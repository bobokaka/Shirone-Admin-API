---
title: 結構化資料
description: /api/data/:kind 八類結構化資料的讀寫，與 /api/bangumi/* 番劇條目檢索及封面匯入的介面參考。
---

# 結構化資料

結構化資料模組讀寫內容倉 `data/*.ts`——檔案裡的 `interface`、註解、匯出陳述式**逐字保留**，只整體替換匯出的陣列字面值。讀取經 tsx 動態 import（帶 mtime query 繞過快取），列舉欄位儲存前驗證。

## kind 與檔案映射

路徑參數 `kind` 八選一：

| `kind` | 檔案 | 匯出陣列 | 條目 |
|--------|------|----------|------|
| `projects` | `data/projects.ts` | `projectsData` | 專案 |
| `skills` | `data/skills.ts` | `skillsData` | 技能 |
| `timeline` | `data/timeline.ts` | `timelineData` | 時間線事件 |
| `devices` | `data/devices.ts` | `devicesData` | 設備 |
| `anime` | `data/anime.ts` | `animeData` | 番劇 |
| `compass` | `data/compass.ts` | `compassData` | 羅盤書架 |
| `music` | `data/music.ts` | `musicTracks` | 歌單曲目 |
| `friends` | `data/friends.ts` | `friendsData` | 友鏈 |

## GET /api/data/:kind

**回傳值** `{ kind, items: DataItem[] }`——`DataItem` 為弱型別物件（欄位結構見各檔案 interface，或[指南 · 結構化資料](../guide/data.md#八類資料)的欄位表）。

```bash
curl http://127.0.0.1:5175/api/data/friends
```

## PUT /api/data/:kind

**整體替換**該類資料的全部條目。

| Body 欄位 | 型別 | 必填 | 說明 |
|-----------|------|------|------|
| `items` | `object[]` | 是 | 全量條目（先 GET 再改再 PUT，勿只傳增量） |

**回傳值** `{ ok: true, changed }`。**副作用**：寫回 `data/*.ts` 的陣列區間；檔案其餘部分不動。

```bash
curl -X PUT http://127.0.0.1:5175/api/data/skills \
  -H "Content-Type: application/json" \
  -d '{"items":[{"name":"TypeScript","category":"frontend","level":"advanced","enable":true}]}'
```

---

# Bangumi 番劇檢索

番劇匯入的三件套，資料來自 Bangumi 公開 API，用於番劇條目的搜尋補全。

## GET /api/bangumi/search

| Query 參數 | 必填 | 說明 |
|------------|------|------|
| `keyword` | 是 | 關鍵詞，1–100 字元（固定檢索動畫類型條目） |

**回傳值** `{ candidates: BangumiCandidate[] }`——每項含 `id`（Bangumi subject id）、`title` / `originalTitle`、`year`、`cover?`、`summary`、`eps`、`bangumiScore?`、`link`。

```bash
curl "http://127.0.0.1:5175/api/bangumi/search?keyword=葬送的芙莉莲"
```

## GET /api/bangumi/subject

| Query 參數 | 必填 | 說明 |
|------------|------|------|
| `id` | 是 | Bangumi subject id（正整數，字串亦可） |

**回傳值** `BangumiDetail`：在 Candidate 基礎上補全 `studio?`（製作公司）、`period?`（放送檔期 `{ start, end? }`）、`genres[]`（高頻類型標籤 ≤4 個）。

```bash
curl "http://127.0.0.1:5175/api/bangumi/subject?id=463652"
```

## POST /api/bangumi/cover-import

封面圖匯入：伺服端從 Bangumi 圖床下載，以條目標題命名落倉到 `public/assets/anime/`。

| Body 欄位 | 型別 | 必填 | 說明 |
|-----------|------|------|------|
| `url` | `string` | 是 | 封面直鏈。**白名單驗證**：僅接受 `lain.bgm.tv` / `api.bgm.tv` / `bgm.tv` / `bangumi.tv` / `ei.hdslb.com`，其餘 400 |
| `title` | `string` | 是 | 條目標題（1–200 字元，用於命名） |
| `currentPath` | `string` | 否 | 命中同目錄時原位替換 |

**回傳值** `MediaUploadResult`。

```bash
curl -X POST http://127.0.0.1:5175/api/bangumi/cover-import \
  -H "Content-Type: application/json" \
  -d '{"url":"https://lain.bgm.tv/pic/cover/l/xx.jpg","title":"葬送的芙莉莲"}'
```
