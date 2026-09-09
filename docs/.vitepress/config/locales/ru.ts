import type { LocaleSpecificConfig } from "vitepress";

type LocaleConfig = LocaleSpecificConfig & { label: string };

export const ru: LocaleConfig = {
  lang: "ru-RU",
  label: "Русский",
  title: "Shirone Admin API",
  description: "Многоязычный шаблон сайта документации на VitePress 2.0 со схемами Mermaid, математическими формулами, полнотекстовым поиском и тёмной темой",
  themeConfig: {
    nav: [
      { text: "Главная", link: "/ru/" },
    ],
    sidebar: {} as any,
    outline: { label: "На этой странице", level: [2, 3] },
    docFooter: { prev: "Предыдущая", next: "Следующая" },
    lastUpdated: { text: "Последнее обновление" },
    returnToTopLabel: "Наверх",
    sidebarMenuLabel: "Меню",
    darkModeSwitchLabel: "Тема",
    lightModeSwitchTitle: "Переключить на светлую тему",
    darkModeSwitchTitle: "Переключить на тёмную тему",
    footer: {
      message: `Copyright © 2026-present bobokaka · Powered by <a href="https://vitepress.dev/" target="_blank">VitePress</a>`,
    },
    search: { provider: "local" },
  },
};
