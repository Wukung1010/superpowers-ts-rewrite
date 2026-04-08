import type { Skill } from '../types.js';
import { InMemorySkillRegistry } from './registry.js';

export class SkillRouter {
  constructor(private readonly registry: InMemorySkillRegistry) {}

  route(query: string): Skill | undefined {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return undefined;
    }

    return this.registry
      .list()
      .find((skill) => skill.name.toLowerCase() === normalized || normalized.includes(skill.name.toLowerCase()));
  }
}
