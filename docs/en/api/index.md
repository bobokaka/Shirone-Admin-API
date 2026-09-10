---
title: API Reference
description: Overview of Shirone-Admin's local API—base conventions, error format, static asset mounts, and a grouped index of every endpoint.
---

# API Reference

Shirone-Admin's backend is a local Fastify service, and the admin UI itself works entirely through this set of APIs. You can also call them directly, treating the Admin as a **programmable gateway** to your content repository—bulk scripts, external editor integration, and automation pipelines are all viable.

This section is written for readers familiar with HTTP and the layout of the content repository. Endpoints are grouped by backend module; each one documents its purpose, parameters, return value, and a minimal runnable example.

## Base Conventions

| Item | Value |
|------|-------|
| Base URL | `http://127.0.0.1:5175` (changeable via `ADMIN_PORT`; bound to loopback only) |
| Path prefix | `/api` |
| Auth | **None**. A local single-machine tool that is not exposed to the LAN—do not reverse-proxy it to the public internet |
| Request body | JSON (`bodyLimit` **2MB**); file uploads use multipart (≤**30MB** per file, one file at a time) |
| CORS | Fully open (`origin: true`), handy for debugging from any local page |

## Error Format

Every error returns a JSON body with the single field `message` (in Chinese), paired with an appropriate HTTP status code:

```json
{ "message": "文件不存在" }
```

| Status | Source |
|--------|--------|
| `400` | Business validation failure (`ApiError`) or a **zod request validation failure**—`message` looks like `body.title: 标题不能为空`, assembled as "field: reason" |
| `404` | Path does not exist, or the requested post/file target is missing (`ENOENT`) |
| `413` | Uploaded file exceeds 30MB |
| `500` | Unexpected error; `message` carries the raw error text |

## Static Asset Mounts

Three read-only static routes serve content repository files directly (the content repository wins on a hit, otherwise it falls back to the same-named path in the theme repository); this is how the admin UI's image previews work:

| Prefix | Served directory | Purpose |
|--------|------------------|---------|
| `/content-assets/*` | content repository `assets/` (falls back to theme `src/assets/`) | Preview of build-time assets such as avatars and banners |
| `/content-public/*` | content repository `public/` (falls back to theme `public/`) | Preview of Moment images, music, and anime covers |
| `/content-posts/*` | content repository `content/posts/` | Post images (direct links for `./images/…` relative references) |

All paths go through resolve validation and **cannot escape the root directory** (directory-traversal safe).

## Endpoint Index

| Group | Contents |
|-------|----------|
| [System & Preview](./system.md) | Connection status probing; start/stop/status of the live site preview processes |
| [Posts](./posts.md) | Post CRUD, slug suggestions, bulk category/tag rename |
| [Moments](./moments.md) | Moments CRUD |
| [Media Upload](./media.md) | Post images, Moment images, site images, data covers, music audio |
| [Site Settings](./settings.md) | Read/write of the four config domains (site/profile/navbar/footer) |
| [Structured Data](./data.md) | Read/write of the eight `data/*.ts` types, anime entry search and cover import |
| [Publish & Validation](./publish.md) | Publish preview, remote probing, one-click publish, dry-run validation |
| [AI Services](./ai.md) | Provider configuration, chat/rewrite (including SSE streaming), and the various AI workflows |
| [Jianshu Import](./import.md) | Export-archive sessions, background import jobs, single-post paste |

## Common Behaviors

- **Write target**: apart from AI settings (`server/data/ai-settings.json`), every write lands in the content repository pointed to by `CONTENT_DIR`
- **Path parameters**: parameters referring to post/Moment paths are POSIX-style paths relative to the content repository (e.g. `hello/index.md`), always `/`-separated
- **Date formats**: post `published` is `YYYY-MM-DD`; `publishedAt` is `YYYY-MM-DDTHH:mm:ss+08:00`; Moment `published` is `YYYY-MM-DD HH:mm:ss`

## Quick Check

With the service running, one command confirms connectivity:

```bash
curl http://127.0.0.1:5175/api/status
```

If it returns the content/theme repository paths, connection status, and a git summary, the API is ready.
