import type { HeadConfig } from "vitepress";

// 站点域名：用于 sitemap 与 RSS
export const hostname = "https://shironeadmin.evocosmos.com";

export const head: HeadConfig[] = [
  ["meta", { name: "keywords", content: "VitePress,文档,文档站,多语言,i18n,Markdown,Mermaid,技术文档,API 文档" }],
  ["meta", { name: "author", content: "bobokaka" }],
  ["link", { rel: "icon", href: "/favicon.ico" }],
  ["link", { rel: "stylesheet", href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" }],
];

export const sharedConfig = {
  lastUpdated: true,
  cleanUrls: true,
  srcExclude: ["**/*.snippet.md"] as string[],
  sitemap: {
    hostname,
  },
  ignoreDeadLinks: true,
};
