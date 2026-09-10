---
title: 構造化データ
description: /api/data/:kind の 8種類の構造化データの読み書きと、/api/bangumi/* のアニメ項目検索・カバー取り込みの API リファレンス。
---

# 構造化データ

構造化データモジュールはコンテンツリポジトリの `data/*.ts` を読み書きします——ファイル内の `interface`、コメント、export 文は**文字通り保持**され、置き換えるのはエクスポートされる配列リテラル全体だけです。読み取りは tsx による動的 import 経由（キャッシュ回避の mtime クエリつき）。列挙フィールドは保存前に検証されます。

## kind とファイルの対応

パスパラメーター `kind` は八択一：

| `kind` | ファイル | エクスポート配列 | 項目 |
|--------|------|----------|------|
| `projects` | `data/projects.ts` | `projectsData` | プロジェクト |
| `skills` | `data/skills.ts` | `skillsData` | スキル |
| `timeline` | `data/timeline.ts` | `timelineData` | タイムラインイベント |
| `devices` | `data/devices.ts` | `devicesData` | デバイス |
| `anime` | `data/anime.ts` | `animeData` | アニメ |
| `compass` | `data/compass.ts` | `compassData` | 羅針盤シェルフ |
| `music` | `data/music.ts` | `musicTracks` | プレイリスト曲目 |
| `friends` | `data/friends.ts` | `friendsData` | 友達リンク |

## GET /api/data/:kind

**戻り値** `{ kind, items: DataItem[] }`——`DataItem` は弱い型のオブジェクトです（フィールド構造は各ファイルの interface、または[ガイド · 構造化データ](../guide/data.md#_8種類のデータ)のフィールド表を参照）。

```bash
curl http://127.0.0.1:5175/api/data/friends
```

## PUT /api/data/:kind

その種類の全項目を**一括置換**します。

| Body フィールド | 型 | 必須 | 説明 |
|-----------|------|------|------|
| `items` | `object[]` | はい | 全量項目（先に GET して変更してから PUT。増分だけ送らないでください） |

**戻り値** `{ ok: true, changed }`。**副作用**：`data/*.ts` の配列部分を書き戻します。ファイルのその他の部分には触れません。

```bash
curl -X PUT http://127.0.0.1:5175/api/data/skills \
  -H "Content-Type: application/json" \
  -d '{"items":[{"name":"TypeScript","category":"frontend","level":"advanced","enable":true}]}'
```

---

# Bangumi アニメ検索

アニメ取り込みの 3点セット。データは Bangumi 公開 API から取得し、アニメ項目の検索・補完に使います。

## GET /api/bangumi/search

| Query パラメーター | 必須 | 説明 |
|------------|------|------|
| `keyword` | はい | キーワード。1–100文字（アニメタイプの項目に固定して検索） |

**戻り値** `{ candidates: BangumiCandidate[] }`——各項目は `id`（Bangumi subject id）、`title` / `originalTitle`、`year`、`cover?`、`summary`、`eps`、`bangumiScore?`、`link` を含みます。

```bash
curl "http://127.0.0.1:5175/api/bangumi/search?keyword=葬送のフリーレン"
```

## GET /api/bangumi/subject

| Query パラメーター | 必須 | 説明 |
|------------|------|------|
| `id` | はい | Bangumi subject id（正の整数。文字列でも可） |

**戻り値** `BangumiDetail`：Candidate をベースに `studio?`（制作会社）、`period?`（放送期間 `{ start, end? }`）、`genres[]`（高頻度ジャンルタグ ≤4個）を補完します。

```bash
curl "http://127.0.0.1:5175/api/bangumi/subject?id=463652"
```

## POST /api/bangumi/cover-import

カバー画像の取り込み：サーバーが Bangumi の画像ホストからダウンロードし、項目タイトルで命名して `public/assets/anime/` に保存します。

| Body フィールド | 型 | 必須 | 説明 |
|-----------|------|------|------|
| `url` | `string` | はい | カバーの直リンク。**ホワイトリスト検証**：`lain.bgm.tv` / `api.bgm.tv` / `bgm.tv` / `bangumi.tv` / `ei.hdslb.com` のみ受け付け、それ以外は 400 |
| `title` | `string` | はい | 項目タイトル（1–200文字。命名に使用） |
| `currentPath` | `string` | いいえ | 同じディレクトリに存在する場合、その場で置き換え |

**戻り値** `MediaUploadResult`。

```bash
curl -X POST http://127.0.0.1:5175/api/bangumi/cover-import \
  -H "Content-Type: application/json" \
  -d '{"url":"https://lain.bgm.tv/pic/cover/l/xx.jpg","title":"葬送のフリーレン"}'
```
