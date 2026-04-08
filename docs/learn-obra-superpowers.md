# obra/superpowers 深度学习笔记

> 目标：理解 `obra/superpowers` 的产品定位、核心工作流、技能系统与可迁移设计。

## 1. 它到底是什么

`superpowers` 不是一个传统框架，而是一套“给 AI 编程代理用的工作流操作系统”。
核心思想：把复杂的软件开发过程拆成可组合的 skills，然后由代理在对话中自动触发。

## 2. 核心价值链（从需求到交付）

根据 README 的工作流，主链路是：

1. `brainstorming`：先澄清问题与设计
2. `using-git-worktrees`：准备隔离开发环境
3. `writing-plans`：把需求拆成可执行小任务
4. `subagent-driven-development` / `executing-plans`：执行任务
5. `test-driven-development`：强制 RED-GREEN-REFACTOR
6. `requesting-code-review`：阶段性审查
7. `finishing-a-development-branch`：收尾与合并策略

这条链路回答了三个问题：
- **先做什么**（先设计、后编码）
- **怎么做**（任务拆解 + 子代理执行）
- **如何保证质量**（TDD + review + 完成前验证）

## 3. 工程结构怎么读

从仓库目录可以看到：

- `skills/`：核心资产，每个技能是一个可复用“行为模块”
- `commands/`：命令级能力
- `agents/`：代理相关配置
- `hooks/`：生命周期钩子
- `docs/`：平台接入和使用文档

理解重点：
- **Skill 是一等公民**（不是零散 prompt）
- **流程技能优先于实现技能**（先决定过程，再落地编码）
- **平台适配是外壳，技能语义是内核**

## 4. 你要掌握的抽象模型

为了自己重写，你需要把原项目抽象成 5 层：

1. **Skill Model**：技能元数据 + 执行体
2. **Registry**：技能发现、注册、查询
3. **Router**：根据用户输入路由到技能
4. **Executor**：执行技能并统一返回
5. **Policy/Workflow**：决定“何时触发哪个技能”

## 5. 设计哲学（必须内化）

- **Process over hacking**：流程先于临场发挥
- **Evidence over claims**：可验证优先
- **TDD as discipline**：测试不是补丁，而是入口
- **YAGNI + DRY**：保持最小必要复杂度

## 6. 学习路径（建议）

第 1 周：
- 通读 README
- 精读 6 个关键 skill：`brainstorming`、`writing-plans`、`test-driven-development`、`subagent-driven-development`、`requesting-code-review`、`using-superpowers`

第 2 周：
- 画出自己的“技能状态机”
- 把每个 skill 的输入、输出、触发条件结构化

第 3 周：
- 实现最小 TS 核心：Registry + Router + Executor + CLI
- 跑通 `list/run` 基础能力

第 4 周：
- 实现自动触发策略
- 加入 hooks 与可观测性

## 7. 你现在应该怎么练

1. 每读一个 skill，就写一行“这个 skill 在流程中的职责”
2. 每完成一个职责定义，就映射到 TS 接口
3. 每新增一层能力，都先写测试再写实现

做到这三点，你就能从“会用 superpowers”升级到“会造 superpowers”。
