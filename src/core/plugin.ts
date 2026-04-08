import type { SuperpowersPlugin } from '../types.js';
import { SkillExecutor } from './executor.js';
import { InMemorySkillRegistry } from './registry.js';

export class PluginRuntime {
  constructor(
    private readonly registry: InMemorySkillRegistry,
    private readonly executor: SkillExecutor,
  ) {}

  register(plugin: SuperpowersPlugin): void {
    this.registry.registerMany(plugin.skills, plugin.name);
    if (plugin.hooks) {
      this.executor.addHooks(plugin.hooks);
    }
  }
}
