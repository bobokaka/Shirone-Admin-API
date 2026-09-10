---
title: 系統與預覽
description: /api/status 連接狀態探測與 /api/preview/* 真站預覽行程管理的介面參考。
---

# 系統與預覽

系統模組回答兩個問題：**工作區連接是否正常**、**部落格前台 dev server 是否在跑**。管理後台頂欄的連接標籤與各頁的真站預覽面板即由這組介面驅動。

## GET /api/status

探測工作區狀態。無參數，永不出錯（內部失敗的欄位返回 `null`/`false`）。

**回傳值** `SystemStatus`：

| 欄位 | 型別 | 說明 |
|------|------|------|
| `contentDir` / `themeDir` | `string` | 解析後的內容倉 / 主題倉絕對路徑（來源：`.env` 或預設相對位置） |
| `contentConnected` | `boolean` | 內容倉目錄下存在 `content/` 即為 `true` |
| `themeConnected` | `boolean` | 主題倉存在 `scripts/content/sync.mjs` 即為 `true` |
| `themeDepsInstalled` | `boolean` | 主題倉 `node_modules` 存在（決定能否本地驗證） |
| `git` | `GitStatus \| null` | 內容倉 git 概要；非 git 倉時 `null` |

`GitStatus`：`branch`、`ahead`、`behind`、`staged[]`、`modified[]`、`untracked[]`（檔案相對路徑清單）。

```bash
curl http://127.0.0.1:5175/api/status
```

```json
{
  "contentDir": "D:\\blogs\\Shirone-Content",
  "themeDir": "D:\\blogs\\Shirone",
  "contentConnected": true,
  "themeConnected": true,
  "themeDepsInstalled": true,
  "git": { "branch": "main", "ahead": 0, "behind": 0, "staged": [], "modified": [], "untracked": [] }
}
```

## POST /api/preview/start

拉起真站預覽行程：在主題倉啟動 `content:watch`（內容監聽同步）與 `astro dev`（:4321）。已在運行時直接返回「已在运行」。**副作用**：建立兩個背景行程樹；Windows 下透過 `cmd /c` 啟動，服務退出時以 `taskkill` 連樹回收。

```bash
curl -X POST http://127.0.0.1:5175/api/preview/start
```

```json
{ "started": true, "message": "真站预览已启动，首次启动需等待依赖编译" }
```

`ready` 與否請以輪詢 `/api/preview/status` 為準（首次需編譯，就緒晚於啟動）。

## POST /api/preview/stop

終止預覽行程樹。**副作用**：殺掉由 start 啟動的全部子行程；若 dev server 來自其他來源（如一鍵啟動腳本），不在回收範圍。

```bash
curl -X POST http://127.0.0.1:5175/api/preview/stop
```

返回 `{ "stopped": true }`。

## GET /api/preview/status

查詢預覽狀態，前端 3 秒輪詢一次。

```bash
curl http://127.0.0.1:5175/api/preview/status
```

```json
{ "running": true, "ready": true, "procs": ["node content-watch.mjs", "astro dev"] }
```

| 欄位 | 說明 |
|------|------|
| `running` | 本服務管理的預覽行程在跑 |
| `ready` | `http://localhost:4321/` 實際可達（任何來源的 dev server 均可） |
| `procs` | 行程描述清單 |
