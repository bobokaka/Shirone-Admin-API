import type { LocaleSpecificConfig } from "vitepress";

type LocaleConfig = LocaleSpecificConfig & { label: string };

export const es: LocaleConfig = {
  lang: "es-ES",
  label: "Español",
  title: "Shirone Admin API",
  description: "Plantilla de sitio de documentación multilingüe basada en VitePress 2.0, con diagramas Mermaid, fórmulas matemáticas, búsqueda de texto completo y modo oscuro",
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
      message: `Copyright © 2026-present bobokaka · Powered by <a href="https://vitepress.dev/" target="_blank">VitePress</a>`,
    },
    search: { provider: "local" },
  },
};
