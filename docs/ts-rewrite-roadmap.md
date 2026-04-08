# TypeScript 重写路线图

## 目标边界

重写目标不是 1:1 复制所有平台细节，而是先做一个可运行、可测试、可扩展的核心内核：

- Skills 可注册与查询
- 可把用户输入路由到 skill
- 可执行 skill 并返回结构化结果
- CLI 能 `list` 与 `run`

## 分阶段交付

### Phase 0（已完成）
- 学习文档落地到 `docs/`
- TS 项目初始化

### Phase 1（本轮 MVP）
- `Skill` / `Registry` / `Router` / `Executor` 核心抽象
- 两个示例技能
- CLI：`list`、`run <skill>`
- 基础单元测试

### Phase 2
- 自动触发策略（关键词 + 规则引擎）
- Hooks（before/after/failed）
- 错误模型与观测日志

### Phase 3
- Skill 包加载器（本地目录扫描）
- 多平台适配层（Codex/Cursor/Claude 的 tool 映射）

### Phase 4
- 子代理调度（并行/串行）
- 计划执行编排器
- 端到端集成测试

## Rust 备选路线（如果转 Rust）

保持同一抽象，不改模型：

- `trait Skill`
- `Registry<HashMap<String, Box<dyn Skill>>>`
- `Router` + `Executor`
- `clap` CLI
- `tokio` 异步执行

先在 TS 验证模型，再转 Rust，成本最低。
