---
title: Media Upload
description: API reference for all /api/media/* upload endpoints—post images, Moment images, site images, data covers, and music audio, with the on-disk directory mapping for each target/kind.
---

# Media Upload

The media module handles persisting all binary files. Every upload endpoint is a **multipart form**, one file at a time, ≤30MB per file; the image extension whitelist is `webp / png / jpg / jpeg / gif / avif` (favicon additionally allows `ico / svg`).

On-disk directory per endpoint (all inside the content repository):

| Scenario | Directory |
|----------|-----------|
| Post images | `content/posts/<slug>/images/` |
| Moment images | `public/images/moments/<batch>/` |
| Banner (desktop/mobile) | `assets/images/banner/desktop/`, `assets/images/banner/mobile/` |
| Avatar | `assets/images/avatar/` |
| Footer images | `public/images/footer/` |
| favicon | `public/favicon/` |
| Data covers | By kind, see the [table below](#post-api-media-data-cover) |
| Music audio | `public/assets/music/url/` |

## POST /api/media/post-image

Post image upload; stored in the given post directory's `images/`.

| Form field | Required | Description |
|------------|----------|-------------|
| `file` | Yes | Image file |
| `slug` | Yes | Post slug (decides the target directory) |

**Return value** `MediaUploadResult`: `{ src, fileName }`—`src` is the reference path for frontmatter / body (relative `./images/<name>`), ready to drop straight into Markdown.

```bash
curl -X POST http://127.0.0.1:5175/api/media/post-image \
  -F "slug=hello" -F "file=@cover.webp"
```

## POST /api/media/moment-image

Moment image upload; stored in `public/images/moments/<batch>/`. The batch directory rule is decided by the theme's thumbnail pipeline and **cannot be bypassed**.

| Form field | Required | Description |
|------------|----------|-------------|
| `file` | Yes | Image file |
| `batchId` | No | Batch directory name (`[\w-]+`, e.g. `20260910-103000`); when omitted the server generates one from the current time |

**Return value** `MediaUploadResult`: `{ src, fileName, batchId? }`—`src` is an absolute site path (`/images/moments/<batch>/<name>`); reuse the returned `batchId` to keep subsequent uploads in the same batch.

```bash
curl -X POST http://127.0.0.1:5175/api/media/moment-image \
  -F "batchId=20260910-103000" -F "file=@photo.webp"
```

## GET /api/media/site-images

Lists the files in a site image hosting directory (the footer image gallery and similar scenarios).

| Query parameter | Required | Description |
|-----------------|----------|-------------|
| `target` | Yes | Directory identifier, 1–40 characters (e.g. `footer`) |

**Return value** `SiteMediaResult[]`: each item `{ src, previewUrl, fileName }`.

```bash
curl "http://127.0.0.1:5175/api/media/site-images?target=footer"
```

## POST /api/media/site-image

Site image upload (multipart).

| Form field | Required | Description |
|------------|----------|-------------|
| `file` | Yes | Image file |
| `target` | Yes | `banner-desktop` / `banner-mobile` / `avatar` / `footer` / `favicon` |
| `name` | No | Fixed filename (for favicon slot replacement, e.g. `favicon-light`) |
| `currentSrc` | No | The field's current value; when it points into the same target hosting directory, the old file is **replaced in place** (this is how avatar updates work) |

**Return value** `SiteMediaResult`: `src` is the path written into YAML, `previewUrl` is a direct preview link for the admin UI.

```bash
curl -X POST http://127.0.0.1:5175/api/media/site-image \
  -F "target=avatar" -F "currentSrc=assets/images/avatar/old.webp" -F "file=@me.webp"
```

## POST /api/media/site-image-import

**Remote URL import** of site images: the server downloads on your behalf (bypassing browser cross-origin limits) and persists via site-image; webp is converted to png/jpg automatically (theme compatibility).

| Body field | Type | Required | Description |
|------------|------|----------|-------------|
| `target` | `string` | Yes | Same as site-image |
| `url` | `string` | Yes | Public http(s) direct link, ≤2000 characters |
| `name` | `string` | No | Desired filename |
| `currentSrc` | `string` | No | In-place replacement target |

**Return value** same as `SiteMediaResult`.

```bash
curl -X POST http://127.0.0.1:5175/api/media/site-image-import \
  -H "Content-Type: application/json" \
  -d '{"target":"footer","url":"https://example.com/badge.png"}'
```

## POST /api/media/data-cover

Structured data cover upload (multipart). kind decides the target directory:

| `kind` | Directory |
|--------|-----------|
| `anime` | `public/assets/anime/` |
| `projects` | `public/assets/projects/` |
| `devices` | `public/images/devices/` |
| `friends` | `public/images/friends/` |
| `music` | `assets/images/music/` |

| Form field | Required | Description |
|------------|----------|-------------|
| `file` | Yes | Image file |
| `kind` | Yes | One of the five values above |
| `path` | No | The entry's current cover path; when it hits the same directory the old file is **overwritten in place** (replacements leave no stale files) |

**Return value** `MediaUploadResult`.

```bash
curl -X POST http://127.0.0.1:5175/api/media/data-cover \
  -F "kind=anime" -F "file=@cover.webp"
```

## POST /api/media/data-cover-import

Remote URL import of data covers (CDN covers surfaced by AI search and similar scenarios); kind and directories as above.

| Body field | Type | Required | Description |
|------------|------|----------|-------------|
| `kind` | `string` | Yes | One of the five-value enum |
| `url` | `string` | Yes | Direct link, ≤2000 characters |
| `title` | `string` | No | Used to generate a readable filename |
| `currentPath` | `string` | No | In-place overwrite target |

```bash
curl -X POST http://127.0.0.1:5175/api/media/data-cover-import \
  -H "Content-Type: application/json" \
  -d '{"kind":"music","url":"https://cdn.example.com/track-cover.jpg","title":"晴天"}'
```

## POST /api/media/music-audio

Local upload of music audio (multipart) → `public/assets/music/url/`.

| Form field | Required | Description |
|------------|----------|-------------|
| `file` | Yes | Audio file |
| `currentSrc` | No | In-place replacement target |

```bash
curl -X POST http://127.0.0.1:5175/api/media/music-audio \
  -F "file=@song.mp3"
```

## POST /api/media/music-download

Server-side fetch of a **remote audio URL** into the repository (works even when the browser's cross-origin policy would block the download).

| Body field | Type | Required | Description |
|------------|------|----------|-------------|
| `url` | `string` | Yes | Audio direct link, ≤2000 characters |
| `filename` | `string` | No | Desired filename |
| `currentPath` | `string` | No | In-place replacement target |

```bash
curl -X POST http://127.0.0.1:5175/api/media/music-download \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com/song.mp3"}'
```
