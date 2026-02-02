import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { authMiddleware } from "../middleware/auth.js";
import { db, products } from "../db/index.js";
import { eq, desc, ilike, and, or } from "drizzle-orm";
import { syncProducts } from "../services/etsy/sync.js";

const productsRoute = new Hono();

const listQuerySchema = z.object({
  search: z.string().optional(),
  state: z.enum(["active", "draft", "sold_out"]).optional(),
  limit: z.coerce.number().min(1).max(100).default(50),
  offset: z.coerce.number().min(0).default(0),
});

// List products
productsRoute.get(
  "/",
  authMiddleware,
  zValidator("query", listQuerySchema),
  async (c) => {
    const { sellerId } = c.get("auth");
    const { search, state, limit, offset } = c.req.valid("query");

    // Build conditions
    const conditions = [eq(products.sellerId, sellerId)];

    if (state) {
      conditions.push(eq(products.state, state));
    }

    if (search) {
      conditions.push(
        or(
          ilike(products.title, `%${search}%`),
          ilike(products.description, `%${search}%`)
        )!
      );
    }

    const [items, countResult] = await Promise.all([
      db
        .select({
          id: products.id,
          etsyListingId: products.etsyListingId,
          title: products.title,
          description: products.description,
          price: products.price,
          quantity: products.quantity,
          state: products.state,
          tags: products.tags,
          images: products.images,
          syncedAt: products.syncedAt,
        })
        .from(products)
        .where(and(...conditions))
        .orderBy(desc(products.syncedAt))
        .limit(limit)
        .offset(offset),

      db
        .select({ count: products.id })
        .from(products)
        .where(and(...conditions)),
    ]);

    return c.json({
      products: items,
      total: countResult.length,
      limit,
      offset,
    });
  }
);

// Get single product
productsRoute.get("/:id", authMiddleware, async (c) => {
  const { sellerId } = c.get("auth");
  const id = c.req.param("id");

  const [product] = await db
    .select()
    .from(products)
    .where(and(eq(products.id, id), eq(products.sellerId, sellerId)))
    .limit(1);

  if (!product) {
    return c.json({ error: "Product not found" }, 404);
  }

  return c.json({ product });
});

// Force sync products from Etsy
productsRoute.post("/sync", authMiddleware, async (c) => {
  const { sellerId } = c.get("auth");

  const count = await syncProducts(sellerId);

  return c.json({
    success: true,
    synced: count,
  });
});

export { productsRoute };
