export interface SkillContext {
  input: string;
  metadata?: Record<string, unknown>;
}

export interface SkillMetadata {
  version: string;
  tags: string[];
}

export type SkillErrorCode = 'not-found' | 'invalid-input' | 'runtime-error';

export interface SkillError {
  code: SkillErrorCode;
  message: string;
}

export interface SkillSuccessResult {
  ok: true;
  output: string;
}

export interface SkillFailureResult {
  ok: false;
  output: string;
  error: SkillError;
}

export type SkillResult = SkillSuccessResult | SkillFailureResult;

export interface Skill {
  name: string;
  description: string;
  metadata: SkillMetadata;
  run(context: SkillContext): Promise<SkillResult>;
}

export interface HookContext {
  input: string;
  skillName: string;
}

export interface SkillHooks {
  beforeRun?(context: HookContext): Promise<void> | void;
  afterRun?(context: HookContext & { result: SkillResult }): Promise<void> | void;
  onError?(context: HookContext & { error: SkillError }): Promise<void> | void;
}

export interface SuperpowersPlugin {
  name: string;
  skills: Skill[];
  hooks?: SkillHooks;
}

export interface ExecutionEvent {
  type: string;
  timestamp: string;
  details?: Record<string, unknown>;
}
