import type { Skill, SuperpowersPlugin } from '../types.js';

export const helloSkill: Skill = {
  name: 'hello',
  description: 'Return a greeting message',
  metadata: {
    version: '1.0.0',
    tags: ['core', 'example'],
  },
  async run(context) {
    const name = context.input.trim() || 'world';

    return {
      ok: true,
      output: `Hello, ${name}!`,
    };
  },
};

export const workflowSkill: Skill = {
  name: 'workflow',
  description: 'Explain the superpowers core workflow',
  metadata: {
    version: '1.0.0',
    tags: ['core', 'workflow'],
  },
  async run() {
    return {
      ok: true,
      output:
        'brainstorming -> worktree -> planning -> execution -> tdd -> code-review -> finish-branch',
    };
  },
};

export const planSkill: Skill = {
  name: 'plan',
  description: 'Generate a simple execution plan from user input',
  metadata: {
    version: '1.0.0',
    tags: ['plugin', 'planning'],
  },
  async run(context) {
    const topic = context.input.trim() || 'task';
    return {
      ok: true,
      output: `Plan for ${topic}: clarify -> split -> implement -> validate`,
    };
  },
};

export const planningPlugin: SuperpowersPlugin = {
  name: 'planning-plugin',
  skills: [planSkill],
};
