import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth.js";
import { db, agents, products, etsyConnections, agentInbox, agentEvents, messagingChannels } from "../db/index.js";
import { eq, and, count, desc, gte } from "drizzle-orm";

const dashboard = new Hono();

// Get dashboard overview
dashboard.get("/overview", authMiddleware, async (c) => {
  const { sellerId } = c.get("auth");

  // Get counts in parallel
  const [
    productStats,
    agentInfo,
    connectionInfo,
    channelStats,
    recentEvents,
    messageStats,
  ] = await Promise.all([
    // Product count by state
    db
      .select({
        total: count(),
      })
      .from(products)
      .where(eq(products.sellerId, sellerId)),

    // Agent info
    db
      .select({
        id: agents.id,
        name: agents.name,
        status: agents.status,
        createdAt: agents.createdAt,
      })
      .from(agents)
      .where(eq(agents.sellerId, sellerId))
      .limit(1),

    // Etsy connection
    db
      .select({
        shopName: etsyConnections.shopName,
        status: etsyConnections.status,
        lastSyncAt: etsyConnections.lastSyncAt,
      })
      .from(etsyConnections)
      .where(eq(etsyConnections.sellerId, sellerId))
      .limit(1),

    // Connected channels
    db
      .select({
        platform: messagingChannels.platform,
        status: messagingChannels.status,
      })
      .from(messagingChannels)
      .where(eq(messagingChannels.sellerId, sellerId)),

    // Recent events (if agent exists)
    db
      .select({
        id: agentEvents.id,
        eventType: agentEvents.eventType,
        content: agentEvents.content,
        createdAt: agentEvents.createdAt,
      })
      .from(agentEvents)
      .innerJoin(agents, eq(agentEvents.agentId, agents.id))
      .where(eq(agents.sellerId, sellerId))
      .orderBy(desc(agentEvents.createdAt))
      .limit(10),

    // Message stats (last 24 hours)
    (async () => {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const [agent] = await db
        .select({ id: agents.id })
        .from(agents)
        .where(eq(agents.sellerId, sellerId))
        .limit(1);

      if (!agent) return { total: 0, processed: 0, pending: 0 };

      const stats = await db
        .select({
          status: agentInbox.status,
          count: count(),
        })
        .from(agentInbox)
        .where(
          and(
            eq(agentInbox.agentId, agent.id),
            gte(agentInbox.createdAt, yesterday)
          )
        )
        .groupBy(agentInbox.status);

      const result = { total: 0, processed: 0, pending: 0 };
      for (const s of stats) {
        result.total += Number(s.count);
        if (s.status === "done") result.processed += Number(s.count);
        if (s.status === "queued" || s.status === "processing")
          result.pending += Number(s.count);
      }
      return result;
    })(),
  ]);

  return c.json({
    products: {
      total: productStats[0]?.total || 0,
    },
    agent: agentInfo[0] || null,
    etsyConnection: connectionInfo[0] || null,
    channels: channelStats.reduce(
      (acc, ch) => {
        acc[ch.platform] = ch.status;
        return acc;
      },
      {} as Record<string, string>
    ),
    recentActivity: recentEvents,
    messages24h: messageStats,
  });
});

export { dashboard };
