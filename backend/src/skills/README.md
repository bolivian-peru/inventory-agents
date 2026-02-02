# IFA Agent Skills

Skills are modular capabilities that enhance agent understanding and actions. Each skill provides specialized knowledge and tools for specific domains.

## Folder Structure

```
src/skills/
├── README.md                    # This file
├── registry.ts                  # Skill registry and loader
├── types.ts                     # Shared skill types
│
├── inventory-analysis/          # Product inventory analysis
│   ├── index.ts                 # Skill entry point
│   ├── manifest.json            # Skill metadata
│   ├── analyzer.ts              # Core analysis logic
│   ├── prompts/                 # LLM prompts
│   │   └── analysis.md          # Analysis prompt template
│   └── tests/                   # Skill tests
│       └── analyzer.test.ts
│
├── pricing-optimizer/           # (Future) Price optimization
├── customer-insights/           # (Future) Customer behavior analysis
└── trend-detector/              # (Future) Market trend detection
```

## How Skills Work

1. **Registration**: Skills register themselves via `manifest.json`
2. **Loading**: The agent provisioner injects relevant skills into agent workspace
3. **Execution**: Agent uses skill prompts and tools during conversations
4. **Context**: Skills provide domain-specific context to enhance agent responses

## Creating a New Skill

1. Create a folder under `src/skills/`
2. Add `manifest.json` with skill metadata
3. Implement `index.ts` as the entry point
4. Add prompts in `prompts/` directory
5. Register in `registry.ts`

## Skill Manifest Schema

```json
{
  "id": "inventory-analysis",
  "name": "Inventory Analysis",
  "version": "1.0.0",
  "description": "Analyze product inventory for insights",
  "author": "IFA Team",
  "capabilities": ["analyze", "categorize", "report"],
  "requiredData": ["products"],
  "outputFormat": "markdown"
}
```

## Available Skills

| Skill | Description | Status |
|-------|-------------|--------|
| `inventory-analysis` | Product categorization, pricing analysis, stock monitoring | ✅ Active |
| `pricing-optimizer` | Dynamic pricing recommendations | 🔜 Planned |
| `customer-insights` | Customer behavior patterns | 🔜 Planned |
| `trend-detector` | Market and seasonal trends | 🔜 Planned |
