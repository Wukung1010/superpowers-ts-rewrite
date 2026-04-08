# 模块 02：注册中心精读（`src/core/registry.ts`）

## 模块职责

Registry 负责三件事：

1. 注册技能（含合法性检查）；
2. 按名称查询技能；
3. 输出排序列表，并追踪技能来源（core / plugin）。

## 模块流程图

```mermaid
flowchart TD
  A[register(skill, source)] --> B{名称合法?}
  B -- 否 --> C[throw Invalid skill name]
  B -- 是 --> D{是否重复?}
  D -- 是 --> E[throw Duplicate skill name]
  D -- 否 --> F[写入 skills Map]
  F --> G[写入 sources Map]

  H[registerMany] --> A
  I[get(name)] --> J[返回 Skill|undefined]
  K[list] --> L[按 name 排序]
  M[listWithSource] --> K
  M --> N[拼接 source]
```

## 逐行精读（`src/core/registry.ts`）

1. 只导入类型 `Skill`，避免运行时依赖。  
2. 空行。  
3. 定义技能名正则：小写字母开头，只允许小写字母/数字/中划线。  
4. 空行。  
5. 定义 `RegisteredSkill` 接口。  
6. `skill` 保存技能对象。  
7. `source` 保存来源标识。  
8. 结束接口。  
9. 空行。  
10. 定义 `InMemorySkillRegistry` 类。  
11. 用 `Map<string, Skill>` 存技能。  
12. 用 `Map<string, string>` 存来源。  
13. 空行。  
14. `register` 方法，默认来源是 `core`。  
15. 校验技能名是否匹配正则。  
16. 不合法直接抛错。  
17. 结束不合法分支。  
18. 空行。  
19. 检查是否已存在同名技能。  
20. 重复则抛错，防止覆盖。  
21. 结束重复分支。  
22. 空行。  
23. 写入技能 Map。  
24. 写入来源 Map。  
25. 结束 `register`。  
26. 空行。  
27. `registerMany` 批量注册，复用单个注册逻辑。  
28. 遍历传入技能列表。  
29. 每个技能都走 `register`，因此复用全部校验。  
30. 结束循环。  
31. 结束 `registerMany`。  
32. 空行。  
33. `get` 按名称读技能。  
34. 直接从 Map 获取。  
35. 结束 `get`。  
36. 空行。  
37. `getSource` 按名称读来源。  
38. 从来源 Map 获取。  
39. 结束 `getSource`。  
40. 空行。  
41. `list` 输出所有技能。  
42. 先转数组再按 `name.localeCompare` 排序，保证稳定显示。  
43. 结束 `list`。  
44. 空行。  
45. `listWithSource` 输出技能 + 来源。  
46. 基于 `list()` 的排序结果映射。  
47. 回填 `skill` 字段。  
48. 读来源，缺省兜底为 `core`。  
49. 结束映射对象。  
50. 结束映射。  
51. 结束类。  

## 学习检查点

- 为什么要先正则校验再去重检查？
- `registerMany` 如果中途失败，会留下什么状态？
- 为什么 `listWithSource` 先调用 `list()` 而不是直接遍历 `skills`？
