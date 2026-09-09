import type { LocaleSpecificConfig } from "vitepress";

type LocaleConfig = LocaleSpecificConfig & { label: string };

export const de: LocaleConfig = {
  lang: "de-DE",
  label: "Deutsch",
  title: "Shirone Admin API",
  description: "Mehrsprachige Dokumentations-Website-Vorlage auf Basis von VitePress 2.0, mit Mermaid-Diagrammen, mathematischen Formeln, Volltextsuche und Dunkelmodus",
  themeConfig: {
    nav: [
      { text: "Startseite", link: "/de/" },
    ],
    sidebar: {} as any,
    outline: { label: "Auf dieser Seite", level: [2, 3] },
    docFooter: { prev: "Vorherige", next: "Nächste" },
    lastUpdated: { text: "Zuletzt aktualisiert" },
    returnToTopLabel: "Nach oben",
    sidebarMenuLabel: "Menü",
    darkModeSwitchLabel: "Erscheinungsbild",
    lightModeSwitchTitle: "Zum hellen Thema wechseln",
    darkModeSwitchTitle: "Zum dunklen Thema wechseln",
    footer: {
      message: `Copyright © 2026-present bobokaka · Powered by <a href="https://vitepress.dev/" target="_blank">VitePress</a>`,
    },
    search: { provider: "local" },
  },
};
