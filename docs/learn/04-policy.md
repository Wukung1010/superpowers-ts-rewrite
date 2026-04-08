# 模块 04：策略层精读（`src/core/policy.ts`）

## 模块职责

Policy 负责“自动选技”。  
规则：**关键词映射优先**，命不中再交给 Router，最后记录 no-match。

## 模块流程图

```mermaid
flowchart TD
  A[selectSkill(input)] --> B[标准化输入]
  B --> C{空输入?}
  C -- 是 --> D[record policy.no-match empty-input]
  D --> E[return undefined]
  C -- 否 --> F[遍历 keywordRules]
  F --> G{命中关键词?}
  G -- 是 --> H[record policy.keyword-match]
  H --> I[return skillName]
  G -- 否 --> F
  F --> J[routed = router.route]
  J --> K{routed?}
  K -- 是 --> L[record policy.router-match]
  L --> M[return routed.name]
  K -- 否 --> N[record policy.no-match no-rule-hit]
  N --> O[return undefined]
```

## 逐行精读（`src/core/policy.ts`）

1. 导入 `ExecutionEvent` 类型。  
2. 导入 `SkillRouter`。  
3. 空行。  
4. 定义 `RuleBasedSkillPolicy`。  
5. 内部维护 `events` 数组。  
6. 空行。  
7. 构造函数开始。  
8. 注入 router。  
9. 注入 `keywordRules`，默认空对象。  
10. 结束构造参数。  
11. 结束构造函数。  
12. 空行。  
13. `getEvents` 返回事件拷贝，避免外部直接修改内部数组。  
14. 结束 `getEvents`。  
15. 空行。  
16. `clearEvents` 清空内部事件。  
17. 通过 `length = 0` 原地清空。  
18. 结束 `clearEvents`。  
19. 空行。  
20. 私有 `recordEvent`，统一封装事件写入。  
21. push 新事件对象。  
22. 事件类型。  
23. 当前 ISO 时间戳。  
24. 可选详情。  
25. 结束对象。  
26. 结束记录函数。  
27. 空行。  
28. `selectSkill` 主入口。  
29. 标准化输入。  
30. 空输入判断。  
31. 记录 no-match（原因 empty-input）。  
32. 返回 undefined。  
33. 结束空输入分支。  
34. 空行。  
35. 遍历关键词规则。  
36. query 包含关键词则命中。  
37. 记录关键词命中事件。  
38. 返回对应 skillName。  
39. 结束命中分支。  
40. 结束关键词循环。  
41. 空行。  
42. 关键词没命中时，调用 router 兜底匹配。  
43. 若 router 命中。  
44. 记录 router 命中事件。  
45. 返回路由结果的技能名。  
46. 结束 router 命中分支。  
47. 空行。  
48. 两层都失败则记录 no-match（原因 no-rule-hit）。  
49. 返回 undefined。  
50. 结束 `selectSkill`。  
51. 结束类。  

## 学习检查点

- 为什么关键词规则要优先于 Router？
- 事件记录在策略层有什么价值？
- 如果 keywordRules 很大，当前实现复杂度和优化方向是什么？
