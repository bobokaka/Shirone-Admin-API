---
title: システムとプレビュー
description: /api/status の接続状態 probe と /api/preview/* の実サイトプレビュープロセス管理の API リファレンス。
---

# システムとプレビュー

システムモジュールは 2つの問いに答えます。**ワークスペースの接続は正常か**、**ブログ表画面の dev server は動いているか**。管理画面トップバーの接続ラベルと各ページの実サイトプレビューパネルが、この API 群で動いています。

## GET /api/status

ワークスペースの状態を probe します。パラメーターなし、決してエラーになりません（内部で失敗したフィールドは `null`/`false` を返します）。

**戻り値** `SystemStatus`：

| フィールド | 型 | 説明 |
|------|------|------|
| `contentDir` / `themeDir` | `string` | 解決済みのコンテンツリポジトリ / テーマリポジトリの絶対パス（由来：`.env` またはデフォルトの相対位置） |
| `contentConnected` | `boolean` | コンテンツリポジトリのディレクトリ配下に `content/` が存在すれば `true` |
| `themeConnected` | `boolean` | テーマリポジトリに `scripts/content/sync.mjs` が存在すれば `true` |
| `themeDepsInstalled` | `boolean` | テーマリポジトリの `node_modules` が存在するか（ローカル検証の可否を決定） |
| `git` | `GitStatus \| null` | コンテンツリポジトリの git 概要。git リポジトリでなければ `null` |

`GitStatus`：`branch`、`ahead`、`behind`、`staged[]`、`modified[]`、`untracked[]`（ファイルの相対パスのリスト）。

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

実サイトプレビューのプロセスを起動します：テーマリポジトリで `content:watch`（コンテンツ監視同期）と `astro dev`（:4321）を開始します。すでに実行中の場合は「すでに実行中」をそのまま返します。**副作用**：2つのバックグラウンドプロセスツリーを作成します。Windows では `cmd /c` 経由で起動し、サービス終了時に `taskkill` でツリーごと回収します。

```bash
curl -X POST http://127.0.0.1:5175/api/preview/start
```

```json
{ "started": true, "message": "真站预览已启动，首次启动需等待依赖编译" }
```

`ready` の判定は、`/api/preview/status` のポーリングを正としてください（初回はコンパイルが必要なため、準備完了は起動より遅れます）。

## POST /api/preview/stop

プレビューのプロセスツリーを終了します。**副作用**：start が起動したすべての子プロセスを kill します。dev server が他のソース（ワンクリック起動スクリプトなど）由来の場合、回収範囲外です。

```bash
curl -X POST http://127.0.0.1:5175/api/preview/stop
```

`{ "stopped": true }` を返します。

## GET /api/preview/status

プレビューの状態を照会します。フロントエンドは 3秒ごとにポーリングします。

```bash
curl http://127.0.0.1:5175/api/preview/status
```

```json
{ "running": true, "ready": true, "procs": ["node content-watch.mjs", "astro dev"] }
```

| フィールド | 説明 |
|------|------|
| `running` | このサービスが管理するプレビュープロセスが動いている |
| `ready` | `http://localhost:4321/` が実際に到達可能（どのソースの dev server でも可） |
| `procs` | プロセスの説明リスト |
