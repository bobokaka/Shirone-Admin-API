---
title: Moments
description: API reference for /api/moments Moments CRUD—publish, update, and delete short updates.
---

# Moments

The Moments module operates on the content repository's `content/moments/`, one Markdown file per Moment, the filename being the id: `<yyyymmdd-HHmmss>.md`. The list is ordered newest first.

## The MomentMeta Structure

The metadata shared by the list and detail endpoints:

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Filename without `.md`, e.g. `20260906-183000` |
| `path` | `string` | Relative path |
| `published` | `string` | `YYYY-MM-DD HH:mm:ss` |
| `pinned` / `draft` | `boolean` | Pinned / draft |
| `location` | `string` | Location |
| `mood` | `string` | Iconify icon name for the mood (empty string = not chosen) |
| `tags` | `string[]` | Tags |
| `images` | `{ src, alt }[]` | Attached images; `src` is a site path |
| `body` | `string` | Body text (included in the list too) |

## GET /api/moments

The full list; no parameters.

```bash
curl http://127.0.0.1:5175/api/moments
```

## GET /api/moments/detail

| Query parameter | Required | Description |
|-----------------|----------|-------------|
| `path` | Yes | Moment relative path |

**Return value** `MomentFile`: `{ meta: MomentMeta, body: string }`.

```bash
curl "http://127.0.0.1:5175/api/moments/detail?path=20260906-183000.md"
```

## POST /api/moments

Creates a Moment. **Side effects**: writes `content/moments/<publish-timestamp>.md`; files referenced by `images` should already be in the repository via [Moment image upload](./media.md#post-api-media-moment-image).

| Body field | Type | Required | Default | Description |
|------------|------|----------|---------|-------------|
| `published` | `string` | Yes | — | `YYYY-MM-DD HH:mm:ss`; decides the filename |
| `body` | `string` | No | `""` | Body text |
| `location` | `string` | No | — | Location |
| `mood` | `string` | No | — | Mood icon name |
| `tags` | `string[]` | No | — | Tags |
| `images` | `{ src, alt? }[]` | No | — | Image list |
| `draft` / `pinned` | `boolean` | No | `false` | Draft / pinned |

**Return value** the created `MomentMeta`.

```bash
curl -X POST http://127.0.0.1:5175/api/moments \
  -H "Content-Type: application/json" \
  -d '{"published":"2026-09-10 10:30:00","body":"第一条说说！","mood":"material-symbols:celebration","tags":["开始"]}'
```

## PUT /api/moments

Updates a Moment; same fields as above, plus:

| Body field | Type | Required | Description |
|------------|------|----------|-------------|
| `path` | `string` | Yes | Target Moment path |

Omitted optional fields fall back to their defaults (full-overwrite semantics); reading detail first and then editing is the safest pattern (that is what the admin UI does).

```bash
curl -X PUT http://127.0.0.1:5175/api/moments \
  -H "Content-Type: application/json" \
  -d '{"path":"20260906-183000.md","published":"2026-09-06 18:30:00","body":"改过了","pinned":true}'
```

## DELETE /api/moments

Deletes a Moment (the `.md` file). **Image files are not deleted with it**; clean up the matching batch directory under `public/images/moments/` manually when needed.

| Query parameter | Required | Description |
|-----------------|----------|-------------|
| `path` | Yes | Moment relative path |

**Return value** `{ "ok": true }`.

```bash
curl -X DELETE "http://127.0.0.1:5175/api/moments?path=20260906-183000.md"
```
