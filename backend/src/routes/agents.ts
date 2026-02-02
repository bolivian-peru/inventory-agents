import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { HTTPException } from "hono/http-exception";
import { authMiddleware } from "../middleware/auth.js";
import { db, agents, agentSessions, agentInbox, agentEvents } from "../db/index.js";
import { eq, desc, and } from "drizzle-orm";
import { provisionAgent } from "../services/agents/provisioner.js";
import { generateInboxId, generateEventId } from "../utils/id.js";
import { streamSSE } from "hono/streaming";

const agentsRoute = new Hono();

// Provision new agent
agentsRoute.post("/provision", authMiddleware, async (c) => {
  const { sellerId } = c.get("auth");

  const result = await provisionAgent(sellerId);
  return c.json(result);
});

// Get seller's agent
agentsRoute.get("/me", authMiddleware, async (c) => {
  const { sellerId } = c.get("auth");

  const [agent] = await db
    .select({
      id: agents.id,
      name: agents.name,
      status: agents.status,
      workspacePath: agents.workspacePath,
      soulInstructions: agents.soulInstructions,
      createdAt: agents.createdAt,
      updatedAt: agents.updatedAt,
    })
    .from(agents)
    .where(eq(agents.sellerId, sellerId))
    .limit(1);

  if (!agent) {
    return c.json({ agent: null });
  }

  // Get session info
  const [session] = await db
    .select({
      sessionId: agentSessions.sessionId,
      lastRunAt: agentSessions.lastRunAt,
    })
    .from(agentSessions)
    .where(eq(agentSessions.agentId, agent.id))
    .limit(1);

  return c.json({
    agent: {
      ...agent,
      session,
    },
  });
});

const sendMessageSchema = z.object({
  message: z.string().min(1).max(4000),
  source: z.enum(["dashboard", "whatsapp", "telegram"]).default("dashboard"),
});

// Send message to agent
agentsRoute.post(
  "/me/send",
  authMiddleware,
  zValidator("json", sendMessageSchema),
  async (c) => {
    const { sellerId } = c.get("auth");
    const { message, source } = c.req.valid("json");

    // Get agent
    const [agent] = await db
      .select({ id: agents.id, status: agents.status })
      .from(agents)
      .where(eq(agents.sellerId, sellerId))
      .limit(1);

    if (!agent) {
      throw new HTTPException(404, { message: "Agent not found. Please provision an agent first." });
    }

    if (agent.status === "paused") {
      throw new HTTPException(400, { message: "Agent is paused. Resume the agent to send messages." });
    }

    // Queue message
    const inboxId = generateInboxId();
    await db.insert(agentInbox).values({
      id: inboxId,
      agentId: agent.id,
      kind: "seller_message",
      payload: { message },
      status: "queued",
      source,
      priority: 0,
      attemptCount: 0,
      availableAt: new Date(),
      createdAt: new Date(),
    });

    // Log event
    await db.insert(agentEvents).values({
      id: generateEventId(),
      agentId: agent.id,
      eventType: "message",
      content: message,
      metadata: { source, inboxId },
      createdAt: new Date(),
    });

    return c.json({ queued: true, inboxId });
  }
);

// Get agent events
agentsRoute.get("/me/events", authMiddleware, async (c) => {
  const { sellerId } = c.get("auth");
  const limit = Number(c.req.query("limit") || "50");
  const before = c.req.query("before");

  // Get agent
  const [agent] = await db
    .select({ id: agents.id })
    .from(agents)
    .where(eq(agents.sellerId, sellerId))
    .limit(1);

  if (!agent) {
    throw new HTTPException(404, { message: "Agent not found" });
  }

  // Build query
  const conditions = [eq(agentEvents.agentId, agent.id)];

  if (before) {
    conditions.push(eq(agentEvents.id, before));
  }

  const events = await db
    .select({
      id: agentEvents.id,
      eventType: agentEvents.eventType,
      content: agentEvents.content,
      metadata: agentEvents.metadata,
      createdAt: agentEvents.createdAt,
    })
    .from(agentEvents)
    .where(and(...conditions))
    .orderBy(desc(agentEvents.createdAt))
    .limit(limit);

  return c.json({ events });
});

// Stream agent events (SSE)
agentsRoute.get("/me/events/stream", authMiddleware, async (c) => {
  const { sellerId } = c.get("auth");

  // Get agent
  const [agent] = await db
    .select({ id: agents.id })
    .from(agents)
    .where(eq(agents.sellerId, sellerId))
    .limit(1);

  if (!agent) {
    throw new HTTPException(404, { message: "Agent not found" });
  }

  return streamSSE(c, async (stream) => {
    let lastEventId: string | null = null;

    // Poll for new events every second
    while (true) {
      const conditions = [eq(agentEvents.agentId, agent.id)];

      const events = await db
        .select()
        .from(agentEvents)
        .where(and(...conditions))
        .orderBy(desc(agentEvents.createdAt))
        .limit(10);

      // Send new events
      for (const event of events.reverse()) {
        if (!lastEventId || event.id > lastEventId) {
          await stream.writeSSE({
            id: event.id,
            event: event.eventType,
            data: JSON.stringify({
              id: event.id,
              type: event.eventType,
              content: event.content,
              metadata: event.metadata,
              createdAt: event.createdAt,
            }),
          });
          lastEventId = event.id;
        }
      }

      // Wait before next poll
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  });
});

// Pause agent
agentsRoute.post("/me/pause", authMiddleware, async (c) => {
  const { sellerId } = c.get("auth");

  const result = await db
    .update(agents)
    .set({ status: "paused", updatedAt: new Date() })
    .where(eq(agents.sellerId, sellerId))
    .returning({ id: agents.id });

  if (result.length === 0) {
    throw new HTTPException(404, { message: "Agent not found" });
  }

  return c.json({ success: true, status: "paused" });
});

// Resume agent
agentsRoute.post("/me/resume", authMiddleware, async (c) => {
  const { sellerId } = c.get("auth");

  const result = await db
    .update(agents)
    .set({ status: "active", updatedAt: new Date() })
    .where(eq(agents.sellerId, sellerId))
    .returning({ id: agents.id });

  if (result.length === 0) {
    throw new HTTPException(404, { message: "Agent not found" });
  }

  return c.json({ success: true, status: "active" });
});

const updateSoulSchema = z.object({
  soulInstructions: z.string().max(10000),
});

// Update soul instructions
agentsRoute.patch(
  "/me/soul",
  authMiddleware,
  zValidator("json", updateSoulSchema),
  async (c) => {
    const { sellerId } = c.get("auth");
    const { soulInstructions } = c.req.valid("json");

    const result = await db
      .update(agents)
      .set({ soulInstructions, updatedAt: new Date() })
      .where(eq(agents.sellerId, sellerId))
      .returning({ id: agents.id });

    if (result.length === 0) {
      throw new HTTPException(404, { message: "Agent not found" });
    }

    return c.json({ success: true });
  }
);

export { agentsRoute };
