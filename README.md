# Shirone-Admin-API

<div align="center">

![VitePress](https://img.shields.io/badge/VitePress-2.0.0--alpha.17-646CFF)
![Vue](https://img.shields.io/badge/Vue-3.5.33-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18-339933)
![License](https://img.shields.io/badge/License-Apache%202.0-yellow)

**[Shirone-Admin](https://github.com/bobokaka/Shirone-Admin) 官方文档**

从零上手的入门指南 · 随查随用的 API 参考 · 9 种语言

<!-- 在线文档上线后在此补充链接：[在线阅读]() · -->
[Shirone-Admin](https://github.com/bobokaka/Shirone-Admin) · [本地开发](#本地开发) · [贡献指南](#贡献指南)

</div>

## 简介

本仓库是开源项目 **Shirone-Admin** 的官方文档站——之于 Shirone-Admin，正如 [vuejs.org](https://vuejs.org/) 之于 Vue。

**Shirone-Admin 是什么？** 它是 [Shirone](https://github.com/LyraVoid/Shirone) 博客的可视化内容管理工具：本地单机运行、前后端分离、AI 辅助写作、一键双仓发布。如果你还没接触过它，从[指南](#文档内容)开始即可，不需要任何背景知识。

文档站基于 **VitePress 2.0 + Vue 3 + TypeScript** 构建，内置多语言、Mermaid 图表、数学公式、全文搜索、Giscus 评论与 RSS 订阅。

## 文档内容

文档从两类读者的需求出发组织：

| 板块 | 目录 | 面向读者 | 内容形态 |
|------|------|----------|----------|
| **指南** | `docs/<lang>/guide/` | 初学者 | 安装、快速上手、功能教程——由浅入深，每步可复现，不预设背景知识 |
| **API 参考** | `docs/<lang>/api/` | 熟练使用者 | 配置项、接口、组件、命令——字典式随查随用，每条附最小示例 |

### 多语言支持

简体中文（`zh`）为基准语言，其余语言结构与条目一一对应：

| 语言 | 代码 | 目录 |
|------|------|------|
| 简体中文 | `zh` | `docs/zh/` |
| 繁体中文 | `zh-Hant` | `docs/zh-hant/` |
| 英文 | `en` | `docs/en/` |
| 日文 | `ja` | `docs/ja/` |
| 韩文 | `ko` | `docs/ko/` |
| 法文 | `fr` | `docs/fr/` |
| 德文 | `de` | `docs/de/` |
| 西班牙文 | `es` | `docs/es/` |
| 俄文 | `ru` | `docs/ru/` |

## 本地开发

适用于想参与文档编写或本地预览站点的贡献者。

### 环境要求

- **Node.js**: >= 18
- **pnpm**: >= 8

### 启动开发服务器

```bash
git clone https://github.com/bobokaka/Shirone-Admin-API.git
cd Shirone-Admin-API
pnpm install
pnpm run dev
```

打开浏览器访问 `http://localhost:5173/`（根路径自动跳转到 `/zh/`）。日常写文档只需 `dev`，保存即热更新。

### 构建与预览

```bash
pnpm run build     # 构建生产版本（约需 20GB 内存）
pnpm run preview   # 本地预览构建结果
```

> 完整构建需要约 20GB 内存，普通电脑可能在构建中卡死。开发调试请使用 `pnpm run dev`，仅在准备部署时执行构建。

## 项目结构

```
Shirone-Admin-API/
├── docs/                          # 文档根目录
│   ├── index.md                   # 根路径重定向到 /zh/
│   ├── zh/                        # 简体中文（基准语言）
│   │   ├── guide/                 # 指南：面向初学者
│   │   └── api/                   # API 参考：面向熟练使用者
│   ├── zh-hant/ en/ ja/ ko/ fr/ de/ es/ ru/
│   └── .vitepress/
│       ├── config.mts             # 配置入口
│       ├── config/                # 主配置、共享配置、侧边栏、各语言 locale
│       ├── theme/                 # 主题定制（自定义首页布局、组件、样式）
│       └── public/                # 静态资源（favicon、logo、图片）
├── package.json
└── LICENSE                        # Apache 2.0
```

## 部署

构建产物在 `docs/.vitepress/dist/`，可部署到任何静态托管服务（Vercel、Netlify、GitHub Pages、Nginx 等）。部署前把 `docs/.vitepress/config/shared.ts` 中的 `hostname` 改为实际域名（影响 sitemap 与 RSS）。

## 贡献指南

欢迎通过 [Issues](https://github.com/bobokaka/Shirone-Admin-API/issues) 报告文档错误，或直接提交 Pull Request（内容纠错、新章节、翻译均欢迎）：

1. Fork 本仓库
2. 创建特性分支（`git checkout -b docs/your-topic`）
3. 提交更改（格式：`type(scope): 中文描述`，如 `docs(guide): 补充安装步骤`）
4. 推送分支并提交 Pull Request

## 许可证

[Apache 2.0](LICENSE)
