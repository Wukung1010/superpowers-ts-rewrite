import { InMemorySkillRegistry } from './registry.js';
import type { SkillResult } from '../types.js';

export class SkillExecutor {
  constructor(private readonly registry: InMemorySkillRegistry) {}

  async run(name: string, input = ''): Promise<SkillResult> {
    const skill = this.registry.get(name);

    if (!skill) {
      return {
        ok: false,
        output: `Skill not found: ${name}`,
      };
    }

    return skill.run({ input });
  }
}
