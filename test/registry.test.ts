import { describe, expect, it } from 'vitest';
import { InMemorySkillRegistry } from '../src/core/registry.js';
import { helloSkill, workflowSkill } from '../src/skills/example.js';

describe('InMemorySkillRegistry', () => {
  it('registers and retrieves skills by name', () => {
    const registry = new InMemorySkillRegistry();

    registry.register(helloSkill);

    expect(registry.get('hello')?.name).toBe('hello');
  });

  it('lists skills sorted by name', () => {
    const registry = new InMemorySkillRegistry();

    registry.register(workflowSkill);
    registry.register(helloSkill);

    expect(registry.list().map((skill) => skill.name)).toEqual(['hello', 'workflow']);
  });
});
