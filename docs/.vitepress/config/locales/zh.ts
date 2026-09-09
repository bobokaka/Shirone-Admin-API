import type { LocaleSpecificConfig } from "vitepress";

type LocaleConfig = LocaleSpecificConfig & { label: string };

export const zh: LocaleConfig = {
  lang: "zh-CN",
  label: "简体中文",
  title: "Shirone Admin API",
  description: "基于 VitePress 2.0 构建的多语言文档站模板，内置 Mermaid 图表、数学公式、全文搜索与暗色模式",
  themeConfig: {
    nav: [
      { text: "首页", link: "/zh/" },
    ],
    sidebar: {} as any,
    outline: { label: "本页目录", level: [2, 3] },
    docFooter: { prev: "上一页", next: "下一页" },
    lastUpdated: { text: "最后更新于" },
    returnToTopLabel: "回到顶部",
    sidebarMenuLabel: "菜单",
    darkModeSwitchLabel: "主题",
    lightModeSwitchTitle: "切换到浅色模式",
    darkModeSwitchTitle: "切换到深色模式",
    footer: {
      message: `Copyright © 2026-present bobokaka · Powered by <a href="https://vitepress.dev/" target="_blank">VitePress</a>`,
    },
    search: { provider: "local" },
  },
};
