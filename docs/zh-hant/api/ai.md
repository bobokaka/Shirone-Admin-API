---
title: AI 服務
description: /api/ai/* 服務商設定、對話與串流改寫（SSE）、提交訊息生成、時間線起草、音樂檢索與桌布抓取的介面參考。
---

# AI 服務

AI 模組涵蓋設定管理與所有 AI 工作流。除桌布抓取外，**全部介面要求 AI 已啟用**（總開關開 + 目前服務商設定完整），否則返回 `400`「AI 助手未启用…」。

設定持久化在本機 `server/data/ai-settings.json`（gitignore），與內容倉完全隔離。

## GET /api/ai/settings

**回傳值** `AiSettings`：

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

`protocol` 二選一：`anthropic`（v1/messages，預設）/ `openai`（chat/completions）。`modelFast` 留空表示輕量任務同主模型。

```bash
curl http://127.0.0.1:5175/api/ai/settings
```

## PUT /api/ai/settings

儲存設定。Body 為完整 `AiSettings`：`enable`（boolean）、`providers`（1–20 套，欄位約束：`temperature` 0–2 預設 0.7、`timeoutSeconds` 5–86400 預設 30、`webSearch` 預設 true）、`activeId`（必須指向 providers 中一項）。**啟用狀態下**目前服務商必須已填完整（位址 http(s) 開頭、Key、模型名），否則 400。

**回傳值** 正規化並儲存後的 `AiSettings`（相容舊版扁平結構，讀取時自動遷移）。

```bash
curl -X PUT http://127.0.0.1:5175/api/ai/settings \
  -H "Content-Type: application/json" \
  -d '{"enable":true,"providers":[{"id":"p1","name":"官方","protocol":"anthropic","baseUrl":"https://api.anthropic.com","apiKey":"sk-…","model":"claude-sonnet-5","modelFast":"","webSearch":true,"temperature":0.7,"timeoutSeconds":30}],"activeId":"p1"}'
```

## POST /api/ai/test

連線測試。**優先用請求主體裡的表單設定**（未儲存也能測），解析失敗則回退已儲存設定。測試請求固定 `maxTokens: 16`、`temperature: 0`、關思考關聯網，超時取該服務商設定與 30 秒的較小值。

**回傳值** `AiTestResult`：`{ ok, latencyMs, reply?, error? }`——`ok=true` 時 `reply` 為模型應答片段（≤120 字元）。

```bash
curl -X POST http://127.0.0.1:5175/api/ai/test \
  -H "Content-Type: application/json" \
  -d '{"enable":true,"providers":[{"id":"p1","name":"t","protocol":"anthropic","baseUrl":"https://api.anthropic.com","apiKey":"sk-…","model":"claude-sonnet-5","modelFast":"","webSearch":false,"temperature":0.7,"timeoutSeconds":30}],"activeId":"p1"}'
```

## POST /api/ai/chat

非串流對話入口（始終使用已儲存設定）。

| Body 欄位 | 型別 | 必填 | 說明 |
|-----------|------|------|------|
| `messages` | `{ role: system/user/assistant, content }[]` | 是 | 完整訊息清單，單條 ≤200k 字元 |
| `maxTokens` | `number` | 否 | 16–16384 |
| `fast` | `boolean` | 否 | `true` 走輕量模型（未設定回退主模型）並關思考 |

**回傳值** `AiChatResult`：`{ content, model, promptTokens?, completionTokens?, searchUsed? }`。

```bash
curl -X POST http://127.0.0.1:5175/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"用一句話介紹 Markdown"}],"fast":true}'
```

## POST /api/ai/edit

單指令改寫：伺服端固定 system（Markdown 寫作助手，只輸出結果），不暴露 system 客製化。

| Body 欄位 | 型別 | 必填 | 說明 |
|-----------|------|------|------|
| `instruction` | `string` | 是 | 改寫指令，≤2000 字元 |
| `text` | `string` | 是 | 待改寫文字，≤100k 字元 |
| `maxTokens` | `number` | 否 | 預設 4096 |

**回傳值** 同 `AiChatResult`。

```bash
curl -X POST http://127.0.0.1:5175/api/ai/edit \
  -H "Content-Type: application/json" \
  -d '{"instruction":"潤色：保留原意，只輸出結果","text":"這算一個測試文本"}'
```

## 串流介面（SSE） {#串流介面}

`edit-stream` 與 `chat-stream` 共用同一套串流轉發協定：

- 回應 `Content-Type: text/event-stream`，每幀一行 `data: <JSON>`（非標準 SSE 的多行 event）
- 幀類型：`{ "type": "thinking", "text": "…" }`（思考增量）、`{ "type": "text", "text": "…" }`（內文增量）、`{ "type": "done", "content": "全文", "model": "…", "completionTokens": n }`、`{ "type": "error", "message": "…" }`
- **用戶端斷開連線即中止上游請求**（這是唯一的停止手段）
- 超時按「無輸出閒置」計（時長 = 目前服務商 `timeoutSeconds`），長文生成不受總時長限制

### POST /api/ai/edit-stream

串流改寫，請求主體與 `edit` 完全一致（`maxTokens` 預設 4096）。

```bash
curl -N -X POST http://127.0.0.1:5175/api/ai/edit-stream \
  -H "Content-Type: application/json" \
  -d '{"instruction":"續寫這篇文章","text":"內文…"}'
```

### POST /api/ai/chat-stream

串流多輪對話。

| Body 欄位 | 型別 | 必填 | 說明 |
|-----------|------|------|------|
| `messages` | `{ role: user/assistant, content }[]` | 是 | 1–40 條（system 不在此列） |
| `system` | `string` | 否 | 系統提示，獨立傳輸，≤10k 字元 |
| `maxTokens` | `number` | 否 | 預設 8192 |

## POST /api/ai/commit-message

AI 提交訊息生成。**永不拋錯阻斷**：AI 未啟用時回退啟發式並標記 `source`。

| Body 欄位 | 型別 | 必填 | 預設 | 說明 |
|-----------|------|------|------|------|
| `repo` | `"content" \| "theme"` | 否 | `content` | 按哪個倉的變更生成 |

**回傳值** `{ message, source: "ai" \| "heuristic" }`——AI 輸出必須通過 `type(scope): ≤30 字` 格式驗證才採用，否則自動回退按變更內容生成。

```bash
curl -X POST http://127.0.0.1:5175/api/ai/commit-message \
  -H "Content-Type: application/json" -d '{"repo":"content"}'
```

## POST /api/ai/timeline-draft

時間線事件起草。

| Body 欄位 | 型別 | 必填 | 說明 |
|-----------|------|------|------|
| `mode` | `"note" \| "git"` | 是 | `note` 按描述起草；`git` 掃描三倉提交歷史歸納 |
| `note` | `string` | mode=note 時必填 | 事件描述，≤500 字元 |
| `limit` | `number` | 否 | 1–5，生成條數上限 |
| `existing` | `{ title, date }[]` | 否 | 已收錄事件（≤300 條），用於去重 |

**回傳值** 草稿陣列（strict JSON + zod 過濾，非法條目已剔除）。

```bash
curl -X POST http://127.0.0.1:5175/api/ai/timeline-draft \
  -H "Content-Type: application/json" \
  -d '{"mode":"note","note":"2025年6月上線了個人部落格","limit":3}'
```

## POST /api/ai/music-search

音樂版權檢索（網路優先；服務不支援連網時自動降級普通請求並標記）。

| Body 欄位 | 型別 | 必填 | 說明 |
|-----------|------|------|------|
| `query` | `string` | 是 | 檢索詞，≤200 字元 |

**回傳值** 候選陣列，每項含 `title` / `artist?` / `license`（`freeCommercial`、`summary`、`evidence?`、`sourceUrl?`）/ `audioUrl?` / `coverUrl?`。

```bash
curl -X POST http://127.0.0.1:5175/api/ai/music-search \
  -H "Content-Type: application/json" -d '{"query":"安靜的鋼琴曲 免費商用"}'
```

## POST /api/ai/wallpaper-search

桌布抓取（safebooru 圖源直取）。**不走 AI、無啟用門檻**，任何時刻可呼叫。

| Body 欄位 | 型別 | 必填 | 說明 |
|-----------|------|------|------|
| `query` | `string` | 否 | 檢索詞，預設空（隨機） |
| `target` | `"desktop" \| "mobile"` | 是 | 尺寸目標：桌面取 ≥1920 橫圖、行動取 ≥1920 豎圖 |

**回傳值** `WallpaperCandidate[]`（湊滿一批）：`{ imageUrl, previewUrl?, width?, height? }`。

```bash
curl -X POST http://127.0.0.1:5175/api/ai/wallpaper-search \
  -H "Content-Type: application/json" -d '{"query":"星空","target":"desktop"}'
```
