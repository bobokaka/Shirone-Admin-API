---
title: Publish & Validation
description: API reference for /api/publish/* publish preview, remote probing, one-click publish, and /api/validate dry-run validation.
---

# Publish & Validation

The publish module wraps git operations for the two repositories (content + theme). The two **never block each other**; each returns its own independent `RepoPublishResult`.

## GET /api/publish/preview

First-screen data for the publish page: change details for both repositories, auto-generated commit messages, recent commits and status. No parameters.

**Return value** `PublishPreview`, key fields:

| Field | Description |
|-------|-------------|
| `branch` / `ahead` / `behind` | Content repository branch and ahead/behind (locally cached values) |
| `changes` / `files` | Content repository change details `{ path, state: "new" \| "modified" }[]` and file list |
| `message` | Auto-generated commit message for the content repository |
| `themeChanges` / `themeFiles` / `themeMessage` / `themeStatus` / `themeRecent` | The theme repository counterparts (`themeStatus` is `null` when not connected) |
| `themeDepsInstalled` | Whether theme dependencies are installed (decides whether local validation is possible) |
| `recent` | The content repository's latest 20 commits `{ hash, date, subject }` |

```bash
curl http://127.0.0.1:5175/api/publish/preview
```

## POST /api/publish/probe

Lightweight remote comparison: `git ls-remote` compares branch tips, **pulling no code or objects**.

| Body field | Type | Required | Description |
|------------|------|----------|-------------|
| `repo` | `"content" \| "theme"` | Yes | Which repository to probe |

**Return value** `RemoteProbe`: `{ behind: number | null }`—`0` means in sync with the remote; `>0` is the exact number of commits behind; `null` means the remote has advanced but the count is unknown (determinable only after a pull).

```bash
curl -X POST http://127.0.0.1:5175/api/publish/probe \
  -H "Content-Type: application/json" -d '{"repo":"content"}'
```

## POST /api/publish

One-click publish. Flow: content repository (**validate → add -A → commit → pull --rebase --autostash → push**; a validation failure blocks that repository) + theme repository (commit → push, no local validation).

| Body field | Type | Required | Description |
|------------|------|----------|-------------|
| `contentMessage` | `string` | No | Content repository commit message; **empty = auto-generated** (must match `type(scope): ≤30 characters`) |
| `themeMessage` | `string` | No | Theme repository commit message; same as above |

**Return value** `PublishResult`:

```json
{
  "ok": true,
  "content": { "ok": true, "hadChanges": true, "commitHash": "a1b2c3d", "pushed": true, "log": ["..."] },
  "theme":  { "ok": true, "hadChanges": false, "pushed": false, "log": ["无变更，跳过"] }
}
```

Per-repository `RepoPublishResult`: `ok` (that repository succeeded overall), `hadChanges`, `commitHash?`, `pushed`, `validationOutput?` (the full log when the content repository fails validation), `log[]` (step-by-step execution record). Top-level `ok = content.ok && theme.ok`.

```bash
curl -X POST http://127.0.0.1:5175/api/publish \
  -H "Content-Type: application/json" -d '{}'
```

> [!WARNING]
> This is the endpoint that actually creates git commits and pushes. Calling `preview` first to confirm the scope of changes is recommended; a content repository validation failure produces no commits at all.

## POST /api/validate

Runs the pre-publish validation alone: executes `scripts/content/sync.mjs --dry-run` in the theme repository (environment carries `CONTENT_DIR`; 180-second timeout; output tail-truncated to 4000 characters). **An in-memory preflight—nothing is written to disk and no changes are made**.

**Return value** `{ ok: boolean, output: string }`—`output` is the validator's output (pinpointing YAML format, field spelling, and frontmatter schema problems).

```bash
curl -X POST http://127.0.0.1:5175/api/validate
```
