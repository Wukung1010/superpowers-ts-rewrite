import { describe, expect, it } from 'vitest';
import { InMemorySkillRegistry } from '../src/core/registry.js';
import { SkillRouter } from '../src/core/router.js';
import { helloSkill, workflowSkill } from '../src/skills/example.js';

describe('SkillRouter', () => {
  it('uses exact match before contains match', () => {
    const registry = new InMemorySkillRegistry();
    registry.register(helloSkill);
    registry.register(workflowSkill);

    const router = new SkillRouter(registry);
    expect(router.route('hello')?.name).toBe('hello');
    expect(router.route('please run workflow now')?.name).toBe('workflow');
  });

  it('supports pluggable rule chains', () => {
    const registry = new InMemorySkillRegistry();
    registry.register(helloSkill);
    registry.register(workflowSkill);

    const customRouter = new SkillRouter(registry, [
      (query, skills) => (query.startsWith('wf') ? skills.find((skill) => skill.name === 'workflow') : undefined),
    ]);

    expect(customRouter.route('wf-start')?.name).toBe('workflow');
    expect(customRouter.route('hello')).toBeUndefined();
  });
});
