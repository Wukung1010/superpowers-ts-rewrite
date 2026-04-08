import { describe, expect, it } from 'vitest';
import { InMemorySkillRegistry } from '../src/core/registry.js';
import { SkillExecutor } from '../src/core/executor.js';
import { helloSkill } from '../src/skills/example.js';
import type { Skill } from '../src/types.js';

describe('SkillExecutor', () => {
  it('returns error result when skill does not exist', async () => {
    const registry = new InMemorySkillRegistry();
    const executor = new SkillExecutor(registry);

    await expect(executor.run('missing')).resolves.toEqual({
      ok: false,
      output: 'Skill not found: missing',
      error: {
        code: 'not-found',
        message: 'Skill not found: missing',
      },
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

  it('returns invalid-input when skill name is empty', async () => {
    const registry = new InMemorySkillRegistry();
    const executor = new SkillExecutor(registry);

    await expect(executor.run('   ')).resolves.toEqual({
      ok: false,
      output: 'Invalid skill name',
      error: {
        code: 'invalid-input',
        message: 'Invalid skill name',
      },
    });
  });

  it('runs hooks in before/after order and logs events', async () => {
    const registry = new InMemorySkillRegistry();
    registry.register(helloSkill);

    const order: string[] = [];
    const executor = new SkillExecutor(registry, [
      {
        beforeRun() {
          order.push('before');
        },
        afterRun() {
          order.push('after');
        },
      },
    ]);

    const result = await executor.run('hello', 'Agent');
    expect(result).toEqual({
      ok: true,
      output: 'Hello, Agent!',
    });
    expect(order).toEqual(['before', 'after']);
    expect(executor.getEvents().map((event) => event.type)).toContain('hook.beforeRun');
    expect(executor.getEvents().map((event) => event.type)).toContain('hook.afterRun');
  });

  it('maps runtime errors and triggers onError hooks', async () => {
    const brokenSkill: Skill = {
      name: 'broken',
      description: 'throws',
      metadata: {
        version: '1.0.0',
        tags: ['test'],
      },
      async run() {
        throw new Error('boom');
      },
    };
    const registry = new InMemorySkillRegistry();
    registry.register(brokenSkill);

    const seen: string[] = [];
    const executor = new SkillExecutor(registry, [
      {
        onError(context) {
          seen.push(`${context.skillName}:${context.error.code}`);
        },
      },
    ]);

    await expect(executor.run('broken')).resolves.toEqual({
      ok: false,
      output: 'boom',
      error: {
        code: 'runtime-error',
        message: 'boom',
      },
    });
    expect(seen).toEqual(['broken:runtime-error']);
  });
});
