import type { Skill } from '../types.js';

export const helloSkill: Skill = {
  name: 'hello',
  description: 'Return a greeting message',
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
  async run() {
    return {
      ok: true,
      output:
        'brainstorming -> worktree -> planning -> execution -> tdd -> code-review -> finish-branch',
    };
  },
};
