---
title: 系统与预览
description: /api/status 连接状态探测与 /api/preview/* 真站预览进程管理的接口参考。
---

# 系统与预览

系统模块回答两个问题：**工作区连接是否正常**、**博客前台 dev server 是否在跑**。管理后台顶栏的连接标签与各页的真站预览面板即由这组接口驱动。

## GET /api/status

探测工作区状态。无参数，永不出错（内部失败的字段返回 `null`/`false`）。

**返回值** `SystemStatus`：

| 字段 | 类型 | 说明 |
|------|------|------|
| `contentDir` / `themeDir` | `string` | 解析后的内容仓 / 主题仓绝对路径（来源：`.env` 或默认相对位置） |
| `contentConnected` | `boolean` | 内容仓目录下存在 `content/` 即为 `true` |
| `themeConnected` | `boolean` | 主题仓存在 `scripts/content/sync.mjs` 即为 `true` |
| `themeDepsInstalled` | `boolean` | 主题仓 `node_modules` 存在（决定能否本地校验） |
| `git` | `GitStatus \| null` | 内容仓 git 概要；非 git 仓时 `null` |

`GitStatus`：`branch`、`ahead`、`behind`、`staged[]`、`modified[]`、`untracked[]`（文件相对路径列表）。

```bash
curl http://127.0.0.1:5175/api/status
```

```json
{
  "contentDir": "D:\\blogs\\Shirone-Content",
  "themeDir": "D:\\blogs\\Shirone",
  "contentConnected": true,
  "themeConnected": true,
  "themeDepsInstalled": true,
  "git": { "branch": "main", "ahead": 0, "behind": 0, "staged": [], "modified": [], "untracked": [] }
}
```

## POST /api/preview/start

拉起真站预览进程：在主题仓启动 `content:watch`（内容监听同步）与 `astro dev`（:4321）。已在运行时直接返回「已在运行」。**副作用**：创建两个后台进程树；Windows 下通过 `cmd /c` 启动，服务退出时以 `taskkill` 连树回收。

```bash
curl -X POST http://127.0.0.1:5175/api/preview/start
```

```json
{ "started": true, "message": "真站预览已启动，首次启动需等待依赖编译" }
```

`ready` 与否请以轮询 `/api/preview/status` 为准（首次需编译，就绪晚于启动）。

## POST /api/preview/stop

终止预览进程树。**副作用**：杀掉由 start 启动的全部子进程；若 dev server 来自其他来源（如一键启动脚本），不在回收范围。

```bash
curl -X POST http://127.0.0.1:5175/api/preview/stop
```

返回 `{ "stopped": true }`。

## GET /api/preview/status

查询预览状态，前端 3 秒轮询一次。

```bash
curl http://127.0.0.1:5175/api/preview/status
```

```json
{ "running": true, "ready": true, "procs": ["node content-watch.mjs", "astro dev"] }
```

| 字段 | 说明 |
|------|------|
| `running` | 本服务管理的预览进程在跑 |
| `ready` | `http://localhost:4321/` 实际可达（任何来源的 dev server 均可） |
| `procs` | 进程描述列表 |
