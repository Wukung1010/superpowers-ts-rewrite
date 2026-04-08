import type { Skill } from '../types.js';
import { InMemorySkillRegistry } from './registry.js';

export type SkillRouteRule = (query: string, skills: Skill[]) => Skill | undefined;

export const exactMatchRule: SkillRouteRule = (query, skills) =>
  skills.find((skill) => skill.name.toLowerCase() === query);

export const containsMatchRule: SkillRouteRule = (query, skills) =>
  skills.find((skill) => query.includes(skill.name.toLowerCase()));

export function defaultRouteRules(): SkillRouteRule[] {
  return [exactMatchRule, containsMatchRule];
}

export class SkillRouter {
  constructor(
    private readonly registry: InMemorySkillRegistry,
    private readonly rules: SkillRouteRule[] = defaultRouteRules(),
  ) {}

  route(query: string): Skill | undefined {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return undefined;
    }

    const skills = this.registry.list();
    for (const rule of this.rules) {
      const matched = rule(normalized, skills);
      if (matched) {
        return matched;
      }
    }

    return undefined;
  }
}
