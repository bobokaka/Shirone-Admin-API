---
title: Post Editing
description: The complete guide to the Markdown source editor—toolbar, image uploads, the post info drawer (date/category/encryption/access path), plus AI-assisted writing and the auto-save mechanism.
---

# Post Editing

The post editor is the most feature-dense page of the console. Enter it by creating a post from [Post Management](./posts.md) or clicking "Edit"—the full editing page includes **side-by-side live preview**; the in-place editor on the Post Management page is the same editor in single-pane form.

![Post Editing](/assets/guide/post-editor.png)

## Top Bar Actions

From left to right:

| Button | Purpose |
|--------|---------|
| Back (“返回”) | Auto-saves, then returns to the previous page |
| Title input | A large, always-present input box—rename at any time |
| Post Info (“文章信息”) | Opens the metadata drawer (see below) |
| Delete (“删除”) | Deletes the post and all images in its directory; requires double confirmation |
| Save (“保存”) | Persists to the content repository immediately |
| Save & Go Publish (“保存并去发布”) | Saves, then jumps directly to [Commit & Publish](./publish.md) |

The top bar also displays an "Auto-saved at HH:mm:ss" hint showing the time of the last auto save.

## The Editor

The editor uses **Markdown source mode** (based on md-editor-v3 + CodeMirror): you write raw Markdown on the left, and the split pane on the right renders a live preview. The toolbar covers common formatting: bold, italic, strikethrough, headings, quotes, lists, tasks, inline code, code blocks, links, images, tables, undo/redo, plus preview/TOC toggles.

**Images with zero friction**: paste a screenshot or upload via the image button in the editor, and the file is stored automatically in the current post directory's `images/` subdirectory, with a relative reference (`./images/xxx.webp`) inserted into the body. Posts are therefore self-contained—copying the whole directory away carries the complete post.

When AI is enabled, an **AI dropdown tool** appears at the end of the toolbar; see [AI-Assisted Writing](#ai-assisted-writing) below.

## The Post Info Drawer

The "Post Info" drawer holds all metadata (corresponding to the post's frontmatter):

### Basic Fields

- **Publish date** (`YYYY-MM-DD`) and **exact time**—use it to control ordering when multiple posts go live on the same day; time zones are normalized to `+08:00` automatically
- **Category**—dropdown of existing categories (with usage counts); typing a new name and pressing Enter creates it
- **Tags**—multi-select, also supports typing to create
- **Description**—when left empty, the theme auto-extracts the beginning of the body; the cover supports local upload or an external URL
- **Toggles**—Draft / Pinned / Comment / Encrypted

### Encrypted Posts

Checking "Encrypted (“加密”)" expands three fields:

- **Access password**—for posts with a password already set, entering a value changes it while leaving it blank keeps it; unchecking "Encrypted" clears the password
- **Password hint**—the hint visitors see before entering the password
- **Hide preview on home cards**—prevents encrypted content from leaking to the home page as an excerpt

### Access Path

Three modes determine the post's final URL, with a live address preview at the bottom:

| Mode | URL Shape | Use Case |
|------|-----------|----------|
| Default | `/posts/<post-name>/` | Regular posts |
| Custom alias | `/posts/<alias>/` | When you want shorter, more semantic URLs |
| Root-path permalink | `/<custom-path>/` | Carefully crafted showcase pages, e.g. `/about-me/` |

## AI-Assisted Writing

> [!NOTE]
> The features below require the AI Assistant to be enabled first ([how to configure](./ai.md#configure-providers)). When not enabled, no AI entry appears in the toolbar and writing features are unaffected.

The AI dropdown tool bundles 5 actions + custom instructions. All actions **preserve code and the Shirone theme's private extension syntax verbatim** (triple-colon containers, file-tree, etc.):

| Action | Scope | How the Result Is Applied |
|--------|-------|---------------------------|
| AI Enhance Content (“AI完善内容”) | Whole document | Fills argumentation gaps, strengthens logical flow—preview first, then apply |
| AI Format Cleanup (“AI格式优化”) | Whole document | Normalizes heading levels, unifies punctuation, completes code-fence languages—preview first, then apply |
| AI Polish (“AI润色”) | **Selection first** | With selected text, replaces it directly; without a selection, goes through a whole-document diff preview |
| AI Continue (“AI续写”) | End of document | Continues naturally from the ending; the result is appended to the body |
| AI Generate Summary (“AI生成摘要”) | Whole document | Generates an 80–160 character summary back into "Post Info" (confirms first if a summary exists) |
| Custom instructions | Selection or whole document | Executes after you type any instruction (e.g. "rewrite in a more conversational style") |

**Diff preview** is the safety net for whole-document rewrite actions (enhance/format cleanup/polish without selection/custom instructions): the AI result streams into a side-by-side diff view, long unchanged stretches collapse automatically, and "Previous/Next change (“上一处/下一处”)" jumps block by block. Only after reviewing does "Apply Replace (“应用替换”)" actually rewrite the body; content from a stopped generation is incomplete and cannot be applied. When the body length changes by more than 20%, the preview box warns in red text to prompt careful review.

All AI actions execute in the global [AI Console](./ai.md#ai-console): the thinking process is visible and can be stopped at any time.

## Auto Save

The editor has a non-intrusive auto-save mechanism:

- It checks every **10 seconds** and silently persists only if the title or body changed
- **Switching posts, clicking Back, or leaving the editing page** also triggers an auto save first
- The only case that stops you: an empty title (nothing to persist)—you will be prompted to fill in the title first

Auto save covers only the title and body; metadata in the "Post Info" drawer persists via the "Save" button.

## Next Steps

- Learn about [Moments](./moments.md)—lighter-weight sharing than posts
- Once your content is ready, head to [Commit & Publish](./publish.md)
