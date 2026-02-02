import { Hono } from "hono";
import { sql } from "../db/index.js";
import Redis from "ioredis";
import { env } from "../config/env.js";

const health = new Hono();

const redis = new Redis(env.REDIS_URL);

health.get("/", async (c) => {
  const checks: Record<string, "ok" | "error"> = {
    api: "ok",
    database: "error",
    redis: "error",
  };

  // Check PostgreSQL
  try {
    await sql`SELECT 1`;
    checks.database = "ok";
  } catch {
    checks.database = "error";
  }

  // Check Redis
  try {
    await redis.ping();
    checks.redis = "ok";
  } catch {
    checks.redis = "error";
  }

  const allHealthy = Object.values(checks).every((v) => v === "ok");

  return c.json(
    {
      status: allHealthy ? "healthy" : "degraded",
      checks,
      timestamp: new Date().toISOString(),
    },
    allHealthy ? 200 : 503
  );
});

health.get("/ready", (c) => {
  return c.json({ status: "ready" });
});

health.get("/live", (c) => {
  return c.json({ status: "alive" });
});

export { health };
