import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import Redis from "ioredis";
import { env } from "../config/env.js";
import { RATE_LIMIT } from "../config/constants.js";

const redis = new Redis(env.REDIS_URL);

interface RateLimitOptions {
  windowMs?: number;
  maxRequests?: number;
  keyPrefix?: string;
}

export function rateLimiter(options: RateLimitOptions = {}) {
  const {
    windowMs = RATE_LIMIT.WINDOW_MS,
    maxRequests = RATE_LIMIT.MAX_REQUESTS,
    keyPrefix = "rl",
  } = options;

  return createMiddleware(async (c, next) => {
    // Use seller ID if authenticated, otherwise use IP
    const auth = c.get("auth");
    const identifier = auth?.sellerId || c.req.header("x-forwarded-for") || "anonymous";
    const key = `${keyPrefix}:${identifier}`;

    const now = Date.now();
    const windowStart = now - windowMs;

    // Use Redis sorted set for sliding window
    const pipeline = redis.pipeline();

    // Remove old entries
    pipeline.zremrangebyscore(key, 0, windowStart);

    // Add current request
    pipeline.zadd(key, now, `${now}-${Math.random()}`);

    // Count requests in window
    pipeline.zcard(key);

    // Set expiry
    pipeline.expire(key, Math.ceil(windowMs / 1000));

    const results = await pipeline.exec();

    if (!results) {
      // Redis error, allow request
      await next();
      return;
    }

    const requestCount = results[2]?.[1] as number;

    // Set rate limit headers
    c.header("X-RateLimit-Limit", String(maxRequests));
    c.header("X-RateLimit-Remaining", String(Math.max(0, maxRequests - requestCount)));
    c.header("X-RateLimit-Reset", String(Math.ceil((now + windowMs) / 1000)));

    if (requestCount > maxRequests) {
      throw new HTTPException(429, {
        message: "Too many requests, please try again later",
      });
    }

    await next();
  });
}

// Stricter rate limiter for auth endpoints
export const authRateLimiter = rateLimiter({
  maxRequests: RATE_LIMIT.AUTH_MAX_REQUESTS,
  keyPrefix: "rl:auth",
});

// Very strict rate limiter for registration (prevent spam accounts)
export const registrationRateLimiter = rateLimiter({
  windowMs: RATE_LIMIT.REGISTRATION_WINDOW_MS,
  maxRequests: RATE_LIMIT.REGISTRATION_MAX_REQUESTS,
  keyPrefix: "rl:register",
});
