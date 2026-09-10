---
title: Posts
description: API reference for /api/posts post CRUD, /api/slug slug suggestions, and /api/taxonomy/rename bulk category/tag renaming.
---

# Posts

The posts module operates directly on the content repository's `content/posts/`. All path parameters are POSIX-style paths relative to that directory. The list is ordered **pinned first, then by publish date, newest first**.

## GET /api/posts

Returns the full list of post metadata (without bodies).

**Return value** `PostMeta[]`; key fields of each item:

| Field | Type | Description |
|-------|------|-------------|
| `slug` | `string` | Directory name (directory-style) or filename without `.md` |
| `path` | `string` | Relative path, e.g. `hello/index.md` |
| `layout` | `"directory" \| "file"` | Directory-style / flat file |
| `title` / `published` / `description` / `image` / `category` / `tags` | — | Metadata; `published` is `YYYY-MM-DD` |
| `publishedAt` / `updated` / `updatedAt` | `string?` | Exact publish time and update time |
| `pinned` / `draft` / `comment` / `encrypted` / `hideHomeContent` | `boolean` | Toggles |
| `hasPassword` | `boolean` | Whether a password is set (**the password itself is never returned**) |
| `passwordHint` | `string` | Password hint |
| `alias` / `permalink` | `string?` | Custom access path |

```bash
curl http://127.0.0.1:5175/api/posts
```

## GET /api/posts/detail

Reads the full content of a single post.

| Query parameter | Required | Description |
|-----------------|----------|-------------|
| `path` | Yes | Post relative path |

**Return value** `PostFile`: `{ meta: PostMeta, body: string }`. `404` when the path does not exist.

```bash
curl "http://127.0.0.1:5175/api/posts/detail?path=hello/index.md"
```

## POST /api/posts

Creates a post (**as a draft**). Directory-style posts are written to `content/posts/<slug>/index.md`.

| Body field | Type | Required | Default | Description |
|------------|------|----------|---------|-------------|
| `title` | `string` | Yes | — | Title; must not be empty |
| `slug` | `string` | No | Transliterated from the title | Custom directory name; illegal characters are auto-cleaned, duplicates de-duplicated |

**Return value** `PostFile` (the newly created post). **Side effects**: creates the directory and `index.md` in the content repository; when `slug` is omitted, it is de-duplicated against existing posts.

```bash
curl -X POST http://127.0.0.1:5175/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"我的第一篇文章"}'
```

## PUT /api/posts

Saves a post. Frontmatter is **merge-written**: only the keys present in `meta` are updated, and the body is replaced wholesale; serialization keeps date formats such as `published` intact.

| Body field | Type | Required | Default | Description |
|------------|------|----------|---------|-------------|
| `path` | `string` | Yes | — | Target post path |
| `body` | `string` | No | `""` | Full body text (replaced wholesale) |
| `meta` | `object` | No | `{}` | Frontmatter key-values to update; passing an empty string for `alias`/`permalink` clears the key |
| `password` | `string` | No | — | **Pass only when setting/changing the password**; omit it to keep the current value |
| `clearPassword` | `boolean` | No | — | When `true`, clears the password (e.g. to un-encrypt) |

**Return value** the saved `PostFile`.

```bash
curl -X PUT http://127.0.0.1:5175/api/posts \
  -H "Content-Type: application/json" \
  -d '{"path":"hello/index.md","meta":{"draft":false},"body":"# 你好\n\n正文。"}'
```

## DELETE /api/posts

Deletes a post. Directory-style posts can only be deleted at the top `slug` level (the whole directory along with its images); flat files delete a single file.

| Query parameter | Required | Description |
|-----------------|----------|-------------|
| `path` | Yes | Post relative path |

**Return value** `{ "ok": true }`.

```bash
curl -X DELETE "http://127.0.0.1:5175/api/posts?path=hello/index.md"
```

## POST /api/slug

Generates or cleans a slug (the title is pinyin-transliterated, illegal characters replaced, and the result de-duplicated against existing posts).

| Body field | Type | Required | Description |
|------------|------|----------|-------------|
| `title` | `string` | No (default `""`) | The title; used for generation **only when `slug` is absent** |
| `slug` | `string` | No | When provided, only cleaned, not generated |

**Return value** `SlugSuggestion`: `{ slug: string, adjusted: boolean, note?: string }`—`adjusted=true` means a replacement or de-duplication happened, and `note` explains why.

```bash
curl -X POST http://127.0.0.1:5175/api/slug \
  -H "Content-Type: application/json" \
  -d '{"title":"快速上手指南"}'
```

## POST /api/taxonomy/rename

Bulk category/tag rename: rewrites frontmatter in **every matching post**. If the target name already exists they are merged; an empty `to` removes it from all posts.

| Body field | Type | Required | Description |
|------------|------|----------|-------------|
| `kind` | `"category" \| "tag"` | Yes | Whether to rename a category or a tag |
| `from` | `string` | Yes | The original name (must not be empty) |
| `to` | `string` | Yes | The target name; empty string = remove |

**Return value** `{ changed, kind, from, to }`—`changed` is the number of posts rewritten. **Side effects**: rewrites files one by one (tags are auto-de-duplicated), with date field formats preserved.

```bash
curl -X POST http://127.0.0.1:5175/api/taxonomy/rename \
  -H "Content-Type: application/json" \
  -d '{"kind":"tag","from":"JS","to":"JavaScript"}'
```
