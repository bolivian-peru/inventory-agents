import { config } from "dotenv";
config();

import { serve } from "@hono/node-server";
import { app } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./utils/logger.js";
import { QueueWorker } from "./workers/queue-worker.js";

// Run migrations
async function runMigrations() {
  const { readdir, readFile } = await import("fs/promises");
  const { join, dirname } = await import("path");
  const { fileURLToPath } = await import("url");
  const postgres = (await import("postgres")).default;

  const __dirname = dirname(fileURLToPath(import.meta.url));
  const sql = postgres(env.DATABASE_URL);
  const migrationsDir = join(__dirname, "db/migrations");

  logger.info("Running migrations...");

  try {
    const files = (await readdir(migrationsDir))
      .filter((f) => f.endsWith(".sql"))
      .sort();

    for (const file of files) {
      const sqlContent = await readFile(join(migrationsDir, file), "utf-8");
      try {
        await sql.unsafe(sqlContent);
        logger.info(`  ✓ ${file}`);
      } catch (e: unknown) {
        const error = e as { message?: string };
        if (error.message?.includes("already exists")) {
          logger.info(`  ⊘ ${file} (already applied)`);
        } else {
          throw e;
        }
      }
    }
  } finally {
    await sql.end();
  }
}

// Main startup
async function main() {
  try {
    // Run migrations
    await runMigrations();

    // Start HTTP server
    const server = serve({
      fetch: app.fetch,
      port: env.PORT,
    });

    logger.info(`🚀 IFA API running on http://localhost:${env.PORT}`);

    // Start queue worker after a short delay
    const queueWorker = new QueueWorker();
    setTimeout(() => {
      queueWorker.start().catch((e) => {
        logger.error("Queue worker failed", { error: e.message });
      });
    }, 2000);

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}, shutting down...`);

      try {
        await queueWorker.stop();
        server.close?.();
        logger.info("Shutdown complete");
        process.exit(0);
      } catch (e) {
        logger.error("Shutdown error", { error: (e as Error).message });
        process.exit(1);
      }
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (error) {
    logger.error("Startup failed", { error: (error as Error).message });
    process.exit(1);
  }
}

main();
