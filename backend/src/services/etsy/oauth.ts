import { createHash, randomBytes } from "crypto";
import Redis from "ioredis";
import { env } from "../../config/env.js";
import { ETSY } from "../../config/constants.js";

const redis = new Redis(env.REDIS_URL);

interface OAuthState {
  sellerId: string;
  codeVerifier: string;
  createdAt: number;
}

// Generate PKCE code verifier (43-128 characters)
function generateCodeVerifier(): string {
  return randomBytes(32)
    .toString("base64url")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 64);
}

// Generate PKCE code challenge (SHA256 hash of verifier)
function generateCodeChallenge(verifier: string): string {
  return createHash("sha256").update(verifier).digest("base64url");
}

// Generate random state
function generateState(): string {
  return randomBytes(16).toString("hex");
}

export async function startOAuthFlow(sellerId: string): Promise<string> {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);

  // Store state in Redis (expires in 10 minutes)
  const stateData: OAuthState = {
    sellerId,
    codeVerifier,
    createdAt: Date.now(),
  };
  await redis.setex(`oauth:${state}`, 600, JSON.stringify(stateData));

  // Build authorization URL
  const params = new URLSearchParams({
    response_type: "code",
    client_id: env.ETSY_API_KEY,
    redirect_uri: env.ETSY_REDIRECT_URI,
    scope: ETSY.SCOPES.join(" "),
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

  return `${ETSY.OAUTH_BASE}/connect?${params.toString()}`;
}

export async function getOAuthState(state: string): Promise<OAuthState | null> {
  const data = await redis.get(`oauth:${state}`);
  if (!data) return null;

  // Delete state after retrieval (one-time use)
  await redis.del(`oauth:${state}`);

  return JSON.parse(data);
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export async function exchangeCodeForTokens(
  code: string,
  codeVerifier: string
): Promise<TokenResponse> {
  const response = await fetch(ETSY.TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: env.ETSY_API_KEY,
      redirect_uri: env.ETSY_REDIRECT_URI,
      code,
      code_verifier: codeVerifier,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token exchange failed: ${error}`);
  }

  return response.json();
}

export async function refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
  const response = await fetch(ETSY.TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: env.ETSY_API_KEY,
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token refresh failed: ${error}`);
  }

  return response.json();
}
