import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Test environment
    environment: "node",

    // Global setup
    setupFiles: ["./tests/setup.ts"],

    // Include patterns
    include: ["tests/**/*.test.ts"],

    // Exclude patterns
    exclude: ["node_modules", "dist"],

    // Coverage configuration
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.ts"],
      exclude: [
        "src/**/*.d.ts",
        "src/db/migrations/**",
        "src/index.ts",
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },

    // Timeouts
    testTimeout: 10000,
    hookTimeout: 10000,

    // Reporter
    reporters: ["verbose"],

    // Pool options
    pool: "forks",
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },

    // Globals (describe, it, expect available without import)
    globals: true,
  },
});
