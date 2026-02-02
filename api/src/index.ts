import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { etsy } from "./etsy.js";

const app = new Hono();

// CORS for frontend
app.use("/*", cors({
  origin: ["https://www.inventoryforagents.xyz", "https://inventoryforagents.xyz"],
  allowMethods: ["GET", "POST", "OPTIONS"],
  allowHeaders: ["Content-Type"],
}));

// Health check
app.get("/health", (c) => {
  return c.json({ 
    status: "healthy", 
    service: "ifa-api",
    version: "1.0.0"
  });
});

// Root
app.get("/", (c) => {
  return c.json({
    name: "IFA API",
    description: "Inventory For Agents - Simple API for Etsy OAuth & Product Sync",
    endpoints: {
      health: "/health",
      etsy_auth: "/etsy/auth",
      etsy_callback: "/etsy/callback",
      etsy_sync: "/etsy/sync",
      status: "/status"
    },
    docs: "https://github.com/bolivian-peru/inventory-agents"
  });
});

// Status endpoint
app.get("/status", (c) => {
  return c.json({
    api: "running",
    etsy: process.env.ETSY_API_KEY ? "configured" : "not configured",
    workspace: process.env.WORKSPACE_PATH || "/root/.openclaw/workspace"
  });
});

// Mount Etsy routes
app.route("/etsy", etsy);

// Start server
const port = parseInt(process.env.PORT || "8080");

serve({
  fetch: app.fetch,
  port,
  hostname: "127.0.0.1", // localhost only, nginx proxies
}, (info) => {
  console.log(`🛒 IFA API running on http://127.0.0.1:${info.port}`);
});
