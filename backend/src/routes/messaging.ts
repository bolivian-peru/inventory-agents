import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { HTTPException } from "hono/http-exception";
import { authMiddleware } from "../middleware/auth.js";
import { db, messagingChannels, agents, agentInbox } from "../db/index.js";
import { eq, and } from "drizzle-orm";
import { generateChannelId, generateInboxId } from "../utils/id.js";
import { logger } from "../utils/logger.js";
import { generateWhatsAppQR } from "../services/messaging/whatsapp-qr.js";

const messaging = new Hono();

// Get messaging channels
messaging.get("/channels", authMiddleware, async (c) => {
  const { sellerId } = c.get("auth");

  const channels = await db
    .select({
      id: messagingChannels.id,
      platform: messagingChannels.platform,
      platformId: messagingChannels.platformId,
      status: messagingChannels.status,
      createdAt: messagingChannels.createdAt,
    })
    .from(messagingChannels)
    .where(eq(messagingChannels.sellerId, sellerId));

  return c.json({ channels });
});

// Start WhatsApp connection
messaging.post("/whatsapp/connect", authMiddleware, async (c) => {
  const { sellerId } = c.get("auth");

  // Check if already connected
  const [existing] = await db
    .select()
    .from(messagingChannels)
    .where(
      and(
        eq(messagingChannels.sellerId, sellerId),
        eq(messagingChannels.platform, "whatsapp")
      )
    )
    .limit(1);

  if (existing && existing.status === "connected") {
    throw new HTTPException(400, { message: "WhatsApp already connected" });
  }

  // Create or update channel
  const channelId = existing?.id || generateChannelId();

  if (existing) {
    await db
      .update(messagingChannels)
      .set({ status: "pending" })
      .where(eq(messagingChannels.id, existing.id));
  } else {
    await db.insert(messagingChannels).values({
      id: channelId,
      sellerId,
      platform: "whatsapp",
      platformId: `wa_${sellerId}`,
      status: "pending",
      createdAt: new Date(),
    });
  }

  // Generate QR code for WhatsApp pairing
  const qrSession = await generateWhatsAppQR(sellerId, channelId);

  return c.json({
    channelId,
    status: "pending",
    message: "Scan the QR code with WhatsApp to connect",
    qrCode: qrSession.qrCode, // Base64 data URL
    sessionId: qrSession.sessionId,
    expiresAt: qrSession.expiresAt.toISOString(),
  });
});

// Disconnect WhatsApp
messaging.delete("/whatsapp/disconnect", authMiddleware, async (c) => {
  const { sellerId } = c.get("auth");

  await db
    .delete(messagingChannels)
    .where(
      and(
        eq(messagingChannels.sellerId, sellerId),
        eq(messagingChannels.platform, "whatsapp")
      )
    );

  return c.json({ success: true });
});

const telegramConnectSchema = z.object({
  chatId: z.string(),
});

// Link Telegram
messaging.post(
  "/telegram/connect",
  authMiddleware,
  zValidator("json", telegramConnectSchema),
  async (c) => {
    const { sellerId } = c.get("auth");
    const { chatId } = c.req.valid("json");

    // Check if already connected
    const [existing] = await db
      .select()
      .from(messagingChannels)
      .where(
        and(
          eq(messagingChannels.sellerId, sellerId),
          eq(messagingChannels.platform, "telegram")
        )
      )
      .limit(1);

    if (existing) {
      await db
        .update(messagingChannels)
        .set({ platformId: chatId, status: "connected" })
        .where(eq(messagingChannels.id, existing.id));
    } else {
      await db.insert(messagingChannels).values({
        id: generateChannelId(),
        sellerId,
        platform: "telegram",
        platformId: chatId,
        status: "connected",
        createdAt: new Date(),
      });
    }

    return c.json({ success: true, status: "connected" });
  }
);

// Disconnect Telegram
messaging.delete("/telegram/disconnect", authMiddleware, async (c) => {
  const { sellerId } = c.get("auth");

  await db
    .delete(messagingChannels)
    .where(
      and(
        eq(messagingChannels.sellerId, sellerId),
        eq(messagingChannels.platform, "telegram")
      )
    );

  return c.json({ success: true });
});

// Webhook for incoming messages (WhatsApp/Telegram)
// This would be called by OpenClaw or messaging platforms
const webhookSchema = z.object({
  platform: z.enum(["whatsapp", "telegram"]),
  platformId: z.string(),
  message: z.string(),
  sender: z.object({
    id: z.string(),
    name: z.string().optional(),
  }),
});

messaging.post("/webhook", zValidator("json", webhookSchema), async (c) => {
  const { platform, platformId, message, sender } = c.req.valid("json");

  logger.info("Incoming message", { platform, platformId, sender: sender.id });

  // Find the seller by platform channel
  const [channel] = await db
    .select()
    .from(messagingChannels)
    .where(
      and(
        eq(messagingChannels.platform, platform),
        eq(messagingChannels.platformId, platformId),
        eq(messagingChannels.status, "connected")
      )
    )
    .limit(1);

  if (!channel) {
    logger.warn("No channel found for incoming message", { platform, platformId });
    return c.json({ error: "Channel not found" }, 404);
  }

  // Get the seller's agent
  const [agent] = await db
    .select({ id: agents.id, status: agents.status })
    .from(agents)
    .where(eq(agents.sellerId, channel.sellerId))
    .limit(1);

  if (!agent) {
    logger.warn("No agent found for seller", { sellerId: channel.sellerId });
    return c.json({ error: "Agent not found" }, 404);
  }

  if (agent.status !== "active") {
    logger.info("Agent is not active, skipping message", { agentId: agent.id });
    return c.json({ queued: false, reason: "Agent not active" });
  }

  // Queue the message
  const inboxId = generateInboxId();
  await db.insert(agentInbox).values({
    id: inboxId,
    agentId: agent.id,
    kind: "seller_message",
    payload: {
      message,
      sender,
      platform,
      replyTo: platformId,
    },
    status: "queued",
    source: platform,
    priority: 0,
    attemptCount: 0,
    availableAt: new Date(),
    createdAt: new Date(),
  });

  logger.info("Message queued", { inboxId, agentId: agent.id });

  return c.json({ queued: true, inboxId });
});

export { messaging };
