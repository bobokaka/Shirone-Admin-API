---
title: Site Settings
description: API reference for reading and writing the four config domains (site/profile/navbar/footer) via /api/settings/:domain, with YAML minimal-override semantics.
---

# Site Settings

The site settings module reads and writes the content repository's `config/*.yaml`. The path parameter `domain` is one of four: `site` / `profile` / `navbar` / `footer`.

**Write semantics—YAML minimal override**: PUT writes only the keys declared in the request body (a recursive patch); undeclared fields never appear in the YAML and inherit the theme defaults at runtime. Arrays are replaced wholesale. This means you can safely send a single field without breaking the rest of the configuration.

## GET /api/settings/:domain

Reads the current value of a config domain (i.e. the overrides declared in the YAML; undeclared keys are absent from the response).

```bash
curl http://127.0.0.1:5175/api/settings/site
```

Key points of each domain's response:

| Domain | File | Response structure |
|--------|------|--------------------|
| `site` | `config/site.yaml` | `SiteSettings`, plus the read-only `themeFavicon[]` (the theme's default favicons—the icons actually in effect when the content repository has no override—**never** written back) |
| `profile` | `config/profile.yaml` | `{ avatar?, name?, bio?, links?: { name, icon, url }[] }` |
| `navbar` | `config/nav-bar.yaml` | `{ links?: NavBarLink[] }` |
| `footer` | `config/footer.yaml` + `config/footer.html` | `{ enable: boolean, html: string }`—html is always a string (`""` when the file is missing) |

## PUT /api/settings/site

Writes `site.yaml`. Every body field is optional; zod strictly validates enums and ranges:

| Field | Type | Constraint |
|-------|------|------------|
| `site` / `base` / `title` | `string` | Non-empty |
| `subtitle` | `string` | — |
| `lang` | Enum | `en / zh_CN / zh_TW / ja / ko / es / th / vi / tr / id` |
| `i18n` | `{ enable?, locales? }` | `locales` has at least one entry, all from the lang enum |
| `timeZone` | `string` | ≥2 characters (e.g. `Asia/Shanghai`) |
| `displaySettings` | `Record<string, boolean>` | Keys limited to `colorStyle / colorSpec / wallpaperMode / layoutMode / reduceMotion / texture` |
| `themeColor` | `{ hue?, fixed?, style?, spec? }` | `hue` integer 0–360; `style` one of nine (tonalSpot/vibrant/content/expressive/rainbow/fruitSalad/monochrome/neutral/fidelity); `spec` 2021 or 2025 |
| `wallpaperMode` | `{ defaultMode? }` | `banner / none` |
| `texture` | `{ enable?, defaultPreset?, defaultOpacity?, allowMotion? }` | preset one of six (none/starlight/cyber-dots/topography/geometric/sakura); opacity 0.05–0.25 |
| `banner` | See below | Full banner structure |
| `favicon` | `{ src, theme }[]` | `theme` is `light / dark` |

The `banner` sub-structure: `src.desktop[] / src.mobile[]` (arrays of wallpaper paths), `position` (top/center/bottom), `dim`, `homeText` (title + subtitle array + `typewriter` speed group), `carousel` (interval ≥3000ms, fadeDuration, six animation modes), `waves`.

**Side effects**: after saving the banner, local wallpaper files **no longer referenced by either side are deleted automatically**. **Return value**: the full updated `site.yaml`.

```bash
curl -X PUT http://127.0.0.1:5175/api/settings/site \
  -H "Content-Type: application/json" \
  -d '{"title":"我的博客","themeColor":{"hue":260}}'
```

## PUT /api/settings/profile

Writes `profile.yaml`; fields: `avatar` / `name` / `bio` / `links[]` (each item requires `name` and `url`, `icon` optional).

```bash
curl -X PUT http://127.0.0.1:5175/api/settings/profile \
  -H "Content-Type: application/json" \
  -d '{"name":"Shirone","bio":"写代码也写故事"}'
```

## PUT /api/settings/navbar

Writes `nav-bar.yaml`. Body: `{ links?: NavBarLink[] }`—omitting `links` is a no-op that returns the current value. Each `NavBarLink`: `preset` (a theme preset name, e.g. `home`) / `name` / `icon` / `url` / `external` / `children[]` (recursively the same shape, for dropdown groups). **Arrays are replaced wholesale**.

```bash
curl -X PUT http://127.0.0.1:5175/api/settings/navbar \
  -H "Content-Type: application/json" \
  -d '{"links":[{"name":"关于","url":"/about/"}]}'
```

## PUT /api/settings/footer

Writes the footer: `enable` (written to `footer.yaml`) and `html` (written **verbatim** to `footer.html`, only trailing whitespace trimmed). Both fields can be omitted and take effect independently. **Return value** `{ enable, html }`.

```bash
curl -X PUT http://127.0.0.1:5175/api/settings/footer \
  -H "Content-Type: application/json" \
  -d '{"enable":true,"html":"<p>自定义页脚内容</p>"}'
```
