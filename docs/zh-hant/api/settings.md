---
title: 站點設定
description: /api/settings/:domain 四個設定域（site/profile/navbar/footer）的讀寫介面參考，YAML 最小化覆蓋語義。
---

# 站點設定

站點設定模組讀寫內容倉 `config/*.yaml`。路徑參數 `domain` 四選一：`site` / `profile` / `navbar` / `footer`。

**寫入語義——YAML 最小化覆蓋**：PUT 只寫請求主體裡宣告過的鍵（遞迴修補），未宣告的欄位在 YAML 裡不出現、執行時繼承主題預設值。陣列整體替換。這意味著你可以放心地只發一個欄位而不破壞其餘設定。

## GET /api/settings/:domain

讀取設定域目前值（即 YAML 中已宣告的覆蓋項，未宣告鍵不在返回中）。

```bash
curl http://127.0.0.1:5175/api/settings/site
```

各域返回要點：

| 域 | 對應檔案 | 返回結構 |
|----|----------|----------|
| `site` | `config/site.yaml` | `SiteSettings`，另帶唯讀 `themeFavicon[]`（主題預設 favicon，內容倉未覆蓋時的實際生效圖示，**不會**被寫回） |
| `profile` | `config/profile.yaml` | `{ avatar?, name?, bio?, links?: { name, icon, url }[] }` |
| `navbar` | `config/nav-bar.yaml` | `{ links?: NavBarLink[] }` |
| `footer` | `config/footer.yaml` + `config/footer.html` | `{ enable: boolean, html: string }`——html 恆為字串（檔案缺失時 `""`） |

## PUT /api/settings/site

寫 `site.yaml`。請求主體全部欄位皆為選填，zod 嚴格驗證列舉與範圍：

| 欄位 | 型別 | 約束 |
|------|------|------|
| `site` / `base` / `title` | `string` | 非空 |
| `subtitle` | `string` | — |
| `lang` | 列舉 | `en / zh_CN / zh_TW / ja / ko / es / th / vi / tr / id` |
| `i18n` | `{ enable?, locales? }` | `locales` 至少一項且均為 lang 列舉 |
| `timeZone` | `string` | ≥2 字元（如 `Asia/Shanghai`） |
| `displaySettings` | `Record<string, boolean>` | 鍵限 `colorStyle / colorSpec / wallpaperMode / layoutMode / reduceMotion / texture` |
| `themeColor` | `{ hue?, fixed?, style?, spec? }` | `hue` 0–360 整數；`style` 9 選一（tonalSpot/vibrant/content/expressive/rainbow/fruitSalad/monochrome/neutral/fidelity）；`spec` 2021 或 2025 |
| `wallpaperMode` | `{ defaultMode? }` | `banner / none` |
| `texture` | `{ enable?, defaultPreset?, defaultOpacity?, allowMotion? }` | preset 六選一（none/starlight/cyber-dots/topography/geometric/sakura）；opacity 0.05–0.25 |
| `banner` | 見下 | 橫幅全量結構 |
| `favicon` | `{ src, theme }[]` | `theme` 為 `light / dark` |

`banner` 子結構：`src.desktop[] / src.mobile[]`（桌布路徑陣列）、`position`（top/center/bottom）、`dim`、`homeText`（標題 + 副標題陣列 + `typewriter` 速度組）、`carousel`（interval ≥3000ms、fadeDuration、六種動畫）、`waves`。

**副作用**：儲存橫幅後，**不再被任何一端引用的本地桌布檔案自動刪除**。**回傳值**：更新後的 `site.yaml` 全量。

```bash
curl -X PUT http://127.0.0.1:5175/api/settings/site \
  -H "Content-Type: application/json" \
  -d '{"title":"我的部落格","themeColor":{"hue":260}}'
```

## PUT /api/settings/profile

寫 `profile.yaml`，欄位：`avatar` / `name` / `bio` / `links[]`（每項 `name` 與 `url` 必填、`icon` 可空）。

```bash
curl -X PUT http://127.0.0.1:5175/api/settings/profile \
  -H "Content-Type: application/json" \
  -d '{"name":"Shirone","bio":"寫程式也寫故事"}'
```

## PUT /api/settings/navbar

寫 `nav-bar.yaml`。Body：`{ links?: NavBarLink[] }`——不傳 `links` 時無操作直接回傳目前值。`NavBarLink` 每項：`preset`（主題預設名，如 `home`）/ `name` / `icon` / `url` / `external` / `children[]`（遞迴同構，下拉分組用）。**陣列整體替換**。

```bash
curl -X PUT http://127.0.0.1:5175/api/settings/navbar \
  -H "Content-Type: application/json" \
  -d '{"links":[{"name":"關於","url":"/about/"}]}'
```

## PUT /api/settings/footer

寫頁尾：`enable`（寫入 `footer.yaml`）與 `html`（**原文**寫入 `footer.html`，僅去尾部空白）。兩欄位均可省略，各自獨立生效。**回傳值** `{ enable, html }`。

```bash
curl -X PUT http://127.0.0.1:5175/api/settings/footer \
  -H "Content-Type: application/json" \
  -d '{"enable":true,"html":"<p>自訂頁尾內容</p>"}'
```
