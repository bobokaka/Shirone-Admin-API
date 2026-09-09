---
title: 文章
description: /api/posts 文章 CRUD、/api/slug slug 建议与 /api/taxonomy/rename 分类标签批量改写的接口参考。
---

# 文章

文章模块直接操作内容仓 `content/posts/`。所有路径参数为相对该目录的 POSIX 风格路径。列表**置顶优先、按发布日期倒序**。

## GET /api/posts

返回全量文章元信息列表（不含正文）。

**返回值** `PostMeta[]`，每项关键字段：

| 字段 | 类型 | 说明 |
|------|------|------|
| `slug` | `string` | 目录名（目录式）或文件名去 `.md` |
| `path` | `string` | 相对路径，如 `hello/index.md` |
| `layout` | `"directory" \| "file"` | 目录式 / 平铺式 |
| `title` / `published` / `description` / `image` / `category` / `tags` | — | 元信息，`published` 为 `YYYY-MM-DD` |
| `publishedAt` / `updated` / `updatedAt` | `string?` | 精确时间与更新时间 |
| `pinned` / `draft` / `comment` / `encrypted` / `hideHomeContent` | `boolean` | 开关 |
| `hasPassword` | `boolean` | 是否已设密码（**永不回传密码本身**） |
| `passwordHint` | `string` | 密码提示 |
| `alias` / `permalink` | `string?` | 自定义访问路径 |

```bash
curl http://127.0.0.1:5175/api/posts
```

## GET /api/posts/detail

读取单篇完整内容。

| Query 参数 | 必填 | 说明 |
|------------|------|------|
| `path` | 是 | 文章相对路径 |

**返回值** `PostFile`：`{ meta: PostMeta, body: string }`。路径不存在时 `404`。

```bash
curl "http://127.0.0.1:5175/api/posts/detail?path=hello/index.md"
```

## POST /api/posts

新建文章（**草稿状态**）。目录式落盘为 `content/posts/<slug>/index.md`。

| Body 字段 | 类型 | 必填 | 默认 | 说明 |
|-----------|------|------|------|------|
| `title` | `string` | 是 | — | 标题，不能为空 |
| `slug` | `string` | 否 | 由标题拼音转写 | 自定义目录名；非法字符自动清洗、重名去重 |

**返回值** `PostFile`（新建后的文章）。**副作用**：在内容仓创建目录与 `index.md`；`slug` 未传时按现有文章去重。

```bash
curl -X POST http://127.0.0.1:5175/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"我的第一篇文章"}'
```

## PUT /api/posts

保存文章。frontmatter **合并写回**：只更新 `meta` 里出现的键，正文整体替换；序列化保证 `published` 等日期格式不变。

| Body 字段 | 类型 | 必填 | 默认 | 说明 |
|-----------|------|------|------|------|
| `path` | `string` | 是 | — | 目标文章路径 |
| `body` | `string` | 否 | `""` | 正文全文（整体替换） |
| `meta` | `object` | 否 | `{}` | 要更新的 frontmatter 键值；`alias`/`permalink` 传空串即清除该键 |
| `password` | `string` | 否 | — | **仅设置/修改密码时传**；不传保留原值 |
| `clearPassword` | `boolean` | 否 | — | `true` 时清除密码（如取消加密） |

**返回值** 保存后的 `PostFile`。

```bash
curl -X PUT http://127.0.0.1:5175/api/posts \
  -H "Content-Type: application/json" \
  -d '{"path":"hello/index.md","meta":{"draft":false},"body":"# 你好\n\n正文。"}'
```

## DELETE /api/posts

删除文章。目录式文章限删 `slug` 顶层（整个目录连同配图），平铺式删单文件。

| Query 参数 | 必填 | 说明 |
|------------|------|------|
| `path` | 是 | 文章相对路径 |

**返回值** `{ "ok": true }`。

```bash
curl -X DELETE "http://127.0.0.1:5175/api/posts?path=hello/index.md"
```

## POST /api/slug

生成或清洗 slug（标题经拼音转写、非法字符替换、与现有文章去重）。

| Body 字段 | 类型 | 必填 | 说明 |
|-----------|------|------|------|
| `title` | `string` | 否（默认 `""`） | 标题；仅在**不传 `slug`** 时用于生成 |
| `slug` | `string` | 否 | 传入则只做清洗，不生成 |

**返回值** `SlugSuggestion`：`{ slug: string, adjusted: boolean, note?: string }`——`adjusted=true` 表示发生替换或去重，`note` 给出原因。

```bash
curl -X POST http://127.0.0.1:5175/api/slug \
  -H "Content-Type: application/json" \
  -d '{"title":"快速上手指南"}'
```

## POST /api/taxonomy/rename

分类/标签批量重命名：改写**所有命中文章**的 frontmatter。目标名已存在即合并；`to` 传空串 = 从所有文章中移除。

| Body 字段 | 类型 | 必填 | 说明 |
|-----------|------|------|------|
| `kind` | `"category" \| "tag"` | 是 | 改分类还是标签 |
| `from` | `string` | 是 | 原名（不能为空） |
| `to` | `string` | 是 | 目标名；空串 = 移除 |

**返回值** `{ changed, kind, from, to }`——`changed` 为改写到的文章数。**副作用**：逐篇改写文件（标签场景自动去重），日期字段格式保持不变。

```bash
curl -X POST http://127.0.0.1:5175/api/taxonomy/rename \
  -H "Content-Type: application/json" \
  -d '{"kind":"tag","from":"JS","to":"JavaScript"}'
```
