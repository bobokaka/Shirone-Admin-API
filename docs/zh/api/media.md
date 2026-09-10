---
title: 媒体上传
description: /api/media/* 全部上传接口参考——文章配图、说说图、站点图、数据封面与音乐音频，含各 target/kind 的落盘目录映射。
---

# 媒体上传

媒体模块处理一切二进制文件落仓。全部上传接口为 **multipart 表单**，一次一个文件，单文件 ≤30MB；图片扩展名白名单 `webp / png / jpg / jpeg / gif / avif`（favicon 额外允许 `ico / svg`）。

各接口落盘目录（均在内容仓内）：

| 场景 | 目录 |
|------|------|
| 文章配图 | `content/posts/<slug>/images/` |
| 说说图 | `public/images/moments/<批次>/` |
| 横幅（桌面/移动） | `assets/images/banner/desktop/`、`assets/images/banner/mobile/` |
| 头像 | `assets/images/avatar/` |
| 页脚图片 | `public/images/footer/` |
| favicon | `public/favicon/` |
| 数据封面 | 按 kind 见[下表](#post-api-media-data-cover) |
| 歌曲音频 | `public/assets/music/url/` |

## POST /api/media/post-image

文章配图上传，存入指定文章目录的 `images/`。

| 表单字段 | 必填 | 说明 |
|----------|------|------|
| `file` | 是 | 图片文件 |
| `slug` | 是 | 文章 slug（决定落盘目录） |

**返回值** `MediaUploadResult`：`{ src, fileName }`——`src` 为 frontmatter / 正文引用路径（相对路径 `./images/<name>`），直接拼进 Markdown 即可。

```bash
curl -X POST http://127.0.0.1:5175/api/media/post-image \
  -F "slug=hello" -F "file=@cover.webp"
```

## POST /api/media/moment-image

说说图上传，存入 `public/images/moments/<批次>/`。批次目录规则由主题缩略图管线决定，**不可绕过**。

| 表单字段 | 必填 | 说明 |
|----------|------|------|
| `file` | 是 | 图片文件 |
| `batchId` | 否 | 批次目录名（`[\w-]+`，如 `20260910-103000`）；缺省由服务端按当前时间生成 |

**返回值** `MediaUploadResult`：`{ src, fileName, batchId? }`——`src` 为站点绝对路径（`/images/moments/<批次>/<name>`），回传的 `batchId` 归批时继续复用。

```bash
curl -X POST http://127.0.0.1:5175/api/media/moment-image \
  -F "batchId=20260910-103000" -F "file=@photo.webp"
```

## GET /api/media/site-images

站点图片托管目录清单（页脚图片库等场景）。

| Query 参数 | 必填 | 说明 |
|------------|------|------|
| `target` | 是 | 目录标识，1–40 字符（如 `footer`） |

**返回值** `SiteMediaResult[]`：每项 `{ src, previewUrl, fileName }`。

```bash
curl "http://127.0.0.1:5175/api/media/site-images?target=footer"
```

## POST /api/media/site-image

站点图片上传（multipart）。

| 表单字段 | 必填 | 说明 |
|----------|------|------|
| `file` | 是 | 图片文件 |
| `target` | 是 | `banner-desktop` / `banner-mobile` / `avatar` / `footer` / `favicon` |
| `name` | 否 | 固定文件名（favicon 槽位替换用，如 `favicon-light`） |
| `currentSrc` | 否 | 字段当前值；指向同目标托管目录时**原位替换**旧文件（头像更新即如此） |

**返回值** `SiteMediaResult`：`src` 为写进 YAML 的路径、`previewUrl` 为后台预览直链。

```bash
curl -X POST http://127.0.0.1:5175/api/media/site-image \
  -F "target=avatar" -F "currentSrc=assets/images/avatar/old.webp" -F "file=@me.webp"
```

## POST /api/media/site-image-import

站点图片**远程直链导入**：服务端代取下载（绕过浏览器跨源限制）后走 site-image 落仓；webp 自动转换为 png/jpg（主题兼容性）。

| Body 字段 | 类型 | 必填 | 说明 |
|-----------|------|------|------|
| `target` | `string` | 是 | 同 site-image |
| `url` | `string` | 是 | 公网 http(s) 直链，≤2000 字符 |
| `name` | `string` | 否 | 指定文件名 |
| `currentSrc` | `string` | 否 | 原位替换目标 |

**返回值** 同 `SiteMediaResult`。

```bash
curl -X POST http://127.0.0.1:5175/api/media/site-image-import \
  -H "Content-Type: application/json" \
  -d '{"target":"footer","url":"https://example.com/badge.png"}'
```

## POST /api/media/data-cover

结构化数据封面上传（multipart）。kind 决定落盘目录：

| `kind` | 目录 |
|--------|------|
| `anime` | `public/assets/anime/` |
| `projects` | `public/assets/projects/` |
| `devices` | `public/images/devices/` |
| `friends` | `public/images/friends/` |
| `music` | `assets/images/music/` |

| 表单字段 | 必填 | 说明 |
|----------|------|------|
| `file` | 是 | 图片文件 |
| `kind` | 是 | 上表五选一 |
| `path` | 否 | 当前条目的封面路径；命中同目录时**原位覆盖**（替换图片不残留旧文件） |

**返回值** `MediaUploadResult`。

```bash
curl -X POST http://127.0.0.1:5175/api/media/data-cover \
  -F "kind=anime" -F "file=@cover.webp"
```

## POST /api/media/data-cover-import

数据封面远程直链导入（AI 检索出的 CDN 封面等场景），kind 与目录同上。

| Body 字段 | 类型 | 必填 | 说明 |
|-----------|------|------|------|
| `kind` | `string` | 是 | 五选一枚举 |
| `url` | `string` | 是 | 直链，≤2000 字符 |
| `title` | `string` | 否 | 用于生成可读文件名 |
| `currentPath` | `string` | 否 | 原位覆盖目标 |

```bash
curl -X POST http://127.0.0.1:5175/api/media/data-cover-import \
  -H "Content-Type: application/json" \
  -d '{"kind":"music","url":"https://cdn.example.com/track-cover.jpg","title":"晴天"}'
```

## POST /api/media/music-audio

歌曲音频本地上传（multipart）→ `public/assets/music/url/`。

| 表单字段 | 必填 | 说明 |
|----------|------|------|
| `file` | 是 | 音频文件 |
| `currentSrc` | 否 | 原位替换目标 |

```bash
curl -X POST http://127.0.0.1:5175/api/media/music-audio \
  -F "file=@song.mp3"
```

## POST /api/media/music-download

歌曲音频**远程直链**服务端拉取落盘（浏览器跨源拿不到的也能下）。

| Body 字段 | 类型 | 必填 | 说明 |
|-----------|------|------|------|
| `url` | `string` | 是 | 音频直链，≤2000 字符 |
| `filename` | `string` | 否 | 指定文件名 |
| `currentPath` | `string` | 否 | 原位替换目标 |

```bash
curl -X POST http://127.0.0.1:5175/api/media/music-download \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com/song.mp3"}'
```
