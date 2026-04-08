import type { Skill } from '../types.js';

const SKILL_NAME_PATTERN = /^[a-z][a-z0-9-]*$/;

export interface RegisteredSkill {
  skill: Skill;
  source: string;
}

export class InMemorySkillRegistry {
  private readonly skills = new Map<string, Skill>();
  private readonly sources = new Map<string, string>();

  register(skill: Skill, source = 'core'): void {
    if (!SKILL_NAME_PATTERN.test(skill.name)) {
      throw new Error(`Invalid skill name: ${skill.name}`);
    }

    if (this.skills.has(skill.name)) {
      throw new Error(`Duplicate skill name: ${skill.name}`);
    }

    this.skills.set(skill.name, skill);
    this.sources.set(skill.name, source);
  }

  registerMany(skills: Skill[], source = 'core'): void {
    for (const skill of skills) {
      this.register(skill, source);
    }
  }

  get(name: string): Skill | undefined {
    return this.skills.get(name);
  }

  getSource(name: string): string | undefined {
    return this.sources.get(name);
  }

  list(): Skill[] {
    return Array.from(this.skills.values()).sort((a, b) => a.name.localeCompare(b.name));
  }

  listWithSource(): RegisteredSkill[] {
    return this.list().map((skill) => ({
      skill,
      source: this.sources.get(skill.name) ?? 'core',
    }));
  }
}
