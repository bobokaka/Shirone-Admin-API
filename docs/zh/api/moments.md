---
title: 说说
description: /api/moments 说说 CRUD 的接口参考——发布、更新、删除动态。
---

# 说说

说说模块操作内容仓 `content/moments/`，每条一个 Markdown 文件，文件名即 id：`<yyyymmdd-HHmmss>.md`。列表按时间倒序。

## MomentMeta 结构

列表与详情共用的元信息：

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | `string` | 文件名去 `.md`，如 `20260906-183000` |
| `path` | `string` | 相对路径 |
| `published` | `string` | `YYYY-MM-DD HH:mm:ss` |
| `pinned` / `draft` | `boolean` | 置顶 / 草稿 |
| `location` | `string` | 地点 |
| `mood` | `string` | 心情 Iconify 图标名（空串表示未选） |
| `tags` | `string[]` | 标签 |
| `images` | `{ src, alt }[]` | 配图，`src` 为站点路径 |
| `body` | `string` | 正文文本（列表即含） |

## GET /api/moments

全量列表，无参数。

```bash
curl http://127.0.0.1:5175/api/moments
```

## GET /api/moments/detail

| Query 参数 | 必填 | 说明 |
|------------|------|------|
| `path` | 是 | 说说相对路径 |

**返回值** `MomentFile`：`{ meta: MomentMeta, body: string }`。

```bash
curl "http://127.0.0.1:5175/api/moments/detail?path=20260906-183000.md"
```

## POST /api/moments

新建说说。**副作用**：写入 `content/moments/<发布时间戳>.md`；`images` 引用的文件应已通过[说说图上传](./media.md#post-apimedia-moment-image)落仓。

| Body 字段 | 类型 | 必填 | 默认 | 说明 |
|-----------|------|------|------|------|
| `published` | `string` | 是 | — | `YYYY-MM-DD HH:mm:ss`，决定文件名 |
| `body` | `string` | 否 | `""` | 正文 |
| `location` | `string` | 否 | — | 地点 |
| `mood` | `string` | 否 | — | 心情图标名 |
| `tags` | `string[]` | 否 | — | 标签 |
| `images` | `{ src, alt? }[]` | 否 | — | 配图列表 |
| `draft` / `pinned` | `boolean` | 否 | `false` | 草稿 / 置顶 |

**返回值** 创建后的 `MomentMeta`。

```bash
curl -X POST http://127.0.0.1:5175/api/moments \
  -H "Content-Type: application/json" \
  -d '{"published":"2026-09-10 10:30:00","body":"第一条说说！","mood":"material-symbols:celebration","tags":["开始"]}'
```

## PUT /api/moments

更新说说，字段同上，另加：

| Body 字段 | 类型 | 必填 | 说明 |
|-----------|------|------|------|
| `path` | `string` | 是 | 目标说说路径 |

未传的可选字段回落默认值（整体覆盖语义），调用前先读 detail 再改是最稳妥的模式（管理界面即如此）。

```bash
curl -X PUT http://127.0.0.1:5175/api/moments \
  -H "Content-Type: application/json" \
  -d '{"path":"20260906-183000.md","published":"2026-09-06 18:30:00","body":"改过了","pinned":true}'
```

## DELETE /api/moments

删除说说（`.md` 文件）。**配图文件不随之删除**，需要时手动清理 `public/images/moments/` 下对应批次目录。

| Query 参数 | 必填 | 说明 |
|------------|------|------|
| `path` | 是 | 说说相对路径 |

**返回值** `{ "ok": true }`。

```bash
curl -X DELETE "http://127.0.0.1:5175/api/moments?path=20260906-183000.md"
```
