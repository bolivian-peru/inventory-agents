/**
 * Test Helpers - Utilities for writing tests
 */

import { Hono } from "hono";
import type { Seller, Agent, Product, EtsyConnection } from "./fixtures/types";

/**
 * Create a test Hono app instance
 */
export function createTestApp() {
  // Import and return configured app
  // This will be implemented after app.ts is ready
  return new Hono();
}

/**
 * Generate a valid JWT token for testing
 */
export async function generateTestToken(seller: Partial<Seller>): Promise<string> {
  // Will be implemented with jose
  return `test-token-${seller.id}`;
}

/**
 * Make authenticated request helper
 */
export function authRequest(token: string) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
}

/**
 * Create test seller in database
 */
export async function createTestSeller(
  overrides: Partial<Seller> = {}
): Promise<Seller> {
  const defaults: Seller = {
    id: `sel_test_${Date.now()}`,
    email: `test${Date.now()}@example.com`,
    passwordHash: "$2b$12$test-hash",
    name: "Test Seller",
    status: "active",
    plan: "free",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  return { ...defaults, ...overrides };
}

/**
 * Create test Etsy connection
 */
export async function createTestEtsyConnection(
  sellerId: string,
  overrides: Partial<EtsyConnection> = {}
): Promise<EtsyConnection> {
  const defaults: EtsyConnection = {
    id: `etsy_test_${Date.now()}`,
    sellerId,
    shopId: "12345678",
    shopName: "Test Shop",
    accessTokenEncrypted: "encrypted-token",
    refreshTokenEncrypted: "encrypted-refresh",
    tokenExpiresAt: new Date(Date.now() + 3600000),
    scopes: ["listings_r", "listings_w"],
    status: "active",
    lastSyncAt: null,
    createdAt: new Date(),
  };
  return { ...defaults, ...overrides };
}

/**
 * Create test product
 */
export async function createTestProduct(
  sellerId: string,
  overrides: Partial<Product> = {}
): Promise<Product> {
  const defaults: Product = {
    id: `prod_test_${Date.now()}`,
    sellerId,
    etsyListingId: `etsy_${Date.now()}`,
    title: "Test Product",
    description: "A test product description",
    price: 25.0,
    quantity: 10,
    state: "active",
    tags: ["test", "handmade"],
    images: [{ url: "https://example.com/image.jpg", rank: 1 }],
    rawData: {},
    syncedAt: new Date(),
    createdAt: new Date(),
  };
  return { ...defaults, ...overrides };
}

/**
 * Create test agent
 */
export async function createTestAgent(
  sellerId: string,
  overrides: Partial<Agent> = {}
): Promise<Agent> {
  const defaults: Agent = {
    id: `agt_test_${Date.now()}`,
    sellerId,
    name: "Test Shop Agent",
    status: "active",
    workspacePath: `/tmp/ifa-test-workspaces/seller_${sellerId}`,
    config: {},
    soulInstructions: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  return { ...defaults, ...overrides };
}

/**
 * Mock Etsy API responses
 */
export const mockEtsyResponses = {
  tokenExchange: {
    access_token: "mock-access-token",
    refresh_token: "mock-refresh-token",
    expires_in: 3600,
    token_type: "Bearer",
  },

  userInfo: {
    user_id: 12345678,
    login_name: "testshop",
  },

  shopInfo: {
    shop_id: 12345678,
    shop_name: "Test Shop",
    title: "Welcome to Test Shop",
    currency_code: "USD",
  },

  listings: {
    count: 2,
    results: [
      {
        listing_id: 1234567890,
        title: "Handmade Ceramic Mug",
        description: "Beautiful handcrafted mug",
        price: { amount: 2499, divisor: 100, currency_code: "USD" },
        quantity: 10,
        state: "active",
        tags: ["ceramic", "mug", "handmade"],
        images: [
          { url_570xN: "https://i.etsystatic.com/test1.jpg", rank: 1 },
        ],
      },
      {
        listing_id: 1234567891,
        title: "Wooden Cutting Board",
        description: "Custom engraved cutting board",
        price: { amount: 4999, divisor: 100, currency_code: "USD" },
        quantity: 5,
        state: "active",
        tags: ["wood", "kitchen", "custom"],
        images: [
          { url_570xN: "https://i.etsystatic.com/test2.jpg", rank: 1 },
        ],
      },
    ],
  },
};

/**
 * Wait for async operation with timeout
 */
export async function waitFor(
  condition: () => Promise<boolean>,
  timeoutMs: number = 5000
): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await condition()) return;
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error("waitFor timeout");
}

/**
 * Clean up test workspace
 */
export async function cleanupTestWorkspace(workspacePath: string): Promise<void> {
  // Will use fs to remove directory
}
