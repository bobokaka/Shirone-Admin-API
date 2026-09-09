---
name: create-skill
description: '交互式创建符合规范的 Claude Code Skill 文档。当用户要求创建skill、生成skill文档或想创建新skill时使用。'
version: 3.0.0
updateTime: 2026-01-16
tags: [工具, 生成器, 自动化, 文档, Claude-Skills]
difficulty: intermediate
---

# Create Skill - Skill 文档生成器

> **Context:** 用户需要创建可复用的 AI 能力，这些能力将在不同对话中被动态发现和加载
> **Objective:** 通过结构化流程生成符合 Claude Code Skills 规范的标准化文档
> **Style:** 简洁、精确、可执行，遵循 Markdown 最佳实践
> **Tone:** 专业且友好，像一位经验丰富的技术导师
> **Audience:** 需要快速创建高质量 Skills 的开发者和 AI 助手
> **Response:** 结构化的 Skill 文档 + 可执行的验证清单

## 概述

本生成器帮助你快速创建符合规范的 Skill 文档。它通过结构化询问收集信息，自动生成完整的 Skill 文档。

### 核心功能

- 交互式引导：通过友好的问答流程收集 Skill 信息
- 标准化格式：确保生成的文档符合 Skill 规范
- 质量验证：自动验证文档完整性和格式规范
- OpenSpec 集成：遵循 proposal → apply 的标准化工作流程

### 适用场景

- 创建新的 Skill 文档时
- 需要标准化文档格式时
- 团队协作需要统一规范时

## 环境要求

**本 Skill 无特定环境要求**

## 触发方式

### 方式 A: 斜杠命令

```
/create-skill
```

### 方式 B: 自然语言

```
帮我创建一个新的 skill
生成一个 skill 文档
我想创建一个 skill
```

## 信息收集清单

创建 Skill 时需要收集以下信息：

### 1. 基础信息
- **Skill 名称** (必填) - 简短描述，系统自动生成 kebab-case 目录名
- **核心功能** (必填) - 一句话描述核心功能
- **目标和用途** (必填) - 解决什么问题？目标用户是谁？使用场景有哪些？

### 2. 技术细节
- **技术栈和工具** (可选) - 涉及哪些编程语言/框架/库？
- **环境要求** (可选) - 需要哪些依赖？支持哪些操作系统？
- **操作步骤** (必填) - 主要的操作步骤有哪些？

### 3. 深度内容
- **示例场景** (推荐) - 基础、进阶、复杂三个级别的示例
- **规则和最佳实践** (推荐) - 核心规则、正确示例、错误示例
- **质量检查项** (必填) - 必检项列表，至少 3 个

## 规则实现指南

### 规则 1: 目录结构规范

**要求**: 每个 Skill 必须有独立目录，主文档统一命名为 `SKILL.md`

```
skills/vue3-component/SKILL.md
skills/create-skill/SKILL.md
skills/skill-optimizer/SKILL.md
```

### 规则 2: Front Matter 规范

**要求**: 所有 Skill 文档必须包含完整的 YAML Front Matter

```yaml
---
name: skill-name              # kebab-case
description: '功能描述。在触发条件时使用。'  # 第三人称 + 触发条件
version: 1.0.0                # 语义化版本
updateTime: 2026-01-16        # YYYY-MM-DD
tags: [tag1, tag2]
difficulty: beginner          # beginner|intermediate|advanced
---
```

### 规则 3: CO-STAR 声明规范

**要求**: 文档开头必须包含 CO-STAR 声明块

```markdown
> **Context:** 何时使用此 Skill
> **Objective:** 要达成什么目标
> **Style:** 输出风格要求
> **Tone:** 交互语气
> **Audience:** 目标用户
> **Response:** 输出格式
```

### 规则 4: 文档结构规范

**要求**: 必须包含以下章节，不包含更新日志

1. 概述（含核心功能、适用场景）
2. 环境要求（如需要）
3. 触发方式
4. 信息收集清单 / 使用步骤
5. 规则实现指南
6. 示例场景
7. 获得更好结果的技巧
8. 常见问题
9. 交付检查清单

## 示例场景

### 场景 1: 创建简单的文档生成 Skill

**用户请求**:

```
/create-skill
```

**执行步骤**:

1. 系统询问是否参考现有 skills → 选择"否"
2. Skill 名称 → "API 文档生成器"
3. 核心功能 → "自动生成 API 文档"
4. 技术栈 → 不需要特定工具
5. 环境要求 → 无特定要求
6. 继续收集其他信息
7. 生成 proposal 并验证
8. 用户批准
9. 生成 `skills/api-doc-generator/SKILL.md`

**预期输出**:

```
✅ Skill 文档已生成: skills/api-doc-generator/SKILL.md
✅ 文档通过所有质量验证规则
```

### 场景 2: 创建需要 Python 环境的 Skill

**用户请求**:

```
帮我创建一个 Python 代码格式化 skill
```

**执行步骤**:

1. 系统识别意图并启动创建流程
2. 参考现有 skills → 选择参考 `create-skill/SKILL.md`
3. Skill 名称 → "Python Code Formatter"
4. 核心功能 → "自动格式化 Python 代码"
5. 技术栈 → Python 3.8+, black, isort
6. 环境要求 → 需要 Python 和相关工具
7. 提供操作步骤、示例场景、检查清单
8. 生成 proposal 并验证
9. 用户批准
10. 生成 `skills/python-code-formatter/SKILL.md`

**预期输出**:

```
✅ Skill 文档已生成: skills/python-code-formatter/SKILL.md
✅ 参考了 create-skill/SKILL.md 的结构
✅ 文档包含完整的环境检查章节
```

### 场景 3: 创建跨平台多依赖 Skill

**用户请求**:

```
创建一个数据库迁移 skill,支持 PostgreSQL 和 MySQL
```

**执行步骤**:

1. 参考偏好 → 选择参考多个 skills
2. Skill 名称 → "DB Migrate"
3. 核心功能 → "执行数据库架构迁移"
4. 技术栈 → Python, SQLAlchemy, psycopg2, PyMySQL
5. 收集复杂的示例场景（PostgreSQL 和 MySQL 分别）
6. 定义质量检查项（数据库连接测试、迁移脚本验证等）
7. 生成 proposal 并验证
8. 用户批准
9. 生成 `skills/db-migrate/SKILL.md`

**预期输出**:

```
✅ Skill 文档已生成: skills/db-migrate/SKILL.md
✅ 文档包含 PostgreSQL 和 MySQL 的完整示例
✅ 通过所有质量验证规则
```

## 获得更好结果的技巧

### 1. 明确 Skill 的单一职责

```
✅ SKILLS_VUE_COMPONENT: 创建 Vue 组件
✅ SKILLS_API_DESIGN: 设计 RESTful API

❌ SKILLS_CODE_HELPER: 各种代码辅助功能（太宽泛）
❌ SKILLS_UTILS: 工具集合（没有明确职责）
```

### 2. 仅在需要时提供环境要求

```
✅ 纯文档生成 skill → "本 Skill 无特定环境要求"
✅ Python 工具 skill → 包含 Python 环境检查
```

### 3. 包含丰富的示例场景

```
基础: 最简单的用例
进阶: 常见的实际应用
复杂: 边界情况和高级用法
```

### 4. 编写可执行的检查清单

```
- [ ] 代码通过 lint 检查
  验证方法: 运行 `npm run lint` 并确保无错误
  通过标准: 所有 lint 规则通过，无 warning
```

## 常见问题

### Q: Skill 文档应该放在哪里？

A: 每个都有自己的独立目录，主文档命名为 `SKILL.md`：

```
skills/my-skill/
└── SKILL.md
```

### Q: Front Matter 必需哪些字段？

A: 以下 6 个字段是必需的：

- `name`: kebab-case 格式的名称
- `description`: 第三人称 + 触发条件
- `version`: 语义化版本号
- `updateTime`: YYYY-MM-DD 格式
- `tags`: 标签数组
- `difficulty`: beginner/intermediate/advanced 之一

### Q: 是否需要包含更新日志？

A: **不需要**。Skill 文档是执行指令，version 字段已含版本信息，更新日志浪费行数且对 AI 执行无帮助。

## 交付检查清单

### 必检项

- [ ] **目录结构**: skills/[skill-name]/SKILL.md
- [ ] **Front Matter 完整性**: 包含所有 6 个必需字段
- [ ] **CO-STAR 声明**: 文档开头包含完整的 CO-STAR 声明块
- [ ] **描述字段规范**: 第三人称 + 包含触发条件
- [ ] **必需章节完整**: 包含所有规定的必需章节
- [ ] **无更新日志**: 不包含更新日志章节
- [ ] **示例场景**: 至少包含 3 个示例场景
- [ ] **检查清单**: 必检项至少 3 个，每个包含验证方法

### 可选项

- [ ] **代码块语法高亮**: 所有代码块使用正确的语言标识
- [ ] **表格格式规范**: 使用标准 Markdown 表格格式
