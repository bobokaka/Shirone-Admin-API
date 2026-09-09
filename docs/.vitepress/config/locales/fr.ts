import type { LocaleSpecificConfig } from "vitepress";

type LocaleConfig = LocaleSpecificConfig & { label: string };

export const fr: LocaleConfig = {
  lang: "fr-FR",
  label: "Français",
  title: "Shirone Admin API",
  description: "Modèle de site de documentation multilingue basé sur VitePress 2.0, avec diagrammes Mermaid, formules mathématiques, recherche plein texte et mode sombre",
  themeConfig: {
    nav: [
      { text: "Accueil", link: "/fr/" },
    ],
    sidebar: {} as any,
    outline: { label: "Sur cette page", level: [2, 3] },
    docFooter: { prev: "Précédent", next: "Suivant" },
    lastUpdated: { text: "Dernière mise à jour" },
    returnToTopLabel: "Retour en haut",
    sidebarMenuLabel: "Menu",
    darkModeSwitchLabel: "Apparence",
    lightModeSwitchTitle: "Passer au thème clair",
    darkModeSwitchTitle: "Passer au thème sombre",
    footer: {
      message: `Copyright © 2026-present bobokaka · Powered by <a href="https://vitepress.dev/" target="_blank">VitePress</a>`,
    },
    search: { provider: "local" },
  },
};
