---
title: AI サービス
description: /api/ai/* のプロバイダー設定、対話とストリーミング書き換え（SSE）、コミットメッセージ生成、タイムライン起草、音楽検索、壁紙取得の API リファレンス。
---

# AI サービス

AI モジュールは設定管理とすべての AI ワークフローをカバーします。壁紙取得を除き、**すべての API で AI が有効である必要があります**（マスタースイッチ ON + 現在のプロバイダー設定が完全）。そうでなければ `400`「AI 助手未启用…」を返します。

設定は本体の `server/data/ai-settings.json`（gitignore 済み）に永続化され、コンテンツリポジトリとは完全に分離されています。

## GET /api/ai/settings

**戻り値** `AiSettings`：

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

`protocol` は二択一：`anthropic`（v1/messages、デフォルト）/ `openai`（chat/completions）。`modelFast` が空欄なら、軽量タスクはメインモデルと同じです。

```bash
curl http://127.0.0.1:5175/api/ai/settings
```

## PUT /api/ai/settings

設定を保存します。Body は完全な `AiSettings`：`enable`（boolean）、`providers`（1–20セット。フィールド制約：`temperature` 0–2 デフォルト 0.7、`timeoutSeconds` 5–86400 デフォルト 30、`webSearch` デフォルト true）、`activeId`（providers 中の 1つを指す必要あり）。**有効状態**では、現在のプロバイダーが完全に入力済みでなければなりません（アドレスは http(s) で始まること、Key、モデル名）。そうでなければ 400 です。

**戻り値** 正規化して保存後の `AiSettings`（旧バージョンのフラット構造に対応し、読み込み時に自動マイグレーション）。

```bash
curl -X PUT http://127.0.0.1:5175/api/ai/settings \
  -H "Content-Type: application/json" \
  -d '{"enable":true,"providers":[{"id":"p1","name":"公式","protocol":"anthropic","baseUrl":"https://api.anthropic.com","apiKey":"sk-…","model":"claude-sonnet-5","modelFast":"","webSearch":true,"temperature":0.7,"timeoutSeconds":30}],"activeId":"p1"}'
```

## POST /api/ai/test

接続テスト。**リクエストボディのフォーム設定を優先的に使用**（保存前でもテスト可能）。解析に失敗した場合は保存済み設定にフォールバックします。テストリクエストは `maxTokens: 16`、`temperature: 0`、思考オフ・Web 検索オフに固定し、タイムアウトはそのプロバイダーの設定と 30秒の小さい方を使います。

**戻り値** `AiTestResult`：`{ ok, latencyMs, reply?, error? }`——`ok=true` のとき `reply` はモデルの応答断片（≤120文字）。

```bash
curl -X POST http://127.0.0.1:5175/api/ai/test \
  -H "Content-Type: application/json" \
  -d '{"enable":true,"providers":[{"id":"p1","name":"t","protocol":"anthropic","baseUrl":"https://api.anthropic.com","apiKey":"sk-…","model":"claude-sonnet-5","modelFast":"","webSearch":false,"temperature":0.7,"timeoutSeconds":30}],"activeId":"p1"}'
```

## POST /api/ai/chat

非ストリーミングの対話入口（常に保存済み設定を使用）。

| Body フィールド | 型 | 必須 | 説明 |
|-----------|------|------|------|
| `messages` | `{ role: system/user/assistant, content }[]` | はい | 完全なメッセージリスト。1条 ≤200k文字 |
| `maxTokens` | `number` | いいえ | 16–16384 |
| `fast` | `boolean` | いいえ | `true` で軽量モデル（未設定ならメインモデルへフォールバック）＋思考オフ |

**戻り値** `AiChatResult`：`{ content, model, promptTokens?, completionTokens?, searchUsed? }`。

```bash
curl -X POST http://127.0.0.1:5175/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Markdown を一言で紹介して"}],"fast":true}'
```

## POST /api/ai/edit

単一指示の書き換え：サーバー側で system を固定（Markdown 執筆アシスタント、結果のみ出力）。system のカスタマイズは公開していません。

| Body フィールド | 型 | 必須 | 説明 |
|-----------|------|------|------|
| `instruction` | `string` | はい | 書き換え指示。≤2000文字 |
| `text` | `string` | はい | 対象テキスト。≤100k文字 |
| `maxTokens` | `number` | いいえ | デフォルト 4096 |

**戻り値** `AiChatResult` と同じ。

```bash
curl -X POST http://127.0.0.1:5175/api/ai/edit \
  -H "Content-Type: application/json" \
  -d '{"instruction":"添削してください：元の意味を保ち、結果のみを出力","text":"これはテストテキストです"}'
```

## ストリーミング API（SSE） {#ストリーミングapi}

`edit-stream` と `chat-stream` は同じストリーミング転送プロトコルを共有します：

- レスポンスは `Content-Type: text/event-stream`。各フレームは 1行の `data: <JSON>`（標準外の複数行 event はなし）
- フレームの型：`{ "type": "thinking", "text": "…" }`（思考の増分）、`{ "type": "text", "text": "…" }`（本文の増分）、`{ "type": "done", "content": "全文", "model": "…", "completionTokens": n }`、`{ "type": "error", "message": "…" }`
- **クライアントが接続を切ると上流リクエストを即座に中止**します（これが唯一の停止手段です）
- タイムアウトは「出力なしアイドル」で計上（長さ = 現在のプロバイダーの `timeoutSeconds`）。長文生成は総時間の制限を受けません

### POST /api/ai/edit-stream

ストリーミング書き換え。リクエストボディは `edit` と完全に同一（`maxTokens` デフォルト 4096）。

```bash
curl -N -X POST http://127.0.0.1:5175/api/ai/edit-stream \
  -H "Content-Type: application/json" \
  -d '{"instruction":"この記事の続きを書いて","text":"本文…"}'
```

### POST /api/ai/chat-stream

ストリーミングの複数ターン対話。

| Body フィールド | 型 | 必須 | 説明 |
|-----------|------|------|------|
| `messages` | `{ role: user/assistant, content }[]` | はい | 1–40条（system はここに含めない） |
| `system` | `string` | いいえ | システムプロンプト。独立して送信。≤10k文字 |
| `maxTokens` | `number` | いいえ | デフォルト 8192 |

## POST /api/ai/commit-message

AI によるコミットメッセージ生成。**決してエラーでブロックしません**：AI 無効時はヒューリスティックにフォールバックし、`source` で判別できます。

| Body フィールド | 型 | 必須 | デフォルト | 説明 |
|-----------|------|------|------|------|
| `repo` | `"content" \| "theme"` | いいえ | `content` | どちらのリポジトリの変更から生成するか |

**戻り値** `{ message, source: "ai" \| "heuristic" }`——AI の出力は `type(scope): ≤30文字` のフォーマット検証に通らなければ採用されず、自動的に変更内容からの生成へフォールバックします。

```bash
curl -X POST http://127.0.0.1:5175/api/ai/commit-message \
  -H "Content-Type: application/json" -d '{"repo":"content"}'
```

## POST /api/ai/timeline-draft

タイムラインイベントの起草。

| Body フィールド | 型 | 必須 | 説明 |
|-----------|------|------|------|
| `mode` | `"note" \| "git"` | はい | `note` は記述から起草。`git` は 3リポジトリのコミット履歴をスキャンしてまとめ上げ |
| `note` | `string` | mode=note 時必須 | イベントの記述。≤500文字 |
| `limit` | `number` | いいえ | 1–5。生成条数の上限 |
| `existing` | `{ title, date }[]` | いいえ | 収録済みイベント（≤300条）。重複除去に使用 |

**戻り値** 下書きの配列（strict JSON + zod フィルタで、不正な項目は除去済み）。

```bash
curl -X POST http://127.0.0.1:5175/api/ai/timeline-draft \
  -H "Content-Type: application/json" \
  -d '{"mode":"note","note":"2025年6月に個人ブログを公開","limit":3}'
```

## POST /api/ai/music-search

音楽の著作権検索（Web 検索優先。サービスが Web 検索非対応の場合は自動的に通常リクエストへ降格し、その旨をマークします）。

| Body フィールド | 型 | 必須 | 説明 |
|-----------|------|------|------|
| `query` | `string` | はい | 検索語。≤200文字 |

**戻り値** 候補の配列。各項目は `title` / `artist?` / `license`（`freeCommercial`、`summary`、`evidence?`、`sourceUrl?`）/ `audioUrl?` / `coverUrl?` を含みます。

```bash
curl -X POST http://127.0.0.1:5175/api/ai/music-search \
  -H "Content-Type: application/json" -d '{"query":"静かなピアノ曲 無料商用利用"}'
```

## POST /api/ai/wallpaper-search

壁紙取得（safebooru 画像ソースから直接取得）。**AI を経由せず、有効化の要件もありません**。いつでも呼び出せます。

| Body フィールド | 型 | 必須 | 説明 |
|-----------|------|------|------|
| `query` | `string` | いいえ | 検索語。デフォルトは空（ランダム） |
| `target` | `"desktop" \| "mobile"` | はい | サイズ目標：デスクトップは ≥1920 の横長画像、モバイルは ≥1920 の縦長画像 |

**戻り値** `WallpaperCandidate[]`（1バッチ分を揃える）：`{ imageUrl, previewUrl?, width?, height? }`。

```bash
curl -X POST http://127.0.0.1:5175/api/ai/wallpaper-search \
  -H "Content-Type: application/json" -d '{"query":"星空","target":"desktop"}'
```
