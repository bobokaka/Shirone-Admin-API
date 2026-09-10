import type { LocaleSpecificConfig } from "vitepress";

type LocaleConfig = LocaleSpecificConfig & { label: string };

export const ru: LocaleConfig = {
  lang: "ru-RU",
  label: "Русский",
  title: "Shirone-Admin",
  description: "Официальная документация Shirone-Admin — визуального инструмента управления контентом для блога Shirone. Установка, использование, настройки и справочник API.",
  themeConfig: {
    nav: [
      { text: "Главная", link: "/ru/" },
      { text: "Руководство", link: "/ru/guide/" },
      { text: "Справочник API", link: "/ru/api/" },
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
