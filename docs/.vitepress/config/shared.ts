import type { HeadConfig } from "vitepress";

// 站点域名：用于 sitemap 与 RSS
export const hostname = "https://shironeadmin.evocosmos.com";

// 站点部署子路径（VitePress base），head/主题运行时字符串中的绝对资源路径需手动携带此前缀
export const siteBase = "/shironeadmin/";

export const head: HeadConfig[] = [
  ["meta", { name: "keywords", content: "VitePress,文档,文档站,多语言,i18n,Markdown,Mermaid,技术文档,API 文档" }],
  ["meta", { name: "author", content: "bobokaka" }],
  ["link", { rel: "icon", href: "/shironeadmin/favicon.ico" }],
  ["link", { rel: "stylesheet", href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" }],
];

export const sharedConfig = {
  // 部署在 https://shironeadmin.evocosmos.com/shironeadmin/ 子路径
  base: siteBase,
  lastUpdated: true,
  cleanUrls: true,
  srcExclude: ["**/*.snippet.md"] as string[],
  sitemap: {
    hostname,
    // VitePress 生成的 sitemap 条目不含 base 前缀，这里统一补上
    transformItems(items) {
      const prefixUrl = (url?: string) =>
        url ? `${siteBase}${url.replace(/^\/+/, "")}` : url;
      return items.map((item) => ({
        ...item,
        url: prefixUrl(item.url),
        links: item.links?.map((link) => ({ ...link, url: prefixUrl(link.url) })),
      }));
    },
  },
  ignoreDeadLinks: true,
};
