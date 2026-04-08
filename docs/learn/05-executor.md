# 模块 05：执行器精读（`src/core/executor.ts`）

## 模块职责

Executor 是运行时核心：

1. 校验技能名；
2. 查找技能；
3. 执行 hooks；
4. 调用 skill.run；
5. 统一包装错误结果；
6. 记录执行事件。

## 模块流程图

```mermaid
flowchart TD
  A[run(name, input)] --> B[record execution.started]
  B --> C{skillName 为空?}
  C -- 是 --> D[create invalid-input]
  D --> E[runErrorHooks]
  E --> F[record execution.failed]
  F --> G[return failure]

  C -- 否 --> H[registry.get]
  H --> I{skill 存在?}
  I -- 否 --> J[create not-found]
  J --> E

  I -- 是 --> K[runBeforeHooks]
  K --> L[skill.run]
  L --> M{result.ok?}
  M -- 否 --> N[runErrorHooks + record failed]
  M -- 是 --> O[record succeeded]
  N --> P[runAfterHooks]
  O --> P
  P --> Q[return result]

  L -->|throw| R[create runtime-error]
  R --> E
```

## 逐行精读（`src/core/executor.ts`）

1. 导入 Registry。  
2. 从 `types` 导入执行器需要的所有类型。  
3. 导入 `ExecutionEvent`。  
4. 导入 `SkillError`。  
5. 导入 `SkillFailureResult`。  
6. 导入 `SkillHooks`。  
7. 导入 `SkillResult`。  
8. 结束类型导入。  
9. 空行。  
10. 定义 `SkillExecutor` 类。  
11. 维护 hooks 列表。  
12. 维护事件列表。  
13. 空行。  
14. 构造函数开始。  
15. 注入 registry。  
16. 可选初始化 hooks（默认空）。  
17. 结束构造参数。  
18. 把初始 hooks 推入内部数组。  
19. 结束构造函数。  
20. 空行。  
21. `addHooks` 允许运行时继续注入 hooks。  
22. 追加到 hooks 数组。  
23. 结束 `addHooks`。  
24. 空行。  
25. `getEvents` 返回事件副本。  
26. 避免外部改动内部状态。  
27. 结束 `getEvents`。  
28. 空行。  
29. `clearEvents` 清空事件。  
30. 原地置空数组。  
31. 结束 `clearEvents`。  
32. 空行。  
33. 私有 `recordEvent`。  
34. push 事件对象。  
35. 事件类型。  
36. 时间戳。  
37. 可选详情。  
38. 结束对象。  
39. 结束方法。  
40. 空行。  
41. 私有 `createErrorResult`，统一构造失败结果。  
42. `ok: false`。  
43. 输出信息。  
44. 错误对象开始。  
45. 错误码。  
46. 错误消息。  
47. 结束错误对象。  
48. 结束失败对象。  
49. 结束方法。  
50. 空行。  
51. 私有 `runBeforeHooks`。  
52. 遍历 hooks。  
53. 仅在存在 `beforeRun` 时调用。  
54. 执行 beforeRun。  
55. 传入 skillName 与 input。  
56. 记录 `hook.beforeRun`。  
57. 结束 if。  
58. 结束循环。  
59. 结束方法。  
60. 空行。  
61. 私有 `runAfterHooks`。  
62. 遍历 hooks。  
63. 仅在存在 `afterRun` 时调用。  
64. 执行 afterRun。  
65. 记录 `hook.afterRun` 并附带 `result.ok`。  
66. 结束 if。  
67. 结束循环。  
68. 结束方法。  
69. 空行。  
70. 私有 `runErrorHooks`。  
71. 遍历 hooks。  
72. 仅在存在 `onError` 时调用。  
73. 执行 onError。  
74. 记录 `hook.onError` 并附带错误码。  
75. 结束 if。  
76. 结束循环。  
77. 结束方法。  
78. 空行。  
79. `run` 主方法开始。  
80. 清理技能名空白。  
81. 记录 `execution.started`。  
82. 空行。  
83. 判断技能名是否为空。  
84. 构造 `invalid-input` 结果。  
85. 触发错误 hooks。  
86. 记录 `execution.failed`。  
87. 返回失败。  
88. 结束空名分支。  
89. 空行。  
90. 去 registry 查技能。  
91. 不存在分支。  
92. 构造 `not-found` 结果。  
93. 触发错误 hooks。  
94. 记录失败。  
95. 返回失败。  
96. 结束 not-found 分支。  
97. 空行。  
98. 进入 try，处理运行期异常。  
99. 先跑 before hooks。  
100. 执行技能。  
101. 空行。  
102. 如果技能本身返回失败结果。  
103. 跑 error hooks。  
104. 记录失败。  
105. 成功分支。  
106. 记录成功事件。  
107. 结束成功/失败分支。  
108. 空行。  
109. 无论成功失败都执行 after hooks。  
110. 返回技能结果。  
111. 进入 catch。  
112. 规范化异常信息。  
113. 构造 `runtime-error`。  
114. 触发错误 hooks。  
115. 记录失败事件。  
116. 返回失败结果。  
117. 结束 catch。  
118. 结束 `run`。  
119. 结束类。  

## 学习检查点

- 为什么 `afterRun` 在失败结果时也执行？
- `skill.run` 抛异常与返回 `{ok:false}` 的语义差异是什么？
- 如果 hook 自己抛错，当前实现会发生什么？
