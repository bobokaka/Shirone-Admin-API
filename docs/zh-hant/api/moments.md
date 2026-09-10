---
title: 說說
description: /api/moments 說說 CRUD 的介面參考——發布、更新、刪除動態。
---

# 說說

說說模組操作內容倉 `content/moments/`，每條一個 Markdown 檔案，檔名即 id：`<yyyymmdd-HHmmss>.md`。清單按時間倒序。

## MomentMeta 結構

清單與詳情共用的元資訊：

| 欄位 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 檔名去 `.md`，如 `20260906-183000` |
| `path` | `string` | 相對路徑 |
| `published` | `string` | `YYYY-MM-DD HH:mm:ss` |
| `pinned` / `draft` | `boolean` | 置頂 / 草稿 |
| `location` | `string` | 地點 |
| `mood` | `string` | 心情 Iconify 圖示名（空字串表示未選） |
| `tags` | `string[]` | 標籤 |
| `images` | `{ src, alt }[]` | 配圖，`src` 為站點路徑 |
| `body` | `string` | 內文文字（清單即含） |

## GET /api/moments

全量清單，無參數。

```bash
curl http://127.0.0.1:5175/api/moments
```

## GET /api/moments/detail

| Query 參數 | 必填 | 說明 |
|------------|------|------|
| `path` | 是 | 說說相對路徑 |

**回傳值** `MomentFile`：`{ meta: MomentMeta, body: string }`。

```bash
curl "http://127.0.0.1:5175/api/moments/detail?path=20260906-183000.md"
```

## POST /api/moments

新建說說。**副作用**：寫入 `content/moments/<發布時間戳>.md`；`images` 引用的檔案應已透過[說說圖上傳](./media.md#post-api-media-moment-image)落倉。

| Body 欄位 | 型別 | 必填 | 預設 | 說明 |
|-----------|------|------|------|------|
| `published` | `string` | 是 | — | `YYYY-MM-DD HH:mm:ss`，決定檔名 |
| `body` | `string` | 否 | `""` | 內文 |
| `location` | `string` | 否 | — | 地點 |
| `mood` | `string` | 否 | — | 心情圖示名 |
| `tags` | `string[]` | 否 | — | 標籤 |
| `images` | `{ src, alt? }[]` | 否 | — | 配圖清單 |
| `draft` / `pinned` | `boolean` | 否 | `false` | 草稿 / 置頂 |

**回傳值** 建立後的 `MomentMeta`。

```bash
curl -X POST http://127.0.0.1:5175/api/moments \
  -H "Content-Type: application/json" \
  -d '{"published":"2026-09-10 10:30:00","body":"第一條說說！","mood":"material-symbols:celebration","tags":["開始"]}'
```

## PUT /api/moments

更新說說，欄位同上，另加：

| Body 欄位 | 型別 | 必填 | 說明 |
|-----------|------|------|------|
| `path` | `string` | 是 | 目標說說路徑 |

未傳的選填欄位回落預設值（整體覆蓋語義），呼叫前先讀 detail 再改是最穩妥的模式（管理介面即如此）。

```bash
curl -X PUT http://127.0.0.1:5175/api/moments \
  -H "Content-Type: application/json" \
  -d '{"path":"20260906-183000.md","published":"2026-09-06 18:30:00","body":"改過了","pinned":true}'
```

## DELETE /api/moments

刪除說說（`.md` 檔案）。**配圖檔案不隨之刪除**，需要時手動清理 `public/images/moments/` 下對應批次目錄。

| Query 參數 | 必填 | 說明 |
|------------|------|------|
| `path` | 是 | 說說相對路徑 |

**回傳值** `{ "ok": true }`。

```bash
curl -X DELETE "http://127.0.0.1:5175/api/moments?path=20260906-183000.md"
```
