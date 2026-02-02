import type { ErrorHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import { ZodError } from "zod";
import { logger } from "../utils/logger.js";
import { env } from "../config/env.js";

export const errorHandler: ErrorHandler = (err, c) => {
  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const errors = err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));

    return c.json(
      {
        error: "Validation failed",
        details: errors,
      },
      400
    );
  }

  // Handle HTTP exceptions
  if (err instanceof HTTPException) {
    return c.json(
      {
        error: err.message,
      },
      err.status
    );
  }

  // Log unexpected errors
  logger.error("Unhandled error", {
    message: err.message,
    stack: err.stack,
    path: c.req.path,
    method: c.req.method,
  });

  // Don't expose internal errors in production
  const message =
    env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message || "Internal server error";

  return c.json(
    {
      error: message,
    },
    500
  );
};
