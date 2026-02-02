import { db, products, etsyConnections } from "../../db/index.js";
import { eq, and } from "drizzle-orm";
import { EtsyClient } from "./client.js";
import { generateProductId } from "../../utils/id.js";
import { logger } from "../../utils/logger.js";

export async function syncProducts(sellerId: string): Promise<number> {
  logger.info("Starting product sync", { sellerId });

  // Get Etsy connection
  const [connection] = await db
    .select()
    .from(etsyConnections)
    .where(
      and(
        eq(etsyConnections.sellerId, sellerId),
        eq(etsyConnections.status, "active")
      )
    )
    .limit(1);

  if (!connection) {
    throw new Error("No active Etsy connection found");
  }

  const client = new EtsyClient(connection.id);

  // Fetch all listings from Etsy
  const listings = await client.getAllListings(connection.shopId);
  logger.info(`Fetched ${listings.length} listings from Etsy`, { sellerId });

  let synced = 0;
  const now = new Date();

  for (const listing of listings) {
    try {
      // Calculate price
      const price = listing.price.amount / listing.price.divisor;

      // Extract image URLs
      const images = listing.images.map((img) => ({
        url_570: img.url_570xN,
        url_full: img.url_fullxfull,
      }));

      // Upsert product
      await db
        .insert(products)
        .values({
          id: generateProductId(),
          sellerId,
          etsyListingId: String(listing.listing_id),
          title: listing.title,
          description: listing.description,
          price: String(price),
          quantity: listing.quantity,
          state: listing.state,
          tags: listing.tags,
          images,
          rawData: listing,
          syncedAt: now,
          createdAt: now,
        })
        .onConflictDoUpdate({
          target: [products.sellerId, products.etsyListingId],
          set: {
            title: listing.title,
            description: listing.description,
            price: String(price),
            quantity: listing.quantity,
            state: listing.state,
            tags: listing.tags,
            images,
            rawData: listing,
            syncedAt: now,
          },
        });

      synced++;
    } catch (error) {
      logger.error(`Failed to sync listing ${listing.listing_id}`, {
        error: (error as Error).message,
        sellerId,
      });
    }
  }

  // Update last sync time on connection
  await db
    .update(etsyConnections)
    .set({ lastSyncAt: now })
    .where(eq(etsyConnections.id, connection.id));

  logger.info(`Synced ${synced} products`, { sellerId });
  return synced;
}
