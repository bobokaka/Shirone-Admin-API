import type { LocaleSpecificConfig } from "vitepress";

type LocaleConfig = LocaleSpecificConfig & { label: string };

export const en: LocaleConfig = {
  lang: "en-US",
  label: "English",
  title: "Shirone Admin API",
  description: "A multilingual documentation site template built on VitePress 2.0, with Mermaid diagrams, math formulas, full-text search and dark mode",
  themeConfig: {
    nav: [
      { text: "Home", link: "/en/" },
    ],
    sidebar: {} as any,
    outline: { label: "On this page", level: [2, 3] },
    docFooter: { prev: "Previous", next: "Next" },
    lastUpdated: { text: "Last updated" },
    returnToTopLabel: "Return to top",
    sidebarMenuLabel: "Menu",
    darkModeSwitchLabel: "Appearance",
    lightModeSwitchTitle: "Switch to light theme",
    darkModeSwitchTitle: "Switch to dark theme",
    footer: {
      message: `Copyright © 2026-present bobokaka · Powered by <a href="https://vitepress.dev/" target="_blank">VitePress</a>`,
    },
    search: { provider: "local" },
  },
};
