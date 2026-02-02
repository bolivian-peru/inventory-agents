import { z } from "zod";

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),

  // Redis
  REDIS_URL: z.string().default("redis://localhost:6379"),

  // Security
  JWT_SECRET: z.string().min(32),
  TOKEN_ENCRYPTION_KEY: z.string().min(32),

  // Etsy OAuth
  ETSY_API_KEY: z.string(),
  ETSY_SHARED_SECRET: z.string(),
  ETSY_REDIRECT_URI: z.string().url(),

  // OpenClaw
  OPENCLAW_GATEWAY_URL: z.string().default("ws://127.0.0.1:18789"),
  OPENCLAW_WORKSPACES_DIR: z.string().default("/root/.openclaw/workspaces"),

  // Server
  PORT: z.coerce.number().default(8080),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),

  // Anthropic
  ANTHROPIC_API_KEY: z.string(),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error("❌ Invalid environment variables:");
    console.error(result.error.format());
    process.exit(1);
  }

  return result.data;
}

export const env = loadEnv();
