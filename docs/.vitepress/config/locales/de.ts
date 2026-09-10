import type { LocaleSpecificConfig } from "vitepress";

type LocaleConfig = LocaleSpecificConfig & { label: string };

export const de: LocaleConfig = {
  lang: "de-DE",
  label: "Deutsch",
  title: "Shirone-Admin",
  description: "Offizielle Dokumentation von Shirone-Admin — dem visuellen Content-Management-Tool für den Shirone-Blog. Installation, Nutzung, Konfiguration und API-Referenz.",
  themeConfig: {
    nav: [
      { text: "Startseite", link: "/de/" },
      { text: "Anleitung", link: "/de/guide/" },
      { text: "API-Referenz", link: "/de/api/" },
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
      message: `<div style="display:flex;flex-direction:row;flex-wrap:wrap;justify-content:center;width:100%">
    <div style="display:inline-block;margin-bottom:4px;margin-right:8px">版权所有 ©2025-present  湖南衍宇科技有限公司 </div>
    <div style="margin-right:8px;display:inline-block;margin-bottom:4px">
      <a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank">湘ICP备2025108289号-1 </a>
    </div>
    <div style="margin-right:8px;display:inline-block;margin-bottom:4px">
      <div style="display:flex;align-items:center;justify-content:center">
        <img style="width:18px;height:18px;margin-right:12px" src="/assets/image/home/police-icon.png"/>
        <a style="height:auto" href="https://beian.mps.gov.cn/#/query/webSearch?code=43010402002123" rel="noreferrer" target="_blank">湘公网安备43010402002123号</a>
      </div>
    </div>
  </div>`,
    },
    search: { provider: "local" },
  },
};
