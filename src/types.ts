export interface SkillContext {
  input: string;
  metadata?: Record<string, unknown>;
}

export interface SkillResult {
  ok: boolean;
  output: string;
}

export interface Skill {
  name: string;
  description: string;
  run(context: SkillContext): Promise<SkillResult>;
}
