import { describe, expect, it } from 'vitest';
import { RuleBasedSkillPolicy } from '../src/core/policy.js';
import { InMemorySkillRegistry } from '../src/core/registry.js';
import { SkillRouter } from '../src/core/router.js';
import { helloSkill, workflowSkill } from '../src/skills/example.js';

describe('RuleBasedSkillPolicy', () => {
  it('uses keyword rules before router matching', () => {
    const registry = new InMemorySkillRegistry();
    registry.register(helloSkill);
    registry.register(workflowSkill);
    const router = new SkillRouter(registry);
    const policy = new RuleBasedSkillPolicy(router, { flow: 'workflow' });

    expect(policy.selectSkill('flow now')).toBe('workflow');
    expect(policy.getEvents().at(-1)?.type).toBe('policy.keyword-match');
  });

  it('falls back to router and logs no-match when needed', () => {
    const registry = new InMemorySkillRegistry();
    registry.register(helloSkill);
    const router = new SkillRouter(registry);
    const policy = new RuleBasedSkillPolicy(router);

    expect(policy.selectSkill('say hello please')).toBe('hello');
    expect(policy.selectSkill('nothing')).toBeUndefined();
    expect(policy.getEvents().at(-1)?.type).toBe('policy.no-match');
  });
});
