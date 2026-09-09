---
title: 站点设置
description: /api/settings/:domain 四个配置域（site/profile/navbar/footer）的读写接口参考，YAML 最小化覆盖语义。
---

# 站点设置

站点设置模块读写内容仓 `config/*.yaml`。路径参数 `domain` 四选一：`site` / `profile` / `navbar` / `footer`。

**写入语义——YAML 最小化覆盖**：PUT 只写请求体里声明过的键（递归打补丁），未声明的字段在 YAML 里不出现、运行时继承主题默认值。数组整体替换。这意味着你可以放心地只发一个字段而不破坏其余配置。

## GET /api/settings/:domain

读取配置域当前值（即 YAML 中已声明的覆盖项，未声明键不在返回中）。

```bash
curl http://127.0.0.1:5175/api/settings/site
```

各域返回要点：

| 域 | 对应文件 | 返回结构 |
|----|----------|----------|
| `site` | `config/site.yaml` | `SiteSettings`，另带只读 `themeFavicon[]`（主题默认 favicon，内容仓未覆盖时的实际生效图标，**不会**被写回） |
| `profile` | `config/profile.yaml` | `{ avatar?, name?, bio?, links?: { name, icon, url }[] }` |
| `navbar` | `config/nav-bar.yaml` | `{ links?: NavBarLink[] }` |
| `footer` | `config/footer.yaml` + `config/footer.html` | `{ enable: boolean, html: string }`——html 恒为字符串（文件缺失时 `""`） |

## PUT /api/settings/site

写 `site.yaml`。请求体全部字段可选，zod 严格校验枚举与范围：

| 字段 | 类型 | 约束 |
|------|------|------|
| `site` / `base` / `title` | `string` | 非空 |
| `subtitle` | `string` | — |
| `lang` | 枚举 | `en / zh_CN / zh_TW / ja / ko / es / th / vi / tr / id` |
| `i18n` | `{ enable?, locales? }` | `locales` 至少一项且均为 lang 枚举 |
| `timeZone` | `string` | ≥2 字符（如 `Asia/Shanghai`） |
| `displaySettings` | `Record<string, boolean>` | 键限 `colorStyle / colorSpec / wallpaperMode / layoutMode / reduceMotion / texture` |
| `themeColor` | `{ hue?, fixed?, style?, spec? }` | `hue` 0–360 整数；`style` 9 选一（tonalSpot/vibrant/content/expressive/rainbow/fruitSalad/monochrome/neutral/fidelity）；`spec` 2021 或 2025 |
| `wallpaperMode` | `{ defaultMode? }` | `banner / none` |
| `texture` | `{ enable?, defaultPreset?, defaultOpacity?, allowMotion? }` | preset 六选一（none/starlight/cyber-dots/topography/geometric/sakura）；opacity 0.05–0.25 |
| `banner` | 见下 | 横幅全量结构 |
| `favicon` | `{ src, theme }[]` | `theme` 为 `light / dark` |

`banner` 子结构：`src.desktop[] / src.mobile[]`（壁纸路径数组）、`position`（top/center/bottom）、`dim`、`homeText`（标题 + 副标题数组 + `typewriter` 速度组）、`carousel`（interval ≥3000ms、fadeDuration、六种动画）、`waves`。

**副作用**：保存横幅后，**不再被任何一端引用的本地壁纸文件自动删除**。**返回值**：更新后的 `site.yaml` 全量。

```bash
curl -X PUT http://127.0.0.1:5175/api/settings/site \
  -H "Content-Type: application/json" \
  -d '{"title":"我的博客","themeColor":{"hue":260}}'
```

## PUT /api/settings/profile

写 `profile.yaml`，字段：`avatar` / `name` / `bio` / `links[]`（每项 `name` 与 `url` 必填、`icon` 可空）。

```bash
curl -X PUT http://127.0.0.1:5175/api/settings/profile \
  -H "Content-Type: application/json" \
  -d '{"name":"Shirone","bio":"写代码也写故事"}'
```

## PUT /api/settings/navbar

写 `nav-bar.yaml`。Body：`{ links?: NavBarLink[] }`——不传 `links` 时无操作直接返回当前值。`NavBarLink` 每项：`preset`（主题预设名，如 `home`）/ `name` / `icon` / `url` / `external` / `children[]`（递归同构，下拉分组用）。**数组整体替换**。

```bash
curl -X PUT http://127.0.0.1:5175/api/settings/navbar \
  -H "Content-Type: application/json" \
  -d '{"links":[{"name":"关于","url":"/about/"}]}'
```

## PUT /api/settings/footer

写页脚：`enable`（写入 `footer.yaml`）与 `html`（**原文**写入 `footer.html`，仅去尾部空白）。两字段均可省略，各自独立生效。**返回值** `{ enable, html }`。

```bash
curl -X PUT http://127.0.0.1:5175/api/settings/footer \
  -H "Content-Type: application/json" \
  -d '{"enable":true,"html":"<p>自定义页脚内容</p>"}'
```
