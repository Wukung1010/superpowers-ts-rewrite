# 学习与重写文档索引

- [`learn-obra-superpowers.md`](./learn-obra-superpowers.md)：重制后的学习总览（含全局流程图与学习路径）
- [`ts-rewrite-roadmap.md`](./ts-rewrite-roadmap.md)：TypeScript 重写路线图
- [`learn/01-types-interfaces.md`](./learn/01-types-interfaces.md)：类型系统精读
- [`learn/02-registry.md`](./learn/02-registry.md)：Registry 模块精读
- [`learn/03-router.md`](./learn/03-router.md)：Router 模块精读
- [`learn/04-policy.md`](./learn/04-policy.md)：Policy 模块精读
- [`learn/05-executor.md`](./learn/05-executor.md)：Executor 模块精读
- [`learn/06-plugin-and-cli.md`](./learn/06-plugin-and-cli.md)：Plugin + CLI 模块精读
- [`learn/07-tests-and-behavior.md`](./learn/07-tests-and-behavior.md)：测试与行为契约精读

建议学习顺序：
1. 先读 `learn-obra-superpowers.md` 总览并看全局流程图
2. 按 `learn/01` 到 `learn/07` 的顺序逐模块精读（每章都带模块流程图和逐行解释）
3. 再读 `ts-rewrite-roadmap.md` 理解后续演进方向
4. 对照 `src/` + `test/` 一起复盘行为边界

当前 Phase 2 关键能力已落地：插件手动注册、路由规则链、统一错误模型、hooks、`run --auto` 策略触发与执行事件追踪。
