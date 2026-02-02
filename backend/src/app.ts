import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger as honoLogger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { routes } from "./routes/index.js";
import { errorHandler } from "./middleware/error-handler.js";
import { rateLimiter } from "./middleware/rate-limiter.js";
import { env } from "./config/env.js";

const app = new Hono();

// Global middleware
app.use("*", honoLogger());
app.use("*", secureHeaders());
app.use(
  "*",
  cors({
    origin: env.CORS_ORIGIN.split(",").map((o) => o.trim()).filter(Boolean),
    credentials: true,
  })
);

// Rate limiting (skip for health checks)
app.use("*", async (c, next) => {
  if (c.req.path.startsWith("/health")) {
    return next();
  }
  return rateLimiter()(c, next);
});

// Error handler
app.onError(errorHandler);

// Mount routes
app.route("/", routes);

// 404 handler
app.notFound((c) => {
  return c.json({ error: "Not found" }, 404);
});

export { app };
