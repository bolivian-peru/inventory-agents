import type { Skill, SkillManifest } from "./types.js";
import { InventoryAnalysisSkill } from "./inventory-analysis/index.js";

class SkillRegistry {
  private skills: Map<string, Skill> = new Map();
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;
    this.register(new InventoryAnalysisSkill());
    this.initialized = true;
  }

  register(skill: Skill): void {
    if (this.skills.has(skill.manifest.id)) {
      throw new Error(`Skill already registered: ${skill.manifest.id}`);
    }
    this.skills.set(skill.manifest.id, skill);
  }

  get(skillId: string): Skill | undefined {
    return this.skills.get(skillId);
  }

  getAll(): Skill[] {
    return Array.from(this.skills.values());
  }

  getManifests(): SkillManifest[] {
    return this.getAll().map((skill) => skill.manifest);
  }

  has(skillId: string): boolean {
    return this.skills.has(skillId);
  }

  getByCapability(capability: string): Skill[] {
    return this.getAll().filter((skill) =>
      skill.manifest.capabilities.includes(capability)
    );
  }
}

export const skillRegistry = new SkillRegistry();
export { InventoryAnalysisSkill };
