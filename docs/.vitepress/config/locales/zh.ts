import type { LocaleSpecificConfig } from "vitepress";

type LocaleConfig = LocaleSpecificConfig & { label: string };

export const zh: LocaleConfig = {
  lang: "zh-CN",
  label: "简体中文",
  title: "Shirone Admin 文档",
  description: "Shirone 博客可视化内容管理工具 Shirone-Admin 的官方文档——安装、使用、配置与 API 参考",
  themeConfig: {
    nav: [
      { text: "首页", link: "/zh/" },
      { text: "指南", link: "/zh/guide/" },
      { text: "API 参考", link: "/zh/api/" },
    ],
    sidebar: {} as any,
    outline: { label: "本页目录", level: [2, 3] },
    docFooter: { prev: "上一页", next: "下一页" },
    lastUpdated: { text: "最后更新于" },
    returnToTopLabel: "回到顶部",
    sidebarMenuLabel: "菜单",
    darkModeSwitchLabel: "主题",
    lightModeSwitchTitle: "切换到浅色模式",
    darkModeSwitchTitle: "切换到深色模式",
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
