import type { ExecutionEvent } from '../types.js';
import { SkillRouter } from './router.js';

export class RuleBasedSkillPolicy {
  private readonly events: ExecutionEvent[] = [];

  constructor(
    private readonly router: SkillRouter,
    private readonly keywordRules: Record<string, string> = {},
  ) {}

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

  selectSkill(input: string): string | undefined {
    const normalized = input.trim().toLowerCase();
    if (!normalized) {
      this.recordEvent('policy.no-match', { reason: 'empty-input' });
      return undefined;
    }

    for (const [keyword, skillName] of Object.entries(this.keywordRules)) {
      if (normalized.includes(keyword.toLowerCase())) {
        this.recordEvent('policy.keyword-match', { keyword, skillName });
        return skillName;
      }
    }

    const routed = this.router.route(normalized);
    if (routed) {
      this.recordEvent('policy.router-match', { skillName: routed.name });
      return routed.name;
    }

    this.recordEvent('policy.no-match', { reason: 'no-rule-hit' });
    return undefined;
  }
}
