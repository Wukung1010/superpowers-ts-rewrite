import { InMemorySkillRegistry } from './registry.js';
import type {
  ExecutionEvent,
  SkillError,
  SkillFailureResult,
  SkillHooks,
  SkillResult,
} from '../types.js';

export class SkillExecutor {
  private readonly hooks: SkillHooks[] = [];
  private readonly events: ExecutionEvent[] = [];

  constructor(
    private readonly registry: InMemorySkillRegistry,
    hooks: SkillHooks[] = [],
  ) {
    this.hooks.push(...hooks);
  }

  addHooks(hooks: SkillHooks): void {
    this.hooks.push(hooks);
  }

  getEvents(): ExecutionEvent[] {
    return [...this.events];
  }

  clearEvents(): void {
    this.events.length = 0;
  }

  private recordEvent(type: string, details?: Record<string, unknown>): void {
    this.events.push({
      type,
      timestamp: new Date().toISOString(),
      details,
    });
  }

  private createErrorResult(code: SkillError['code'], message: string): SkillFailureResult {
    return {
      ok: false,
      output: message,
      error: {
        code,
        message,
      },
    };
  }

  private async runBeforeHooks(skillName: string, input: string): Promise<void> {
    for (const hooks of this.hooks) {
      if (hooks.beforeRun) {
        await hooks.beforeRun({ skillName, input });
        this.recordEvent('hook.beforeRun', { skillName });
      }
    }
  }

  private async runAfterHooks(skillName: string, input: string, result: SkillResult): Promise<void> {
    for (const hooks of this.hooks) {
      if (hooks.afterRun) {
        await hooks.afterRun({ skillName, input, result });
        this.recordEvent('hook.afterRun', { skillName, ok: result.ok });
      }
    }
  }

  private async runErrorHooks(skillName: string, input: string, error: SkillError): Promise<void> {
    for (const hooks of this.hooks) {
      if (hooks.onError) {
        await hooks.onError({ skillName, input, error });
        this.recordEvent('hook.onError', { skillName, code: error.code });
      }
    }
  }

  async run(name: string, input = ''): Promise<SkillResult> {
    const skillName = name.trim();
    this.recordEvent('execution.started', { skillName, input });

    if (!skillName) {
      const result = this.createErrorResult('invalid-input', 'Invalid skill name');
      await this.runErrorHooks(skillName, input, result.error);
      this.recordEvent('execution.failed', { skillName, code: result.error.code });
      return result;
    }

    const skill = this.registry.get(skillName);
    if (!skill) {
      const result = this.createErrorResult('not-found', `Skill not found: ${skillName}`);
      await this.runErrorHooks(skillName, input, result.error);
      this.recordEvent('execution.failed', { skillName, code: result.error.code });
      return result;
    }

    try {
      await this.runBeforeHooks(skillName, input);
      const result = await skill.run({ input });

      if (!result.ok) {
        await this.runErrorHooks(skillName, input, result.error);
        this.recordEvent('execution.failed', { skillName, code: result.error.code });
      } else {
        this.recordEvent('execution.succeeded', { skillName });
      }

      await this.runAfterHooks(skillName, input, result);
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const result = this.createErrorResult('runtime-error', message);
      await this.runErrorHooks(skillName, input, result.error);
      this.recordEvent('execution.failed', { skillName, code: result.error.code });
      return result;
    }
  }
}
