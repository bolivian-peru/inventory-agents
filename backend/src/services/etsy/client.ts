import { ETSY } from "../../config/constants.js";
import { db, etsyConnections } from "../../db/index.js";
import { eq } from "drizzle-orm";
import { decrypt, encrypt } from "../../utils/crypto.js";
import { refreshAccessToken } from "./oauth.js";
import { logger } from "../../utils/logger.js";

interface EtsyShop {
  shop_id: number;
  shop_name: string;
  title: string;
  currency_code: string;
  url: string;
  listing_active_count: number;
}

interface EtsyListing {
  listing_id: number;
  title: string;
  description: string;
  state: string;
  price: {
    amount: number;
    divisor: number;
    currency_code: string;
  };
  quantity: number;
  tags: string[];
  images: Array<{
    url_570xN: string;
    url_fullxfull: string;
  }>;
}

interface EtsyListingsResponse {
  count: number;
  results: EtsyListing[];
}

export class EtsyClient {
  private connectionId: string;
  private accessToken: string | null = null;

  constructor(connectionId: string) {
    this.connectionId = connectionId;
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken) {
      return this.accessToken;
    }

    // Get connection from database
    const [connection] = await db
      .select()
      .from(etsyConnections)
      .where(eq(etsyConnections.id, this.connectionId))
      .limit(1);

    if (!connection) {
      throw new Error("Etsy connection not found");
    }

    // Check if token is expired (with 5 minute buffer)
    const now = new Date();
    const expiresAt = new Date(connection.tokenExpiresAt);
    const buffer = 5 * 60 * 1000; // 5 minutes

    if (now.getTime() + buffer > expiresAt.getTime()) {
      // Token expired, refresh it
      logger.info("Refreshing Etsy token", { connectionId: this.connectionId });

      try {
        const refreshToken = decrypt(connection.refreshTokenEncrypted);
        const tokens = await refreshAccessToken(refreshToken);

        // Update tokens in database
        const newExpiresAt = new Date(Date.now() + tokens.expires_in * 1000);
        await db
          .update(etsyConnections)
          .set({
            accessTokenEncrypted: encrypt(tokens.access_token),
            refreshTokenEncrypted: encrypt(tokens.refresh_token),
            tokenExpiresAt: newExpiresAt,
          })
          .where(eq(etsyConnections.id, this.connectionId));

        this.accessToken = tokens.access_token;
        return tokens.access_token;
      } catch (error) {
        // Mark connection as expired
        await db
          .update(etsyConnections)
          .set({ status: "expired" })
          .where(eq(etsyConnections.id, this.connectionId));

        throw new Error("Failed to refresh Etsy token");
      }
    }

    // Token is still valid
    this.accessToken = decrypt(connection.accessTokenEncrypted);
    return this.accessToken;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getAccessToken();

    const response = await fetch(`${ETSY.API_BASE}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        "x-api-key": process.env.ETSY_API_KEY!,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Etsy API error: ${response.status} ${error}`);
    }

    return response.json();
  }

  async getShop(): Promise<EtsyShop> {
    // Get user ID first
    const user = await this.request<{ user_id: number }>("/application/users/me");

    // Get shop by user ID
    const shops = await this.request<{ results: EtsyShop[] }>(
      `/application/users/${user.user_id}/shops`
    );

    if (shops.results.length === 0) {
      throw new Error("No Etsy shop found for this account");
    }

    return shops.results[0];
  }

  async getListings(
    shopId: string,
    limit = 100,
    offset = 0
  ): Promise<EtsyListingsResponse> {
    return this.request<EtsyListingsResponse>(
      `/application/shops/${shopId}/listings?limit=${limit}&offset=${offset}&includes=images`
    );
  }

  async getAllListings(shopId: string): Promise<EtsyListing[]> {
    const allListings: EtsyListing[] = [];
    let offset = 0;
    const limit = 100;

    while (true) {
      const response = await this.getListings(shopId, limit, offset);
      allListings.push(...response.results);

      if (response.results.length < limit) {
        break;
      }
      offset += limit;
    }

    return allListings;
  }

  async getListing(listingId: string): Promise<EtsyListing> {
    return this.request<EtsyListing>(
      `/application/listings/${listingId}?includes=images`
    );
  }
}
