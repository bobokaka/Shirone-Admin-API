---
title: 结构化数据
description: /api/data/:kind 八类结构化数据的读写，与 /api/bangumi/* 番剧条目检索及封面导入的接口参考。
---

# 结构化数据

结构化数据模块读写内容仓 `data/*.ts`——文件里的 `interface`、注释、导出语句**逐字保留**，只整体替换导出的数组字面量。读取经 tsx 动态 import（带 mtime query 绕过缓存），枚举字段保存前校验。

## kind 与文件映射

路径参数 `kind` 八选一：

| `kind` | 文件 | 导出数组 | 条目 |
|--------|------|----------|------|
| `projects` | `data/projects.ts` | `projectsData` | 项目 |
| `skills` | `data/skills.ts` | `skillsData` | 技能 |
| `timeline` | `data/timeline.ts` | `timelineData` | 时间线事件 |
| `devices` | `data/devices.ts` | `devicesData` | 设备 |
| `anime` | `data/anime.ts` | `animeData` | 番剧 |
| `compass` | `data/compass.ts` | `compassData` | 罗盘书架 |
| `music` | `data/music.ts` | `musicTracks` | 歌单曲目 |
| `friends` | `data/friends.ts` | `friendsData` | 友链 |

## GET /api/data/:kind

**返回值** `{ kind, items: DataItem[] }`——`DataItem` 为弱类型对象（字段结构见各文件 interface，或[指南 · 结构化数据](../guide/data.md#八类数据)的字段表）。

```bash
curl http://127.0.0.1:5175/api/data/friends
```

## PUT /api/data/:kind

**整体替换**该类数据的全部条目。

| Body 字段 | 类型 | 必填 | 说明 |
|-----------|------|------|------|
| `items` | `object[]` | 是 | 全量条目（先 GET 再改再 PUT，勿只传增量） |

**返回值** `{ ok: true, changed }`。**副作用**：写回 `data/*.ts` 的数组区间；文件其余部分不动。

```bash
curl -X PUT http://127.0.0.1:5175/api/data/skills \
  -H "Content-Type: application/json" \
  -d '{"items":[{"name":"TypeScript","category":"frontend","level":"advanced","enable":true}]}'
```

---

# Bangumi 番剧检索

番剧导入的三件套，数据来自 Bangumi 公开 API，用于番剧条目的搜索补全。

## GET /api/bangumi/search

| Query 参数 | 必填 | 说明 |
|------------|------|------|
| `keyword` | 是 | 关键词，1–100 字符（固定检索动画类型条目） |

**返回值** `{ candidates: BangumiCandidate[] }`——每项含 `id`（Bangumi subject id）、`title` / `originalTitle`、`year`、`cover?`、`summary`、`eps`、`bangumiScore?`、`link`。

```bash
curl "http://127.0.0.1:5175/api/bangumi/search?keyword=葬送的芙莉莲"
```

## GET /api/bangumi/subject

| Query 参数 | 必填 | 说明 |
|------------|------|------|
| `id` | 是 | Bangumi subject id（正整数，字符串亦可） |

**返回值** `BangumiDetail`：在 Candidate 基础上补全 `studio?`（制作公司）、`period?`（放送档期 `{ start, end? }`）、`genres[]`（高频类型标签 ≤4 个）。

```bash
curl "http://127.0.0.1:5175/api/bangumi/subject?id=463652"
```

## POST /api/bangumi/cover-import

封面图导入：服务端从 Bangumi 图床下载，以条目标题命名落仓到 `public/assets/anime/`。

| Body 字段 | 类型 | 必填 | 说明 |
|-----------|------|------|------|
| `url` | `string` | 是 | 封面直链。**白名单校验**：仅接受 `lain.bgm.tv` / `api.bgm.tv` / `bgm.tv` / `bangumi.tv` / `ei.hdslb.com`，其余 400 |
| `title` | `string` | 是 | 条目标题（1–200 字符，用于命名） |
| `currentPath` | `string` | 否 | 命中同目录时原位替换 |

**返回值** `MediaUploadResult`。

```bash
curl -X POST http://127.0.0.1:5175/api/bangumi/cover-import \
  -H "Content-Type: application/json" \
  -d '{"url":"https://lain.bgm.tv/pic/cover/l/xx.jpg","title":"葬送的芙莉莲"}'
```
