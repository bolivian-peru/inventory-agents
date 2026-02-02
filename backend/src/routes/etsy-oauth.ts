import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { authMiddleware } from "../middleware/auth.js";
import { db, etsyConnections } from "../db/index.js";
import { eq, and } from "drizzle-orm";
import { generateEtsyConnectionId } from "../utils/id.js";
import { encrypt } from "../utils/crypto.js";
import {
  startOAuthFlow,
  getOAuthState,
  exchangeCodeForTokens,
} from "../services/etsy/oauth.js";
import { EtsyClient } from "../services/etsy/client.js";
import { syncProducts } from "../services/etsy/sync.js";
import { ETSY } from "../config/constants.js";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";

const etsyOAuth = new Hono();

// Start OAuth flow
etsyOAuth.get("/authorize", authMiddleware, async (c) => {
  const { sellerId } = c.get("auth");

  // Check if already connected
  const [existing] = await db
    .select({ id: etsyConnections.id })
    .from(etsyConnections)
    .where(
      and(
        eq(etsyConnections.sellerId, sellerId),
        eq(etsyConnections.status, "active")
      )
    )
    .limit(1);

  if (existing) {
    throw new HTTPException(400, { message: "Etsy already connected" });
  }

  const redirectUrl = await startOAuthFlow(sellerId);
  return c.json({ redirectUrl });
});

// OAuth callback
etsyOAuth.get("/callback", async (c) => {
  const code = c.req.query("code");
  const state = c.req.query("state");
  const error = c.req.query("error");

  if (error) {
    logger.error("Etsy OAuth error", { error });
    // Redirect to frontend with error
    return c.redirect(`${env.CORS_ORIGIN}/dashboard?etsy_error=${error}`);
  }

  if (!code || !state) {
    throw new HTTPException(400, { message: "Missing code or state" });
  }

  // Get stored state
  const stateData = await getOAuthState(state);
  if (!stateData) {
    throw new HTTPException(400, { message: "Invalid or expired state" });
  }

  // Exchange code for tokens
  const tokens = await exchangeCodeForTokens(code, stateData.codeVerifier);

  // Create Etsy client and get shop info
  const connectionId = generateEtsyConnectionId();
  const tokenExpiresAt = new Date(Date.now() + tokens.expires_in * 1000);

  // Temporarily store tokens to get shop info
  await db.insert(etsyConnections).values({
    id: connectionId,
    sellerId: stateData.sellerId,
    shopId: "pending",
    accessTokenEncrypted: encrypt(tokens.access_token),
    refreshTokenEncrypted: encrypt(tokens.refresh_token),
    tokenExpiresAt,
    scopes: ETSY.SCOPES,
    status: "active",
    createdAt: new Date(),
  });

  try {
    // Get shop details
    const client = new EtsyClient(connectionId);
    const shop = await client.getShop();

    // Update connection with shop info
    await db
      .update(etsyConnections)
      .set({
        shopId: String(shop.shop_id),
        shopName: shop.shop_name,
      })
      .where(eq(etsyConnections.id, connectionId));

    // Trigger product sync in background
    syncProducts(stateData.sellerId).catch((err) => {
      logger.error("Initial product sync failed", {
        error: err.message,
        sellerId: stateData.sellerId,
      });
    });

    // Redirect to frontend with success
    return c.redirect(
      `${env.CORS_ORIGIN}/dashboard?etsy_connected=true&shop=${encodeURIComponent(shop.shop_name)}`
    );
  } catch (err) {
    // Clean up on error
    await db
      .delete(etsyConnections)
      .where(eq(etsyConnections.id, connectionId));

    logger.error("Failed to complete Etsy OAuth", { error: (err as Error).message });
    return c.redirect(`${env.CORS_ORIGIN}/dashboard?etsy_error=shop_fetch_failed`);
  }
});

// Get connection status
etsyOAuth.get("/connection", authMiddleware, async (c) => {
  const { sellerId } = c.get("auth");

  const [connection] = await db
    .select({
      id: etsyConnections.id,
      shopId: etsyConnections.shopId,
      shopName: etsyConnections.shopName,
      status: etsyConnections.status,
      lastSyncAt: etsyConnections.lastSyncAt,
      createdAt: etsyConnections.createdAt,
    })
    .from(etsyConnections)
    .where(eq(etsyConnections.sellerId, sellerId))
    .limit(1);

  if (!connection) {
    return c.json({ connected: false });
  }

  return c.json({
    connected: connection.status === "active",
    connection,
  });
});

// Disconnect Etsy
etsyOAuth.delete("/connection", authMiddleware, async (c) => {
  const { sellerId } = c.get("auth");

  await db
    .delete(etsyConnections)
    .where(eq(etsyConnections.sellerId, sellerId));

  return c.json({ success: true });
});

export { etsyOAuth };
