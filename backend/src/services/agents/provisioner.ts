import { mkdir, writeFile, readFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { env } from "../../config/env.js";
import { db, agents, agentSessions, etsyConnections, products, sellers } from "../../db/index.js";
import { eq, and } from "drizzle-orm";
import { generateAgentId } from "../../utils/id.js";
import { nanoid } from "nanoid";
import { logger } from "../../utils/logger.js";
import { decrypt } from "../../utils/crypto.js";
import { skillRegistry } from "../../skills/registry.js";
import type { SkillContext } from "../../skills/types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

interface ProvisionResult {
  agent: {
    id: string;
    name: string;
    status: string;
    workspacePath: string;
  };
}

export async function provisionAgent(sellerId: string): Promise<ProvisionResult> {
  logger.info("Provisioning agent", { sellerId });

  const [existingAgent] = await db
    .select({ id: agents.id })
    .from(agents)
    .where(eq(agents.sellerId, sellerId))
    .limit(1);

  if (existingAgent) {
    throw new Error("Agent already exists for this seller");
  }

  const [seller] = await db
    .select()
    .from(sellers)
    .where(eq(sellers.id, sellerId))
    .limit(1);

  if (!seller) {
    throw new Error("Seller not found");
  }

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
    throw new Error("No active Etsy connection. Please connect your Etsy shop first.");
  }

  const productList = await db
    .select({
      id: products.id,
      title: products.title,
      price: products.price,
      quantity: products.quantity,
      state: products.state,
    })
    .from(products)
    .where(eq(products.sellerId, sellerId))
    .limit(100);

  const agentId = generateAgentId();
  const workspacePath = join(env.OPENCLAW_WORKSPACES_DIR, `seller_${sellerId}`);
  const sessionId = nanoid(21);

  await mkdir(workspacePath, { recursive: true });
  await mkdir(join(workspacePath, "products"), { recursive: true });

  const templatesDir = join(__dirname, "../../../templates/agent-workspace");

  const claudeTemplate = await readFile(join(templatesDir, "CLAUDE.md"), "utf-8");
  const claudeMd = claudeTemplate
    .replace("{{SHOP_NAME}}", connection.shopName || "Your Shop")
    .replace("{{SELLER_NAME}}", seller.name || "Seller")
    .replace("{{PRODUCT_COUNT}}", String(productList.length))
    .replace("{{PRODUCTS_SUMMARY}}", formatProductsSummary(productList));

  await writeFile(join(workspacePath, "CLAUDE.md"), claudeMd);

  const soulTemplate = await readFile(join(templatesDir, "SOUL.md"), "utf-8");
  const soulMd = soulTemplate.replace("{{SHOP_NAME}}", connection.shopName || "Your Shop");

  await writeFile(join(workspacePath, "SOUL.md"), soulMd);

  const mcpConfig = {
    mcpServers: {
      etsy: {
        command: "npx",
        args: ["-y", "etsy-mcp-server"],
        env: {
          ETSY_API_KEY: env.ETSY_API_KEY,
          ETSY_ACCESS_TOKEN: decrypt(connection.accessTokenEncrypted),
          ETSY_SHOP_ID: connection.shopId,
        },
      },
    },
  };

  await writeFile(join(workspacePath, ".mcp.json"), JSON.stringify(mcpConfig, null, 2));

  await writeFile(
    join(workspacePath, "products", "inventory.json"),
    JSON.stringify(productList, null, 2)
  );

  await mkdir(join(workspacePath, "skills"), { recursive: true });
  await injectSkillPrompts(workspacePath, {
    sellerId,
    shopId: connection.shopId,
    shopName: connection.shopName || "Your Shop",
    products: productList.map((p) => ({
      id: p.id,
      etsyListingId: "",
      title: p.title,
      description: null,
      price: Number(p.price) || 0,
      quantity: p.quantity || 0,
      state: p.state || "active",
      tags: [],
      images: [],
      createdAt: new Date(),
      syncedAt: null,
    })),
  });

  const now = new Date();
  const [agent] = await db
    .insert(agents)
    .values({
      id: agentId,
      sellerId,
      name: `${connection.shopName} Agent`,
      status: "active",
      workspacePath,
      config: {},
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  await db.insert(agentSessions).values({
    agentId,
    sessionId,
    createdAt: now,
  });

  logger.info("Agent provisioned", { agentId, workspacePath });

  return {
    agent: {
      id: agent.id,
      name: agent.name,
      status: agent.status,
      workspacePath: agent.workspacePath,
    },
  };
}

function formatProductsSummary(
  productList: Array<{ title: string; price: string | null; quantity: number | null; state: string | null }>
): string {
  if (productList.length === 0) {
    return "No products synced yet.";
  }

  return productList
    .slice(0, 20)
    .map((p) => `- ${p.title} ($${p.price || "N/A"}, qty: ${p.quantity || 0}, ${p.state || "unknown"})`)
    .join("\n");
}

export async function deprovisionAgent(sellerId: string): Promise<void> {
  logger.info("Deprovisioning agent", { sellerId });
  await db.delete(agents).where(eq(agents.sellerId, sellerId));
}

async function injectSkillPrompts(workspacePath: string, context: SkillContext): Promise<void> {
  await skillRegistry.initialize();
  const skills = skillRegistry.getAll();
  const skillsIndex: Array<{ id: string; name: string; description: string }> = [];

  for (const skill of skills) {
    try {
      const prompt = await skill.generatePrompt(context);
      const skillDir = join(workspacePath, "skills", skill.manifest.id);

      await mkdir(skillDir, { recursive: true });
      await writeFile(join(skillDir, "SKILL.md"), prompt);
      await writeFile(
        join(skillDir, "manifest.json"),
        JSON.stringify(skill.manifest, null, 2)
      );

      skillsIndex.push({
        id: skill.manifest.id,
        name: skill.manifest.name,
        description: skill.manifest.description,
      });

      logger.info("Skill injected", { skillId: skill.manifest.id, workspacePath });
    } catch (error) {
      logger.error("Failed to inject skill", {
        skillId: skill.manifest.id,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  await writeFile(
    join(workspacePath, "skills", "index.json"),
    JSON.stringify({ skills: skillsIndex }, null, 2)
  );

  try {
    const claudePath = join(workspacePath, "CLAUDE.md");
    const claudeContent = await readFile(claudePath, "utf-8");

    const skillsSection = `
## Available Skills

Your agent has the following skills available:

${skillsIndex.map((s) => `- **${s.name}** (${s.id}): ${s.description}`).join("\n")}

Skill prompts are in the \`skills/\` directory. Read them when relevant queries come up.
`;

    if (!claudeContent.includes("## Available Skills")) {
      await writeFile(claudePath, claudeContent + "\n" + skillsSection);
    }
  } catch {
    // Ignore if CLAUDE.md doesn't exist yet
  }
}
