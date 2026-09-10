---
title: メディアアップロード
description: /api/media/* の全アップロード API リファレンス——記事画像、モーメンツ画像、サイト画像、データカバー、音楽音声。各 target/kind の保存先ディレクトリ対応つき。
---

# メディアアップロード

メディアモジュールは、すべてのバイナリファイルのリポジトリ保存を扱います。すべてのアップロード API は **multipart フォーム**で、1回 1ファイル、1ファイル ≤30MB。画像拡張子のホワイトリストは `webp / png / jpg / jpeg / gif / avif`（favicon のみ `ico / svg` を追加許可）。

各 API の保存先ディレクトリ（すべてコンテンツリポジトリ内）：

| シーン | ディレクトリ |
|------|------|
| 記事画像 | `content/posts/<slug>/images/` |
| モーメンツ画像 | `public/images/moments/<バッチ>/` |
| バナー（デスクトップ/モバイル） | `assets/images/banner/desktop/`、`assets/images/banner/mobile/` |
| アバター | `assets/images/avatar/` |
| フッター画像 | `public/images/footer/` |
| favicon | `public/favicon/` |
| データカバー | kind ごとに[下の表](#post-api-media-data-cover)を参照 |
| 楽曲音声 | `public/assets/music/url/` |

## POST /api/media/post-image

記事画像のアップロード。指定した記事ディレクトリの `images/` に保存します。

| フォームフィールド | 必須 | 説明 |
|----------|------|------|
| `file` | はい | 画像ファイル |
| `slug` | はい | 記事の slug（保存先ディレクトリを決定） |

**戻り値** `MediaUploadResult`：`{ src, fileName }`——`src` は frontmatter / 本文の参照パス（相対パス `./images/<name>`）で、そのまま Markdown に埋め込めます。

```bash
curl -X POST http://127.0.0.1:5175/api/media/post-image \
  -F "slug=hello" -F "file=@cover.webp"
```

## POST /api/media/moment-image

モーメンツ画像のアップロード。`public/images/moments/<バッチ>/` に保存します。バッチディレクトリの規則はテーマのサムネイルパイプラインが決めており、**迂回できません**。

| フォームフィールド | 必須 | 説明 |
|----------|------|------|
| `file` | はい | 画像ファイル |
| `batchId` | いいえ | バッチディレクトリ名（`[\w-]+`、例：`20260910-103000`）。省略時はサーバーが現在時刻で生成 |

**戻り値** `MediaUploadResult`：`{ src, fileName, batchId? }`——`src` はサイトの絶対パス（`/images/moments/<バッチ>/<name>`）。返却された `batchId` は同じバッチに追加する際に再利用します。

```bash
curl -X POST http://127.0.0.1:5175/api/media/moment-image \
  -F "batchId=20260910-103000" -F "file=@photo.webp"
```

## GET /api/media/site-images

サイト画像の管理ディレクトリの一覧（フッター画像ライブラリなどのシーン）。

| Query パラメーター | 必須 | 説明 |
|------------|------|------|
| `target` | はい | ディレクトリ識別子。1–40文字（例：`footer`） |

**戻り値** `SiteMediaResult[]`：各項目 `{ src, previewUrl, fileName }`。

```bash
curl "http://127.0.0.1:5175/api/media/site-images?target=footer"
```

## POST /api/media/site-image

サイト画像のアップロード（multipart）。

| フォームフィールド | 必須 | 説明 |
|----------|------|------|
| `file` | はい | 画像ファイル |
| `target` | はい | `banner-desktop` / `banner-mobile` / `avatar` / `footer` / `favicon` |
| `name` | いいえ | 固定ファイル名（favicon スロットの置き換え用。例：`favicon-light`） |
| `currentSrc` | いいえ | フィールドの現在値。同じ管理ディレクトリを指している場合、旧ファイルを**その場で置き換え**ます（アバター更新がまさにこれ） |

**戻り値** `SiteMediaResult`：`src` は YAML に書き込むパス、`previewUrl` は管理画面のプレビュー直リンク。

```bash
curl -X POST http://127.0.0.1:5175/api/media/site-image \
  -F "target=avatar" -F "currentSrc=assets/images/avatar/old.webp" -F "file=@me.webp"
```

## POST /api/media/site-image-import

サイト画像の**リモート直リンク取り込み**：サーバー側が代理ダウンロードし（ブラウザーのオリジン間制限を回避）、site-image 経由でリポジトリに保存します。webp は png/jpg に自動変換されます（テーマ互換性のため）。

| Body フィールド | 型 | 必須 | 説明 |
|-----------|------|------|------|
| `target` | `string` | はい | site-image と同じ |
| `url` | `string` | はい | 公開 http(s) 直リンク。≤2000文字 |
| `name` | `string` | いいえ | ファイル名の指定 |
| `currentSrc` | `string` | いいえ | その場で置き換える対象 |

**戻り値** `SiteMediaResult` と同じ。

```bash
curl -X POST http://127.0.0.1:5175/api/media/site-image-import \
  -H "Content-Type: application/json" \
  -d '{"target":"footer","url":"https://example.com/badge.png"}'
```

## POST /api/media/data-cover

構造化データのカバーアップロード（multipart）。kind が保存先ディレクトリを決めます：

| `kind` | ディレクトリ |
|--------|------|
| `anime` | `public/assets/anime/` |
| `projects` | `public/assets/projects/` |
| `devices` | `public/images/devices/` |
| `friends` | `public/images/friends/` |
| `music` | `assets/images/music/` |

| フォームフィールド | 必須 | 説明 |
|----------|------|------|
| `file` | はい | 画像ファイル |
| `kind` | はい | 上の表から五択一 |
| `path` | いいえ | 現在の項目のカバーパス。同じディレクトリに存在する場合**その場で上書き**します（画像を置き換えても旧ファイルが残りません） |

**戻り値** `MediaUploadResult`。

```bash
curl -X POST http://127.0.0.1:5175/api/media/data-cover \
  -F "kind=anime" -F "file=@cover.webp"
```

## POST /api/media/data-cover-import

データカバーのリモート直リンク取り込み（AI 検索で見つけた CDN カバーなどのシーン）。kind とディレクトリは上記と同じ。

| Body フィールド | 型 | 必須 | 説明 |
|-----------|------|------|------|
| `kind` | `string` | はい | 五択一の列挙値 |
| `url` | `string` | はい | 直リンク。≤2000文字 |
| `title` | `string` | いいえ | 読みやすいファイル名の生成に使用 |
| `currentPath` | `string` | いいえ | その場で上書きする対象 |

```bash
curl -X POST http://127.0.0.1:5175/api/media/data-cover-import \
  -H "Content-Type: application/json" \
  -d '{"kind":"music","url":"https://cdn.example.com/track-cover.jpg","title":"晴天"}'
```

## POST /api/media/music-audio

楽曲音声のローカルアップロード（multipart）→ `public/assets/music/url/`。

| フォームフィールド | 必須 | 説明 |
|----------|------|------|
| `file` | はい | 音声ファイル |
| `currentSrc` | いいえ | その場で置き換える対象 |

```bash
curl -X POST http://127.0.0.1:5175/api/media/music-audio \
  -F "file=@song.mp3"
```

## POST /api/media/music-download

楽曲音声の**リモート直リンク**をサーバー側で取得して保存します（ブラウザーのオリジン間制限で取得できないものも落とせます）。

| Body フィールド | 型 | 必須 | 説明 |
|-----------|------|------|------|
| `url` | `string` | はい | 音声の直リンク。≤2000文字 |
| `filename` | `string` | いいえ | ファイル名の指定 |
| `currentPath` | `string` | いいえ | その場で置き換える対象 |

```bash
curl -X POST http://127.0.0.1:5175/api/media/music-download \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com/song.mp3"}'
```
