import { describe, expect, it } from 'vitest';
import { InMemorySkillRegistry } from '../src/core/registry.js';
import { SkillExecutor } from '../src/core/executor.js';
import { helloSkill } from '../src/skills/example.js';

describe('SkillExecutor', () => {
  it('returns error result when skill does not exist', async () => {
    const registry = new InMemorySkillRegistry();
    const executor = new SkillExecutor(registry);

    await expect(executor.run('missing')).resolves.toEqual({
      ok: false,
      output: 'Skill not found: missing',
    });
  });

  it('executes registered skill', async () => {
    const registry = new InMemorySkillRegistry();
    registry.register(helloSkill);
    const executor = new SkillExecutor(registry);

    await expect(executor.run('hello', 'Wukung')).resolves.toEqual({
      ok: true,
      output: 'Hello, Wukung!',
    });
  });
});
