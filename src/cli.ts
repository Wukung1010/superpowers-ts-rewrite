#!/usr/bin/env node
import { InMemorySkillRegistry } from './core/registry.js';
import { SkillExecutor } from './core/executor.js';
import { PluginRuntime } from './core/plugin.js';
import { RuleBasedSkillPolicy } from './core/policy.js';
import { SkillRouter } from './core/router.js';
import { helloSkill, planningPlugin, workflowSkill } from './skills/example.js';

function createRuntime(): {
  registry: InMemorySkillRegistry;
  executor: SkillExecutor;
  policy: RuleBasedSkillPolicy;
} {
  const registry = new InMemorySkillRegistry();
  registry.registerMany([helloSkill, workflowSkill], 'core');

  const executor = new SkillExecutor(registry);
  const plugins = new PluginRuntime(registry, executor);
  plugins.register(planningPlugin);

  const router = new SkillRouter(registry);
  const policy = new RuleBasedSkillPolicy(router, {
    plan: 'plan',
    workflow: 'workflow',
    hello: 'hello',
  });

  return { registry, executor, policy };
}

function readOption(args: string[], name: string): string | undefined {
  const index = args.indexOf(name);
  if (index === -1 || index + 1 >= args.length) {
    return undefined;
  }
  return args[index + 1];
}

function hasOption(args: string[], name: string): boolean {
  return args.includes(name);
}

function readRunSkillName(args: string[]): string | undefined {
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--input') {
      index += 1;
      continue;
    }

    if (!arg.startsWith('--')) {
      return arg;
    }
  }

  return undefined;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0];

  const { registry, executor, policy } = createRuntime();

  if (command === 'list') {
    for (const { skill, source } of registry.listWithSource()) {
      console.log(
        `${skill.name}\t${skill.description}\tv${skill.metadata.version}\t${skill.metadata.tags.join(',')}\t${source}`,
      );
    }
    return;
  }

  if (command === 'run') {
    const runArgs = args.slice(1);
    const auto = hasOption(runArgs, '--auto');
    const input = readOption(runArgs, '--input') ?? '';
    const skillName = auto ? policy.selectSkill(input) : readRunSkillName(runArgs);

    if (!skillName) {
      console.error(
        auto
          ? 'No skill matched for auto mode. Provide a richer --input.'
          : 'Usage: superpowers-ts run <skill> [--input <text>] [--auto]',
      );
      process.exitCode = 1;
      return;
    }

    const result = await executor.run(skillName, input);

    if (!result.ok) {
      console.error(`[${result.error.code}] ${result.output}`);
      process.exitCode = result.error.code === 'invalid-input' ? 2 : 1;
      return;
    }

    console.log(result.output);
    return;
  }

  console.log('Usage: superpowers-ts <list|run>');
  process.exitCode = 1;
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
