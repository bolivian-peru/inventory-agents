import {
  pgTable,
  text,
  timestamp,
  numeric,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";

// Sellers (users)
export const sellers = pgTable("sellers", {
  id: text("id").primaryKey(),
  email: text("email").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  name: text("name"),
  status: text("status").default("active").notNull(), // active | suspended
  plan: text("plan").default("free").notNull(), // free | pro
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// Etsy OAuth connections
export const etsyConnections = pgTable("etsy_connections", {
  id: text("id").primaryKey(),
  sellerId: text("seller_id")
    .references(() => sellers.id, { onDelete: "cascade" })
    .notNull(),
  shopId: text("shop_id").notNull(),
  shopName: text("shop_name"),
  accessTokenEncrypted: text("access_token_encrypted").notNull(),
  refreshTokenEncrypted: text("refresh_token_encrypted").notNull(),
  tokenExpiresAt: timestamp("token_expires_at", { withTimezone: true }).notNull(),
  scopes: text("scopes").array(),
  status: text("status").default("active").notNull(), // active | expired | revoked
  lastSyncAt: timestamp("last_sync_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// Synced products
export const products = pgTable("products", {
  id: text("id").primaryKey(),
  sellerId: text("seller_id")
    .references(() => sellers.id, { onDelete: "cascade" })
    .notNull(),
  etsyListingId: text("etsy_listing_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }),
  quantity: integer("quantity"),
  state: text("state"), // active | draft | sold_out
  tags: text("tags").array(),
  images: jsonb("images").default([]),
  rawData: jsonb("raw_data"),
  syncedAt: timestamp("synced_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// Agents (one per seller)
export const agents = pgTable("agents", {
  id: text("id").primaryKey(),
  sellerId: text("seller_id")
    .references(() => sellers.id, { onDelete: "cascade" })
    .unique()
    .notNull(),
  name: text("name").notNull(),
  status: text("status").default("provisioning").notNull(), // provisioning | active | paused | error
  workspacePath: text("workspace_path").notNull(),
  config: jsonb("config").default({}),
  soulInstructions: text("soul_instructions"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// Agent sessions (OpenClaw session tracking)
export const agentSessions = pgTable("agent_sessions", {
  agentId: text("agent_id")
    .primaryKey()
    .references(() => agents.id, { onDelete: "cascade" }),
  sessionId: text("session_id").notNull(), // For --resume
  lastRunAt: timestamp("last_run_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// Agent message queue
export const agentInbox = pgTable("agent_inbox", {
  id: text("id").primaryKey(),
  agentId: text("agent_id")
    .references(() => agents.id, { onDelete: "cascade" })
    .notNull(),
  kind: text("kind").notNull(), // seller_message | system_tick | etsy_event
  payload: jsonb("payload").notNull(),
  status: text("status").default("queued").notNull(), // queued | processing | done | failed
  priority: integer("priority").default(0).notNull(),
  source: text("source"), // whatsapp | telegram | dashboard
  attemptCount: integer("attempt_count").default(0).notNull(),
  availableAt: timestamp("available_at", { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  processedAt: timestamp("processed_at", { withTimezone: true }),
});

// Agent events (activity log)
export const agentEvents = pgTable("agent_events", {
  id: text("id").primaryKey(),
  agentId: text("agent_id")
    .references(() => agents.id, { onDelete: "cascade" })
    .notNull(),
  eventType: text("event_type").notNull(), // message | response | tool_use | error
  content: text("content"),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// Agent runs (track each execution)
export const agentRuns = pgTable("agent_runs", {
  id: text("id").primaryKey(),
  agentId: text("agent_id")
    .references(() => agents.id, { onDelete: "cascade" })
    .notNull(),
  sessionId: text("session_id").notNull(),
  inboxId: text("inbox_id").references(() => agentInbox.id),
  status: text("status").default("starting").notNull(), // starting | running | completed | failed
  pid: integer("pid"),
  startedAt: timestamp("started_at", { withTimezone: true }).defaultNow().notNull(),
  finishedAt: timestamp("finished_at", { withTimezone: true }),
  exitCode: integer("exit_code"),
  signal: text("signal"),
  error: text("error"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// Messaging channels
export const messagingChannels = pgTable("messaging_channels", {
  id: text("id").primaryKey(),
  sellerId: text("seller_id")
    .references(() => sellers.id, { onDelete: "cascade" })
    .notNull(),
  platform: text("platform").notNull(), // whatsapp | telegram
  platformId: text("platform_id").notNull(),
  status: text("status").default("pending").notNull(), // pending | connected | disconnected
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// Type exports
export type Seller = typeof sellers.$inferSelect;
export type NewSeller = typeof sellers.$inferInsert;
export type EtsyConnection = typeof etsyConnections.$inferSelect;
export type NewEtsyConnection = typeof etsyConnections.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Agent = typeof agents.$inferSelect;
export type NewAgent = typeof agents.$inferInsert;
export type AgentSession = typeof agentSessions.$inferSelect;
export type AgentInbox = typeof agentInbox.$inferSelect;
export type NewAgentInbox = typeof agentInbox.$inferInsert;
export type AgentEvent = typeof agentEvents.$inferSelect;
export type AgentRun = typeof agentRuns.$inferSelect;
export type MessagingChannel = typeof messagingChannels.$inferSelect;
