---
title: 发布与校验
description: /api/publish/* 发布预览、远端探测、一键发布与 /api/validate dry-run 校验的接口参考。
---

# 发布与校验

发布模块封装双仓（内容仓 + 主题仓）的 git 操作。两个仓库**互不阻断**，各自返回独立的 `RepoPublishResult`。

## GET /api/publish/preview

发布页首屏数据：两仓变更明细、自动生成的提交信息、最近提交与状态。无参数。

**返回值** `PublishPreview` 关键字段：

| 字段 | 说明 |
|------|------|
| `branch` / `ahead` / `behind` | 内容仓分支与领先/落后（本地缓存值） |
| `changes` / `files` | 内容仓变更明细 `{ path, state: "new" \| "modified" }[]` 与文件清单 |
| `message` | 内容仓自动提交信息 |
| `themeChanges` / `themeFiles` / `themeMessage` / `themeStatus` / `themeRecent` | 主题仓对应信息（未连接时 `themeStatus` 为 `null`） |
| `themeDepsInstalled` | 主题依赖是否安装（决定能否本地校验） |
| `recent` | 内容仓最近 20 条提交 `{ hash, date, subject }` |

```bash
curl http://127.0.0.1:5175/api/publish/preview
```

## POST /api/publish/probe

轻量远端比对：`git ls-remote` 比对分支 tip，**不拉取任何代码/对象**。

| Body 字段 | 类型 | 必填 | 说明 |
|-----------|------|------|------|
| `repo` | `"content" \| "theme"` | 是 | 探测哪个仓 |

**返回值** `RemoteProbe`：`{ behind: number | null }`——`0` 与远端一致；`>0` 精确落后数；`null` 远端已前进但数量未知（需拉取后才能确定）。

```bash
curl -X POST http://127.0.0.1:5175/api/publish/probe \
  -H "Content-Type: application/json" -d '{"repo":"content"}'
```

## POST /api/publish

一键发布。流程：内容仓（**校验 → add -A → commit → pull --rebase --autostash → push**，校验失败即阻断该仓）+ 主题仓（commit → push，不跑本地校验）。

| Body 字段 | 类型 | 必填 | 说明 |
|-----------|------|------|------|
| `contentMessage` | `string` | 否 | 内容仓提交信息；**留空自动生成**（须符合 `type(scope): ≤30 字`） |
| `themeMessage` | `string` | 否 | 主题仓提交信息；同上 |

**返回值** `PublishResult`：

```json
{
  "ok": true,
  "content": { "ok": true, "hadChanges": true, "commitHash": "a1b2c3d", "pushed": true, "log": ["..."] },
  "theme":  { "ok": true, "hadChanges": false, "pushed": false, "log": ["无变更，跳过"] }
}
```

单仓 `RepoPublishResult`：`ok`（该仓整体成功）、`hadChanges`、`commitHash?`、`pushed`、`validationOutput?`（内容仓校验失败时的完整日志）、`log[]`（逐步执行记录）。顶层 `ok = content.ok && theme.ok`。

```bash
curl -X POST http://127.0.0.1:5175/api/publish \
  -H "Content-Type: application/json" -d '{}'
```

> [!WARNING]
> 这是真正会产生 git 提交与推送的接口。调用前建议先 `preview` 确认变更范围；内容仓校验失败时不会产生任何提交。

## POST /api/validate

单独执行发布前校验：在主题仓跑 `scripts/content/sync.mjs --dry-run`（环境带 `CONTENT_DIR`，180 秒超时，输出截尾 4000 字符）。**纯内存预检，不落盘、不产生任何改动**。

**返回值** `{ ok: boolean, output: string }`——`output` 为校验器输出（YAML 格式、字段拼写、frontmatter schema 问题定位）。

```bash
curl -X POST http://127.0.0.1:5175/api/validate
```
