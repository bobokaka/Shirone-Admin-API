---
title: サイト設定
description: /api/settings/:domain の 4つの設定ドメイン（site/profile/navbar/footer）の読み書き API リファレンス。YAML 最小上書きセマンティクス。
---

# サイト設定

サイト設定モジュールはコンテンツリポジトリの `config/*.yaml` を読み書きします。パスパラメーター `domain` は四択一：`site` / `profile` / `navbar` / `footer`。

**書き込みセマンティクス——YAML 最小上書き**：PUT はリクエストボディで宣言されたキーのみを書き込みます（再帰パッチ）。未宣言のフィールドは YAML に現れず、実行時はテーマのデフォルト値を継承します。配列は一括置換です。つまり、1つのフィールドだけを安心して送信でき、残りの設定は壊れません。

## GET /api/settings/:domain

設定ドメインの現在値を読み取ります（YAML で宣言済みの上書き項目。未宣言のキーは戻り値に含まれません）。

```bash
curl http://127.0.0.1:5175/api/settings/site
```

各ドメインの戻り値の要点：

| ドメイン | 対応ファイル | 戻り値の構造 |
|----|----------|----------|
| `site` | `config/site.yaml` | `SiteSettings`。読み取り専用の `themeFavicon[]` も付属（テーマデフォルトの favicon。コンテンツリポジトリが未上書きの時に実際に有効なアイコン。**書き戻されません**） |
| `profile` | `config/profile.yaml` | `{ avatar?, name?, bio?, links?: { name, icon, url }[] }` |
| `navbar` | `config/nav-bar.yaml` | `{ links?: NavBarLink[] }` |
| `footer` | `config/footer.yaml` + `config/footer.html` | `{ enable: boolean, html: string }`——html は常に文字列（ファイルがない場合は `""`） |

## PUT /api/settings/site

`site.yaml` に書き込みます。リクエストボディの全フィールドが任意で、zod が列挙値と範囲を厳密に検証します：

| フィールド | 型 | 制約 |
|------|------|------|
| `site` / `base` / `title` | `string` | 空不可 |
| `subtitle` | `string` | — |
| `lang` | 列挙 | `en / zh_CN / zh_TW / ja / ko / es / th / vi / tr / id` |
| `i18n` | `{ enable?, locales? }` | `locales` は最低 1項目で、すべて lang 列挙値 |
| `timeZone` | `string` | ≥2文字（例：`Asia/Shanghai`） |
| `displaySettings` | `Record<string, boolean>` | キーは `colorStyle / colorSpec / wallpaperMode / layoutMode / reduceMotion / texture` に限定 |
| `themeColor` | `{ hue?, fixed?, style?, spec? }` | `hue` は 0–360 の整数。`style` は九択一（tonalSpot/vibrant/content/expressive/rainbow/fruitSalad/monochrome/neutral/fidelity）。`spec` は 2021 または 2025 |
| `wallpaperMode` | `{ defaultMode? }` | `banner / none` |
| `texture` | `{ enable?, defaultPreset?, defaultOpacity?, allowMotion? }` | preset は六択一（none/starlight/cyber-dots/topography/geometric/sakura）。opacity は 0.05–0.25 |
| `banner` | 後述 | バナーの全量構造 |
| `favicon` | `{ src, theme }[]` | `theme` は `light / dark` |

`banner` のサブ構造：`src.desktop[] / src.mobile[]`（壁紙パスの配列）、`position`（top/center/bottom）、`dim`、`homeText`（タイトル + サブタイトル配列 + `typewriter` の速度群）、`carousel`（interval ≥3000ms、fadeDuration、6種類のアニメーション）、`waves`。

**副作用**：バナー保存後、**デスクトップ/モバイルのどちらからも参照されなくなったローカルの壁紙ファイルは自動削除**されます。**戻り値**：更新後の `site.yaml` の全量。

```bash
curl -X PUT http://127.0.0.1:5175/api/settings/site \
  -H "Content-Type: application/json" \
  -d '{"title":"私のブログ","themeColor":{"hue":260}}'
```

## PUT /api/settings/profile

`profile.yaml` に書き込みます。フィールド：`avatar` / `name` / `bio` / `links[]`（各項目で `name` と `url` は必須、`icon` は空可）。

```bash
curl -X PUT http://127.0.0.1:5175/api/settings/profile \
  -H "Content-Type: application/json" \
  -d '{"name":"Shirone","bio":"コードを書き、物語を書く"}'
```

## PUT /api/settings/navbar

`nav-bar.yaml` に書き込みます。Body：`{ links?: NavBarLink[] }`——`links` を渡さない場合は無操作で現在値をそのまま返します。`NavBarLink` の各項目：`preset`（テーマプリセット名、例：`home`）/ `name` / `icon` / `url` / `external` / `children[]`（再帰的に同じ構造。ドロップダウングループ用）。**配列は一括置換**です。

```bash
curl -X PUT http://127.0.0.1:5175/api/settings/navbar \
  -H "Content-Type: application/json" \
  -d '{"links":[{"name":"このサイトについて","url":"/about/"}]}'
```

## PUT /api/settings/footer

フッターに書き込みます：`enable`（`footer.yaml` に書き込む）と `html`（**原文のまま** `footer.html` に書き込む。末尾の空白のみ除去）。両フィールドとも省略可能で、それぞれ独立して効きます。**戻り値** `{ enable, html }`。

```bash
curl -X PUT http://127.0.0.1:5175/api/settings/footer \
  -H "Content-Type: application/json" \
  -d '{"enable":true,"html":"<p>カスタムフッターの内容</p>"}'
```
