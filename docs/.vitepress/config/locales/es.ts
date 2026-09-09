import type { LocaleSpecificConfig } from "vitepress";

type LocaleConfig = LocaleSpecificConfig & { label: string };

export const es: LocaleConfig = {
  lang: "es-ES",
  label: "Español",
  title: "Shirone-Admin",
  description: "Documentación oficial de Shirone-Admin — la herramienta de gestión visual de contenidos para el blog Shirone. Instalación, uso, configuración y referencia de API.",
  themeConfig: {
    nav: [
      { text: "Inicio", link: "/es/" },
    ],
    sidebar: {} as any,
    outline: { label: "En esta página", level: [2, 3] },
    docFooter: { prev: "Anterior", next: "Siguiente" },
    lastUpdated: { text: "Última actualización" },
    returnToTopLabel: "Volver arriba",
    sidebarMenuLabel: "Menú",
    darkModeSwitchLabel: "Apariencia",
    lightModeSwitchTitle: "Cambiar a tema claro",
    darkModeSwitchTitle: "Cambiar a tema oscuro",
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
