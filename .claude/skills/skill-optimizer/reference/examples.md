# 审查场景示例

详细的 Skill 文档审查场景和解决方案。

## 场景 1: 审查 Front Matter 不完整的 Skill

### 输入文档

```markdown
---
name: my-skill
description: A helpful skill
version: 1.0
---

# My Skill
...
```

### 审查报告

```markdown
## 审查报告: my-skill

### 综合评分: 35/100 ❌ 不合格

### 🔴 高优先级问题

#### 1. Front Matter 缺少 3 个必需字段
- **缺失字段:**
  - ❌ `updateTime` - 无法判断文档时效性
  - ❌ `tags` - Claude 无法正确索引
  - ❌ `difficulty` - 用户无法预判难度

#### 2. Version 格式不规范
- **当前:** `version: 1.0`
- **应为:** `version: 1.0.0` (语义化版本)

#### 3. Description 不符合规范
- **当前:** `A helpful skill` (第一人称, 过于模糊)
- **问题:**
  - 使用了第一人称
  - 缺少触发条件说明
  - 未描述具体功能

### 修复后的 Front Matter

```yaml
---
name: my-skill
description: '分析代码质量并生成改进建议。在代码审查、重构或质量检查时使用。'
version: 1.0.0
updateTime: 2026-01-15
tags: [代码, 质量, 审查, 重构]
difficulty: intermediate
---
```

### 验证结果: ✅ 全部通过
```

---

## 场景 2: 审查缺少渐进式披露设计的冗长 Skill

### 问题描述

SKILL.md 共 800 行，包含大量 API 参考和详细示例

### 审查报告

```markdown
## 审查报告: long-skill

### 综合评分: 65/100 ⚠️ 需要改进

### 🟡 中优先级问题

#### Token 效率分析
- **当前行数:** 800 行
- **推荐行数:** ≤500 行
- **估算 Token:** ~7500 (超出推荐 ~2500)
- **影响:** 加载时间增加，上下文占用过多

### 架构改进建议

#### 当前结构 (问题)
```
long-skill/
└── SKILL.md (800 行 - 全部内容)
```

#### 建议结构 (渐进式披露)
```
long-skill/
├── SKILL.md (200 行 - 概述和快速开始)
│   ├── 核心概念
│   ├── 快速开始
│   └── 指向详细内容的链接
│
├── reference/
│   ├── api.md (300 行 - API 参考)
│   ├── examples.md (200 行 - 详细示例)
│   └── advanced.md (100 行 - 高级用法)
│
└── scripts/
    ├── validate.sh
    └── helper.py
```

### 新的 SKILL.md 结构

```markdown
# Long Skill

## 快速开始

[最基本用法，20 行]

## 核心功能

[功能概述，50 行]

## 深入学习

**完整 API 参考** → 参阅 [reference/api.md](reference/api.md)
**更多示例** → 参阅 [reference/examples.md](reference/examples.md)
**高级用法** → 参阅 [reference/advanced.md](reference/advanced.md)
```

### 预期改进
- Token 使用: ~7500 → ~2000 (减少 73%)
- 加载时间: 显著降低
- 可维护性: 提高 (模块化)
```

---

## 场景 3: 审查术语不一致的 Skill

### 问题描述

文档中混用多种术语变体

### 审查报告

```markdown
## 审查报告: inconsistent-skill

### 🟡 中优先级问题

#### 术语不一致检测

| 期望 | 发现的变体 | 次数 |
|-----|-----------|------|
| `Skill` | `skill`, `SKILL`, `Skill` | 混用 |
| `API` | `api`, `API`, `Api` | 混用 |
| `端点` | `端点`, `接口`, `endpoint` | 混用 |

### 修复建议

#### 术语标准化表

| 概念 | 标准术语 | 使用场景 |
|-----|---------|---------|
| Claude Skills | `Skill` (大写 S) | 指代整个系统 |
| 单个技能 | `skill` (小写 s) | 指代具体实例 |
| 应用程序接口 | `API` (全大写) | 统一使用 |
| HTTP 端点 | `端点` | 中文文档 |

### 自动替换脚本

```bash
# 术语标准化脚本
sed -i 's/\bskill\b/Skill/g' "$FILE"  # 小写转大写
sed -i 's/\bapi\b/API/g' "$FILE"       # api 转大写
sed -i 's/接口/端点/g' "$FILE"         # 统一翻译
```
```

---

## 场景 4: 审查缺少反馈循环的 Skill

### 问题描述

Skill 描述了操作步骤，但没有验证机制

### 审查报告

```markdown
## 审查报告: no-feedback-skill

### 🟡 中优先级问题

#### 缺少反馈循环设计

**当前工作流:**
1. 执行操作 A
2. 执行操作 B
3. 完成

**问题:** 如果步骤 B 失败，用户无法知道

### 改进建议: 添加验证步骤

#### 推荐模式: 验证循环

```markdown
## 工作流

### 步骤 1: 准备
[准备工作说明]

### 步骤 2: 执行
```bash
operation_command
```

### 步骤 3: 验证 (必须)
```bash
# 验证命令
verify_command

# 预期输出
# ✅ Success: 表示成功
# ❌ Error: 表示失败
```

**如果验证失败:**
1. 检查错误信息
2. 参考 [故障排除](#故障排除)
3. 重新执行步骤 2-3

### 步骤 4: 确认
仅在验证通过后继续
```

### 可选: 添加验证脚本

创建 `scripts/validate.sh`:
```bash
#!/bin/bash
# 验证操作结果
if [ condition ]; then
    echo "✅ 验证通过"
    exit 0
else
    echo "❌ 验证失败"
    exit 1
fi
```
```
