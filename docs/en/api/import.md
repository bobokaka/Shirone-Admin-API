---
title: Jianshu Import
description: API reference for /api/import/jianshu/* export-archive sessions, background import jobs, single-post paste conversion, and AI metadata suggestions.
---

# Jianshu Import

Two groups of endpoints for migrating from Jianshu: the **export-archive flow** (session-based: upload → manifest → preview → background job) and the **single-post paste flow** (no session, converted as soon as you paste).

Sessions and jobs live in **server memory**: sessions last 24 hours with at most 3 kept (LRU eviction), job results are kept for 1 hour, and a service restart clears them—already-imported posts are unaffected (they were written to the repository long before).

## POST /api/import/jianshu/archive

Uploads a Jianshu export archive (multipart).

| Form field | Required | Description |
|------------|----------|-------------|
| `file` | Yes | rar / zip archive, ≤30MB |

**Side effects**: unpacks and parses in memory (nothing hits disk). **Return value** `JianshuArchiveSummary`:

```json
{
  "sessionId": "s-xxxx",
  "notebooks": [{ "name": "技术随笔", "articles": [{ "id": "技术随笔/a.md", "title": "标题", "bytes": 8213 }] }],
  "total": 42,
  "importedIds": ["技术随笔/a.md"]
}
```

`id` is the session-unique identifier (the normalized in-archive path); root-level standalone essays go into the “未分组” (ungrouped) notebook.

```bash
curl -X POST http://127.0.0.1:5175/api/import/jianshu/archive \
  -F "file=@jianshu-export.zip"
```

## GET /api/import/jianshu/preview

Single-post conversion preview; **nothing is written to disk**, and images keep their remote links.

| Query parameter | Required | Description |
|-----------------|----------|-------------|
| `sessionId` | Yes | The session id returned by the previous step |
| `id` | Yes | Article id |

**Return value** `JianshuPreview`: `{ title, markdown, imageCount, wordCount }`—`wordCount` is the body's plain-text character count (a very small value suggests only placeholder content remains).

```bash
curl "http://127.0.0.1:5175/api/import/jianshu/preview?sessionId=s-xxxx&id=技术随笔/a.md"
```

## POST /api/import/jianshu/run

Starts a **background import job**; it returns immediately, then you poll for progress.

| Body field | Type | Required | Description |
|------------|------|----------|-------------|
| `sessionId` | `string` | Yes | Session id |
| `ids` | `string[]` | Yes | Article ids to import, 1–2000 of them |
| `options.published` | `string` | Yes | The uniform publish date `YYYY-MM-DD` (the export archive carries no dates) |
| `options.categoryFromNotebook` | `boolean` | Yes | Use the notebook name as the category |
| `options.category` | `string` | No | The uniform category when not using notebooks (≤40 characters) |
| `options.tags` | `string[]` | Yes | Uniform tags (≤12, each ≤30 characters) |
| `options.localizeImages` | `boolean` | Yes | Download images into the repository (failures keep remote links) |
| `options.draft` | `boolean` | Yes | Import as drafts |

**Return value** `{ jobId }`. **Side effects**: writes `content/posts/<slug>/index.md` post by post and downloads images.

```bash
curl -X POST http://127.0.0.1:5175/api/import/jianshu/run \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"s-xxxx","ids":["技术随笔/a.md"],"options":{"published":"2026-09-10","categoryFromNotebook":true,"tags":["简书迁移"],"localizeImages":true,"draft":true}}'
```

## GET /api/import/jianshu/job

Polls job progress (a 2-second interval is recommended).

| Query parameter | Required | Description |
|-----------------|----------|-------------|
| `id` | Yes | Job id |

**Return value** `JianshuImportJob`: `{ id, sessionId, status: "running" | "done", total, done, current, results, log }`. Each item of `results` is `{ id, title, ok, path?, error?, images }`; `log` keeps the last 200 entries.

```bash
curl "http://127.0.0.1:5175/api/import/jianshu/job?id=job-xxxx"
```

## DELETE /api/import/jianshu/session

Discards a session (clears the in-archive cache). Refused while a job is running.

| Query parameter | Required | Description |
|-----------------|----------|-------------|
| `id` | Yes | Session id |

**Return value** `{ ok: boolean }`.

```bash
curl -X DELETE "http://127.0.0.1:5175/api/import/jianshu/session?id=s-xxxx"
```

## POST /api/import/jianshu/paste-preview

Single-post paste **conversion preview** (nothing written to disk). At least one of the three payloads must be non-empty, each ≤2MB; parsing priority: **markdown (the editor's final draft) > html (rich text) > text (plain text, falls back to Markdown)**.

| Body field | Type | Required | Description |
|------------|------|----------|-------------|
| `markdown` | `string` | One of three | The editor's final draft, used with priority |
| `html` | `string` | One of three | Rich text (copied from a web page), converted to Markdown |
| `text` | `string` | One of three | Plain-text fallback |

**Return value** same as `JianshuPreview`.

```bash
curl -X POST http://127.0.0.1:5175/api/import/jianshu/paste-preview \
  -H "Content-Type: application/json" \
  -d '{"html":"<h1>标题</h1><p>段落</p>"}'
```

## POST /api/import/jianshu/paste-run

Single-post paste **written to the repository**: images are downloaded into the post directory automatically (failures keep remote links).

The body = the paste payload (as above) + `options`:

| Field | Constraint |
|-------|------------|
| `title` | Required, 1–100 characters |
| `published` | Required, `YYYY-MM-DD` |
| `category` | Optional, ≤40 characters |
| `tags` | ≤12, each ≤30 characters |
| `draft` | boolean |

**Return value** `JianshuPasteResult`: `{ title, path, slug, images, failedImages[] }`—`images` is the count successfully localized, `failedImages` lists the images that kept remote links.

```bash
curl -X POST http://127.0.0.1:5175/api/import/jianshu/paste-run \
  -H "Content-Type: application/json" \
  -d '{"markdown":"# 标题\n正文","options":{"title":"标题","published":"2026-09-10","tags":[],"draft":true}}'
```

## POST /api/import/jianshu/suggest-meta

AI analyzes the body and fills in metadata (auto-falls back to a body excerpt when AI is disabled or the call fails, with `aiUsed=false`).

| Body field | Type | Required | Description |
|------------|------|----------|-------------|
| `title` | `string` | No | Leave empty to have AI propose a title as well, ≤100 characters |
| `markdown` | `string` | Yes | The body, 1–2MB |

**Return value** `JianshuMetaSuggestion`: `{ title?, description, category, tags[], aiUsed }`.

```bash
curl -X POST http://127.0.0.1:5175/api/import/jianshu/suggest-meta \
  -H "Content-Type: application/json" \
  -d '{"title":"","markdown":"# 我的博客搭建记\n…"}'
```
