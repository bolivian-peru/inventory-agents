/**
 * Test Setup - Global configuration for all tests
 *
 * TDD Approach:
 * 1. Write tests that describe expected behavior
 * 2. Run tests (they will fail - RED)
 * 3. Implement minimum code to pass (GREEN)
 * 4. Refactor while keeping tests passing (REFACTOR)
 */

import { beforeAll, afterAll, beforeEach, afterEach } from "vitest";

// Test database URL (use separate database for tests)
process.env.DATABASE_URL =
  process.env.TEST_DATABASE_URL ||
  "postgres://ifa_test:test@localhost:5432/ifa_test";

process.env.REDIS_URL = process.env.TEST_REDIS_URL || "redis://localhost:6379/1";
process.env.JWT_SECRET = "test-jwt-secret-for-testing-only-32chars";
process.env.TOKEN_ENCRYPTION_KEY = "0".repeat(64); // 32 bytes hex for testing
process.env.ETSY_API_KEY = "test-etsy-key";
process.env.ETSY_SHARED_SECRET = "test-etsy-secret";
process.env.ETSY_REDIRECT_URI = "http://localhost:8080/etsy/oauth/callback";
process.env.PORT = "8081"; // Different port for tests
process.env.NODE_ENV = "test";
process.env.CORS_ORIGIN = "http://localhost:3000";
process.env.OPENCLAW_GATEWAY_URL = "ws://localhost:18789";
process.env.OPENCLAW_WORKSPACES_DIR = "/tmp/ifa-test-workspaces";

/**
 * Test Lifecycle Hooks
 */

// Before all tests in a file
beforeAll(async () => {
  // Setup test database
  // Run migrations
  // Clear test workspaces
});

// After all tests in a file
afterAll(async () => {
  // Cleanup database connections
  // Remove test data
});

// Before each test
beforeEach(async () => {
  // Reset database state
  // Clear Redis
});

// After each test
afterEach(async () => {
  // Cleanup any created resources
});

/**
 * Test Categories (Tags)
 *
 * Use these to run specific test groups:
 * - npm test -- --grep "@unit"
 * - npm test -- --grep "@integration"
 * - npm test -- --grep "@e2e"
 */
export const TestTags = {
  UNIT: "@unit",
  INTEGRATION: "@integration",
  E2E: "@e2e",
  AUTH: "@auth",
  ETSY: "@etsy",
  AGENT: "@agent",
  SKILL: "@skill",
  MESSAGING: "@messaging",
} as const;
