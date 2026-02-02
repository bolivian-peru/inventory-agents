import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth.js";
import { skillRegistry } from "../skills/registry.js";
import { db } from "../db/index.js";
import { products, agents } from "../db/schema.js";
import { eq } from "drizzle-orm";
import type { SkillContext, ProductData } from "../skills/types.js";

const app = new Hono();

app.use("/*", authMiddleware);

async function buildSkillContext(sellerId: string): Promise<{ context: SkillContext; error?: string }> {
  const [agent] = await db
    .select()
    .from(agents)
    .where(eq(agents.sellerId, sellerId))
    .limit(1);

  if (!agent) {
    return { context: null as unknown as SkillContext, error: "No agent found. Provision an agent first." };
  }

  const sellerProducts = await db
    .select()
    .from(products)
    .where(eq(products.sellerId, sellerId));

  const mappedProducts: ProductData[] = sellerProducts.map((p) => ({
    id: p.id,
    etsyListingId: p.etsyListingId,
    title: p.title,
    description: p.description,
    price: Number(p.price),
    quantity: p.quantity ?? 0,
    state: p.state ?? "active",
    tags: p.tags ?? [],
    images: (p.images as Array<{ url: string; rank: number }>) ?? [],
    createdAt: p.createdAt,
    syncedAt: p.syncedAt,
  }));

  return {
    context: {
      sellerId,
      shopId: agent.id,
      shopName: agent.name,
      products: mappedProducts,
    },
  };
}

app.get("/", async (c) => {
  await skillRegistry.initialize();
  const manifests = skillRegistry.getManifests();

  return c.json({
    skills: manifests.map((m) => ({
      id: m.id,
      name: m.name,
      version: m.version,
      description: m.description,
      capabilities: m.capabilities,
      enabled: m.enabled ?? true,
    })),
  });
});

app.get("/:id", async (c) => {
  const skillId = c.req.param("id");

  await skillRegistry.initialize();
  const skill = skillRegistry.get(skillId);

  if (!skill) {
    return c.json({ error: "Skill not found" }, 404);
  }

  return c.json({ skill: skill.manifest });
});

app.post("/:id/analyze", async (c) => {
  const skillId = c.req.param("id");
  const { sellerId } = c.get("auth");

  await skillRegistry.initialize();
  const skill = skillRegistry.get(skillId);

  if (!skill) {
    return c.json({ error: "Skill not found" }, 404);
  }

  const { context, error } = await buildSkillContext(sellerId);
  if (error) {
    return c.json({ error }, 400);
  }

  try {
    const result = await skill.analyze(context);

    return c.json({
      analysis: {
        skillId: result.skillId,
        timestamp: result.timestamp,
        summary: result.summary,
        sections: result.sections.map((s) => ({
          title: s.title,
          content: s.content,
        })),
        recommendations: result.recommendations,
        metrics: result.metrics,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Analysis failed";
    return c.json({ error: message }, 500);
  }
});

app.get("/:id/prompt", async (c) => {
  const skillId = c.req.param("id");
  const { sellerId } = c.get("auth");

  await skillRegistry.initialize();
  const skill = skillRegistry.get(skillId);

  if (!skill) {
    return c.json({ error: "Skill not found" }, 404);
  }

  const { context, error } = await buildSkillContext(sellerId);
  if (error) {
    return c.json({ error }, 400);
  }

  try {
    const prompt = await skill.generatePrompt(context);
    return c.json({ prompt });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Prompt generation failed";
    return c.json({ error: message }, 500);
  }
});

export default app;
