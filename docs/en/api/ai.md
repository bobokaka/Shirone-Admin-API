---
title: AI Services
description: API reference for /api/ai/* provider configuration, chat and streaming rewrite (SSE), commit message generation, timeline drafting, music search, and wallpaper fetching.
---

# AI Services

The AI module covers configuration management and every AI workflow. Except for wallpaper fetching, **all endpoints require AI to be enabled** (master switch on + the active provider fully configured); otherwise they return `400` with “AI 助手未启用…”.

Configuration persists in the local `server/data/ai-settings.json` (gitignored), fully isolated from the content repository.

## GET /api/ai/settings

**Return value** `AiSettings`:

```json
{
  "enable": true,
  "providers": [
    {
      "id": "uuid", "name": "Anthropic 官方",
      "protocol": "anthropic", "baseUrl": "https://api.anthropic.com",
      "apiKey": "sk-…", "model": "claude-sonnet-5", "modelFast": "",
      "webSearch": true, "temperature": 0.7, "timeoutSeconds": 30
    }
  ],
  "activeId": "uuid"
}
```

`protocol` is one of two: `anthropic` (v1/messages, the default) / `openai` (chat/completions). An empty `modelFast` means light tasks use the main model.

```bash
curl http://127.0.0.1:5175/api/ai/settings
```

## PUT /api/ai/settings

Saves the configuration. The body is a complete `AiSettings`: `enable` (boolean), `providers` (1–20 profiles; field constraints: `temperature` 0–2 default 0.7, `timeoutSeconds` 5–86400 default 30, `webSearch` default true), `activeId` (must point to one of the providers). **While enabled**, the active provider must be fully filled in (URL starting with http(s), key, model name), otherwise 400.

**Return value** the normalized, saved `AiSettings` (the legacy flat structure is accepted and migrated on read).

```bash
curl -X PUT http://127.0.0.1:5175/api/ai/settings \
  -H "Content-Type: application/json" \
  -d '{"enable":true,"providers":[{"id":"p1","name":"官方","protocol":"anthropic","baseUrl":"https://api.anthropic.com","apiKey":"sk-…","model":"claude-sonnet-5","modelFast":"","webSearch":true,"temperature":0.7,"timeoutSeconds":30}],"activeId":"p1"}'
```

## POST /api/ai/test

Connection test. **The form configuration in the request body wins** (you can test before saving); if parsing fails it falls back to the saved configuration. Test requests are pinned to `maxTokens: 16`, `temperature: 0`, thinking and web search off, and a timeout of min(that provider's setting, 30 seconds).

**Return value** `AiTestResult`: `{ ok, latencyMs, reply?, error? }`—when `ok=true`, `reply` is an excerpt of the model's answer (≤120 characters).

```bash
curl -X POST http://127.0.0.1:5175/api/ai/test \
  -H "Content-Type: application/json" \
  -d '{"enable":true,"providers":[{"id":"p1","name":"t","protocol":"anthropic","baseUrl":"https://api.anthropic.com","apiKey":"sk-…","model":"claude-sonnet-5","modelFast":"","webSearch":false,"temperature":0.7,"timeoutSeconds":30}],"activeId":"p1"}'
```

## POST /api/ai/chat

Non-streaming chat entry (always uses the saved configuration).

| Body field | Type | Required | Description |
|------------|------|----------|-------------|
| `messages` | `{ role: system/user/assistant, content }[]` | Yes | The full message list; each message ≤200k characters |
| `maxTokens` | `number` | No | 16–16384 |
| `fast` | `boolean` | No | `true` routes to the fast model (falls back to the main model when unset) with thinking off |

**Return value** `AiChatResult`: `{ content, model, promptTokens?, completionTokens?, searchUsed? }`.

```bash
curl -X POST http://127.0.0.1:5175/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"用一句话介绍 Markdown"}],"fast":true}'
```

## POST /api/ai/edit

Single-instruction rewrite: the server pins the system prompt (a Markdown writing assistant that outputs only the result); system customization is not exposed.

| Body field | Type | Required | Description |
|------------|------|----------|-------------|
| `instruction` | `string` | Yes | Rewrite instruction, ≤2000 characters |
| `text` | `string` | Yes | Text to rewrite, ≤100k characters |
| `maxTokens` | `number` | No | Default 4096 |

**Return value** same as `AiChatResult`.

```bash
curl -X POST http://127.0.0.1:5175/api/ai/edit \
  -H "Content-Type: application/json" \
  -d '{"instruction":"润色：保留原意，只输出结果","text":"这算一个测试文本"}'
```

## Streaming Endpoints (SSE) {#streaming-endpoints}

`edit-stream` and `chat-stream` share the same streaming relay protocol:

- Response `Content-Type: text/event-stream`, one `data: <JSON>` line per frame (not the multi-line events of standard SSE)
- Frame types: `{ "type": "thinking", "text": "…" }` (thinking delta), `{ "type": "text", "text": "…" }` (body delta), `{ "type": "done", "content": "<full text>", "model": "…", "completionTokens": n }`, `{ "type": "error", "message": "…" }`
- **Disconnecting the client aborts the upstream request** (this is the only way to stop)
- The timeout counts idle time without output (duration = the active provider's `timeoutSeconds`); generating long texts is not limited by total duration

### POST /api/ai/edit-stream

Streaming rewrite; the request body is identical to `edit` (`maxTokens` defaults to 4096).

```bash
curl -N -X POST http://127.0.0.1:5175/api/ai/edit-stream \
  -H "Content-Type: application/json" \
  -d '{"instruction":"续写这篇文章","text":"正文…"}'
```

### POST /api/ai/chat-stream

Streaming multi-turn chat.

| Body field | Type | Required | Description |
|------------|------|----------|-------------|
| `messages` | `{ role: user/assistant, content }[]` | Yes | 1–40 messages (system not counted) |
| `system` | `string` | No | System prompt, transmitted separately, ≤10k characters |
| `maxTokens` | `number` | No | Default 8192 |

## POST /api/ai/commit-message

AI commit message generation. **Never throws or blocks**: when AI is disabled it falls back to heuristics and marks it via `source`.

| Body field | Type | Required | Default | Description |
|------------|------|----------|---------|-------------|
| `repo` | `"content" \| "theme"` | No | `content` | Generate from which repository's changes |

**Return value** `{ message, source: "ai" \| "heuristic" }`—the AI output is adopted only if it passes the `type(scope): ≤30 characters` format check, otherwise it automatically falls back to generating from the changes.

```bash
curl -X POST http://127.0.0.1:5175/api/ai/commit-message \
  -H "Content-Type: application/json" -d '{"repo":"content"}'
```

## POST /api/ai/timeline-draft

Timeline event drafting.

| Body field | Type | Required | Description |
|------------|------|----------|-------------|
| `mode` | `"note" \| "git"` | Yes | `note` drafts from a description; `git` scans the three repositories' commit history and summarizes |
| `note` | `string` | Required when mode=note | Event description, ≤500 characters |
| `limit` | `number` | No | 1–5, the cap on generated entries |
| `existing` | `{ title, date }[]` | No | Already-recorded events (≤300), used for de-duplication |

**Return value** an array of drafts (strict JSON + zod filtering; invalid entries already removed).

```bash
curl -X POST http://127.0.0.1:5175/api/ai/timeline-draft \
  -H "Content-Type: application/json" \
  -d '{"mode":"note","note":"2025年6月上线了个人博客","limit":3}'
```

## POST /api/ai/music-search

Music license search (web search first; automatically degrades to a plain request and is flagged when the service lacks web search).

| Body field | Type | Required | Description |
|------------|------|----------|-------------|
| `query` | `string` | Yes | Search query, ≤200 characters |

**Return value** an array of candidates, each containing `title` / `artist?` / `license` (`freeCommercial`, `summary`, `evidence?`, `sourceUrl?`) / `audioUrl?` / `coverUrl?`.

```bash
curl -X POST http://127.0.0.1:5175/api/ai/music-search \
  -H "Content-Type: application/json" \
  -d '{"query":"安静的钢琴曲 免费商用"}'
```

## POST /api/ai/wallpaper-search

Wallpaper fetching (pulled straight from the safebooru image source). **Does not go through AI and has no enablement requirement**—callable at any time.

| Body field | Type | Required | Description |
|------------|------|----------|-------------|
| `query` | `string` | No | Search query, default empty (random) |
| `target` | `"desktop" \| "mobile"` | Yes | Size target: desktop fetches landscape images ≥1920 wide, mobile fetches portrait images ≥1920 tall |

**Return value** `WallpaperCandidate[]` (enough to fill a batch): `{ imageUrl, previewUrl?, width?, height? }`.

```bash
curl -X POST http://127.0.0.1:5175/api/ai/wallpaper-search \
  -H "Content-Type: application/json" \
  -d '{"query":"星空","target":"desktop"}'
```
