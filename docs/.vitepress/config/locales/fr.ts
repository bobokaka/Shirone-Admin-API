import type { LocaleSpecificConfig } from "vitepress";

type LocaleConfig = LocaleSpecificConfig & { label: string };

export const fr: LocaleConfig = {
  lang: "fr-FR",
  label: "Français",
  title: "Shirone Admin Docs",
  description: "Documentation officielle de Shirone-Admin — l'outil de gestion visuelle de contenu pour le blog Shirone. Installation, utilisation, configuration et référence API.",
  themeConfig: {
    nav: [
      { text: "Accueil", link: "/fr/" },
      { text: "Guide", link: "/fr/guide/" },
      { text: "Référence API", link: "/fr/api/" },
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
      message: `<div style="display:flex;flex-direction:row;flex-wrap:wrap;justify-content:center;width:100%">
    <div style="display:inline-block;margin-bottom:4px;margin-right:8px">版权所有 ©2025-present  湖南衍宇科技有限公司 </div>
    <div style="margin-right:8px;display:inline-block;margin-bottom:4px">
      <a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank">湘ICP备2025108289号-1 </a>
    </div>
    <div style="margin-right:8px;display:inline-block;margin-bottom:4px">
      <div style="display:flex;align-items:center;justify-content:center">
        <img style="width:18px;height:18px;margin-right:12px" src="/shironeadmin/assets/image/home/police-icon.png"/>
        <a style="height:auto" href="https://beian.mps.gov.cn/#/query/webSearch?code=43010402002123" rel="noreferrer" target="_blank">湘公网安备43010402002123号</a>
      </div>
    </div>
  </div>`,
    },
    search: { provider: "local" },
  },
};
