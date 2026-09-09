---
title: 简书导入
description: /api/import/jianshu/* 导出包会话、后台导入任务、单篇粘贴转换与 AI 元信息建议的接口参考。
---

# 简书导入

简书迁移的两组接口：**导出包流程**（会话制：上传 → 清单 → 预览 → 后台任务）与**单篇粘贴流程**（无会话，即贴即转）。

会话与任务都保存在**服务端内存**：会话有效期 24 小时、最多 3 个（LRU 淘汰），任务结果保留 1 小时，服务重启即清空——已导入文章不受影响（早已落仓）。

## POST /api/import/jianshu/archive

上传简书导出包（multipart）。

| 表单字段 | 必填 | 说明 |
|----------|------|------|
| `file` | 是 | rar / zip 压缩包，≤30MB |

**副作用**：内存解包并解析（不落盘）。**返回值** `JianshuArchiveSummary`：

```json
{
  "sessionId": "s-xxxx",
  "notebooks": [{ "name": "技术随笔", "articles": [{ "id": "技术随笔/a.md", "title": "标题", "bytes": 8213 }] }],
  "total": 42,
  "importedIds": ["技术随笔/a.md"]
}
```

`id` 为会话内唯一标识（归一化包内路径）；根级散文归入「未分组」。

```bash
curl -X POST http://127.0.0.1:5175/api/import/jianshu/archive \
  -F "file=@jianshu-export.zip"
```

## GET /api/import/jianshu/preview

单篇转换预览，**不落盘**，图片保持远程链接。

| Query 参数 | 必填 | 说明 |
|------------|------|------|
| `sessionId` | 是 | 上一步返回的会话 id |
| `id` | 是 | 文章 id |

**返回值** `JianshuPreview`：`{ title, markdown, imageCount, wordCount }`——`wordCount` 为正文纯文本字数（过小说明可能只剩占位内容）。

```bash
curl "http://127.0.0.1:5175/api/import/jianshu/preview?sessionId=s-xxxx&id=技术随笔/a.md"
```

## POST /api/import/jianshu/run

启动**后台导入任务**，立即返回后轮询进度。

| Body 字段 | 类型 | 必填 | 说明 |
|-----------|------|------|------|
| `sessionId` | `string` | 是 | 会话 id |
| `ids` | `string[]` | 是 | 要导入的文章 id，1–2000 条 |
| `options.published` | `string` | 是 | 统一发布日期 `YYYY-MM-DD`（导出包不含日期） |
| `options.categoryFromNotebook` | `boolean` | 是 | 文集名作分类 |
| `options.category` | `string` | 否 | 不按文集时的统一分类（≤40 字符） |
| `options.tags` | `string[]` | 是 | 统一标签（≤12 个，单个 ≤30 字符） |
| `options.localizeImages` | `boolean` | 是 | 图片下载落仓（失败的保留远程链接） |
| `options.draft` | `boolean` | 是 | 导入为草稿 |

**返回值** `{ jobId }`。**副作用**：逐篇写 `content/posts/<slug>/index.md`、下载图片。

```bash
curl -X POST http://127.0.0.1:5175/api/import/jianshu/run \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"s-xxxx","ids":["技术随笔/a.md"],"options":{"published":"2026-09-10","categoryFromNotebook":true,"tags":["简书迁移"],"localizeImages":true,"draft":true}}'
```

## GET /api/import/jianshu/job

轮询任务进度（建议 2 秒间隔）。

| Query 参数 | 必填 | 说明 |
|------------|------|------|
| `id` | 是 | 任务 id |

**返回值** `JianshuImportJob`：`{ id, sessionId, status: "running" | "done", total, done, current, results, log }`。`results` 每项 `{ id, title, ok, path?, error?, images }`；`log` 保留末尾 200 条。

```bash
curl "http://127.0.0.1:5175/api/import/jianshu/job?id=job-xxxx"
```

## DELETE /api/import/jianshu/session

丢弃会话（清空包内缓存）。任务运行中会被拒绝。

| Query 参数 | 必填 | 说明 |
|------------|------|------|
| `id` | 是 | 会话 id |

**返回值** `{ ok: boolean }`。

```bash
curl -X DELETE "http://127.0.0.1:5175/api/import/jianshu/session?id=s-xxxx"
```

## POST /api/import/jianshu/paste-preview

单篇粘贴**转换预览**（不落盘）。三载荷至少一个非空，各 ≤2MB；解析优先级：**markdown（编辑器定稿）> html（富文本）> text（纯文本按 Markdown 兜底）**。

| Body 字段 | 类型 | 必填 | 说明 |
|-----------|------|------|------|
| `markdown` | `string` | 三选一 | 编辑器定稿，优先采用 |
| `html` | `string` | 三选一 | 富文本（网页复制），转 Markdown |
| `text` | `string` | 三选一 | 纯文本兜底 |

**返回值** 同 `JianshuPreview`。

```bash
curl -X POST http://127.0.0.1:5175/api/import/jianshu/paste-preview \
  -H "Content-Type: application/json" \
  -d '{"html":"<h1>标题</h1><p>段落</p>"}'
```

## POST /api/import/jianshu/paste-run

单篇粘贴**落仓**：图片自动下载到文章目录（失败的保留远程链接）。

Body = 粘贴载荷（同上）+ `options`：

| 字段 | 约束 |
|------|------|
| `title` | 必填，1–100 字符 |
| `published` | 必填，`YYYY-MM-DD` |
| `category` | 可选，≤40 字符 |
| `tags` | ≤12 个，单个 ≤30 字符 |
| `draft` | boolean |

**返回值** `JianshuPasteResult`：`{ title, path, slug, images, failedImages[] }`——`images` 为成功本地化数，`failedImages` 为保留远程链接的图片。

```bash
curl -X POST http://127.0.0.1:5175/api/import/jianshu/paste-run \
  -H "Content-Type: application/json" \
  -d '{"markdown":"# 标题\n正文","options":{"title":"标题","published":"2026-09-10","tags":[],"draft":true}}'
```

## POST /api/import/jianshu/suggest-meta

AI 分析正文，补充元信息（未启用/失败自动回退正文摘要，`aiUsed=false`）。

| Body 字段 | 类型 | 必填 | 说明 |
|-----------|------|------|------|
| `title` | `string` | 否 | 留空 = 让 AI 一并拟定标题，≤100 字符 |
| `markdown` | `string` | 是 | 正文，1–2MB |

**返回值** `JianshuMetaSuggestion`：`{ title?, description, category, tags[], aiUsed }`。

```bash
curl -X POST http://127.0.0.1:5175/api/import/jianshu/suggest-meta \
  -H "Content-Type: application/json" \
  -d '{"title":"","markdown":"# 我的博客搭建记\n…"}'
```
