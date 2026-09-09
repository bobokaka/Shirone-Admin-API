---
title: AI 服务
description: /api/ai/* 服务商配置、对话与流式改写（SSE）、提交信息生成、时间线起草、音乐检索与壁纸抓取的接口参考。
---

# AI 服务

AI 模块覆盖配置管理与所有 AI 工作流。除壁纸抓取外，**全部接口要求 AI 已启用**（总开关开 + 当前服务商配置完整），否则返回 `400`「AI 助手未启用…」。

配置持久化在本机 `server/data/ai-settings.json`（gitignore），与内容仓完全隔离。

## GET /api/ai/settings

**返回值** `AiSettings`：

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

`protocol` 二选一：`anthropic`（v1/messages，默认）/ `openai`（chat/completions）。`modelFast` 留空表示轻量任务同主模型。

```bash
curl http://127.0.0.1:5175/api/ai/settings
```

## PUT /api/ai/settings

保存配置。Body 为完整 `AiSettings`：`enable`（boolean）、`providers`（1–20 套，字段约束：`temperature` 0–2 默认 0.7、`timeoutSeconds` 5–86400 默认 30、`webSearch` 默认 true）、`activeId`（必须指向 providers 中一项）。**启用状态下**当前服务商必须已填完整（地址 http(s) 开头、Key、模型名），否则 400。

**返回值** 归一化并保存后的 `AiSettings`（兼容旧版扁平结构，读取时自动迁移）。

```bash
curl -X PUT http://127.0.0.1:5175/api/ai/settings \
  -H "Content-Type: application/json" \
  -d '{"enable":true,"providers":[{"id":"p1","name":"官方","protocol":"anthropic","baseUrl":"https://api.anthropic.com","apiKey":"sk-…","model":"claude-sonnet-5","modelFast":"","webSearch":true,"temperature":0.7,"timeoutSeconds":30}],"activeId":"p1"}'
```

## POST /api/ai/test

连接测试。**优先用请求体里的表单配置**（未保存也能测），解析失败则回退已保存配置。测试请求固定 `maxTokens: 16`、`temperature: 0`、关思考关联网，超时取该服务商配置与 30 秒的较小值。

**返回值** `AiTestResult`：`{ ok, latencyMs, reply?, error? }`——`ok=true` 时 `reply` 为模型应答片段（≤120 字符）。

```bash
curl -X POST http://127.0.0.1:5175/api/ai/test \
  -H "Content-Type: application/json" \
  -d '{"enable":true,"providers":[{"id":"p1","name":"t","protocol":"anthropic","baseUrl":"https://api.anthropic.com","apiKey":"sk-…","model":"claude-sonnet-5","modelFast":"","webSearch":false,"temperature":0.7,"timeoutSeconds":30}],"activeId":"p1"}'
```

## POST /api/ai/chat

非流式对话入口（始终使用已保存配置）。

| Body 字段 | 类型 | 必填 | 说明 |
|-----------|------|------|------|
| `messages` | `{ role: system/user/assistant, content }[]` | 是 | 完整消息列表，单条 ≤200k 字符 |
| `maxTokens` | `number` | 否 | 16–16384 |
| `fast` | `boolean` | 否 | `true` 走轻量模型（未配置回退主模型）并关思考 |

**返回值** `AiChatResult`：`{ content, model, promptTokens?, completionTokens?, searchUsed? }`。

```bash
curl -X POST http://127.0.0.1:5175/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"用一句话介绍 Markdown"}],"fast":true}'
```

## POST /api/ai/edit

单指令改写：服务端固定 system（Markdown 写作助手，只输出结果），不暴露 system 定制。

| Body 字段 | 类型 | 必填 | 说明 |
|-----------|------|------|------|
| `instruction` | `string` | 是 | 改写指令，≤2000 字符 |
| `text` | `string` | 是 | 待改写文本，≤100k 字符 |
| `maxTokens` | `number` | 否 | 默认 4096 |

**返回值** 同 `AiChatResult`。

```bash
curl -X POST http://127.0.0.1:5175/api/ai/edit \
  -H "Content-Type: application/json" \
  -d '{"instruction":"润色：保留原意，只输出结果","text":"这算一个测试文本"}'
```

## 流式接口（SSE） {#流式接口}

`edit-stream` 与 `chat-stream` 共用同一套流式转发协议：

- 响应 `Content-Type: text/event-stream`，每帧一行 `data: <JSON>`（非标准 SSE 的多行 event）
- 帧类型：`{ "type": "thinking", "text": "…" }`（思考增量）、`{ "type": "text", "text": "…" }`（正文增量）、`{ "type": "done", "content": "全文", "model": "…", "completionTokens": n }`、`{ "type": "error", "message": "…" }`
- **客户端断开连接即中止上游请求**（这是唯一的停止手段）
- 超时按「无输出闲置」计（时长 = 当前服务商 `timeoutSeconds`），长文生成不受总时长限制

### POST /api/ai/edit-stream

流式改写，请求体与 `edit` 完全一致（`maxTokens` 默认 4096）。

```bash
curl -N -X POST http://127.0.0.1:5175/api/ai/edit-stream \
  -H "Content-Type: application/json" \
  -d '{"instruction":"续写这篇文章","text":"正文…"}'
```

### POST /api/ai/chat-stream

流式多轮对话。

| Body 字段 | 类型 | 必填 | 说明 |
|-----------|------|------|------|
| `messages` | `{ role: user/assistant, content }[]` | 是 | 1–40 条（system 不在此列） |
| `system` | `string` | 否 | 系统提示，独立传输，≤10k 字符 |
| `maxTokens` | `number` | 否 | 默认 8192 |

## POST /api/ai/commit-message

AI 提交信息生成。**永不抛错阻断**：AI 未启用时回退启发式并标记 `source`。

| Body 字段 | 类型 | 必填 | 默认 | 说明 |
|-----------|------|------|------|------|
| `repo` | `"content" \| "theme"` | 否 | `content` | 按哪个仓的变更生成 |

**返回值** `{ message, source: "ai" \| "heuristic" }`——AI 输出必须通过 `type(scope): ≤30 字` 格式校验才采用，否则自动回退按变更内容生成。

```bash
curl -X POST http://127.0.0.1:5175/api/ai/commit-message \
  -H "Content-Type: application/json" -d '{"repo":"content"}'
```

## POST /api/ai/timeline-draft

时间线事件起草。

| Body 字段 | 类型 | 必填 | 说明 |
|-----------|------|------|------|
| `mode` | `"note" \| "git"` | 是 | `note` 按描述起草；`git` 扫描三仓提交历史归纳 |
| `note` | `string` | mode=note 时必填 | 事件描述，≤500 字符 |
| `limit` | `number` | 否 | 1–5，生成条数上限 |
| `existing` | `{ title, date }[]` | 否 | 已收录事件（≤300 条），用于去重 |

**返回值** 草稿数组（strict JSON + zod 过滤，非法条目已剔除）。

```bash
curl -X POST http://127.0.0.1:5175/api/ai/timeline-draft \
  -H "Content-Type: application/json" \
  -d '{"mode":"note","note":"2025年6月上线了个人博客","limit":3}'
```

## POST /api/ai/music-search

音乐版权检索（联网优先；服务不支持联网时自动降级普通请求并标记）。

| Body 字段 | 类型 | 必填 | 说明 |
|-----------|------|------|------|
| `query` | `string` | 是 | 检索词，≤200 字符 |

**返回值** 候选数组，每项含 `title` / `artist?` / `license`（`freeCommercial`、`summary`、`evidence?`、`sourceUrl?`）/ `audioUrl?` / `coverUrl?`。

```bash
curl -X POST http://127.0.0.1:5175/api/ai/music-search \
  -H "Content-Type: application/json" -d '{"query":"安静的钢琴曲 免费商用"}'
```

## POST /api/ai/wallpaper-search

壁纸抓取（safebooru 图源直取）。**不走 AI、无启用门槛**，任何时刻可调。

| Body 字段 | 类型 | 必填 | 说明 |
|-----------|------|------|------|
| `query` | `string` | 否 | 检索词，默认空（随机） |
| `target` | `"desktop" \| "mobile"` | 是 | 尺寸目标：桌面取 ≥1920 横图、移动取 ≥1920 竖图 |

**返回值** `WallpaperCandidate[]`（凑满一批）：`{ imageUrl, previewUrl?, width?, height? }`。

```bash
curl -X POST http://127.0.0.1:5175/api/ai/wallpaper-search \
  -H "Content-Type: application/json" -d '{"query":"星空","target":"desktop"}'
```
