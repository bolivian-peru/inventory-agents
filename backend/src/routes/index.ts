import { Hono } from "hono";
import { health } from "./health.js";
import { auth } from "./auth.js";
import { etsyOAuth } from "./etsy-oauth.js";
import { productsRoute } from "./products.js";
import { agentsRoute } from "./agents.js";
import { messaging } from "./messaging.js";
import { dashboard } from "./dashboard.js";
import skills from "./skills.js";

const routes = new Hono();

// Root endpoint - API info
routes.get("/", (c) => {
  return c.json({
    name: "IFA Backend API",
    version: "1.0.0",
    status: "operational",
    endpoints: {
      health: "/health",
      auth: "/auth",
      agents: "/agents",
      products: "/products",
      etsy: "/etsy/oauth",
      messaging: "/messaging",
      dashboard: "/dashboard",
      skills: "/skills"
    },
    documentation: "https://github.com/bolivian-peru/agents-inventory",
    website: "https://www.inventoryforagents.xyz"
  });
});

// Mount routes
routes.route("/health", health);
routes.route("/auth", auth);
routes.route("/etsy/oauth", etsyOAuth);
routes.route("/products", productsRoute);
routes.route("/agents", agentsRoute);
routes.route("/messaging", messaging);
routes.route("/dashboard", dashboard);
routes.route("/skills", skills);

export { routes };
