import { describe, expect, it } from 'vitest';
import { InMemorySkillRegistry } from '../src/core/registry.js';
import { helloSkill, workflowSkill } from '../src/skills/example.js';
import type { Skill } from '../src/types.js';

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

  it('throws when registering duplicate skill names', () => {
    const registry = new InMemorySkillRegistry();

    registry.register(helloSkill);
    expect(() => registry.register(helloSkill)).toThrow('Duplicate skill name: hello');
  });

  it('throws when registering invalid skill names', () => {
    const registry = new InMemorySkillRegistry();
    const invalidSkill: Skill = {
      name: 'Bad Name',
      description: 'invalid',
      metadata: {
        version: '1.0.0',
        tags: ['test'],
      },
      async run() {
        return { ok: true, output: 'ok' };
      },
    };

    expect(() => registry.register(invalidSkill)).toThrow('Invalid skill name: Bad Name');
  });

  it('tracks skill source for core and plugins', () => {
    const registry = new InMemorySkillRegistry();
    registry.register(helloSkill, 'core');
    registry.register(workflowSkill, 'workflow-plugin');

    expect(registry.listWithSource()).toEqual([
      { skill: helloSkill, source: 'core' },
      { skill: workflowSkill, source: 'workflow-plugin' },
    ]);
  });
});
