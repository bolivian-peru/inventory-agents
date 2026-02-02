import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import bcrypt from "bcrypt";
import { db, sellers } from "../db/index.js";
import { eq } from "drizzle-orm";
import { generateSellerId } from "../utils/id.js";
import { createToken, authMiddleware } from "../middleware/auth.js";
import { authRateLimiter, registrationRateLimiter } from "../middleware/rate-limiter.js";
import { HTTPException } from "hono/http-exception";

const auth = new Hono();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Register (with extra strict rate limiting)
auth.post(
  "/register",
  authRateLimiter,
  registrationRateLimiter,
  zValidator("json", registerSchema),
  async (c) => {
    const { email, password, name } = c.req.valid("json");

    // Check if email exists
    const [existing] = await db
      .select({ id: sellers.id })
      .from(sellers)
      .where(eq(sellers.email, email.toLowerCase()))
      .limit(1);

    if (existing) {
      throw new HTTPException(400, { message: "Email already registered" });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create seller
    const id = generateSellerId();
    const now = new Date();

    const [seller] = await db
      .insert(sellers)
      .values({
        id,
        email: email.toLowerCase(),
        passwordHash,
        name,
        createdAt: now,
        updatedAt: now,
      })
      .returning({
        id: sellers.id,
        email: sellers.email,
        name: sellers.name,
        plan: sellers.plan,
        createdAt: sellers.createdAt,
      });

    // Generate token
    const token = await createToken({
      sellerId: seller.id,
      email: seller.email,
    });

    return c.json({
      token,
      seller,
    });
  }
);

// Login
auth.post(
  "/login",
  authRateLimiter,
  zValidator("json", loginSchema),
  async (c) => {
    const { email, password } = c.req.valid("json");

    // Find seller
    const [seller] = await db
      .select()
      .from(sellers)
      .where(eq(sellers.email, email.toLowerCase()))
      .limit(1);

    if (!seller) {
      throw new HTTPException(401, { message: "Invalid email or password" });
    }

    // Check password
    const valid = await bcrypt.compare(password, seller.passwordHash);
    if (!valid) {
      throw new HTTPException(401, { message: "Invalid email or password" });
    }

    // Check status
    if (seller.status === "suspended") {
      throw new HTTPException(403, { message: "Account suspended" });
    }

    // Generate token
    const token = await createToken({
      sellerId: seller.id,
      email: seller.email,
    });

    return c.json({
      token,
      seller: {
        id: seller.id,
        email: seller.email,
        name: seller.name,
        plan: seller.plan,
        createdAt: seller.createdAt,
      },
    });
  }
);

// Get current seller
auth.get("/me", authMiddleware, async (c) => {
  const { sellerId } = c.get("auth");

  const [seller] = await db
    .select({
      id: sellers.id,
      email: sellers.email,
      name: sellers.name,
      plan: sellers.plan,
      status: sellers.status,
      createdAt: sellers.createdAt,
    })
    .from(sellers)
    .where(eq(sellers.id, sellerId))
    .limit(1);

  if (!seller) {
    throw new HTTPException(404, { message: "Seller not found" });
  }

  return c.json({ seller });
});

export { auth };
