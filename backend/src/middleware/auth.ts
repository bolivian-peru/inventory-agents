import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import * as jose from "jose";
import { env } from "../config/env.js";
import { db, sellers } from "../db/index.js";
import { eq } from "drizzle-orm";

export interface AuthContext {
  sellerId: string;
  email: string;
}

declare module "hono" {
  interface ContextVariableMap {
    auth: AuthContext;
  }
}

const secret = new TextEncoder().encode(env.JWT_SECRET);

export async function createToken(payload: { sellerId: string; email: string }): Promise<string> {
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyToken(token: string): Promise<AuthContext> {
  try {
    const { payload } = await jose.jwtVerify(token, secret);
    return {
      sellerId: payload.sellerId as string,
      email: payload.email as string,
    };
  } catch {
    throw new HTTPException(401, { message: "Invalid or expired token" });
  }
}

export const authMiddleware = createMiddleware(async (c, next) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new HTTPException(401, { message: "Missing authorization header" });
  }

  const token = authHeader.slice(7);
  const auth = await verifyToken(token);

  // Verify seller still exists and is active
  const [seller] = await db
    .select({ id: sellers.id, status: sellers.status })
    .from(sellers)
    .where(eq(sellers.id, auth.sellerId))
    .limit(1);

  if (!seller) {
    throw new HTTPException(401, { message: "Seller not found" });
  }

  if (seller.status === "suspended") {
    throw new HTTPException(403, { message: "Account suspended" });
  }

  c.set("auth", auth);
  await next();
});
