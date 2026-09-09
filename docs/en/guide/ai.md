---
title: AI Assistant
description: Configure and use Shirone-Admin's AI capabilities—multi-provider switching, dual-protocol support, the global streaming console, and a tour of AI entry points across every page.
---

# AI Assistant

Shirone-Admin's AI capabilities are an **optional enhancement**: without configuration, every feature works as usual; with configuration, writing, importing, and publishing each gain a set of intelligent assists. This chapter covers configuration first, then usage.

## Configure Providers

Click the **gear** in the top bar to open the "Settings (“设置”)" dialog, then choose "AI Assistant (“AI助手”)" in the left menu.

![AI provider configuration](/assets/guide/app-settings.png)

### Core Concepts

- **Multiple providers**—save multiple connection profiles (up to 20) and switch which one is active at any time. Suited to people holding both an official API and a relay proxy, or switching between models on demand
- **Dual protocol**—each profile picks one of two:
  - `anthropic`—Anthropic-compatible protocol (`v1/messages`), fitting the official API and various "Anthropic-compatible" relays
  - `openai`—OpenAI-compatible protocol (`chat/completions`), fitting OpenAI and the vast majority of domestic model APIs
- **Master switch**—when "Enable (“启用”)" is off, all AI entries are hidden and the API rejects everything

### Fields of Each Provider Profile

| Field | Notes |
|-------|-------|
| Name | Display name, e.g. `Anthropic 官方` / `GLM 中转` |
| Protocol | anthropic / openai |
| API URL | The root URL suffices (`https://api.anthropic.com` or `https://api.openai.com/v1`); bare roots, URLs with `/v1`, and proxy sub-paths are all tolerated |
| API Key | Stored only in the local `server/data/ai-settings.json`; **never written to the content repository**, never leaked through publishing |
| Main model | For everyday tasks, e.g. `claude-sonnet-5` / `gpt-4o-mini` / `glm-5.3` |
| Fast model | For simple tasks like summaries and tag suggestions; **empty = same as the main model** (one less thing to configure) |
| Web search | Attaches a web search tool to services that support it; automatically degrades to a plain request when the service doesn't |
| Temperature | Sampling temperature 0–2, default 0.7 |
| Timeout | Per-request timeout in seconds, 5–86400, default 30 |

### Configuration Workflow

1. Click + to **Add Provider (“新增服务商”)** (default name "Default Profile N"; typing replaces it)
2. Fill in the fields, or use **paste import**: paste the `settings.json` env block from Claude Code, a shell `export` statement, or dotenv content, and 10 keys like `ANTHROPIC_*` / `OPENAI_*` are recognized and filled in automatically
3. **Test Connection (“测试连接”)**—test without saving; returns latency and the model's reply; once it passes, **Save (“保存”)**

> [!WARNING]
> `server/data/ai-settings.json` contains plaintext API keys. The file is gitignored, but avoid copying it anywhere that might get committed or shared.

## AI Console

The global floating panel opened by the **✨ button** in the top bar—this is where all AI tasks execute:

![AI Console](/assets/guide/ai-console.png)

Two forms:

- **Task form**—AI actions triggered from feature pages (polish, continue, draft…) execute here: instruction entries with a "Task (“任务”)" badge, the model's **thinking process** (collapsible), body text streaming in, plus elapsed time and model annotation
- **Chat form**—after a task ends, follow up directly in the input box (carrying context for further edits), or just chat; Enter sends, Shift+Enter inserts a newline

General capabilities: **stop at any time** (after stopping, existing content is kept or restored depending on the scenario), click the title bar to **Collapse (“收起”)** without losing the panel, **New Chat (“新对话”)** clears everything. When multi-turn history exceeds 60k characters, the oldest turns are dropped automatically; the thinking stream keeps the most recent 8000 characters.

## AI Entry Points on Each Page

Once enabled, AI features appear in these locations (organized by page):

| Page | Entry | Capability |
|------|-------|------------|
| [Post Editing](./post-editor.md#ai-assisted-writing) | Toolbar AI dropdown | Enhance content / format cleanup / polish (selection first) / continue / generate summary / custom instructions, with diff preview for whole-document rewrites |
| [Moments](./moments.md#ai-assistance-optional) | Composer buttons | Body polish (streaming refill), tag and mood suggestions |
| [Data Management](./data.md#field-level-ai-) | Edit dialog ✨ | Generate and rewrite description fields for projects/skills/anime etc. |
| [Data Management · Timeline](./data.md#timeline-ai-drafting) | AI Draft button | Summarize git history / draft events from a note; check and insert |
| [Data Management · Playlist](./data.md#playlist-import-music) | Import Music | Search the web for tracks with license info attached |
| [Site Settings](./settings.md#basic-info) | Input ✨ | One-shot generation of subtitle and bio |
| [Site Settings · Banner](./settings.md#banner-wallpaper) | AI Generate copy | Generate the whole set of typewriter rotating lines |
| [Platform Import](./import.md#single-post-paste) | Auto-triggered | Complete title/description/category/tags for pasted articles |
| [Commit & Publish](./publish.md#commit-messages) | AI Generate button | Generate commit messages for both repositories (auto-fallback on non-compliance) |

Additionally, the editor toolbar's AI menu shows a loading animation and blocks repeat triggers during generation; all streaming tasks share one console, and only one runs at a time.

## Design Philosophy

- **AI never blocks the main flow**—commit message generation falls back to heuristics on failure; import metadata falls back to a body excerpt; polish restores the original text on stop
- **Preview before applying**—whole-document rewrites always go through diff confirmation, never overwriting your text directly
- **Light tasks use the fast model**—small tasks like tag suggestions and summaries go to `modelFast` with thinking disabled, saving money and time

## Next Steps

- Return to [Post Editing](./post-editor.md) and try AI polish for real
- See AI commit message generation in [Commit & Publish](./publish.md)
