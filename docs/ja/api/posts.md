---
title: 記事
description: /api/posts の記事 CRUD、/api/slug の slug 提案、/api/taxonomy/rename のカテゴリ・タグ一括書き換えの API リファレンス。
---

# 記事

記事モジュールはコンテンツリポジトリの `content/posts/` を直接操作します。すべてのパスパラメーターはこのディレクトリからの相対 POSIX 形式パスです。リストは**ピン留め優先、公開日の降順**です。

## GET /api/posts

全記事のメタ情報リストを返します（本文を含まない）。

**戻り値** `PostMeta[]`。各項目の主要フィールド：

| フィールド | 型 | 説明 |
|------|------|------|
| `slug` | `string` | ディレクトリ名（ディレクトリ式）またはファイル名から `.md` を除いたもの |
| `path` | `string` | 相対パス。例：`hello/index.md` |
| `layout` | `"directory" \| "file"` | ディレクトリ式 / フラット式 |
| `title` / `published` / `description` / `image` / `category` / `tags` | — | メタ情報。`published` は `YYYY-MM-DD` |
| `publishedAt` / `updated` / `updatedAt` | `string?` | 正確な時刻と更新時刻 |
| `pinned` / `draft` / `comment` / `encrypted` / `hideHomeContent` | `boolean` | スイッチ類 |
| `hasPassword` | `boolean` | パスワード設定済みか（**パスワードそのものは決して返しません**） |
| `passwordHint` | `string` | パスワードヒント |
| `alias` / `permalink` | `string?` | カスタムアクセスパス |

```bash
curl http://127.0.0.1:5175/api/posts
```

## GET /api/posts/detail

1件の記事の完全な内容を読み取ります。

| Query パラメーター | 必須 | 説明 |
|------------|------|------|
| `path` | はい | 記事の相対パス |

**戻り値** `PostFile`：`{ meta: PostMeta, body: string }`。パスが存在しない場合は `404`。

```bash
curl "http://127.0.0.1:5175/api/posts/detail?path=hello/index.md"
```

## POST /api/posts

記事を新規作成します（**下書き状態**）。ディレクトリ式で `content/posts/<slug>/index.md` として保存されます。

| Body フィールド | 型 | 必須 | デフォルト | 説明 |
|-----------|------|------|------|------|
| `title` | `string` | はい | — | タイトル。空にできません |
| `slug` | `string` | いいえ | タイトルのピンイン転写 | カスタムディレクトリ名。不正文字は自動クリーンアップ、重複は番号付加 |

**戻り値** `PostFile`（作成後の記事）。**副作用**：コンテンツリポジトリにディレクトリと `index.md` を作成。`slug` 未指定時は既存記事と重複回避されます。

```bash
curl -X POST http://127.0.0.1:5175/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"私の最初の記事"}'
```

## PUT /api/posts

記事を保存します。frontmatter は**マージ書き込み**：`meta` に現れたキーのみ更新し、本文は全体置換。シリアライズで `published` などの日付フォーマットは保持されます。

| Body フィールド | 型 | 必須 | デフォルト | 説明 |
|-----------|------|------|------|------|
| `path` | `string` | はい | — | 対象記事のパス |
| `body` | `string` | いいえ | `""` | 本文全文（全体置換） |
| `meta` | `object` | いいえ | `{}` | 更新する frontmatter のキーと値。`alias`/`permalink` に空文字を渡すとそのキーをクリア |
| `password` | `string` | いいえ | — | **パスワードの設定/変更時のみ渡す**。未指定なら現状維持 |
| `clearPassword` | `boolean` | いいえ | — | `true` でパスワードをクリア（暗号化の解除など） |

**戻り値** 保存後の `PostFile`。

```bash
curl -X PUT http://127.0.0.1:5175/api/posts \
  -H "Content-Type: application/json" \
  -d '{"path":"hello/index.md","meta":{"draft":false},"body":"# こんにちは\n\n本文。"}'
```

## DELETE /api/posts

記事を削除します。ディレクトリ式の記事は `slug` の最上位まで（ディレクトリ全体と画像をまとめて）、フラット式は単一ファイルを削除します。

| Query パラメーター | 必須 | 説明 |
|------------|------|------|
| `path` | はい | 記事の相対パス |

**戻り値** `{ "ok": true }`。

```bash
curl -X DELETE "http://127.0.0.1:5175/api/posts?path=hello/index.md"
```

## POST /api/slug

slug の生成またはクリーンアップ（タイトルのピンイン転写、不正文字の置換、既存記事との重複回避）。

| Body フィールド | 型 | 必須 | 説明 |
|-----------|------|------|------|
| `title` | `string` | いいえ（デフォルト `""`） | タイトル。**`slug` を渡さない場合のみ**生成に使われます |
| `slug` | `string` | いいえ | 渡した場合は生成せずクリーンアップのみ |

**戻り値** `SlugSuggestion`：`{ slug: string, adjusted: boolean, note?: string }`——`adjusted=true` は置換または重複回避が発生したことを意味し、`note` に理由が示されます。

```bash
curl -X POST http://127.0.0.1:5175/api/slug \
  -H "Content-Type: application/json" \
  -d '{"title":"快速上手指南"}'
```

## POST /api/taxonomy/rename

カテゴリ/タグの一括リネーム：**該当するすべての記事**の frontmatter を書き換えます。目標名が既存なら統合されます。`to` に空文字を渡すと全記事から削除します。

| Body フィールド | 型 | 必須 | 説明 |
|-----------|------|------|------|
| `kind` | `"category" \| "tag"` | はい | カテゴリかタグか |
| `from` | `string` | はい | 元の名前（空にできない） |
| `to` | `string` | はい | 目標名。空文字 = 削除 |

**戻り値** `{ changed, kind, from, to }`——`changed` は書き換えた記事数。**副作用**：記事を 1本ずつ書き換え（タグでは自動重複除去）、日付フィールドのフォーマットは保持されます。

```bash
curl -X POST http://127.0.0.1:5175/api/taxonomy/rename \
  -H "Content-Type: application/json" \
  -d '{"kind":"tag","from":"JS","to":"JavaScript"}'
```
