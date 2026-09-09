import { defineConfig } from "vitepress";
import path from "node:path";
import fs from "node:fs";
import { withMermaid } from "vitepress-plugin-mermaid";
import { giscusPlugin } from "vitepress-plugin-giscus";
import { RssPlugin } from "vitepress-plugin-rss";
import { head, sharedConfig, hostname } from "./shared.js";
import { sidebar } from "./sidebar-generated.js";
import { zh } from "./locales/zh.js";
import { en } from "./locales/en.js";
import { zhHant } from "./locales/zh-hant.js";
import { ja } from "./locales/ja.js";
import { fr } from "./locales/fr.js";
import { ko } from "./locales/ko.js";
import { ru } from "./locales/ru.js";
import { de } from "./locales/de.js";
import { es } from "./locales/es.js";
import mark from "markdown-it-mark";
import sub from "markdown-it-sub";
import sup from "markdown-it-sup";
import footnote from "markdown-it-footnote";

// 将自动生成的 sidebar 合并到各 locale
// 筛选以 locale 前缀开头的所有 section key，实现侧边栏按模块隔离
const mergeSidebar = (locale: typeof zh, prefix: string) => {
  const sidebarObj = sidebar as Record<string, unknown>;
  const filteredSidebar: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(sidebarObj)) {
    if (key === prefix || key.startsWith(prefix)) {
      filteredSidebar[key] = value;
    }
  }

  return {
    ...locale,
    themeConfig: {
      ...locale.themeConfig,
      sidebar: filteredSidebar,
    },
  };
};

// 静态文件服务插件 — 修复 VitePress alpha dev server 的 SPA fallback 拦截静态资源 bug
function publicAssetsPlugin() {
  const __dirname = path.dirname(new URL(import.meta.url).pathname.replace(/^\//, ""));
  const publicDir = path.resolve(__dirname, "../public");
  const mimeTypes: Record<string, string> = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".webp": "image/webp",
    ".avif": "image/avif",
    ".txt": "text/plain",
    ".xml": "application/xml",
    ".json": "application/json",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
  };

  return {
    name: "public-assets-fix",
    configureServer(server: any) {
      // 直接注入中间件到 connect 中间件栈（与 VitePress 内部插件同级）
      server.middlewares.use((req: any, res: any, next: any) => {
        const url = req.url?.split("?")[0];
        if (!url) return next();
        const ext = path.extname(url).toLowerCase();
        if (!ext || !mimeTypes[ext]) return next();

        const filePath = path.join(publicDir, url);
        if (!fs.existsSync(filePath)) return next();

        const stat = fs.statSync(filePath);
        if (!stat.isFile()) return next();

        res.setHeader("Content-Type", mimeTypes[ext] || "application/octet-stream");
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        fs.createReadStream(filePath).pipe(res);
      });
    },
  };
}

export default withMermaid(defineConfig({
  // 站点元数据
  head,
  ...sharedConfig,

  // 主题共享配置
  themeConfig: {
    logo: "/logo.png",
    siteTitle: "Shirone Admin API",
    socialLinks: [
      { icon: "github", link: "https://github.com/bobokaka/Shirone-Admin-API" },
    ],
    search: {
      provider: "local",
      options: {
        locales: {
          "/zh/": { translations: { button: { buttonText: "搜索文档" } } },
          "/en/": { translations: { button: { buttonText: "Search" } } },
          "/zh-hant/": { translations: { button: { buttonText: "搜尋文件" } } },
          "/ja/": { translations: { button: { buttonText: "ドキュメントを検索" } } },
          "/fr/": { translations: { button: { buttonText: "Rechercher" } } },
          "/ko/": { translations: { button: { buttonText: "문서 검색" } } },
          "/ru/": { translations: { button: { buttonText: "Поиск" } } },
          "/de/": { translations: { button: { buttonText: "Suche" } } },
          "/es/": { translations: { button: { buttonText: "Buscar" } } },
        },
      },
    },
  },

  // 多语言配置
  // 注意：locale key 不能带前导/尾随斜杠，VitePress 内部会自动拼接 /${key}/
  locales: {
    root: {
      lang: "zh-CN",
      themeConfig: {
        nav: [{ text: "首页", link: "/zh/" }],
      },
    },
    zh: { ...mergeSidebar(zh, "/zh/") },
    en: { ...mergeSidebar(en, "/en/") },
    "zh-hant": { ...mergeSidebar(zhHant, "/zh-hant/") },
    ja: { ...mergeSidebar(ja, "/ja/") },
    fr: { ...mergeSidebar(fr, "/fr/") },
    ko: { ...mergeSidebar(ko, "/ko/") },
    ru: { ...mergeSidebar(ru, "/ru/") },
    de: { ...mergeSidebar(de, "/de/") },
    es: { ...mergeSidebar(es, "/es/") },
  },

  // Markdown 配置
  markdown: {
    theme: { light: "one-light", dark: "one-dark-pro" },
    lineNumbers: true,
    math: true,
    config(md) {
      md.use(mark);
      md.use(sub);
      md.use(sup);
      md.use(footnote);
    },
  },

  // Vite 插件配置
  vite: {
    plugins: [
      publicAssetsPlugin(),
      // Giscus 评论：需在 https://giscus.app 生成自己仓库的配置后替换下列参数
      giscusPlugin({
        repo: "bobokaka/Shirone-Admin-API-feedback",
        repoId: "",
        category: "Announcements",
        categoryId: "",
        mapping: "pathname",
        inputPosition: "top",
        loading: "lazy",
        lang: "zh-CN",
      }),
      RssPlugin({
        title: "Shirone Admin API Docs",
        baseUrl: hostname,
        copyright: "Copyright © 2026-present bobokaka",
        description: "基于 VitePress 2.0 的多语言文档站模板",
        language: "zh-cn",
        filename: "feed.rss",
        icon: false,
        author: { name: "bobokaka", link: hostname },
      }),
    ],
  },
}));
