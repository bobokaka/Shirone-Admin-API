---
title: 媒體上傳
description: /api/media/* 全部上傳介面參考——文章配圖、說說圖、站點圖、資料封面與音樂音訊，含各 target/kind 的落盤目錄映射。
---

# 媒體上傳

媒體模組處理一切二進位檔案落倉。全部上傳介面為 **multipart 表單**，一次一個檔案，單檔案 ≤30MB；圖片副檔名白名單 `webp / png / jpg / jpeg / gif / avif`（favicon 額外允許 `ico / svg`）。

各介面落盤目錄（均在內容倉內）：

| 場景 | 目錄 |
|------|------|
| 文章配圖 | `content/posts/<slug>/images/` |
| 說說圖 | `public/images/moments/<批次>/` |
| 橫幅（桌面/行動） | `assets/images/banner/desktop/`、`assets/images/banner/mobile/` |
| 頭像 | `assets/images/avatar/` |
| 頁尾圖片 | `public/images/footer/` |
| favicon | `public/favicon/` |
| 資料封面 | 按 kind 見[下表](#post-api-media-data-cover) |
| 歌曲音訊 | `public/assets/music/url/` |

## POST /api/media/post-image

文章配圖上傳，存入指定文章目錄的 `images/`。

| 表單欄位 | 必填 | 說明 |
|----------|------|------|
| `file` | 是 | 圖片檔案 |
| `slug` | 是 | 文章 slug（決定落盤目錄） |

**回傳值** `MediaUploadResult`：`{ src, fileName }`——`src` 為 frontmatter / 內文引用路徑（相對路徑 `./images/<name>`），直接拼進 Markdown 即可。

```bash
curl -X POST http://127.0.0.1:5175/api/media/post-image \
  -F "slug=hello" -F "file=@cover.webp"
```

## POST /api/media/moment-image

說說圖上傳，存入 `public/images/moments/<批次>/`。批次目錄規則由主題縮圖管線決定，**不可繞過**。

| 表單欄位 | 必填 | 說明 |
|----------|------|------|
| `file` | 是 | 圖片檔案 |
| `batchId` | 否 | 批次目錄名（`[\w-]+`，如 `20260910-103000`）；預設由伺服端按目前時間生成 |

**回傳值** `MediaUploadResult`：`{ src, fileName, batchId? }`——`src` 為站點絕對路徑（`/images/moments/<批次>/<name>`），回傳的 `batchId` 歸批時繼續複用。

```bash
curl -X POST http://127.0.0.1:5175/api/media/moment-image \
  -F "batchId=20260910-103000" -F "file=@photo.webp"
```

## GET /api/media/site-images

站點圖片託管目錄清單（頁尾圖片庫等場景）。

| Query 參數 | 必填 | 說明 |
|------------|------|------|
| `target` | 是 | 目錄標識，1–40 字元（如 `footer`） |

**回傳值** `SiteMediaResult[]`：每項 `{ src, previewUrl, fileName }`。

```bash
curl "http://127.0.0.1:5175/api/media/site-images?target=footer"
```

## POST /api/media/site-image

站點圖片上傳（multipart）。

| 表單欄位 | 必填 | 說明 |
|----------|------|------|
| `file` | 是 | 圖片檔案 |
| `target` | 是 | `banner-desktop` / `banner-mobile` / `avatar` / `footer` / `favicon` |
| `name` | 否 | 固定檔名（favicon 槽位替換用，如 `favicon-light`） |
| `currentSrc` | 否 | 欄位目前值；指向同目標託管目錄時**原位替換**舊檔案（頭像更新即如此） |

**回傳值** `SiteMediaResult`：`src` 為寫進 YAML 的路徑、`previewUrl` 為後台預覽直鏈。

```bash
curl -X POST http://127.0.0.1:5175/api/media/site-image \
  -F "target=avatar" -F "currentSrc=assets/images/avatar/old.webp" -F "file=@me.webp"
```

## POST /api/media/site-image-import

站點圖片**遠端直鏈匯入**：伺服端代為下載（繞過瀏覽器跨來源限制）後走 site-image 落倉；webp 自動轉換為 png/jpg（主題相容性）。

| Body 欄位 | 型別 | 必填 | 說明 |
|-----------|------|------|------|
| `target` | `string` | 是 | 同 site-image |
| `url` | `string` | 是 | 公網 http(s) 直鏈，≤2000 字元 |
| `name` | `string` | 否 | 指定檔名 |
| `currentSrc` | `string` | 否 | 原位替換目標 |

**回傳值** 同 `SiteMediaResult`。

```bash
curl -X POST http://127.0.0.1:5175/api/media/site-image-import \
  -H "Content-Type: application/json" \
  -d '{"target":"footer","url":"https://example.com/badge.png"}'
```

## POST /api/media/data-cover

結構化資料封面上傳（multipart）。kind 決定落盤目錄：

| `kind` | 目錄 |
|--------|------|
| `anime` | `public/assets/anime/` |
| `projects` | `public/assets/projects/` |
| `devices` | `public/images/devices/` |
| `friends` | `public/images/friends/` |
| `music` | `assets/images/music/` |

| 表單欄位 | 必填 | 說明 |
|----------|------|------|
| `file` | 是 | 圖片檔案 |
| `kind` | 是 | 上表五選一 |
| `path` | 否 | 目前條目的封面路徑；命中同目錄時**原位覆蓋**（替換圖片不殘留舊檔案） |

**回傳值** `MediaUploadResult`。

```bash
curl -X POST http://127.0.0.1:5175/api/media/data-cover \
  -F "kind=anime" -F "file=@cover.webp"
```

## POST /api/media/data-cover-import

資料封面遠端直鏈匯入（AI 檢索出的 CDN 封面等場景），kind 與目錄同上。

| Body 欄位 | 型別 | 必填 | 說明 |
|-----------|------|------|------|
| `kind` | `string` | 是 | 五選一列舉 |
| `url` | `string` | 是 | 直鏈，≤2000 字元 |
| `title` | `string` | 否 | 用於生成可讀檔名 |
| `currentPath` | `string` | 否 | 原位覆蓋目標 |

```bash
curl -X POST http://127.0.0.1:5175/api/media/data-cover-import \
  -H "Content-Type: application/json" \
  -d '{"kind":"music","url":"https://cdn.example.com/track-cover.jpg","title":"晴天"}'
```

## POST /api/media/music-audio

歌曲音訊本地上傳（multipart）→ `public/assets/music/url/`。

| 表單欄位 | 必填 | 說明 |
|----------|------|------|
| `file` | 是 | 音訊檔案 |
| `currentSrc` | 否 | 原位替換目標 |

```bash
curl -X POST http://127.0.0.1:5175/api/media/music-audio \
  -F "file=@song.mp3"
```

## POST /api/media/music-download

歌曲音訊**遠端直鏈**伺服端拉取落盤（瀏覽器跨來源拿不到的也能下）。

| Body 欄位 | 型別 | 必填 | 說明 |
|-----------|------|------|------|
| `url` | `string` | 是 | 音訊直鏈，≤2000 字元 |
| `filename` | `string` | 否 | 指定檔名 |
| `currentPath` | `string` | 否 | 原位替換目標 |

```bash
curl -X POST http://127.0.0.1:5175/api/media/music-download \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com/song.mp3"}'
```
