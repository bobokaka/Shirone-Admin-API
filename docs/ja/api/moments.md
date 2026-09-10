---
title: モーメンツ
description: /api/moments のモーメンツ CRUD の API リファレンス——投稿、更新、削除。
---

# モーメンツ

モーメンツモジュールはコンテンツリポジトリの `content/moments/` を操作します。1件につき 1つの Markdown ファイルで、ファイル名がそのまま id です：`<yyyymmdd-HHmmss>.md`。リストは時刻の降順です。

## MomentMeta の構造

リストと詳細で共通のメタ情報：

| フィールド | 型 | 説明 |
|------|------|------|
| `id` | `string` | ファイル名から `.md` を除いたもの。例：`20260906-183000` |
| `path` | `string` | 相対パス |
| `published` | `string` | `YYYY-MM-DD HH:mm:ss` |
| `pinned` / `draft` | `boolean` | ピン留め / 下書き |
| `location` | `string` | 場所 |
| `mood` | `string` | 気分の Iconify アイコン名（空文字は未選択） |
| `tags` | `string[]` | タグ |
| `images` | `{ src, alt }[]` | 画像。`src` はサイト内パス |
| `body` | `string` | 本文テキスト（リストにも含まれる） |

## GET /api/moments

全件リスト。パラメーターなし。

```bash
curl http://127.0.0.1:5175/api/moments
```

## GET /api/moments/detail

| Query パラメーター | 必須 | 説明 |
|------------|------|------|
| `path` | はい | モーメンツの相対パス |

**戻り値** `MomentFile`：`{ meta: MomentMeta, body: string }`。

```bash
curl "http://127.0.0.1:5175/api/moments/detail?path=20260906-183000.md"
```

## POST /api/moments

モーメンツを新規作成します。**副作用**：`content/moments/<投稿タイムスタンプ>.md` に書き込みます。`images` が参照するファイルは、あらかじめ[モーメンツ画像のアップロード](./media.md#post-api-media-moment-image)でリポジトリに保存しておく必要があります。

| Body フィールド | 型 | 必須 | デフォルト | 説明 |
|-----------|------|------|------|------|
| `published` | `string` | はい | — | `YYYY-MM-DD HH:mm:ss`。ファイル名を決定します |
| `body` | `string` | いいえ | `""` | 本文 |
| `location` | `string` | いいえ | — | 場所 |
| `mood` | `string` | いいえ | — | 気分アイコン名 |
| `tags` | `string[]` | いいえ | — | タグ |
| `images` | `{ src, alt? }[]` | いいえ | — | 画像のリスト |
| `draft` / `pinned` | `boolean` | いいえ | `false` | 下書き / ピン留め |

**戻り値** 作成後の `MomentMeta`。

```bash
curl -X POST http://127.0.0.1:5175/api/moments \
  -H "Content-Type: application/json" \
  -d '{"published":"2026-09-10 10:30:00","body":"最初のモーメンツ！","mood":"material-symbols:celebration","tags":["はじめに"]}'
```

## PUT /api/moments

モーメンツを更新します。フィールドは上記と同じで、次が追加されます：

| Body フィールド | 型 | 必須 | 説明 |
|-----------|------|------|------|
| `path` | `string` | はい | 対象モーメンツのパス |

未指定の任意フィールドはデフォルト値に戻る（全体上書きセマンティクス）ため、呼び出し前に detail を読んでから変更するのが最も安全なパターンです（管理インターフェースもそうしています）。

```bash
curl -X PUT http://127.0.0.1:5175/api/moments \
  -H "Content-Type: application/json" \
  -d '{"path":"20260906-183000.md","published":"2026-09-06 18:30:00","body":"修正しました","pinned":true}'
```

## DELETE /api/moments

モーメンツ（`.md` ファイル）を削除します。**画像ファイルは一緒に削除されない**ため、必要に応じて `public/images/moments/` 配下の対応するバッチディレクトリを手動で整理してください。

| Query パラメーター | 必須 | 説明 |
|------------|------|------|
| `path` | はい | モーメンツの相対パス |

**戻り値** `{ "ok": true }`。

```bash
curl -X DELETE "http://127.0.0.1:5175/api/moments?path=20260906-183000.md"
```
