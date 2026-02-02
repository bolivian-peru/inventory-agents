import { Hono } from "hono";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import crypto from "crypto";

const etsy = new Hono();

// In-memory state storage (simple, single-user)
const oauthState: Map<string, { codeVerifier: string; createdAt: number }> = new Map();

// Etsy OAuth URLs
const ETSY_AUTH_URL = "https://www.etsy.com/oauth/connect";
const ETSY_TOKEN_URL = "https://api.etsy.com/v3/public/oauth/token";
const ETSY_API_BASE = "https://api.etsy.com/v3";

// Generate PKCE code verifier and challenge
function generatePKCE() {
  const codeVerifier = crypto.randomBytes(32).toString("base64url");
  const codeChallenge = crypto
    .createHash("sha256")
    .update(codeVerifier)
    .digest("base64url");
  return { codeVerifier, codeChallenge };
}

// Start OAuth flow
etsy.get("/auth", (c) => {
  const apiKey = process.env.ETSY_API_KEY;
  const redirectUri = process.env.ETSY_REDIRECT_URI;

  if (!apiKey || !redirectUri) {
    return c.json({ error: "Etsy API not configured" }, 500);
  }

  const state = crypto.randomBytes(16).toString("hex");
  const { codeVerifier, codeChallenge } = generatePKCE();

  // Store state for callback
  oauthState.set(state, { codeVerifier, createdAt: Date.now() });

  // Clean old states (older than 10 minutes)
  const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
  for (const [key, value] of oauthState.entries()) {
    if (value.createdAt < tenMinutesAgo) {
      oauthState.delete(key);
    }
  }

  const params = new URLSearchParams({
    response_type: "code",
    client_id: apiKey,
    redirect_uri: redirectUri,
    scope: "listings_r shops_r",
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

  const authUrl = `${ETSY_AUTH_URL}?${params}`;

  return c.json({
    authUrl,
    message: "Redirect user to authUrl to connect Etsy shop"
  });
});

// OAuth callback
etsy.get("/callback", async (c) => {
  const code = c.req.query("code");
  const state = c.req.query("state");
  const error = c.req.query("error");

  if (error) {
    return c.json({ error: `Etsy OAuth error: ${error}` }, 400);
  }

  if (!code || !state) {
    return c.json({ error: "Missing code or state" }, 400);
  }

  const storedState = oauthState.get(state);
  if (!storedState) {
    return c.json({ error: "Invalid or expired state" }, 400);
  }

  oauthState.delete(state);

  const apiKey = process.env.ETSY_API_KEY;
  const redirectUri = process.env.ETSY_REDIRECT_URI;

  // Exchange code for token
  try {
    const tokenResponse = await fetch(ETSY_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: apiKey!,
        redirect_uri: redirectUri!,
        code,
        code_verifier: storedState.codeVerifier,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("Token exchange failed:", errorText);
      return c.json({ error: "Failed to exchange code for token" }, 500);
    }

    const tokens = await tokenResponse.json() as {
      access_token: string;
      refresh_token: string;
      expires_in: number;
    };

    // Save tokens to workspace
    const workspacePath = process.env.WORKSPACE_PATH || "/root/.openclaw/workspace";
    await mkdir(workspacePath, { recursive: true });
    
    // Save tokens (in production, encrypt these!)
    await writeFile(
      join(workspacePath, ".etsy-tokens.json"),
      JSON.stringify({
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: Date.now() + tokens.expires_in * 1000,
        connectedAt: new Date().toISOString(),
      }, null, 2),
      { mode: 0o600 }
    );

    // Immediately sync products
    const syncResult = await syncProducts(tokens.access_token, workspacePath);

    return c.json({
      success: true,
      message: "Etsy connected! Products synced.",
      products: syncResult.count
    });
  } catch (err) {
    console.error("OAuth callback error:", err);
    return c.json({ error: "OAuth callback failed" }, 500);
  }
});

// Sync products from Etsy
etsy.post("/sync", async (c) => {
  const workspacePath = process.env.WORKSPACE_PATH || "/root/.openclaw/workspace";
  
  try {
    const tokensFile = await import("fs").then(fs => 
      fs.promises.readFile(join(workspacePath, ".etsy-tokens.json"), "utf-8")
    );
    const tokens = JSON.parse(tokensFile);

    // Check if token expired (TODO: implement refresh)
    if (Date.now() > tokens.expiresAt) {
      return c.json({ error: "Token expired, reconnect Etsy" }, 401);
    }

    const result = await syncProducts(tokens.accessToken, workspacePath);
    return c.json(result);
  } catch (err) {
    return c.json({ error: "No Etsy connection found. Connect first at /etsy/auth" }, 400);
  }
});

// Fetch and save products as markdown
async function syncProducts(accessToken: string, workspacePath: string) {
  const apiKey = process.env.ETSY_API_KEY;

  // Get user's shop
  const meResponse = await fetch(`${ETSY_API_BASE}/application/users/me`, {
    headers: {
      "x-api-key": apiKey!,
      "Authorization": `Bearer ${accessToken}`,
    },
  });

  if (!meResponse.ok) {
    throw new Error("Failed to get user info");
  }

  const me = await meResponse.json() as { user_id: number; shop_id?: number };
  
  if (!me.shop_id) {
    throw new Error("User has no Etsy shop");
  }

  // Get shop listings
  const listingsResponse = await fetch(
    `${ETSY_API_BASE}/application/shops/${me.shop_id}/listings/active?limit=100`,
    {
      headers: {
        "x-api-key": apiKey!,
        "Authorization": `Bearer ${accessToken}`,
      },
    }
  );

  if (!listingsResponse.ok) {
    throw new Error("Failed to get listings");
  }

  const listings = await listingsResponse.json() as {
    count: number;
    results: Array<{
      listing_id: number;
      title: string;
      description: string;
      price: { amount: number; divisor: number; currency_code: string };
      quantity: number;
      tags: string[];
      state: string;
    }>;
  };

  // Format as markdown
  let markdown = `# My Etsy Products\n\n`;
  markdown += `*Last synced: ${new Date().toISOString()}*\n\n`;
  markdown += `**Total Products: ${listings.count}**\n\n---\n\n`;

  for (const item of listings.results) {
    const price = (item.price.amount / item.price.divisor).toFixed(2);
    markdown += `## ${item.title}\n\n`;
    markdown += `- **Price:** ${price} ${item.price.currency_code}\n`;
    markdown += `- **Quantity:** ${item.quantity}\n`;
    markdown += `- **Status:** ${item.state}\n`;
    if (item.tags?.length > 0) {
      markdown += `- **Tags:** ${item.tags.join(", ")}\n`;
    }
    markdown += `\n${item.description?.slice(0, 500) || "No description"}${item.description?.length > 500 ? "..." : ""}\n\n`;
    markdown += `---\n\n`;
  }

  // Save to workspace
  await writeFile(join(workspacePath, "products.md"), markdown);

  // Also save as JSON for programmatic access
  await writeFile(
    join(workspacePath, "products.json"),
    JSON.stringify(listings.results, null, 2)
  );

  console.log(`✓ Synced ${listings.count} products to ${workspacePath}`);

  return {
    success: true,
    count: listings.count,
    syncedAt: new Date().toISOString()
  };
}

export { etsy };
