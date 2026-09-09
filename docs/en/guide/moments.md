---
title: Moments
description: Publish and manage Moments—mood, location, tags, automatic batching of up to nine uploaded images, plus AI polish and tag suggestions.
---

# Moments

"Moments (“说说”)" are a lighter content form than posts: a passing thought, a few photos, a mood icon. The composer sits at the top of the page and the Moments stream below—write and publish on the spot.

![Moments](/assets/guide/moments.png)

## Publishing a Moment

The composer card, top to bottom:

1. **Body**—a multi-line text box for whatever is on your mind
2. **Image area**—up to **9 images**; click + to choose, or paste directly
3. **Metadata row**—mood / location / tags / publish time / pinned
4. **Action row**—AI Polish (when AI is enabled) / Save Draft (“存草稿”) / Publish Moment (“发布说说”)

### Mood Icons

Nine preset moods to choose from: 😊 happy, 🤩 excited, 😐 calm, 😔 down, 😢 sad, ❤️ love, 🎉 celebrate, ☕ coffee, 🌙 good night. Icons are stored as Iconify names (all bundled locally, no network requests) and rendered as the corresponding icons on the frontend.

### How Images Are Archived

All images published together enter **the same batch directory**:

```
public/images/moments/<yyyymmdd-HHmmss>/   # batch id matches the Moment's filename
├── 1.webp
└── 2.webp
```

Concurrent multi-file uploads also land in the same batch (the batch id is generated up front). This directory rule is not arbitrary—the theme's thumbnail pipeline **scans only** `public/images/moments/`; images stored elsewhere cannot get thumbnails on the frontend, so the backend enforces the storage location.

> [!TIP]
> Removing an image before publishing only drops it from this publish; the file stays in the repository. Deleting the whole Moment likewise keeps its image files—clean them up manually when needed.

### AI Assistance (Optional)

When AI is enabled, the composer gains two extra entries:

- **AI Polish (“AI润色”)**—rewrites the body with streaming output that grows directly in the input box (natural and conversational, preserving tone and facts); stop at any time—stopping restores the original text
- **AI Suggest (“AI建议”)**—extracts 2–4 tags from the body (merged and deduplicated against existing tags) and guesses the mood (an existing selection is never overridden)

## Managing the Moments Stream

The list below supports combined filtering and pagination (8 per page):

| Filter | Notes |
|--------|-------|
| Search box | Matches body, location, tags |
| Status dropdown | All / Published / Draft |
| Multi-select tags | Clicking a tag on a card also filters instantly (click again to clear) |
| Pinned only | Checkbox |

Each Moment card offers:

- **Edit (“编辑”)**—loads content back into the composer above (newly uploaded images go into a **new batch**, never mixed into the old directory); after editing, click "Publish Moment" to save
- **Pin toggle**—pin/unpin in one click; the list refreshes immediately
- **Delete (“删除”)**—removes the `.md` file after double confirmation (images are kept)

## Moments vs. Posts

| | Posts | Moments |
|---|-------|---------|
| Content form | Long-form writing + metadata system | Short text + images + mood |
| Storage | `content/posts/<slug>/index.md` | `content/moments/<yyyymmdd-HHmmss>.md` |
| Typical use | Tutorials, notes, deep reflections | Status updates, musings, quick notes |

## Next Steps

- Use [Structured Data](./data.md) to showcase your devices, anime, and friends
- After writing content, head to [Commit & Publish](./publish.md)
