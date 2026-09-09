---
title: Platform Import
description: Bring Jianshu articles into your blog—two paths via archive import or web single-post paste, guided by a five-step wizard, with AI auto-completing metadata.
---

# Platform Import

Currently blogging on another platform? The "Platform Import (“平台导入”)" page provides the migration channel. **Jianshu** is currently supported; the page has per-platform tabs at the top, and more platforms will extend this.

There are two import paths—choose one when entering the page:

| Method | Best For | Input |
|---------|----------|-------|
| **Archive import** | Whole-site migration, dozens or hundreds of posts | The rar / zip obtained from Jianshu's official "download all articles as an archive" feature |
| **Single post paste** | Hand-picked posts, paste-and-convert on the spot | Content selected and copied from an article page on the web version |

![Platform Import](/assets/guide/import.png)

## Archive Import

A five-step wizard: **Choose method → Upload archive → Select articles → Content conversion → Import done**.

### Step 1: Upload the Export Archive

Request the export in Jianshu under "Settings → Account Management → Download All Articles as Archive" (Jianshu emails you a download link), then drag the archive into the upload area. Limits: zip / rar format, ≤30MB per archive.

After upload, the server unpacks and parses it in memory, listing all articles grouped by **notebook**.

### Step 2: Select Articles

- After a successful parse, articles not yet imported are **selected by default**
- Whole-notebook selection, select all / clear all are supported
- Already-imported articles are marked "Imported (“已导入”)" and unselectable, preventing duplicates
- Each article can be "**Preview (“预览”)**"-ed first—see the converted Markdown without touching disk

The right side of the page sets import options:

| Option | Notes |
|--------|-------|
| Unified publish date | Jianshu exports contain no dates; all articles get this one publish date (changeable per post later) |
| Notebooks as categories | When checked, each notebook name becomes the article's category directly; otherwise you specify one unified category manually |
| Tags | Appends these tags uniformly to this batch |
| Localize images | Downloads Jianshu CDN images into each article's `images/` directory; failed downloads keep the remote link |
| Import as drafts | **Recommended to keep checked**—review in [Post Management](./posts.md) first, then publish |

### Step 3: Content Conversion

After you click start, the server creates a **background job** to convert article by article; the page polls progress every 2 seconds: total, completed, and the title currently being processed. You can leave the page mid-way—the job keeps running.

### Step 4: Done

When the job finishes, a result list shows each article's outcome, repository path, and number of localized images. Failures come with reasons (a single failure does not affect other articles). You can "Import Another Archive (“导入下一包”)" to continue, or jump to Post Management to inspect the results.

## Single Post Paste

A five-step wizard: **Choose method → Paste content → Content conversion → Post info → Import done**.

1. **Paste**—open the article in Jianshu's web version, select all and copy, then `Ctrl+V` straight into the editor: rich text converts to Markdown automatically (headings, bold, links, images all preserved), source on the left and preview on the right, with manual fixes still possible
2. **Content conversion**—on confirmation the server persists it: images download automatically into the article directory (failures keep remote links), creating a directory-style post
3. **Post info**—AI analyzes the body and **auto-completes**: title (drafted by AI when left empty), description, category, and tag suggestions—everything manually editable; when AI is unavailable it falls back to an excerpt of the body, clearly flagged with `aiUsed=false`
4. **Finalize**—metadata is written back to the post, done. One click jumps to [Post Editing](./post-editor.md) for further polish

> [!TIP]
> The title input also has a paste fallback: when the clipboard holds only rich text (common when copying from the web), the plain text is extracted automatically and compressed into a single line.

## Sessions and Jobs

- Uploading an export archive creates a **session** (parse results cached in server memory), valid for 24 hours, with at most 3 kept simultaneously—the oldest is evicted on timeout/overflow; "Switch Archive (“换一个包”)" discards the current session immediately
- Background import job results are kept for 1 hour
- After a service restart, in-memory sessions and jobs are cleared—just re-upload the archive; **already-imported articles are unaffected** (they are already in the content repository)

## Next Steps

- Review imported articles one by one in [Post Management](./posts.md) and clear the draft flag
- For bulk category changes, use [Post Management · Category Management](./posts.md#category--tag-management)
