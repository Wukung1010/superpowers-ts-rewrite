# 模块 03：路由层精读（`src/core/router.ts`）

## 模块职责

Router 做“输入文本 -> Skill”匹配，不做执行。  
它的核心是“规则链”：按顺序尝试规则，命中即返回。

## 模块流程图

```mermaid
flowchart TD
  A[route(query)] --> B[trim + lowercase]
  B --> C{空字符串?}
  C -- 是 --> D[return undefined]
  C -- 否 --> E[skills = registry.list]
  E --> F[for rule in rules]
  F --> G{rule 命中?}
  G -- 是 --> H[return matched skill]
  G -- 否 --> F
  F --> I[return undefined]
```

## 逐行精读（`src/core/router.ts`）

1. 导入 `Skill` 类型。  
2. 导入 Registry 类。  
3. 空行。  
4. 定义 `SkillRouteRule`：入参是 query + skills，返回命中技能或 undefined。  
5. 空行。  
6. 定义 `exactMatchRule`：精确匹配规则。  
7. 遍历技能数组，找名字与 query 完全一致的技能。  
8. 空行。  
9. 定义 `containsMatchRule`：包含匹配规则。  
10. 如果 query 包含技能名，则命中。  
11. 空行。  
12. 定义默认规则工厂。  
13. 默认顺序是“精确匹配优先，其次包含匹配”。  
14. 结束函数。  
15. 空行。  
16. 定义 `SkillRouter` 类。  
17. 构造函数。  
18. 注入 registry。  
19. 注入 rules，默认用 `defaultRouteRules()`。  
20. 结束构造参数。  
21. 空行。  
22. `route` 主方法。  
23. 先标准化输入：trim + lowercase。  
24. 空行。  
25. 空输入直接返回 undefined。  
26. 结束空输入分支。  
27. 空行。  
28. 空行（逻辑分组）。  
29. 从 registry 获取当前技能快照。  
30. 遍历规则链。  
31. 调用当前规则尝试匹配。  
32. 命中则立即返回。  
33. 返回命中技能。  
34. 结束命中分支。  
35. 结束规则循环。  
36. 空行。  
37. 全部规则都未命中，返回 undefined。  
38. 结束 `route`。  
39. 结束类。  

## 学习检查点

- 为什么规则链顺序很关键？
- 如果想支持“标签匹配”，应加新规则还是改旧规则？
- `registry.list()` 返回排序结果，会不会影响路由命中优先级？
