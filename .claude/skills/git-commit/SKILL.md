---
name: git-commit
description: 根据项目 commitlint 配置自动生成规范的 Git 提交信息。使用 conventional commits 规范，正文描述不超过 20 字。
license: MIT
compatibility: Git
metadata:
  author: bobokaka
  version: "1.0"
---

根据 `.commitlintrc.cjs` 配置自动生成规范的 Git 提交信息。

## 输入

用户请求执行 git 提交时，分析当前暂存的代码变更，自动生成提交信息。

## 执行步骤

1. **获取变更状态**

   运行以下命令获取变更信息：
   ```bash
   git status --short
   git diff --cached --stat
   git diff --cached
   ```

2. **分析变更内容**

   根据变更的文件和代码内容，判断：
   - 变更类型 (type)
   - 变更范围 (scope) - 可选
   - 变更描述 (subject) - **不超过 20 个中文字符**

3. **确定提交类型**

   从以下类型中选择最合适的：

   | 类型 | 说明 | 适用场景 |
   |------|------|----------|
   | `feat` | 新增功能 | 新增页面、组件、API、功能点 |
   | `fix` | 修复缺陷 | 修复 bug、错误处理 |
   | `perf` | 性能优化 | 性能提升相关改动 |
   | `style` | 代码样式 | 代码格式调整（非 CSS 样式） |
   | `docs` | 文档变更 | README、注释、文档更新 |
   | `data` | 数据相关 | 数据处理、mock 数据等 |
   | `test` | 测试相关 | 添加或修改测试用例 |
   | `refactor` | 代码重构 | 不改变功能的代码重组 |
   | `build` | 编译打包 | 依赖升级、webpack/vite 配置 |
   | `ci` | 持续集成 | GitHub Actions、Jenkins 等 |
   | `cd` | 持续部署 | 部署流程、Docker 等 |
   | `db` | 数据库 | SQL、迁移脚本、表结构 |
   | `chore` | 其他修改 | 构建流程、依赖管理等杂项 |
   | `revert` | 回滚提交 | 撤销之前的提交 |
   | `workflow` | 工作流 | GitHub workflow、自动化流程 |
   | `types` | TS 类型 | 类型定义、接口声明 |
   | `config` | 配置相关 | 环境配置、项目配置 |
   | `refine` | 优化改进 | 代码优化、体验改进 |
   | `clean` | 清理代码 | 删除废弃代码、无用文件 |
   | `organize` | 整理文件 | 文件移动、目录结构调整 |
   | `dependency` | 依赖管理 | 安装/升级/移除依赖 |
   | `merge` | 分支合并 | 合并分支相关 |

4. **确定提交范围 (scope) - 可选**

   根据变更文件路径，从以下范围选择：

   | 范围 | 说明 | 对应目录/模块 |
   |------|------|---------------|
   | `app` | 系统业务 | `src/views/` 业务页面 |
   | `baseline` | 基础组件 | `library/components/baseline/` |
   | `business` | 业务组件 | `library/components/business/` |
   | `atom` | 业务 demo | demo 相关 |
   | `power` | 权限相关 | 权限控制模块 |
   | `home` | 首页相关 | 首页模块 |
   | `account` | 账户相关 | 登录、用户信息等 |
   | `envDepend` | 环境依赖 | `.env.*`、配置文件 |
   | `codeDepend` | 代码依赖 | `package.json`、依赖升级 |

5. **生成提交信息格式**

   ```
   type(scope): subject
   ```

   或不带 scope：
   ```
   type: subject
   ```

6. **执行提交**

   ```bash
   git commit -m "type(scope): subject"
   ```

## 提交信息规范

### 格式要求

- **subject 必须 ≤ 20 个中文字符**
- 使用简洁的中文描述
- 不加句号
- 使用动词开头（新增、修复、优化、更新、移除等）

### 示例

```
# 好的示例
feat(form): 新增表单验证功能
fix(router): 修复路由跳转异常
style: 统一代码缩进格式
refactor(api): 重构请求拦截逻辑
perf(table): 优化大数据渲染

# 不好的示例（描述过长）
feat(form): 新增了一个非常复杂的表单验证功能模块（超过20字）
fix: 修复了用户在登录页面输入错误密码后没有提示的问题（超过20字）
```

## 注意事项

1. **优先分析代码变更**，而非仅看文件名
2. **scope 可省略**，当变更跨多个模块或难以归类时
3. **一个提交只做一件事**，如果变更涉及多个不相关改动，建议拆分提交
4. **不要使用 emoji**，保持提交信息简洁
5. **遵循项目的 Git 提交规范**，与 `.commitlintrc.cjs` 配置保持一致

## 快速别名

项目预设了一些常用提交别名（在 `.commitlintrc.cjs` 中定义）：

| 别名 | 展开内容 |
|------|----------|
| `fd` | `docs:修复错别字` |
| `ur` | `docs: 更新 README` |
| `blog` | `docs(博客):更新文章` |
