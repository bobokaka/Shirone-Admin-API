---
title: Post Management
description: Browse, filter, preview, and organize all your posts—a two-pane layout with filters on the left and preview on the right, plus bulk rename and merge for categories/tags.
---

# Post Management

The "Post Management (“文章管理”)" page is your main entry point for working with posts: browse all posts, filter by category and tag, quickly preview bodies, and bulk-tidy your taxonomy.

![Post Management](/assets/guide/posts.png)

The page is split into two panes: **left, the post list** (filtering + selection), **right, the content preview** (reading or in-place editing). Click any post on the left and the right renders its Markdown body immediately.

## Creating a New Post

Click "**New Post (“新建文章”)**" on the toolbar, enter a title in the dialog (changeable at any time after creation), and confirm:

1. The backend creates a post in **draft state** under `content/posts/` in the content repository
2. You are automatically redirected to the [Post Editing](./post-editor.md) page to start writing

The post title is transliterated via pinyin into a URL-friendly directory name (slug), e.g. 《快速上手指南》→ `kuai-su-shang-shou-zhi-nan/index.md`. Duplicates get an automatic numeric suffix.

## Browsing and Filtering

The toolbar provides three filters that can be combined:

| Filter | Behavior |
|--------|----------|
| Search box | Matches **title, category, and tags** simultaneously (case-insensitive) |
| Category dropdown | Shows only posts in that category; the count in parentheses after each option is the number of posts |
| Tag dropdown | Shows only posts carrying that tag |

The list header shows "Posts (filtered / total)" in real time. Each post row shows the title, publish date, category, plus status tags: yellow "Draft (“草稿”)", "Pinned (“置顶”)", and red "Encrypted (“加密”)".

## Preview and In-Place Editing

After selecting a post, the right pane shows:

- **Title and metadata**: date, category, tags, draft/pinned/encrypted tags
- **Body rendering**: Markdown rendered live; images inside the post's directory (`./images/…` relative references) display directly
- The **Edit (“编辑”)** button: switches the right pane in place into the full editor (the same UI as the [Post Editing](./post-editor.md) page, just without the split-pane preview). The "Split-Pane Editing (“分栏编辑”)" icon in the editor's top right jumps to the full editing page with side-by-side preview; returning automatically restores the editing state of this post
- The **Delete (“删除”)** button: for directory-style posts, a confirmation warns "this will delete the post and all images in its directory"; content already committed to git can be recovered from history

> [!TIP]
> While in-place editing, switching posts on the left with unsaved changes triggers a **silent auto save** first—nothing is ever lost (see [Post Editing · Auto Save](./post-editor.md#auto-save)).

## Category / Tag Management

The "**Category Management (“分类管理”)**" on the right of the toolbar opens the bulk-cleanup dialog—the only place the site-wide taxonomy ever needs maintenance:

- Category / Tag tabs at the top; lists sorted by **post usage count, descending**
- **Rename / Merge**: renames a category (or tag) to a new name; if the new name already exists, the two are effectively **merged**. The backend rewrites each post's frontmatter one by one while preserving date formats
- **Remove**: deletes this category/tag from all posts (the posts themselves are unaffected)

For example, to unify scattered "JS" and "JavaScript" into "JavaScript": run rename on "JS", enter `JavaScript`, confirm, and all related posts are rewritten automatically.

## How Posts Live on Disk

Understanding the storage layout makes backups and troubleshooting easier:

```
content/posts/
├── hello/                  # Directory style (default for new posts): images managed alongside
│   ├── index.md
│   └── images/
│       └── cover.webp
└── old-post.md             # Flat style (legacy posts or external imports): single file
```

- New posts are always **directory style**; images uploaded in the editor go into that directory's `images/` subdirectory automatically
- The list is sorted by **pinned first, then publish date descending**

## Next Steps

- Enter the [Post Editing](./post-editor.md) page to learn about the editor, post info, and AI-assisted writing
- After editing, go to [Commit & Publish](./publish.md) to go live
