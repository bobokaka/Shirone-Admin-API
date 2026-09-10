---
title: 文章
description: /api/posts 文章 CRUD、/api/slug slug 建議與 /api/taxonomy/rename 分類標籤批次改寫的介面參考。
---

# 文章

文章模組直接操作內容倉 `content/posts/`。所有路徑參數為相對該目錄的 POSIX 風格路徑。清單**置頂優先、按發布日期倒序**。

## GET /api/posts

返回全量文章元資訊清單（不含內文）。

**回傳值** `PostMeta[]`，每項關鍵欄位：

| 欄位 | 型別 | 說明 |
|------|------|------|
| `slug` | `string` | 目錄名（目錄式）或檔名去 `.md` |
| `path` | `string` | 相對路徑，如 `hello/index.md` |
| `layout` | `"directory" \| "file"` | 目錄式 / 平鋪式 |
| `title` / `published` / `description` / `image` / `category` / `tags` | — | 元資訊，`published` 為 `YYYY-MM-DD` |
| `publishedAt` / `updated` / `updatedAt` | `string?` | 精確時間與更新時間 |
| `pinned` / `draft` / `comment` / `encrypted` / `hideHomeContent` | `boolean` | 開關 |
| `hasPassword` | `boolean` | 是否已設密碼（**永不回傳密碼本身**） |
| `passwordHint` | `string` | 密碼提示 |
| `alias` / `permalink` | `string?` | 自訂存取路徑 |

```bash
curl http://127.0.0.1:5175/api/posts
```

## GET /api/posts/detail

讀取單篇完整內容。

| Query 參數 | 必填 | 說明 |
|------------|------|------|
| `path` | 是 | 文章相對路徑 |

**回傳值** `PostFile`：`{ meta: PostMeta, body: string }`。路徑不存在時 `404`。

```bash
curl "http://127.0.0.1:5175/api/posts/detail?path=hello/index.md"
```

## POST /api/posts

新建文章（**草稿狀態**）。目錄式落盤為 `content/posts/<slug>/index.md`。

| Body 欄位 | 型別 | 必填 | 預設 | 說明 |
|-----------|------|------|------|------|
| `title` | `string` | 是 | — | 標題，不能為空 |
| `slug` | `string` | 否 | 由標題拼音轉寫 | 自訂目錄名；非法字元自動清洗、重名去重 |

**回傳值** `PostFile`（新建後的文章）。**副作用**：在內容倉建立目錄與 `index.md`；`slug` 未傳時按現有文章去重。

```bash
curl -X POST http://127.0.0.1:5175/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"我的第一篇文章"}'
```

## PUT /api/posts

儲存文章。frontmatter **合併寫回**：只更新 `meta` 裡出現的鍵，內文整體替換；序列化保證 `published` 等日期格式不變。

| Body 欄位 | 型別 | 必填 | 預設 | 說明 |
|-----------|------|------|------|------|
| `path` | `string` | 是 | — | 目標文章路徑 |
| `body` | `string` | 否 | `""` | 內文全文（整體替換） |
| `meta` | `object` | 否 | `{}` | 要更新的 frontmatter 鍵值；`alias`/`permalink` 傳空字串即清除該鍵 |
| `password` | `string` | 否 | — | **僅設定/修改密碼時傳**；不傳保留原值 |
| `clearPassword` | `boolean` | 否 | — | `true` 時清除密碼（如取消加密） |

**回傳值** 儲存後的 `PostFile`。

```bash
curl -X PUT http://127.0.0.1:5175/api/posts \
  -H "Content-Type: application/json" \
  -d '{"path":"hello/index.md","meta":{"draft":false},"body":"# 你好\n\n內文。"}'
```

## DELETE /api/posts

刪除文章。目錄式文章限刪 `slug` 頂層（整個目錄連同配圖），平鋪式刪單檔案。

| Query 參數 | 必填 | 說明 |
|------------|------|------|
| `path` | 是 | 文章相對路徑 |

**回傳值** `{ "ok": true }`。

```bash
curl -X DELETE "http://127.0.0.1:5175/api/posts?path=hello/index.md"
```

## POST /api/slug

生成或清洗 slug（標題經拼音轉寫、非法字元替換、與現有文章去重）。

| Body 欄位 | 型別 | 必填 | 說明 |
|-----------|------|------|------|
| `title` | `string` | 否（預設 `""`） | 標題；僅在**不傳 `slug`** 時用於生成 |
| `slug` | `string` | 否 | 傳入則只做清洗，不生成 |

**回傳值** `SlugSuggestion`：`{ slug: string, adjusted: boolean, note?: string }`——`adjusted=true` 表示發生替換或去重，`note` 給出原因。

```bash
curl -X POST http://127.0.0.1:5175/api/slug \
  -H "Content-Type: application/json" \
  -d '{"title":"快速上手指南"}'
```

## POST /api/taxonomy/rename

分類/標籤批次重新命名：改寫**所有命中文章**的 frontmatter。目標名已存在即合併；`to` 傳空字串 = 從所有文章中移除。

| Body 欄位 | 型別 | 必填 | 說明 |
|-----------|------|------|------|
| `kind` | `"category" \| "tag"` | 是 | 改分類還是標籤 |
| `from` | `string` | 是 | 原名（不能為空） |
| `to` | `string` | 是 | 目標名；空字串 = 移除 |

**回傳值** `{ changed, kind, from, to }`——`changed` 為改寫到的文章數。**副作用**：逐篇改寫檔案（標籤場景自動去重），日期欄位格式保持不變。

```bash
curl -X POST http://127.0.0.1:5175/api/taxonomy/rename \
  -H "Content-Type: application/json" \
  -d '{"kind":"tag","from":"JS","to":"JavaScript"}'
```
