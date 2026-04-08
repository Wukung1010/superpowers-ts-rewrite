# superpowers-ts-rewrite 源码精读总览（重制版）

> 这份文档是新的学习入口：你提到原来的学习路线太模糊，所以这里改成“总览 + 分模块精读 + 流程图 + 逐行解释”结构。  
> 建议严格按顺序学习，每个模块都对应源码与测试。

---

## 1) 学习目标（你要达到什么程度）

学完后你应该能：

1. 独立解释本仓库从 CLI 到技能执行的完整链路；
2. 看懂并改动核心模块（types / registry / router / policy / executor / plugin）；
3. 通过测试理解行为边界，保证改动不破坏现有语义；
4. 在这个最小内核上继续扩展（自动加载、多平台适配、编排器）。

---

## 2) 整体架构流程图（全局）

```mermaid
flowchart TD
  A[CLI: superpowers-ts <list|run>] --> B[createRuntime]
  B --> C[InMemorySkillRegistry]
  B --> D[SkillExecutor]
  B --> E[PluginRuntime]
  E --> C
  E --> D
  B --> F[SkillRouter]
  B --> G[RuleBasedSkillPolicy]
  G --> F

  A -->|list| C
  A -->|run --auto| G
  A -->|run <skill>| D
  G -->|selected skillName| D
  D --> C
  D --> H[Skill.run]
  D --> I[hooks before/after/onError]
  D --> J[SkillResult + ExecutionEvent]
```

---

## 3) 分文件学习路径（核心模块一模块一文档）

1. [`learn/01-types-interfaces.md`](./learn/01-types-interfaces.md)  
   核心类型系统：Skill、Result、Error、Hooks、Plugin、Event
2. [`learn/02-registry.md`](./learn/02-registry.md)  
   注册中心：命名校验、重复校验、来源追踪
3. [`learn/03-router.md`](./learn/03-router.md)  
   路由层：规则链与默认匹配策略
4. [`learn/04-policy.md`](./learn/04-policy.md)  
   策略层：关键词优先 + 路由兜底 + 事件记录
5. [`learn/05-executor.md`](./learn/05-executor.md)  
   执行层：错误模型、hooks 生命周期、执行事件
6. [`learn/06-plugin-and-cli.md`](./learn/06-plugin-and-cli.md)  
   插件与入口：运行时装配、参数解析、命令分发
7. [`learn/07-tests-and-behavior.md`](./learn/07-tests-and-behavior.md)  
   测试驱动理解：每个测试在“锁定什么行为”

---

## 4) 怎么学（推荐节奏）

1. **先读总览**（本文件）理解大图；
2. **逐个模块精读**：每个文件都先看流程图，再看逐行解释；
3. **对照源码与测试**：读完模块就打开对应 `src/` 和 `test/`；
4. **最后做一次“闭卷复述”**：不看代码，把调用链从 CLI 讲到 SkillResult。

---

## 5) 关键学习原则

- 把这个项目当成“最小可扩展内核”，不是完整产品；
- 看代码时先关注“边界条件”和“失败路径”；
- 测试文件是行为契约，和源码同等重要。
