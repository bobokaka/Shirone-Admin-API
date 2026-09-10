---
title: System & Preview
description: API reference for /api/status connection probing and /api/preview/* live site preview process management.
---

# System & Preview

The system module answers two questions: **is the workspace connected properly**, and **is the blog frontend dev server running**. The connection badge in the admin top bar and the live site preview panel on each page are driven by this group of endpoints.

## GET /api/status

Probes workspace status. Takes no parameters and never fails (fields whose internal lookup failed come back `null`/`false`).

**Return value** `SystemStatus`:

| Field | Type | Description |
|-------|------|-------------|
| `contentDir` / `themeDir` | `string` | Resolved absolute paths of the content / theme repositories (source: `.env` or the default relative locations) |
| `contentConnected` | `boolean` | `true` as long as the content repository contains a `content/` directory |
| `themeConnected` | `boolean` | `true` when the theme repository contains `scripts/content/sync.mjs` |
| `themeDepsInstalled` | `boolean` | The theme repository's `node_modules` exists (decides whether local validation is possible) |
| `git` | `GitStatus \| null` | Git summary of the content repository; `null` when it is not a git repository |

`GitStatus`: `branch`, `ahead`, `behind`, `staged[]`, `modified[]`, `untracked[]` (lists of file paths relative to the repository).

```bash
curl http://127.0.0.1:5175/api/status
```

```json
{
  "contentDir": "D:\\blogs\\Shirone-Content",
  "themeDir": "D:\\blogs\\Shirone",
  "contentConnected": true,
  "themeConnected": true,
  "themeDepsInstalled": true,
  "git": { "branch": "main", "ahead": 0, "behind": 0, "staged": [], "modified": [], "untracked": [] }
}
```

## POST /api/preview/start

Starts the live site preview processes: launches `content:watch` (content watch & sync) and `astro dev` (:4321) in the theme repository. If already running, it directly returns “已在运行”. **Side effects**: creates two background process trees; on Windows they are started via `cmd /c` and reclaimed with a tree-wide `taskkill` when the service exits.

```bash
curl -X POST http://127.0.0.1:5175/api/preview/start
```

```json
{ "started": true, "message": "真站预览已启动，首次启动需等待依赖编译" }
```

Treat the poll of `/api/preview/status` as the source of truth for `ready` (the first launch needs compilation, so readiness lags the start).

## POST /api/preview/stop

Terminates the preview process trees. **Side effects**: kills every child process started by start; a dev server from another source (such as the one-command startup script) is out of scope.

```bash
curl -X POST http://127.0.0.1:5175/api/preview/stop
```

Returns `{ "stopped": true }`.

## GET /api/preview/status

Queries preview status; the frontend polls it every 3 seconds.

```bash
curl http://127.0.0.1:5175/api/preview/status
```

```json
{ "running": true, "ready": true, "procs": ["node content-watch.mjs", "astro dev"] }
```

| Field | Description |
|-------|-------------|
| `running` | The preview processes managed by this service are running |
| `ready` | `http://localhost:4321/` is actually reachable (a dev server from any source counts) |
| `procs` | List of process descriptions |
