---
title: 簡書取り込み
description: /api/import/jianshu/* のエクスポートパッケージセッション、バックグラウンド取り込みタスク、単一記事貼り付け変換と AI メタ情報提案の API リファレンス。
---

# 簡書取り込み

簡書移行の 2組の API です。**エクスポートパッケージフロー**（セッション制：アップロード → 一覧 → プレビュー → バックグラウンドタスク）と**単一記事貼り付けフロー**（セッションなし、貼ってすぐ変換）。

セッションとタスクはどちらも**サーバーのメモリ**に保存されます：セッションの有効期間は 24時間、最大 3件（LRU 破棄）。タスク結果は 1時間保持され、サービスの再起動で消えます——取り込み済みの記事には影響しません（すでにリポジトリに保存済みのため）。

## POST /api/import/jianshu/archive

簡書のエクスポートパッケージをアップロードします（multipart）。

| フォームフィールド | 必須 | 説明 |
|----------|------|------|
| `file` | はい | rar / zip 圧縮パッケージ。≤30MB |

**副作用**：メモリ上で解凍して解析します（ディスクに書き込みません）。**戻り値** `JianshuArchiveSummary`：

```json
{
  "sessionId": "s-xxxx",
  "notebooks": [{ "name": "技术随笔", "articles": [{ "id": "技术随笔/a.md", "title": "标题", "bytes": 8213 }] }],
  "total": 42,
  "importedIds": ["技术随笔/a.md"]
}
```

`id` はセッション内で一意の識別子（パッケージ内パスの正規化）。ルート直下の散文記事は「未分组（未分類）」に振り分けられます。

```bash
curl -X POST http://127.0.0.1:5175/api/import/jianshu/archive \
  -F "file=@jianshu-export.zip"
```

## GET /api/import/jianshu/preview

1件分の変換プレビュー。**ディスクに書き込まず**、画像はリモートリンクを保持します。

| Query パラメーター | 必須 | 説明 |
|------------|------|------|
| `sessionId` | はい | 前ステップで返されたセッション id |
| `id` | はい | 記事 id |

**戻り値** `JianshuPreview`：`{ title, markdown, imageCount, wordCount }`——`wordCount` は本文のプレーンテキストの文字数です（極端に少ない場合、プレースホルダー的な内容しか残っていない可能性があります）。

```bash
curl "http://127.0.0.1:5175/api/import/jianshu/preview?sessionId=s-xxxx&id=技术随笔/a.md"
```

## POST /api/import/jianshu/run

**バックグラウンド取り込みタスク**を起動します。即座に返り、進捗はポーリングします。

| Body フィールド | 型 | 必須 | 説明 |
|-----------|------|------|------|
| `sessionId` | `string` | はい | セッション id |
| `ids` | `string[]` | はい | 取り込む記事 id。1–2000条 |
| `options.published` | `string` | はい | 統一の公開日 `YYYY-MM-DD`（エクスポートパッケージに日付は含まれない） |
| `options.categoryFromNotebook` | `boolean` | はい | 文集名をカテゴリにする |
| `options.category` | `string` | いいえ | 文集を使わない場合の統一カテゴリ（≤40文字） |
| `options.tags` | `string[]` | はい | 統一タグ（≤12個、1個 ≤30文字） |
| `options.localizeImages` | `boolean` | はい | 画像をダウンロードしてリポジトリへ保存（失敗したものはリモートリンクを保持） |
| `options.draft` | `boolean` | はい | 下書きとして取り込む |

**戻り値** `{ jobId }`。**副作用**：`content/posts/<slug>/index.md` を 1本ずつ書き込み、画像をダウンロードします。

```bash
curl -X POST http://127.0.0.1:5175/api/import/jianshu/run \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"s-xxxx","ids":["技术随笔/a.md"],"options":{"published":"2026-09-10","categoryFromNotebook":true,"tags":["简书迁移"],"localizeImages":true,"draft":true}}'
```

## GET /api/import/jianshu/job

タスクの進捗をポーリングします（2秒間隔を推奨）。

| Query パラメーター | 必須 | 説明 |
|------------|------|------|
| `id` | はい | タスク id |

**戻り値** `JianshuImportJob`：`{ id, sessionId, status: "running" | "done", total, done, current, results, log }`。`results` の各項目は `{ id, title, ok, path?, error?, images }`。`log` は末尾 200条を保持します。

```bash
curl "http://127.0.0.1:5175/api/import/jianshu/job?id=job-xxxx"
```

## DELETE /api/import/jianshu/session

セッションを破棄します（パッケージ内のキャッシュをクリア）。タスク実行中は拒否されます。

| Query パラメーター | 必須 | 説明 |
|------------|------|------|
| `id` | はい | セッション id |

**戻り値** `{ ok: boolean }`。

```bash
curl -X DELETE "http://127.0.0.1:5175/api/import/jianshu/session?id=s-xxxx"
```

## POST /api/import/jianshu/paste-preview

単一記事貼り付けの**変換プレビュー**（ディスクに書き込まず）。3つのペイロードのうち最低 1つが空でなく、各 ≤2MB。解析の優先順位：**markdown（エディター確定稿）> html（リッチテキスト）> text（プレーンテキストは Markdown としてフォールバック）**。

| Body フィールド | 型 | 必須 | 説明 |
|-----------|------|------|------|
| `markdown` | `string` | 三択一 | エディターの確定稿。優先的に採用 |
| `html` | `string` | 三択一 | リッチテキスト（Web からコピー）。Markdown へ変換 |
| `text` | `string` | 三択一 | プレーンテキストのフォールバック |

**戻り値** `JianshuPreview` と同じ。

```bash
curl -X POST http://127.0.0.1:5175/api/import/jianshu/paste-preview \
  -H "Content-Type: application/json" \
  -d '{"html":"<h1>タイトル</h1><p>段落</p>"}'
```

## POST /api/import/jianshu/paste-run

単一記事貼り付けの**リポジトリ保存**：画像は記事ディレクトリへ自動ダウンロードされます（失敗したものはリモートリンクを保持）。

Body = 貼り付けペイロード（上記と同じ）+ `options`：

| フィールド | 制約 |
|------|------|
| `title` | 必須。1–100文字 |
| `published` | 必須。`YYYY-MM-DD` |
| `category` | 任意。≤40文字 |
| `tags` | ≤12個、1個 ≤30文字 |
| `draft` | boolean |

**戻り値** `JianshuPasteResult`：`{ title, path, slug, images, failedImages[] }`——`images` はローカル化に成功した数、`failedImages` はリモートリンクを保持した画像です。

```bash
curl -X POST http://127.0.0.1:5175/api/import/jianshu/paste-run \
  -H "Content-Type: application/json" \
  -d '{"markdown":"# タイトル\n本文","options":{"title":"タイトル","published":"2026-09-10","tags":[],"draft":true}}'
```

## POST /api/import/jianshu/suggest-meta

AI が本文を解析してメタ情報を補完します（無効/失敗時は本文の要約へ自動フォールバックし、`aiUsed=false`）。

| Body フィールド | 型 | 必須 | 説明 |
|-----------|------|------|------|
| `title` | `string` | いいえ | 空欄 = AI にタイトルの命名も任せる。≤100文字 |
| `markdown` | `string` | はい | 本文。1–2MB |

**戻り値** `JianshuMetaSuggestion`：`{ title?, description, category, tags[], aiUsed }`。

```bash
curl -X POST http://127.0.0.1:5175/api/import/jianshu/suggest-meta \
  -H "Content-Type: application/json" \
  -d '{"title":"","markdown":"# ブログ構築の記録\n…"}'
```
