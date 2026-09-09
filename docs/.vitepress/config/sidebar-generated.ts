import type { DefaultTheme } from "vitepress";

type SidebarConfig = DefaultTheme.Sidebar;

// 侧边栏配置：key 为带语言前缀的目录路径，value 为该目录的侧边栏数组。
// 新增文档后在此处（或通过脚本）补充对应语言的条目。
export const sidebar: SidebarConfig = {
  "/zh/guide/": [
    {
      text: "开始",
      items: [
        { text: "指南总览", link: "/zh/guide/" },
        { text: "快速上手", link: "/zh/guide/quick-start" },
      ],
    },
  ],
};
