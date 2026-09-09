import type { LocaleSpecificConfig } from "vitepress";

type LocaleConfig = LocaleSpecificConfig & { label: string };

export const zhHant: LocaleConfig = {
  lang: "zh-Hant",
  label: "繁體中文",
  title: "Shirone Admin API",
  description: "基於 VitePress 2.0 構建的多語言文檔站模板，內置 Mermaid 圖表、數學公式、全文搜索與暗色模式",
  themeConfig: {
    nav: [
      { text: "首頁", link: "/zh-hant/" },
    ],
    sidebar: {} as any,
    outline: { label: "本頁目錄", level: [2, 3] },
    docFooter: { prev: "上一頁", next: "下一頁" },
    lastUpdated: { text: "最後更新於" },
    returnToTopLabel: "回到頂部",
    sidebarMenuLabel: "選單",
    darkModeSwitchLabel: "主題",
    lightModeSwitchTitle: "切換到淺色模式",
    darkModeSwitchTitle: "切換到深色模式",
    footer: {
      message: `Copyright © 2026-present bobokaka · Powered by <a href="https://vitepress.dev/" target="_blank">VitePress</a>`,
    },
    search: { provider: "local" },
  },
};
