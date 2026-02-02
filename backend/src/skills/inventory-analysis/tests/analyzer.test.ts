/**
 * Inventory Analyzer Tests
 *
 * Install vitest: npm install -D vitest
 * Run with: npx vitest run src/skills/inventory-analysis/tests/analyzer.test.ts
 */

import { describe, it, expect } from "vitest";
import { analyzeInventory, formatAnalysisAsMarkdown } from "../analyzer.js";
import type { SkillContext, ProductData } from "../../types.js";

// Sample test data
const createProduct = (overrides: Partial<ProductData> = {}): ProductData => ({
  id: `prod_${Math.random().toString(36).slice(2)}`,
  etsyListingId: `etsy_${Math.random().toString(36).slice(2)}`,
  title: "Test Product",
  description: "A test product description",
  price: 25.0,
  quantity: 10,
  state: "active",
  tags: ["handmade", "vintage"],
  images: [{ url: "https://example.com/image.jpg", rank: 1 }],
  createdAt: new Date(),
  syncedAt: new Date(),
  ...overrides,
});

const createContext = (products: ProductData[]): SkillContext => ({
  sellerId: "sel_test123",
  shopId: "shop_test123",
  shopName: "Test Shop",
  products,
});

describe("analyzeInventory", () => {
  it("should handle empty inventory", () => {
    const context = createContext([]);
    const result = analyzeInventory(context);

    expect(result.skillId).toBe("inventory-analysis");
    expect(result.metrics.totalProducts).toBe(0);
    expect(result.summary).toContain("No products");
  });

  it("should calculate correct metrics for products", () => {
    const products = [
      createProduct({ price: 10, quantity: 5 }),
      createProduct({ price: 20, quantity: 3 }),
      createProduct({ price: 30, quantity: 2 }),
    ];
    const context = createContext(products);
    const result = analyzeInventory(context);

    expect(result.metrics.totalProducts).toBe(3);
    expect(result.metrics.avgPrice).toBe(20); // (10+20+30)/3
    expect(result.metrics.totalValue).toBe(170); // 10*5 + 20*3 + 30*2
  });

  it("should identify low stock items", () => {
    const products = [
      createProduct({ title: "Low Stock Item", quantity: 2 }),
      createProduct({ title: "Normal Item", quantity: 10 }),
    ];
    const context = createContext(products);
    const result = analyzeInventory(context);

    expect(result.metrics.lowStockCount).toBe(1);
    expect(result.metrics.inStockCount).toBe(1);
  });

  it("should identify out of stock items", () => {
    const products = [
      createProduct({ title: "Out of Stock", quantity: 0 }),
      createProduct({ title: "Sold Out", state: "sold_out", quantity: 5 }),
      createProduct({ title: "Available", quantity: 10 }),
    ];
    const context = createContext(products);
    const result = analyzeInventory(context);

    expect(result.metrics.outOfStockCount).toBe(2);
    expect(result.metrics.inStockCount).toBe(1);
  });

  it("should generate recommendations for low stock", () => {
    const products = [
      createProduct({ title: "Low Stock A", quantity: 1 }),
      createProduct({ title: "Low Stock B", quantity: 2 }),
    ];
    const context = createContext(products);
    const result = analyzeInventory(context);

    const stockRec = result.recommendations.find(
      (r) => r.category === "Stock Management" && r.title.includes("Restock")
    );
    expect(stockRec).toBeDefined();
    expect(stockRec?.priority).toBe("high");
  });

  it("should generate recommendations for missing images", () => {
    const products = [
      createProduct({ title: "No Images", images: [] }),
      createProduct({ title: "Has Images", images: [{ url: "test", rank: 1 }] }),
    ];
    const context = createContext(products);
    const result = analyzeInventory(context);

    const imageRec = result.recommendations.find(
      (r) => r.category === "Listing Quality"
    );
    expect(imageRec).toBeDefined();
  });

  it("should categorize products by tags", () => {
    const products = [
      createProduct({ tags: ["jewelry", "handmade"] }),
      createProduct({ tags: ["jewelry", "vintage"] }),
      createProduct({ tags: ["clothing", "handmade"] }),
    ];
    const context = createContext(products);
    const result = analyzeInventory(context);

    const categorySection = result.sections.find((s) =>
      s.title.includes("Category")
    );
    expect(categorySection).toBeDefined();
    expect(categorySection?.content).toContain("jewelry");
    expect(categorySection?.content).toContain("clothing");
  });
});

describe("formatAnalysisAsMarkdown", () => {
  it("should generate valid markdown output", () => {
    const products = [createProduct()];
    const context = createContext(products);
    const result = analyzeInventory(context);
    const markdown = formatAnalysisAsMarkdown(result);

    expect(markdown).toContain("# Inventory Analysis Report");
    expect(markdown).toContain("## Inventory Overview");
    expect(markdown).toContain("Test Shop");
  });

  it("should include recommendations section", () => {
    const products = [createProduct({ quantity: 1 })];
    const context = createContext(products);
    const result = analyzeInventory(context);
    const markdown = formatAnalysisAsMarkdown(result);

    expect(markdown).toContain("## Recommendations");
  });

  it("should format priority indicators", () => {
    const products = [createProduct({ quantity: 0 })]; // Out of stock = high priority
    const context = createContext(products);
    const result = analyzeInventory(context);
    const markdown = formatAnalysisAsMarkdown(result);

    expect(markdown).toContain("🔴"); // High priority indicator
  });
});
