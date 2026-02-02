import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "../config/env.js";
import * as schema from "./schema.js";

// Connection for queries
const queryClient = postgres(env.DATABASE_URL);

// Drizzle instance
export const db = drizzle(queryClient, { schema });

// Raw SQL client for migrations and complex queries
export const sql = queryClient;

// Export schema for convenience
export * from "./schema.js";
