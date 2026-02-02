/**
 * Test Fixture Types - Type definitions for test data
 */

export interface Seller {
  id: string;
  email: string;
  passwordHash: string;
  name: string | null;
  status: "active" | "suspended";
  plan: "free" | "pro";
  createdAt: Date;
  updatedAt: Date;
}

export interface EtsyConnection {
  id: string;
  sellerId: string;
  shopId: string;
  shopName: string | null;
  accessTokenEncrypted: string;
  refreshTokenEncrypted: string;
  tokenExpiresAt: Date;
  scopes: string[];
  status: "active" | "expired" | "revoked";
  lastSyncAt: Date | null;
  createdAt: Date;
}

export interface Product {
  id: string;
  sellerId: string;
  etsyListingId: string;
  title: string;
  description: string | null;
  price: number;
  quantity: number;
  state: "active" | "draft" | "sold_out";
  tags: string[];
  images: ProductImage[];
  rawData: Record<string, unknown>;
  syncedAt: Date | null;
  createdAt: Date;
}

export interface ProductImage {
  url: string;
  rank: number;
}

export interface Agent {
  id: string;
  sellerId: string;
  name: string;
  status: "provisioning" | "active" | "paused" | "error";
  workspacePath: string;
  config: Record<string, unknown>;
  soulInstructions: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AgentSession {
  agentId: string;
  sessionId: string;
  lastRunAt: Date | null;
  createdAt: Date;
}

export interface AgentInboxMessage {
  id: string;
  agentId: string;
  kind: "seller_message" | "system_tick" | "etsy_event" | "customer_message";
  payload: Record<string, unknown>;
  status: "queued" | "processing" | "done" | "failed";
  priority: number;
  source: "whatsapp" | "telegram" | "dashboard" | "system" | null;
  attemptCount: number;
  availableAt: Date | null;
  createdAt: Date;
  processedAt: Date | null;
}

export interface AgentEvent {
  id: string;
  agentId: string;
  eventType: "message" | "response" | "tool_use" | "error";
  content: string | null;
  metadata: Record<string, unknown>;
  createdAt: Date;
}

export interface MessagingChannel {
  id: string;
  sellerId: string;
  platform: "whatsapp" | "telegram";
  platformId: string;
  status: "pending" | "connected" | "disconnected";
  createdAt: Date;
}
