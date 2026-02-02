# IFA Agent Skills System

## Overview

Skills are modular capabilities that enhance agent understanding and actions. Each skill provides specialized knowledge, analysis tools, and prompts for specific domains.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        SKILL SYSTEM                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────┐    ┌─────────────────┐                     │
│  │  Skill Registry │◄───│  Agent Provision │                    │
│  │  (registry.ts)  │    │  (provisioner.ts)│                    │
│  └────────┬────────┘    └─────────────────┘                     │
│           │                                                      │
│           ▼                                                      │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    SKILLS                                │    │
│  │                                                          │    │
│  │  ┌──────────────────┐  ┌──────────────────┐             │    │
│  │  │ inventory-analysis│  │ pricing-optimizer │ (planned)  │    │
│  │  │ ├── manifest.json │  │ ├── manifest.json │            │    │
│  │  │ ├── analyzer.ts   │  │ ├── optimizer.ts  │            │    │
│  │  │ ├── index.ts      │  │ └── index.ts      │            │    │
│  │  │ └── prompts/      │  └──────────────────┘             │    │
│  │  └──────────────────┘                                    │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    AGENT WORKSPACE                               │
│                                                                  │
│  ~/.openclaw/workspaces/seller_{id}/                            │
│    ├── CLAUDE.md (references skills)                            │
│    ├── SOUL.md                                                  │
│    ├── .mcp.json                                                │
│    ├── products/                                                 │
│    └── skills/                                                   │
│        ├── index.json (skill manifest list)                     │
│        └── inventory-analysis/                                   │
│            ├── SKILL.md (generated prompt)                      │
│            └── manifest.json                                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Skill Structure

Each skill follows this structure:

```
src/skills/{skill-name}/
├── manifest.json       # Skill metadata
├── index.ts           # Entry point, implements Skill interface
├── {logic}.ts         # Core business logic
├── prompts/           # LLM prompt templates
│   └── {prompt}.md
└── tests/             # Skill tests
    └── {logic}.test.ts
```

## Creating a New Skill

### 1. Create the manifest

```json
{
  "id": "my-skill",
  "name": "My Skill",
  "version": "1.0.0",
  "description": "What this skill does",
  "author": "Your Name",
  "capabilities": ["analyze", "recommend"],
  "requiredData": ["products"],
  "outputFormat": "markdown",
  "enabled": true
}
```

### 2. Implement the Skill interface

```typescript
import type { Skill, SkillManifest, SkillContext, AnalysisResult } from "../types.js";
import manifest from "./manifest.json" with { type: "json" };

export class MySkill implements Skill {
  readonly manifest: SkillManifest = manifest as SkillManifest;

  async analyze(context: SkillContext): Promise<AnalysisResult> {
    // Your analysis logic
    return {
      skillId: this.manifest.id,
      timestamp: new Date(),
      summary: "Analysis summary",
      sections: [],
      recommendations: [],
      metrics: {},
    };
  }

  async generatePrompt(context: SkillContext): Promise<string> {
    const result = await this.analyze(context);
    // Format as markdown prompt for agent
    return `## ${this.manifest.name}\n\n${result.summary}`;
  }
}
```

### 3. Register in registry.ts

```typescript
import { MySkill } from "./my-skill/index.js";

// In SkillRegistry.initialize():
this.register(new MySkill());
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/skills` | List all available skills |
| GET | `/skills/:id` | Get skill details |
| POST | `/skills/:id/analyze` | Run skill analysis |
| GET | `/skills/:id/prompt` | Get skill prompt for agent |

## Available Skills

### inventory-analysis

**Purpose**: Comprehensive analysis of Etsy product inventory

**Capabilities**:
- Product categorization by tags
- Pricing distribution analysis
- Stock level monitoring
- Actionable recommendations

**Triggers**:
- "analyze inventory"
- "inventory report"
- "product analysis"
- "stock check"
- "pricing analysis"

**Output Sections**:
1. Inventory Overview - Total products, active/draft, value
2. Stock Status - In stock, low stock, out of stock
3. Pricing Analysis - Price ranges, distribution
4. Categories - Breakdown by product tags
5. Top Products - By price and value
6. Recommendations - Prioritized action items

## Skill Context

Skills receive a `SkillContext` with:

```typescript
interface SkillContext {
  sellerId: string;       // Seller ID
  shopId: string;         // Etsy shop ID
  shopName: string;       // Shop display name
  products: ProductData[]; // All synced products
  metadata?: Record<string, unknown>; // Extra context
}
```

## Recommendations

Skills can generate recommendations with priority levels:

```typescript
interface Recommendation {
  priority: "high" | "medium" | "low";
  category: string;      // e.g., "Stock Management"
  title: string;         // Short title
  description: string;   // Detailed explanation
  action?: string;       // Specific action to take
}
```

## Testing

Run skill tests:

```bash
# All skill tests
npm test -- src/skills/

# Specific skill
npm test -- src/skills/inventory-analysis/
```

## Future Skills (Planned)

| Skill | Description | Status |
|-------|-------------|--------|
| `pricing-optimizer` | Dynamic pricing recommendations based on market data | Planned |
| `customer-insights` | Customer behavior patterns and preferences | Planned |
| `trend-detector` | Market and seasonal trend detection | Planned |
| `seo-analyzer` | Listing SEO optimization suggestions | Planned |
| `competitor-tracker` | Competitive analysis | Planned |
