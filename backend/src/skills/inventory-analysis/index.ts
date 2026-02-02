import type { Skill, SkillManifest, SkillContext, AnalysisResult } from "../types.js";
import { analyzeInventory, formatAnalysisAsMarkdown } from "./analyzer.js";
import manifest from "./manifest.json" with { type: "json" };

export class InventoryAnalysisSkill implements Skill {
  readonly manifest: SkillManifest = manifest as SkillManifest;

  async analyze(context: SkillContext): Promise<AnalysisResult> {
    return analyzeInventory(context);
  }

  async generatePrompt(context: SkillContext): Promise<string> {
    const result = await this.analyze(context);
    const markdown = formatAnalysisAsMarkdown(result);

    return `
## Inventory Analysis Skill

You have access to detailed inventory analysis for ${context.shopName}.

${markdown}

### How to Use This Information

When a seller asks about their inventory, products, or needs recommendations:

1. **Stock queries**: Reference the stock status section for current levels
2. **Pricing questions**: Use the pricing analysis for price-related inquiries
3. **Product recommendations**: Suggest actions from the recommendations section
4. **Category insights**: Use category breakdown to discuss product mix

### Triggers

This analysis is relevant when the seller asks:
- "What's my inventory status?"
- "Which products need restocking?"
- "How are my products priced?"
- "Give me an inventory report"
- "Analyze my products"
- "What products are selling well?"

Always provide specific product names and numbers from the analysis above.
`.trim();
  }
}

export { analyzeInventory, formatAnalysisAsMarkdown } from "./analyzer.js";
