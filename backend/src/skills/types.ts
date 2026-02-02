export interface SkillManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  capabilities: string[];
  requiredData: string[];
  outputFormat: "markdown" | "json" | "text";
  enabled?: boolean;
}

export interface SkillContext {
  sellerId: string;
  shopId: string;
  shopName: string;
  products: ProductData[];
  metadata?: Record<string, unknown>;
}

export interface ProductData {
  id: string;
  etsyListingId: string;
  title: string;
  description: string | null;
  price: number;
  quantity: number;
  state: string;
  tags: string[];
  images: ProductImage[];
  category?: string;
  createdAt: Date;
  syncedAt: Date | null;
}

export interface ProductImage {
  url: string;
  rank: number;
}

export interface AnalysisResult {
  skillId: string;
  timestamp: Date;
  summary: string;
  sections: AnalysisSection[];
  recommendations: Recommendation[];
  metrics: Record<string, number | string>;
}

export interface AnalysisSection {
  title: string;
  content: string;
  data?: Record<string, unknown>;
}

export interface Recommendation {
  priority: "high" | "medium" | "low";
  category: string;
  title: string;
  description: string;
  action?: string;
}

export interface Skill {
  manifest: SkillManifest;
  analyze(context: SkillContext): Promise<AnalysisResult>;
  generatePrompt(context: SkillContext): Promise<string>;
}

export interface PriceRange {
  label: string;
  min: number;
  max: number;
  count: number;
  percentage: number;
}

export interface StockStatus {
  inStock: number;
  lowStock: number;
  outOfStock: number;
  totalValue: number;
}

export interface CategoryBreakdown {
  name: string;
  count: number;
  avgPrice: number;
  totalValue: number;
  topProducts: string[];
}
