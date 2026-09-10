---
title: 發布與驗證
description: /api/publish/* 發布預覽、遠端探測、一鍵發布與 /api/validate dry-run 驗證的介面參考。
---

# 發布與驗證

發布模組封裝雙倉（內容倉 + 主題倉）的 git 操作。兩個倉庫**互不阻斷**，各自返回獨立的 `RepoPublishResult`。

## GET /api/publish/preview

發布頁首屏資料：兩倉變更明細、自動生成的提交訊息、最近提交與狀態。無參數。

**回傳值** `PublishPreview` 關鍵欄位：

| 欄位 | 說明 |
|------|------|
| `branch` / `ahead` / `behind` | 內容倉分支與領先/落後（本地快取值） |
| `changes` / `files` | 內容倉變更明細 `{ path, state: "new" \| "modified" }[]` 與檔案清單 |
| `message` | 內容倉自動提交訊息 |
| `themeChanges` / `themeFiles` / `themeMessage` / `themeStatus` / `themeRecent` | 主題倉對應資訊（未連接時 `themeStatus` 為 `null`） |
| `themeDepsInstalled` | 主題依賴是否安裝（決定能否本地驗證） |
| `recent` | 內容倉最近 20 條提交 `{ hash, date, subject }` |

```bash
curl http://127.0.0.1:5175/api/publish/preview
```

## POST /api/publish/probe

輕量遠端比對：`git ls-remote` 比對分支 tip，**不拉取任何程式碼/物件**。

| Body 欄位 | 型別 | 必填 | 說明 |
|-----------|------|------|------|
| `repo` | `"content" \| "theme"` | 是 | 探測哪個倉 |

**回傳值** `RemoteProbe`：`{ behind: number | null }`——`0` 與遠端一致；`>0` 精確落後數；`null` 遠端已前進但數量未知（需拉取後才能確定）。

```bash
curl -X POST http://127.0.0.1:5175/api/publish/probe \
  -H "Content-Type: application/json" -d '{"repo":"content"}'
```

## POST /api/publish

一鍵發布。流程：內容倉（**驗證 → add -A → commit → pull --rebase --autostash → push**，驗證失敗即阻斷該倉）+ 主題倉（commit → push，不跑本地驗證）。

| Body 欄位 | 型別 | 必填 | 說明 |
|-----------|------|------|------|
| `contentMessage` | `string` | 否 | 內容倉提交訊息；**留空自動生成**（須符合 `type(scope): ≤30 字`） |
| `themeMessage` | `string` | 否 | 主題倉提交訊息；同上 |

**回傳值** `PublishResult`：

```json
{
  "ok": true,
  "content": { "ok": true, "hadChanges": true, "commitHash": "a1b2c3d", "pushed": true, "log": ["..."] },
  "theme":  { "ok": true, "hadChanges": false, "pushed": false, "log": ["无变更，跳过"] }
}
```

單倉 `RepoPublishResult`：`ok`（該倉整體成功）、`hadChanges`、`commitHash?`、`pushed`、`validationOutput?`（內容倉驗證失敗時的完整日誌）、`log[]`（逐步執行記錄）。頂層 `ok = content.ok && theme.ok`。

```bash
curl -X POST http://127.0.0.1:5175/api/publish \
  -H "Content-Type: application/json" -d '{}'
```

> [!WARNING]
> 這是真正會產生 git 提交與推送的介面。呼叫前建議先 `preview` 確認變更範圍；內容倉驗證失敗時不會產生任何提交。

## POST /api/validate

單獨執行發布前驗證：在主題倉跑 `scripts/content/sync.mjs --dry-run`（環境帶 `CONTENT_DIR`，180 秒超時，輸出截尾 4000 字元）。**純記憶體預檢，不落盤、不產生任何改動**。

**回傳值** `{ ok: boolean, output: string }`——`output` 為驗證器輸出（YAML 格式、欄位拼寫、frontmatter schema 問題定位）。

```bash
curl -X POST http://127.0.0.1:5175/api/validate
```
