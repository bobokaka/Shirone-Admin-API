---
title: Dashboard & Preview
description: Get to know the home page of the Shirone-Admin console—four stat cards, recent content lists, and a preview panel embedding your real blog site.
---

# Dashboard & Preview

The first page you see after opening `http://localhost:5173/` is the **dashboard**. It is the overview of the entire console: how many changes await publishing, how many posts and Moments exist, plus a preview window rendering your blog's real look in real time.

![Dashboard](/assets/guide/dashboard.png)

## The Four Stat Cards

| Card | What the Number Means | Quick Action |
|------|-----------------------|--------------|
| **Pending Changes** | Total git-changed files in the content repository: staged + modified + untracked | "Go Publish (“去发布”)" → jumps to [Commit & Publish](./publish.md) |
| **Total Posts** | All posts in the content repository (including drafts) | "Manage Posts (“管理文章”)" → jumps to [Post Management](./posts.md) |
| **Total Moments** | All Moments (including drafts) | "Manage Moments (“管理说说”)" → jumps to [Moments](./moments.md) |
| **Total Drafts** | Combined count of posts and Moments flagged as draft | "Keep Writing (“继续创作”)" → jumps to Post Management |

"Pending Changes" is the summary of all your uncommitted changes made in the console—if you have written posts and posted Moments and this number is non-zero, you have not published yet.

## Recent Content

Below the stat cards, two list cards show the **6 most recent posts** and the **6 most recent Moments**:

- Post rows show title and publish date; drafts carry a yellow tag
- Moment rows show time, pinned/draft/tags; the body is excerpted to the first three lines, with up to 3 thumbnails (click to enlarge)
- The "More (“更多”)" link at the top right jumps to the corresponding management page

## Live Site Preview

The "Live Site Preview (“真站预览”)" card at the bottom of the page embeds an iframe that loads `http://localhost:4321/`—the **real site** rendered by the theme repository's Astro dev server. It is not a screenshot or a simplified mock; the preview is exactly identical to the future published site.

### Status Indicators and Controls

The preview panel's top toolbar, from left to right:

- **Status badge** (polled every 3 seconds):
  - Site ready `:4321` — preview available
  - Detected dev server already running `:4321` — preview available (process not started by this panel)
  - Starting, first run needs compilation… — Astro is cold-starting, please wait a moment
  - Not running — you need to click "Start Preview"
- **Start Preview (“启动预览”) / Stop (“停止”)** — starts or terminates the theme repository's `content:watch` + `astro dev` processes from the console
- **Open in New Window (“新窗口打开”)** — opens a browser tab accessing `:4321` directly

The dashboard's preview panel does not start processes automatically (to avoid surprises); you must click "Start Preview" manually. If you used the one-command startup via `node workspace/content-watch.mjs`, the dev server is already running and the panel shows ready immediately.

### Why the Preview Is "Real"

[Three-Repo Workspace](./workspace.md) introduced the data flow: save in the console → write to the content repository → `content:watch` materializes into the theme repository → Astro recompiles. So when you tweak some copy in the console and save, the blog in the preview updates a few seconds later—**what you see is the real site that is about to be published**.

## Top Bar and Global Entry Points

The top bar shared by every page:

- **Page title** — the name of the current feature page
- **Connection status badge** — content repository "Connected / Not Connected" (see [Three-Repo Workspace · How to Check Connection Status](./workspace.md#how-to-check-connection-status))
- **✨ button** — opens the global [AI Console](./ai.md#ai-console)
- **Gear button** — opens the "Settings (“设置”)" dialog ([AI provider configuration](./ai.md#configure-providers) and the About page)

## Next Steps

- [Write your first post](./posts.md)
- [Post a Moment](./moments.md)
