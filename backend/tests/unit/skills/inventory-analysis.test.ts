/**
 * Inventory Analysis Skill - Unit Tests (TDD)
 *
 * These tests define the expected behavior of inventory analysis.
 *
 * @tags @unit @skill
 */

import { describe, it, expect } from "vitest";
import { analyzeInventory, formatAnalysisAsMarkdown } from "../../../src/skills/inventory-analysis/analyzer";
import type { SkillContext, ProductData } from "../../../src/skills/types";

// Helper to create test products
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

describe("InventoryAnalysisSkill @unit @skill", () => {
  describe("analyzeInventory()", () => {
    describe("Basic Analysis", () => {
      it("should handle empty inventory", () => {
        // GIVEN
        const context = createContext([]);

        // WHEN
        const result = analyzeInventory(context);

        // THEN
        expect(result.skillId).toBe("inventory-analysis");
        expect(result.metrics.totalProducts).toBe(0);
        expect(result.summary).toContain("No products");
      });

      it("should calculate total product count", () => {
        // GIVEN
        const products = [createProduct(), createProduct(), createProduct()];
        const context = createContext(products);

        // WHEN
        const result = analyzeInventory(context);

        // THEN
        expect(result.metrics.totalProducts).toBe(3);
      });

      it("should calculate average price", () => {
        // GIVEN
        const products = [
          createProduct({ price: 10 }),
          createProduct({ price: 20 }),
          createProduct({ price: 30 }),
        ];
        const context = createContext(products);

        // WHEN
        const result = analyzeInventory(context);

        // THEN
        expect(result.metrics.avgPrice).toBe(20);
      });

      it("should calculate total inventory value", () => {
        // GIVEN
        const products = [
          createProduct({ price: 10, quantity: 5 }),  // 50
          createProduct({ price: 20, quantity: 3 }),  // 60
          createProduct({ price: 30, quantity: 2 }),  // 60
        ];
        const context = createContext(products);

        // WHEN
        const result = analyzeInventory(context);

        // THEN
        expect(result.metrics.totalValue).toBe(170);
      });
    });

    describe("Stock Analysis", () => {
      it("should identify in-stock items (quantity > 3)", () => {
        // GIVEN
        const products = [
          createProduct({ quantity: 10 }), // In stock
          createProduct({ quantity: 5 }),  // In stock
        ];
        const context = createContext(products);

        // WHEN
        const result = analyzeInventory(context);

        // THEN
        expect(result.metrics.inStockCount).toBe(2);
      });

      it("should identify low-stock items (quantity 1-3)", () => {
        // GIVEN
        const products = [
          createProduct({ title: "Low Stock A", quantity: 1 }),
          createProduct({ title: "Low Stock B", quantity: 2 }),
          createProduct({ title: "Low Stock C", quantity: 3 }),
          createProduct({ title: "Normal Stock", quantity: 10 }),
        ];
        const context = createContext(products);

        // WHEN
        const result = analyzeInventory(context);

        // THEN
        expect(result.metrics.lowStockCount).toBe(3);
      });

      it("should identify out-of-stock items (quantity = 0)", () => {
        // GIVEN
        const products = [
          createProduct({ title: "Out of Stock", quantity: 0 }),
          createProduct({ title: "Available", quantity: 10 }),
        ];
        const context = createContext(products);

        // WHEN
        const result = analyzeInventory(context);

        // THEN
        expect(result.metrics.outOfStockCount).toBe(1);
      });

      it("should count sold_out state as out-of-stock", () => {
        // GIVEN
        const products = [
          createProduct({ state: "sold_out", quantity: 5 }), // State overrides quantity
        ];
        const context = createContext(products);

        // WHEN
        const result = analyzeInventory(context);

        // THEN
        expect(result.metrics.outOfStockCount).toBe(1);
      });
    });

    describe("Price Distribution", () => {
      it("should create price ranges", () => {
        // GIVEN
        const products = [
          createProduct({ price: 10 }),
          createProduct({ price: 25 }),
          createProduct({ price: 50 }),
          createProduct({ price: 75 }),
          createProduct({ price: 100 }),
        ];
        const context = createContext(products);

        // WHEN
        const result = analyzeInventory(context);

        // THEN
        const pricingSection = result.sections.find((s) => s.title.includes("Pricing"));
        expect(pricingSection).toBeDefined();
        expect(pricingSection?.content).toContain("Price Distribution");
      });

      it("should calculate min and max prices", () => {
        // GIVEN
        const products = [
          createProduct({ price: 15 }),
          createProduct({ price: 45 }),
          createProduct({ price: 100 }),
        ];
        const context = createContext(products);

        // WHEN
        const result = analyzeInventory(context);

        // THEN
        const pricingSection = result.sections.find((s) => s.title.includes("Pricing"));
        expect(pricingSection?.content).toContain("$15.00"); // Min
        expect(pricingSection?.content).toContain("$100.00"); // Max
      });
    });

    describe("Category Analysis", () => {
      it("should group products by first tag", () => {
        // GIVEN
        const products = [
          createProduct({ tags: ["jewelry", "handmade"] }),
          createProduct({ tags: ["jewelry", "vintage"] }),
          createProduct({ tags: ["clothing", "handmade"] }),
        ];
        const context = createContext(products);

        // WHEN
        const result = analyzeInventory(context);

        // THEN
        const categorySection = result.sections.find((s) => s.title.includes("Category"));
        expect(categorySection?.content).toContain("jewelry");
        expect(categorySection?.content).toContain("clothing");
      });

      it("should label products without tags as Uncategorized", () => {
        // GIVEN
        const products = [
          createProduct({ tags: [] }),
        ];
        const context = createContext(products);

        // WHEN
        const result = analyzeInventory(context);

        // THEN
        const categorySection = result.sections.find((s) => s.title.includes("Category"));
        expect(categorySection?.content).toContain("Uncategorized");
      });
    });

    describe("Recommendations", () => {
      it("should recommend restocking low-stock items", () => {
        // GIVEN
        const products = [
          createProduct({ title: "Low Stock Item", quantity: 2 }),
        ];
        const context = createContext(products);

        // WHEN
        const result = analyzeInventory(context);

        // THEN
        const stockRec = result.recommendations.find(
          (r) => r.category === "Stock Management" && r.title.includes("Restock")
        );
        expect(stockRec).toBeDefined();
        expect(stockRec?.priority).toBe("high");
      });

      it("should recommend addressing out-of-stock items", () => {
        // GIVEN
        const products = [
          createProduct({ title: "Out of Stock", quantity: 0 }),
        ];
        const context = createContext(products);

        // WHEN
        const result = analyzeInventory(context);

        // THEN
        const outOfStockRec = result.recommendations.find(
          (r) => r.title.includes("Out-of-Stock")
        );
        expect(outOfStockRec).toBeDefined();
        expect(outOfStockRec?.priority).toBe("high");
      });

      it("should recommend adding images to products without images", () => {
        // GIVEN
        const products = [
          createProduct({ title: "No Images", images: [] }),
        ];
        const context = createContext(products);

        // WHEN
        const result = analyzeInventory(context);

        // THEN
        const imageRec = result.recommendations.find(
          (r) => r.category === "Listing Quality"
        );
        expect(imageRec).toBeDefined();
      });

      it("should order recommendations by priority", () => {
        // GIVEN
        const products = [
          createProduct({ quantity: 0 }),        // High: out of stock
          createProduct({ images: [] }),         // Medium: no images
          createProduct({ tags: [] }),           // Low: no tags (if < 5 unique tags)
        ];
        const context = createContext(products);

        // WHEN
        const result = analyzeInventory(context);

        // THEN
        const priorities = result.recommendations.map((r) => r.priority);
        expect(priorities[0]).toBe("high");
      });
    });

    describe("Summary Generation", () => {
      it("should summarize total products and value", () => {
        // GIVEN
        const products = [
          createProduct({ price: 25, quantity: 4 }),
          createProduct({ price: 50, quantity: 2 }),
        ];
        const context = createContext(products);

        // WHEN
        const result = analyzeInventory(context);

        // THEN
        expect(result.summary).toContain("2 products");
        expect(result.summary).toContain("$200.00");
      });

      it("should mention stock issues in summary", () => {
        // GIVEN
        const products = [
          createProduct({ quantity: 1 }), // Low stock
          createProduct({ quantity: 0 }), // Out of stock
        ];
        const context = createContext(products);

        // WHEN
        const result = analyzeInventory(context);

        // THEN
        expect(result.summary).toContain("Attention needed");
        expect(result.summary).toContain("low stock");
        expect(result.summary).toContain("out of stock");
      });

      it("should indicate healthy inventory when all is well", () => {
        // GIVEN
        const products = [
          createProduct({ quantity: 10 }),
          createProduct({ quantity: 15 }),
        ];
        const context = createContext(products);

        // WHEN
        const result = analyzeInventory(context);

        // THEN
        expect(result.summary).toContain("well-stocked");
      });
    });
  });

  describe("formatAnalysisAsMarkdown()", () => {
    it("should include report header with timestamp", () => {
      // GIVEN
      const products = [createProduct()];
      const context = createContext(products);
      const result = analyzeInventory(context);

      // WHEN
      const markdown = formatAnalysisAsMarkdown(result);

      // THEN
      expect(markdown).toContain("# Inventory Analysis Report");
      expect(markdown).toContain("Generated:");
    });

    it("should include all sections", () => {
      // GIVEN
      const products = [createProduct()];
      const context = createContext(products);
      const result = analyzeInventory(context);

      // WHEN
      const markdown = formatAnalysisAsMarkdown(result);

      // THEN
      expect(markdown).toContain("## Inventory Overview");
      expect(markdown).toContain("## Stock Status");
      expect(markdown).toContain("## Pricing Analysis");
      expect(markdown).toContain("## Category Breakdown");
      expect(markdown).toContain("## Top Products");
    });

    it("should include recommendations section", () => {
      // GIVEN
      const products = [createProduct({ quantity: 1 })];
      const context = createContext(products);
      const result = analyzeInventory(context);

      // WHEN
      const markdown = formatAnalysisAsMarkdown(result);

      // THEN
      expect(markdown).toContain("## Recommendations");
    });

    it("should use emoji indicators for priority", () => {
      // GIVEN
      const products = [createProduct({ quantity: 0 })];
      const context = createContext(products);
      const result = analyzeInventory(context);

      // WHEN
      const markdown = formatAnalysisAsMarkdown(result);

      // THEN
      expect(markdown).toContain("🔴"); // High priority
    });
  });
});
