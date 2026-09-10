---
title: 簡書匯入
description: /api/import/jianshu/* 匯出包工作階段、背景匯入任務、單篇貼上轉換與 AI 元資訊建議的介面參考。
---

# 簡書匯入

簡書遷移的兩組介面：**匯出包流程**（工作階段制：上傳 → 清單 → 預覽 → 背景任務）與**單篇貼上流程**（無工作階段，即貼即轉）。

工作階段與任務都保存在**伺服端記憶體**：工作階段有效期 24 小時、最多 3 個（LRU 淘汰），任務結果保留 1 小時，服務重啟即清空——已匯入文章不受影響（早已落倉）。

## POST /api/import/jianshu/archive

上傳簡書匯出包（multipart）。

| 表單欄位 | 必填 | 說明 |
|----------|------|------|
| `file` | 是 | rar / zip 壓縮包，≤30MB |

**副作用**：記憶體解包並解析（不落盤）。**回傳值** `JianshuArchiveSummary`：

```json
{
  "sessionId": "s-xxxx",
  "notebooks": [{ "name": "技术随笔", "articles": [{ "id": "技术随笔/a.md", "title": "标题", "bytes": 8213 }] }],
  "total": 42,
  "importedIds": ["技术随笔/a.md"]
}
```

`id` 為工作階段內唯一標識（正規化包內路徑）；根級散文歸入「未分组」。

```bash
curl -X POST http://127.0.0.1:5175/api/import/jianshu/archive \
  -F "file=@jianshu-export.zip"
```

## GET /api/import/jianshu/preview

單篇轉換預覽，**不落盤**，圖片保持遠端連結。

| Query 參數 | 必填 | 說明 |
|------------|------|------|
| `sessionId` | 是 | 上一步返回的工作階段 id |
| `id` | 是 | 文章 id |

**回傳值** `JianshuPreview`：`{ title, markdown, imageCount, wordCount }`——`wordCount` 為內文純文字字數（過少說明可能只剩佔位內容）。

```bash
curl "http://127.0.0.1:5175/api/import/jianshu/preview?sessionId=s-xxxx&id=技术随笔/a.md"
```

## POST /api/import/jianshu/run

啟動**背景匯入任務**，立即返回後輪詢進度。

| Body 欄位 | 型別 | 必填 | 說明 |
|-----------|------|------|------|
| `sessionId` | `string` | 是 | 工作階段 id |
| `ids` | `string[]` | 是 | 要匯入的文章 id，1–2000 條 |
| `options.published` | `string` | 是 | 統一發布日期 `YYYY-MM-DD`（匯出包不含日期） |
| `options.categoryFromNotebook` | `boolean` | 是 | 文集名作分類 |
| `options.category` | `string` | 否 | 不按文集時的統一分類（≤40 字元） |
| `options.tags` | `string[]` | 是 | 統一標籤（≤12 個，單個 ≤30 字元） |
| `options.localizeImages` | `boolean` | 是 | 圖片下載落倉（失敗的保留遠端連結） |
| `options.draft` | `boolean` | 是 | 匯入為草稿 |

**回傳值** `{ jobId }`。**副作用**：逐篇寫 `content/posts/<slug>/index.md`、下載圖片。

```bash
curl -X POST http://127.0.0.1:5175/api/import/jianshu/run \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"s-xxxx","ids":["技术随笔/a.md"],"options":{"published":"2026-09-10","categoryFromNotebook":true,"tags":["簡書遷移"],"localizeImages":true,"draft":true}}'
```

## GET /api/import/jianshu/job

輪詢任務進度（建議 2 秒間隔）。

| Query 參數 | 必填 | 說明 |
|------------|------|------|
| `id` | 是 | 任務 id |

**回傳值** `JianshuImportJob`：`{ id, sessionId, status: "running" | "done", total, done, current, results, log }`。`results` 每項 `{ id, title, ok, path?, error?, images }`；`log` 保留末尾 200 條。

```bash
curl "http://127.0.0.1:5175/api/import/jianshu/job?id=job-xxxx"
```

## DELETE /api/import/jianshu/session

丟棄工作階段（清空包內快取）。任務執行中會被拒絕。

| Query 參數 | 必填 | 說明 |
|------------|------|------|
| `id` | 是 | 工作階段 id |

**回傳值** `{ ok: boolean }`。

```bash
curl -X DELETE "http://127.0.0.1:5175/api/import/jianshu/session?id=s-xxxx"
```

## POST /api/import/jianshu/paste-preview

單篇貼上**轉換預覽**（不落盤）。三種載荷至少一個非空，各 ≤2MB；解析優先級：**markdown（編輯器定稿）> html（富文本）> text（純文字按 Markdown 兜底）**。

| Body 欄位 | 型別 | 必填 | 說明 |
|-----------|------|------|------|
| `markdown` | `string` | 三選一 | 編輯器定稿，優先採用 |
| `html` | `string` | 三選一 | 富文本（網頁複製），轉 Markdown |
| `text` | `string` | 三選一 | 純文字兜底 |

**回傳值** 同 `JianshuPreview`。

```bash
curl -X POST http://127.0.0.1:5175/api/import/jianshu/paste-preview \
  -H "Content-Type: application/json" \
  -d '{"html":"<h1>標題</h1><p>段落</p>"}'
```

## POST /api/import/jianshu/paste-run

單篇貼上**落倉**：圖片自動下載到文章目錄（失敗的保留遠端連結）。

Body = 貼上載荷（同上）+ `options`：

| 欄位 | 約束 |
|------|------|
| `title` | 必填，1–100 字元 |
| `published` | 必填，`YYYY-MM-DD` |
| `category` | 選填，≤40 字元 |
| `tags` | ≤12 個，單個 ≤30 字元 |
| `draft` | boolean |

**回傳值** `JianshuPasteResult`：`{ title, path, slug, images, failedImages[] }`——`images` 為成功本地化數，`failedImages` 為保留遠端連結的圖片。

```bash
curl -X POST http://127.0.0.1:5175/api/import/jianshu/paste-run \
  -H "Content-Type: application/json" \
  -d '{"markdown":"# 標題\n正文","options":{"title":"標題","published":"2026-09-10","tags":[],"draft":true}}'
```

## POST /api/import/jianshu/suggest-meta

AI 分析內文，補充元資訊（未啟用/失敗自動回退內文摘要，`aiUsed=false`）。

| Body 欄位 | 型別 | 必填 | 說明 |
|-----------|------|------|------|
| `title` | `string` | 否 | 留空 = 讓 AI 一併擬定標題，≤100 字元 |
| `markdown` | `string` | 是 | 內文，1–2MB |

**回傳值** `JianshuMetaSuggestion`：`{ title?, description, category, tags[], aiUsed }`。

```bash
curl -X POST http://127.0.0.1:5175/api/import/jianshu/suggest-meta \
  -H "Content-Type: application/json" \
  -d '{"title":"","markdown":"# 我的部落格搭建記\n…"}'
```
