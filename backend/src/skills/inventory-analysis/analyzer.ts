import type {
  ProductData,
  AnalysisResult,
  AnalysisSection,
  Recommendation,
  PriceRange,
  StockStatus,
  CategoryBreakdown,
  SkillContext,
} from "../types.js";

const LOW_STOCK_THRESHOLD = 3;

export function analyzeInventory(context: SkillContext): AnalysisResult {
  const { products, shopName } = context;

  const stockStatus = analyzeStockStatus(products);
  const priceRanges = analyzePriceDistribution(products);
  const categories = analyzeCategories(products);
  const recommendations = generateRecommendations(products, stockStatus);

  const sections: AnalysisSection[] = [
    generateOverviewSection(products, shopName),
    generateStockSection(stockStatus, products),
    generatePricingSection(priceRanges, products),
    generateCategorySection(categories),
    generateTopProductsSection(products),
  ];

  return {
    skillId: "inventory-analysis",
    timestamp: new Date(),
    summary: generateSummary(products, stockStatus),
    sections,
    recommendations,
    metrics: {
      totalProducts: products.length,
      totalValue: stockStatus.totalValue,
      avgPrice: products.length > 0
        ? Math.round((stockStatus.totalValue / products.length) * 100) / 100
        : 0,
      inStockCount: stockStatus.inStock,
      lowStockCount: stockStatus.lowStock,
      outOfStockCount: stockStatus.outOfStock,
    },
  };
}

function analyzeStockStatus(products: ProductData[]): StockStatus {
  let inStock = 0;
  let lowStock = 0;
  let outOfStock = 0;
  let totalValue = 0;

  for (const product of products) {
    totalValue += product.price * product.quantity;

    if (product.quantity === 0 || product.state === "sold_out") {
      outOfStock++;
    } else if (product.quantity <= LOW_STOCK_THRESHOLD) {
      lowStock++;
    } else {
      inStock++;
    }
  }

  return { inStock, lowStock, outOfStock, totalValue };
}

function analyzePriceDistribution(products: ProductData[]): PriceRange[] {
  if (products.length === 0) return [];

  const prices = products.map((p) => p.price).sort((a, b) => a - b);
  const min = prices[0];
  const max = prices[prices.length - 1];
  const ranges: PriceRange[] = [];
  const rangeCount = Math.min(5, Math.ceil((max - min) / 10) || 1);
  const rangeSize = (max - min) / rangeCount || max;

  for (let i = 0; i < rangeCount; i++) {
    const rangeMin = min + i * rangeSize;
    const rangeMax = i === rangeCount - 1 ? max + 0.01 : min + (i + 1) * rangeSize;

    const count = products.filter(
      (p) => p.price >= rangeMin && p.price < rangeMax
    ).length;

    ranges.push({
      label: `$${rangeMin.toFixed(0)} - $${rangeMax.toFixed(0)}`,
      min: rangeMin,
      max: rangeMax,
      count,
      percentage: Math.round((count / products.length) * 100),
    });
  }

  return ranges.filter((r) => r.count > 0);
}

function analyzeCategories(products: ProductData[]): CategoryBreakdown[] {
  const categoryMap = new Map<string, ProductData[]>();

  for (const product of products) {
    const category = product.tags[0] || "Uncategorized";
    const existing = categoryMap.get(category) || [];
    existing.push(product);
    categoryMap.set(category, existing);
  }

  const categories: CategoryBreakdown[] = [];

  for (const [name, categoryProducts] of categoryMap) {
    const totalValue = categoryProducts.reduce(
      (sum, p) => sum + p.price * p.quantity,
      0
    );
    const avgPrice =
      categoryProducts.reduce((sum, p) => sum + p.price, 0) /
      categoryProducts.length;
    const topProducts = categoryProducts
      .sort((a, b) => b.price - a.price)
      .slice(0, 3)
      .map((p) => p.title);

    categories.push({
      name,
      count: categoryProducts.length,
      avgPrice: Math.round(avgPrice * 100) / 100,
      totalValue: Math.round(totalValue * 100) / 100,
      topProducts,
    });
  }

  return categories.sort((a, b) => b.count - a.count);
}

function generateRecommendations(
  products: ProductData[],
  stockStatus: StockStatus
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  const lowStockProducts = products.filter(
    (p) => p.quantity > 0 && p.quantity <= LOW_STOCK_THRESHOLD
  );
  if (lowStockProducts.length > 0) {
    recommendations.push({
      priority: "high",
      category: "Stock Management",
      title: "Restock Low Inventory Items",
      description: `${lowStockProducts.length} products have low stock (≤${LOW_STOCK_THRESHOLD} items). Consider restocking to avoid stockouts.`,
      action: `Review: ${lowStockProducts.slice(0, 3).map((p) => p.title).join(", ")}`,
    });
  }

  if (stockStatus.outOfStock > 0) {
    const outOfStockProducts = products.filter(
      (p) => p.quantity === 0 || p.state === "sold_out"
    );
    recommendations.push({
      priority: "high",
      category: "Stock Management",
      title: "Address Out-of-Stock Products",
      description: `${stockStatus.outOfStock} products are out of stock. These are losing potential sales.`,
      action: `Restock or mark as inactive: ${outOfStockProducts.slice(0, 3).map((p) => p.title).join(", ")}`,
    });
  }

  const prices = products.map((p) => p.price);
  const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
  const lowPriced = products.filter((p) => p.price < avgPrice * 0.5);
  if (lowPriced.length > 0 && lowPriced.length < products.length * 0.3) {
    recommendations.push({
      priority: "medium",
      category: "Pricing",
      title: "Review Low-Priced Items",
      description: `${lowPriced.length} products are priced significantly below average. Consider if pricing adjustments are needed.`,
      action: `Review pricing for: ${lowPriced.slice(0, 3).map((p) => `${p.title} ($${p.price})`).join(", ")}`,
    });
  }

  const uniqueTags = new Set(products.flatMap((p) => p.tags));
  if (uniqueTags.size < 5 && products.length > 10) {
    recommendations.push({
      priority: "low",
      category: "Catalog",
      title: "Diversify Product Tags",
      description: "Your inventory has limited tag variety. Adding more diverse tags can improve discoverability.",
      action: "Review and expand product tags for better Etsy search visibility",
    });
  }

  const noImages = products.filter((p) => p.images.length === 0);
  if (noImages.length > 0) {
    recommendations.push({
      priority: "medium",
      category: "Listing Quality",
      title: "Add Product Images",
      description: `${noImages.length} products have no images. Products with images sell significantly better.`,
      action: `Add images to: ${noImages.slice(0, 3).map((p) => p.title).join(", ")}`,
    });
  }

  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

function generateSummary(products: ProductData[], stockStatus: StockStatus): string {
  if (products.length === 0) {
    return "No products in inventory. Start by syncing your Etsy shop.";
  }

  const parts: string[] = [];
  parts.push(`${products.length} products totaling $${stockStatus.totalValue.toFixed(2)} in value.`);

  if (stockStatus.lowStock > 0 || stockStatus.outOfStock > 0) {
    const issues: string[] = [];
    if (stockStatus.lowStock > 0) issues.push(`${stockStatus.lowStock} low stock`);
    if (stockStatus.outOfStock > 0) issues.push(`${stockStatus.outOfStock} out of stock`);
    parts.push(`Attention needed: ${issues.join(", ")}.`);
  } else {
    parts.push("All products well-stocked.");
  }

  return parts.join(" ");
}

function generateOverviewSection(products: ProductData[], shopName: string): AnalysisSection {
  const activeProducts = products.filter((p) => p.state === "active");
  const draftProducts = products.filter((p) => p.state === "draft");

  return {
    title: "Inventory Overview",
    content: `
## ${shopName} Inventory Overview

| Metric | Value |
|--------|-------|
| Total Products | ${products.length} |
| Active Listings | ${activeProducts.length} |
| Draft Listings | ${draftProducts.length} |
| Total Inventory Value | $${products.reduce((sum, p) => sum + p.price * p.quantity, 0).toFixed(2)} |
| Average Price | $${products.length > 0 ? (products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(2) : "0.00"} |
`.trim(),
    data: {
      totalProducts: products.length,
      activeProducts: activeProducts.length,
      draftProducts: draftProducts.length,
    },
  };
}

function generateStockSection(stockStatus: StockStatus, products: ProductData[]): AnalysisSection {
  const lowStockItems = products
    .filter((p) => p.quantity > 0 && p.quantity <= LOW_STOCK_THRESHOLD)
    .map((p) => `- **${p.title}**: ${p.quantity} remaining`)
    .slice(0, 5)
    .join("\n");

  const outOfStockItems = products
    .filter((p) => p.quantity === 0 || p.state === "sold_out")
    .map((p) => `- ${p.title}`)
    .slice(0, 5)
    .join("\n");

  return {
    title: "Stock Status",
    content: `
## Stock Status

| Status | Count |
|--------|-------|
| ✅ In Stock | ${stockStatus.inStock} |
| ⚠️ Low Stock (≤${LOW_STOCK_THRESHOLD}) | ${stockStatus.lowStock} |
| ❌ Out of Stock | ${stockStatus.outOfStock} |

${stockStatus.lowStock > 0 ? `### Low Stock Items\n${lowStockItems}` : ""}

${stockStatus.outOfStock > 0 ? `### Out of Stock Items\n${outOfStockItems}` : ""}
`.trim(),
    data: { ...stockStatus } as Record<string, unknown>,
  };
}

function generatePricingSection(priceRanges: PriceRange[], products: ProductData[]): AnalysisSection {
  if (products.length === 0) {
    return {
      title: "Pricing Analysis",
      content: "No products to analyze.",
    };
  }

  const prices = products.map((p) => p.price).sort((a, b) => a - b);
  const minPrice = prices[0];
  const maxPrice = prices[prices.length - 1];
  const medianPrice = prices[Math.floor(prices.length / 2)];

  const rangeTable = priceRanges
    .map((r) => `| ${r.label} | ${r.count} | ${r.percentage}% |`)
    .join("\n");

  return {
    title: "Pricing Analysis",
    content: `
## Pricing Analysis

| Metric | Value |
|--------|-------|
| Lowest Price | $${minPrice.toFixed(2)} |
| Highest Price | $${maxPrice.toFixed(2)} |
| Median Price | $${medianPrice.toFixed(2)} |

### Price Distribution

| Range | Products | % of Inventory |
|-------|----------|----------------|
${rangeTable}
`.trim(),
    data: { minPrice, maxPrice, medianPrice, ranges: priceRanges },
  };
}

function generateCategorySection(categories: CategoryBreakdown[]): AnalysisSection {
  if (categories.length === 0) {
    return {
      title: "Categories",
      content: "No category data available.",
    };
  }

  const categoryTable = categories
    .slice(0, 10)
    .map(
      (c) =>
        `| ${c.name} | ${c.count} | $${c.avgPrice.toFixed(2)} | $${c.totalValue.toFixed(2)} |`
    )
    .join("\n");

  return {
    title: "Category Breakdown",
    content: `
## Category Breakdown

| Category | Products | Avg Price | Total Value |
|----------|----------|-----------|-------------|
${categoryTable}
`.trim(),
    data: { categories },
  };
}

function generateTopProductsSection(products: ProductData[]): AnalysisSection {
  if (products.length === 0) {
    return {
      title: "Top Products",
      content: "No products to display.",
    };
  }

  const topByPrice = products
    .sort((a, b) => b.price - a.price)
    .slice(0, 5)
    .map((p) => `| ${p.title.substring(0, 40)}${p.title.length > 40 ? "..." : ""} | $${p.price.toFixed(2)} | ${p.quantity} |`)
    .join("\n");

  const topByValue = products
    .sort((a, b) => b.price * b.quantity - a.price * a.quantity)
    .slice(0, 5)
    .map((p) => `| ${p.title.substring(0, 40)}${p.title.length > 40 ? "..." : ""} | $${(p.price * p.quantity).toFixed(2)} |`)
    .join("\n");

  return {
    title: "Top Products",
    content: `
## Top Products

### By Price

| Product | Price | Stock |
|---------|-------|-------|
${topByPrice}

### By Inventory Value

| Product | Value |
|---------|-------|
${topByValue}
`.trim(),
  };
}

function getPriorityEmoji(priority: "high" | "medium" | "low"): string {
  switch (priority) {
    case "high":
      return "🔴";
    case "medium":
      return "🟡";
    case "low":
      return "🟢";
  }
}

export function formatAnalysisAsMarkdown(result: AnalysisResult): string {
  const parts: string[] = [];

  parts.push("# Inventory Analysis Report");
  parts.push(`*Generated: ${result.timestamp.toISOString()}*\n`);
  parts.push(`> ${result.summary}\n`);

  for (const section of result.sections) {
    parts.push(section.content);
    parts.push("");
  }

  if (result.recommendations.length > 0) {
    parts.push("## Recommendations\n");
    for (const rec of result.recommendations) {
      const emoji = getPriorityEmoji(rec.priority);
      parts.push(`### ${emoji} ${rec.title}`);
      parts.push(`**Category:** ${rec.category} | **Priority:** ${rec.priority}`);
      parts.push(`\n${rec.description}`);
      if (rec.action) {
        parts.push(`\n**Action:** ${rec.action}`);
      }
      parts.push("");
    }
  }

  return parts.join("\n");
}
