# Shirone Admin API Docs

<div align="center">

![VitePress](https://img.shields.io/badge/VitePress-2.0.0--alpha.17-646CFF)
![Vue](https://img.shields.io/badge/Vue-3.5.33-brightgreen)
![License](https://img.shields.io/badge/License-Apache%202.0-yellow)

基于 VitePress 2.0 的多语言文档站模板

[快速开始](#快速开始) · [VitePress 文档](https://vitepress.dev/)

</div>

## 项目简介

一个开箱即用的多语言文档站模板，基于 **VitePress 2.0 + Vue 3 + TypeScript** 构建。内置 9 种语言配置、Mermaid 图表、数学公式、全文搜索、Giscus 评论与 RSS 订阅，克隆即可开始写文档。

### 核心特性

- **多语言架构**：内置 9 种语言（简繁中文、英、日、韩、法、德、西、俄），每种语言独立的目录与界面文案配置
- **丰富文档功能**：Mermaid 图表、数学公式、高亮标记、上下标、脚注
- **搜索**：VitePress 本地全文搜索，支持按语言定制搜索界面
- **评论与订阅**：Giscus 评论（GitHub Discussions）、RSS 订阅开箱即用
- **自定义首页**：基于 frontmatter 的 hero / features / highlights 分区渲染，带滚动进入动画
- **暗色模式**：全站及 Mermaid 图表均适配
- **响应式设计**：适配桌面端和移动端，含 RTL 样式支持

## 快速开始

### 环境要求

- **Node.js**: >= 18
- **pnpm**: >= 8

### 安装与启动

```bash
git clone https://github.com/bobokaka/Shirone-Admin-API.git
cd Shirone-Admin-API
pnpm install
pnpm run dev
```

打开浏览器访问 `http://localhost:5173/`（根路径自动跳转到 `/zh/`）。

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
│   ├── zh/                        # 简体中文（默认语言）
│   ├── zh-hant/                   # 繁体中文
│   ├── en/                        # 英文
│   ├── ja/  ko/  fr/  de/  es/  ru/
│   └── .vitepress/
│       ├── config.mts             # 配置入口
│       ├── config/
│       │   ├── index.ts           # 主配置（主题、插件、Markdown）
│       │   ├── shared.ts          # 共享配置（hostname、head、sitemap）
│       │   ├── sidebar-generated.ts  # 侧边栏配置
│       │   └── locales/           # 各语言 locale 配置
│       ├── theme/                 # 主题定制
│       │   ├── Layout.vue         # 自定义布局
│       │   ├── components/        # HomeHighlights、SiteInfo 组件
│       │   ├── composables/       # useMermaidLinks
│       │   └── styles/            # 全局样式、暗色模式、RTL
│       └── public/                # 静态资源（favicon、logo、图片）
│
├── .claude/                       # Claude Code 配置（commands + skills）
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.json
└── LICENSE                        # Apache 2.0
```

## 多语言支持

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

## 如何编写文档

1. 在 `docs/<lang>/` 下创建 `.md` 文件（如 `docs/zh/guide/getting-started.md`）
2. 在 `docs/.vitepress/config/sidebar-generated.ts` 中补充对应语言的侧边栏条目：

```ts
export const sidebar: SidebarConfig = {
  "/zh/guide/": [
    { text: "快速开始", link: "/zh/guide/getting-started/" },
  ],
};
```

3. 如需在导航栏加入入口，编辑 `docs/.vitepress/config/locales/<lang>.ts` 的 `nav` 配置
4. 首页（`docs/<lang>/index.md`）通过 frontmatter 的 `hero`、`features`、`highlights` 字段驱动自定义首页组件

### 添加新语言

1. 在 `docs/.vitepress/config/locales/` 下创建新的语言配置文件（可参考现有文件）
2. 在 `config/index.ts` 的 `locales` 中导入并注册
3. 在 `docs/` 下创建对应语言的内容目录
4. 在 `themeConfig.search.options.locales` 中补充搜索界面文案

## 配置要点

| 位置 | 用途 |
|------|------|
| `config/shared.ts` | 站点域名（sitemap/RSS 用）、head 标签、keywords |
| `config/index.ts` | 主题配置、Giscus/RSS 插件参数、Markdown 扩展 |
| `config/locales/*.ts` | 各语言的标题、描述、导航、页脚 |
| `config/sidebar-generated.ts` | 各语言的侧边栏 |

> 使用 Giscus 评论前，需在 [giscus.app](https://giscus.app) 生成自己仓库的配置，替换 `config/index.ts` 中的 `giscusPlugin` 参数。

## 部署

构建产物在 `docs/.vitepress/dist/`，可部署到任何静态托管服务（Vercel、Netlify、GitHub Pages、Nginx 等）。部署前记得把 `config/shared.ts` 中的 `hostname` 改为实际域名。

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改（格式：`type(scope): 中文描述`）
4. 推送到分支并提交 Pull Request

## 许可证

[Apache 2.0](LICENSE)
