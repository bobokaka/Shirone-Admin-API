---
title: Structured Data
description: API reference for reading and writing the eight types of structured data via /api/data/:kind, plus /api/bangumi/* anime entry search and cover import.
---

# Structured Data

The structured data module reads and writes the content repository's `data/*.ts`—the `interface`s, comments, and export statements in each file are **preserved verbatim**; only the exported array literal is replaced wholesale. Reads go through a tsx dynamic import (with an mtime query to bypass caching); enum fields are validated before saving.

## kind-to-file Mapping

The path parameter `kind` is one of eight:

| `kind` | File | Exported array | Entry |
|--------|------|----------------|-------|
| `projects` | `data/projects.ts` | `projectsData` | Project |
| `skills` | `data/skills.ts` | `skillsData` | Skill |
| `timeline` | `data/timeline.ts` | `timelineData` | Timeline event |
| `devices` | `data/devices.ts` | `devicesData` | Device |
| `anime` | `data/anime.ts` | `animeData` | Anime |
| `compass` | `data/compass.ts` | `compassData` | Bookshelf |
| `music` | `data/music.ts` | `musicTracks` | Playlist track |
| `friends` | `data/friends.ts` | `friendsData` | Friend link |

## GET /api/data/:kind

**Return value** `{ kind, items: DataItem[] }`—`DataItem` is a loosely typed object (see each file's interface for the field structure, or the field tables in [Guide · Structured Data](../guide/data.md#eight-data-types)).

```bash
curl http://127.0.0.1:5175/api/data/friends
```

## PUT /api/data/:kind

**Replaces wholesale** all entries of that data type.

| Body field | Type | Required | Description |
|------------|------|----------|-------------|
| `items` | `object[]` | Yes | The full set of entries (GET, edit, then PUT—do not send just a delta) |

**Return value** `{ ok: true, changed }`. **Side effects**: rewrites the array section of `data/*.ts`; the rest of the file is untouched.

```bash
curl -X PUT http://127.0.0.1:5175/api/data/skills \
  -H "Content-Type: application/json" \
  -d '{"items":[{"name":"TypeScript","category":"frontend","level":"advanced","enable":true}]}'
```

---

# Bangumi Anime Search

The three endpoints of anime import; data comes from the public Bangumi API and powers search-assisted completion of anime entries.

## GET /api/bangumi/search

| Query parameter | Required | Description |
|-----------------|----------|-------------|
| `keyword` | Yes | Keyword, 1–100 characters (always searches anime-type subjects) |

**Return value** `{ candidates: BangumiCandidate[] }`—each item contains `id` (Bangumi subject id), `title` / `originalTitle`, `year`, `cover?`, `summary`, `eps`, `bangumiScore?`, `link`.

```bash
curl "http://127.0.0.1:5175/api/bangumi/search?keyword=葬送的芙莉莲"
```

## GET /api/bangumi/subject

| Query parameter | Required | Description |
|-----------------|----------|-------------|
| `id` | Yes | Bangumi subject id (positive integer; a string works too) |

**Return value** `BangumiDetail`: adds `studio?` (production studio), `period?` (broadcast window `{ start, end? }`), and `genres[]` (up to 4 high-frequency genre tags) on top of Candidate.

```bash
curl "http://127.0.0.1:5175/api/bangumi/subject?id=463652"
```

## POST /api/bangumi/cover-import

Cover import: the server downloads from the Bangumi image host and saves into `public/assets/anime/`, named after the entry title.

| Body field | Type | Required | Description |
|------------|------|----------|-------------|
| `url` | `string` | Yes | Cover direct link. **Whitelist check**: only `lain.bgm.tv` / `api.bgm.tv` / `bgm.tv` / `bangumi.tv` / `ei.hdslb.com` are accepted; anything else returns 400 |
| `title` | `string` | Yes | Entry title (1–200 characters, used for naming) |
| `currentPath` | `string` | No | In-place replacement when it hits the same directory |

**Return value** `MediaUploadResult`.

```bash
curl -X POST http://127.0.0.1:5175/api/bangumi/cover-import \
  -H "Content-Type: application/json" \
  -d '{"url":"https://lain.bgm.tv/pic/cover/l/xx.jpg","title":"葬送的芙莉莲"}'
```
