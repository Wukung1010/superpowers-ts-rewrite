import { describe, expect, it } from 'vitest';
import { SkillExecutor } from '../src/core/executor.js';
import { PluginRuntime } from '../src/core/plugin.js';
import { InMemorySkillRegistry } from '../src/core/registry.js';
import { helloSkill } from '../src/skills/example.js';
import type { SuperpowersPlugin } from '../src/types.js';

describe('PluginRuntime', () => {
  it('registers plugin skills and hooks in one entrypoint', async () => {
    const registry = new InMemorySkillRegistry();
    const seen: string[] = [];
    const executor = new SkillExecutor(registry);
    const pluginRuntime = new PluginRuntime(registry, executor);

    const plugin: SuperpowersPlugin = {
      name: 'hello-plugin',
      skills: [helloSkill],
      hooks: {
        beforeRun() {
          seen.push('before');
        },
      },
    };

    pluginRuntime.register(plugin);

    expect(registry.getSource('hello')).toBe('hello-plugin');
    await executor.run('hello', 'Plugin');
    expect(seen).toEqual(['before']);
  });
});
