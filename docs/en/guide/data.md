---
title: Structured Data
description: Visually edit the blog's eight types of structured data—projects, skills, timeline, devices, anime, compass, playlist, friends—including anime search import, music import, and AI timeline drafting.
---

# Structured Data

The projects, skills, and device lists on the blog's "Me" page, the sidebar's anime watch list, friends, and background playlist—these are all **structured data**: each type is a TypeScript array in the content repository's `data/*.ts`. The "Data Management (“数据管理”)" page turns all of them into table + form visual editing, with changes **persisted to the repository instantly**.

![Data Management](/assets/guide/data.png)

## Eight Data Types

| Tab | Entries | Typical Fields |
|-----|---------|----------------|
| Projects | Projects | Name, description, category, stage (released/in development/exploring), tech stack, featured |
| Skills | Skills | Name, category (frontend/backend/tools/game dev), level (beginner→expert), icon |
| Timeline | Events | Title, date, category (milestone/project/experience/life), highlights, related links |
| Devices | Devices | Name, brand, category, status (in use/standby/retired/wishlist), specs |
| Anime | Anime | Title, status (watching/finished/planned/on hold/dropped), score, progress, genres, cover |
| Compass | Bookshelves | Name, icon, navigation entries (name + link + note) |
| Playlist | Tracks | Title, artist, cover, audio URL, duration |
| Friends | Friend links | Site name, avatar, description, URL, tags |

## Common Operations

- **Add**—opens the edit dialog for field-by-field entry; missing required fields are intercepted with a prompt
- **Toggle directly in the table**—boolean fields like "Featured (“精选”)" and "Enabled (“启用”)" are switches right in the table; flip and it saves
- **Reorder**—the ↑↓ buttons on the right of each row adjust order (array order equals frontend display order), persisted instantly
- **Edit / Delete**—Edit reopens the dialog with all fields loaded; Delete requires double confirmation

A few effort-saving details:

- **Identifier fields are auto-generated**—identifier columns like project key, device id, and track id need no manual input: on creation the title is converted to a pinyin slug (duplicates get a suffix), and friend ids take max + 1
- **Icon fields**—enter an Iconify icon name (e.g. `simple-icons:typescript`) for an instant preview; icons are all bundled locally with no network requests
- **Image fields**—covers support local upload (auto-routed to the right asset directory by data type) or pasting a path; anime/playlist have dedicated one-click imports, see below
- **Entry lists for compass and timeline**—nested arrays like "Navigation Entries (“导航条目”)" and "Related Links (“关联链接”)" are edited as visual cards—name/icon/URL of each sub-entry filled in one row, with required-field validation

All changes are written back to `data/*.ts` through a **serialized save queue**—interface definitions, comments, and export statements in the file are preserved verbatim; only the array literal is replaced, so hand-maintained code is never touched.

## Anime: Search Import

The anime tab has a dedicated "**Search Import (“搜索导入”)**" button, with data from the [Bangumi](https://bgm.tv/) public API:

![Anime search import](/assets/guide/data-anime.png)

1. **Search**—enter a Chinese/Japanese/English title and get a candidate list (with year, episode count, score, cover)
2. **Pick an entry**—details are fetched automatically: studio, broadcast period, top genre tags
3. **Confirm**—generates a new anime draft: title/year/genres/description/cover/studio all pre-filled, while **status and score are left for you to decide**; the cover is downloaded from Bangumi's official image host into `public/assets/anime/`

Tracking what you watch no longer requires hand-typing metadata—finish one, search one.

## Playlist: Import Music

The playlist tab's "**Import Music (“导入音乐”)**" offers three ways to add tracks:

- **AI search**—describe the song you want (title/style); AI searches the web and attaches **license info** (free for commercial use or not, with evidence links); after confirmation, audio and cover land in the repository automatically
- **Direct-link import**—paste an audio direct link and the server downloads it on your behalf (even ones the browser cannot fetch due to CORS)
- **Local upload**—upload audio files directly

After importing, click **▶ Preview (“试听”)** in the table; the bottom player bar plays on selection—save only when it sounds right.

## Timeline: AI Drafting

The timeline tab's "**AI Draft (“AI起草”)**" button (visible when AI is enabled) generates event drafts in bulk via two modes:

- **git mode**—scans the commit history of all three repositories (up to 30 per repo, with file add/delete stats) and AI summarizes them into timeline events: perfect for "what did I do this month" retrospectives
- **note mode**—you write a one-line description and AI drafts it into a well-formed event (title/date/category/highlights/tags)

The generated draft list supports **per-item checking**; already-recorded events are deduplicated automatically (matched by title + date). On confirmed insertion, each event is inserted at the correct position by date and persisted; the date format is auto-converted to the dot style the site uses (`2025.06.01`).

## Field-Level AI ✨

Long-text fields like descriptions (project description, skill description, anime description, friend description, timeline description, device description) have a **✨ button** in the top right of the edit dialog: once the entry's title is filled, one click has AI generate or rewrite the field in 1–3 sentences. The result streams directly into the input box—stoppable and manually editable.

## Next Steps

- Once the site's storefront is tuned, move on to [Site Settings](./settings.md)
- After the data is filled in, go live via [Commit & Publish](./publish.md)
