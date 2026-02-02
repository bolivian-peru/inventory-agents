import { spawn, ChildProcess } from "child_process";
import { db, sql, agentInbox, agentSessions, agentRuns, agentEvents, agents } from "../db/index.js";
import { eq, and, notInArray, lte } from "drizzle-orm";
import { AGENT } from "../config/constants.js";
import { generateEventId } from "../utils/id.js";
import { nanoid } from "nanoid";
import { logger } from "../utils/logger.js";

interface InboxJob {
  id: string;
  agent_id: string;
  kind: string;
  payload: unknown;
  attempt_count: number;
}

interface CurrentRun {
  runId: string;
  agentId: string;
  inboxId: string;
  process: ChildProcess | null;
  startedAt: Date;
}

export class QueueWorker {
  private running = false;
  private currentRun: CurrentRun | null = null;

  async start(): Promise<void> {
    if (this.running) {
      logger.warn("Queue worker already running");
      return;
    }

    this.running = true;
    logger.info("Queue worker started");

    // Reconcile any stalled runs from previous crashes
    await this.reconcileStalledRuns();

    // Main loop
    while (this.running) {
      try {
        const job = await this.claimNextJob();

        if (job) {
          await this.processJob(job);
        } else {
          // No jobs, wait before polling again
          await this.sleep(AGENT.POLL_INTERVAL_MS);
        }
      } catch (error) {
        logger.error("Queue worker error", { error: (error as Error).message });
        await this.sleep(AGENT.POLL_INTERVAL_MS * 5);
      }
    }
  }

  async stop(): Promise<void> {
    logger.info("Stopping queue worker");
    this.running = false;

    // Kill any running process
    if (this.currentRun?.process) {
      this.currentRun.process.kill("SIGTERM");
    }
  }

  private async reconcileStalledRuns(): Promise<void> {
    // Mark any "running" or "starting" runs as failed
    // These are from previous crashes
    const stalled = await sql`
      UPDATE agent_runs
      SET status = 'failed', error = 'Worker crashed', finished_at = NOW()
      WHERE status IN ('starting', 'running')
      RETURNING id
    `;

    if (stalled.length > 0) {
      logger.info(`Reconciled ${stalled.length} stalled runs`);
    }
  }

  private async claimNextJob(): Promise<InboxJob | null> {
    // Atomic claim using FOR UPDATE SKIP LOCKED
    // This prevents race conditions in multi-worker setups
    const result = await sql`
      UPDATE agent_inbox
      SET status = 'processing', processed_at = NOW()
      WHERE id = (
        SELECT id FROM agent_inbox
        WHERE status = 'queued'
          AND available_at <= NOW()
          AND agent_id NOT IN (
            SELECT agent_id FROM agent_runs WHERE status IN ('starting', 'running')
          )
        ORDER BY priority DESC, created_at ASC
        LIMIT 1
        FOR UPDATE SKIP LOCKED
      )
      RETURNING id, agent_id, kind, payload, attempt_count
    `;

    if (result.length === 0) {
      return null;
    }

    return result[0] as InboxJob;
  }

  private async processJob(job: InboxJob): Promise<void> {
    logger.info("Processing job", { jobId: job.id, kind: job.kind });

    // Get agent and session info
    const [agent] = await db
      .select()
      .from(agents)
      .where(eq(agents.id, job.agent_id))
      .limit(1);

    if (!agent) {
      logger.error("Agent not found", { agentId: job.agent_id });
      await this.markJobFailed(job.id, "Agent not found");
      return;
    }

    if (agent.status !== "active") {
      logger.info("Agent not active, skipping", { agentId: job.agent_id, status: agent.status });
      await this.markJobFailed(job.id, "Agent not active");
      return;
    }

    const [session] = await db
      .select()
      .from(agentSessions)
      .where(eq(agentSessions.agentId, job.agent_id))
      .limit(1);

    if (!session) {
      logger.error("Session not found", { agentId: job.agent_id });
      await this.markJobFailed(job.id, "Session not found");
      return;
    }

    // Create run record
    const runId = `run_${nanoid(21)}`;
    await db.insert(agentRuns).values({
      id: runId,
      agentId: job.agent_id,
      sessionId: session.sessionId,
      inboxId: job.id,
      status: "starting",
      startedAt: new Date(),
      createdAt: new Date(),
    });

    try {
      // Extract message from payload
      const payload = job.payload as { message?: string };
      const message = payload.message || JSON.stringify(payload);

      // Run Claude Code
      const result = await this.runClaudeCode(
        runId,
        job.agent_id,
        agent.workspacePath,
        session.sessionId,
        message
      );

      // Update session last run time
      await db
        .update(agentSessions)
        .set({ lastRunAt: new Date() })
        .where(eq(agentSessions.agentId, job.agent_id));

      // Mark job as done
      await sql`
        UPDATE agent_inbox
        SET status = 'done', processed_at = NOW()
        WHERE id = ${job.id}
      `;

      // Update run as completed
      await db
        .update(agentRuns)
        .set({
          status: "completed",
          finishedAt: new Date(),
          exitCode: result.exitCode,
        })
        .where(eq(agentRuns.id, runId));

      logger.info("Job completed", { jobId: job.id, runId });
    } catch (error) {
      const errorMessage = (error as Error).message;
      logger.error("Job failed", { jobId: job.id, error: errorMessage });

      await this.markJobFailed(job.id, errorMessage);

      await db
        .update(agentRuns)
        .set({
          status: "failed",
          finishedAt: new Date(),
          error: errorMessage,
        })
        .where(eq(agentRuns.id, runId));

      // Retry if under limit
      if (job.attempt_count < AGENT.MAX_RETRY_ATTEMPTS) {
        const backoffSeconds = Math.pow(2, job.attempt_count);
        const availableAt = new Date(Date.now() + backoffSeconds * 1000);
        await db
          .update(agentInbox)
          .set({
            status: "queued",
            attemptCount: job.attempt_count + 1,
            availableAt,
          })
          .where(eq(agentInbox.id, job.id));
        logger.info("Job queued for retry", { jobId: job.id, backoffSeconds });
      }
    } finally {
      this.currentRun = null;
    }
  }

  private async runClaudeCode(
    runId: string,
    agentId: string,
    workspacePath: string,
    sessionId: string,
    message: string
  ): Promise<{ exitCode: number }> {
    return new Promise((resolve, reject) => {
      const args = [
        "--cwd",
        workspacePath,
        "--resume",
        sessionId,
        "-p",
        message,
        "--output-format",
        "stream-json",
      ];

      logger.debug("Spawning claude", { args });

      const proc = spawn("claude", args, {
        stdio: ["ignore", "pipe", "pipe"],
        env: {
          ...process.env,
          ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
        },
      });

      this.currentRun = {
        runId,
        agentId,
        inboxId: "",
        process: proc,
        startedAt: new Date(),
      };

      // Update run with PID
      db.update(agentRuns)
        .set({ pid: proc.pid, status: "running" })
        .where(eq(agentRuns.id, runId))
        .catch((e) => logger.error("Failed to update run PID", { error: e.message }));

      let stdout = "";
      let stderr = "";
      const MAX_BUFFER_SIZE = 10 * 1024 * 1024; // 10MB limit

      proc.stdout?.on("data", (data: Buffer) => {
        const text = data.toString();
        // Limit buffer size to prevent memory issues
        if (stdout.length < MAX_BUFFER_SIZE) {
          stdout += text.slice(0, MAX_BUFFER_SIZE - stdout.length);
        }

        // Try to parse stream-json events
        const lines = text.split("\n").filter(Boolean);
        for (const line of lines) {
          try {
            const event = JSON.parse(line);
            this.handleAgentEvent(agentId, event);
          } catch {
            // Not JSON, might be plain output
          }
        }
      });

      proc.stderr?.on("data", (data: Buffer) => {
        // Limit stderr buffer
        if (stderr.length < MAX_BUFFER_SIZE) {
          stderr += data.toString().slice(0, MAX_BUFFER_SIZE - stderr.length);
        }
      });

      // Set timeout
      const timeout = setTimeout(() => {
        logger.warn("Claude process timeout", { runId });
        proc.kill("SIGTERM");
      }, AGENT.MAX_RUN_TIME_MS);

      proc.on("close", (code) => {
        clearTimeout(timeout);

        if (code === 0) {
          resolve({ exitCode: code || 0 });
        } else {
          reject(new Error(`Claude exited with code ${code}: ${stderr}`));
        }
      });

      proc.on("error", (error: NodeJS.ErrnoException) => {
        clearTimeout(timeout);
        if (error.code === "ENOENT") {
          reject(new Error("Claude CLI not found. Please install: npm install -g @anthropic-ai/claude-code"));
        } else {
          reject(error);
        }
      });
    });
  }

  private async handleAgentEvent(agentId: string, event: unknown): Promise<void> {
    try {
      const e = event as { type?: string; content?: string; tool?: string };
      let eventType = "info";
      let content = "";

      if (e.type === "assistant") {
        eventType = "response";
        content = e.content || "";
      } else if (e.type === "tool_use") {
        eventType = "tool_use";
        content = e.tool || "";
      } else if (e.type === "error") {
        eventType = "error";
        content = e.content || "";
      }

      await db.insert(agentEvents).values({
        id: generateEventId(),
        agentId,
        eventType,
        content,
        metadata: event as object,
        createdAt: new Date(),
      });
    } catch (error) {
      logger.error("Failed to store agent event", { error: (error as Error).message });
    }
  }

  private async markJobFailed(jobId: string, error: string): Promise<void> {
    await sql`
      UPDATE agent_inbox
      SET status = 'failed', processed_at = NOW()
      WHERE id = ${jobId}
    `;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
