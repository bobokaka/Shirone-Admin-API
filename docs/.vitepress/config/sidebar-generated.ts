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
        { text: "三仓工作区", link: "/zh/guide/workspace" },
      ],
    },
    {
      text: "内容创作",
      items: [
        { text: "仪表盘与预览", link: "/zh/guide/dashboard" },
        { text: "文章管理", link: "/zh/guide/posts" },
        { text: "文章编辑", link: "/zh/guide/post-editor" },
        { text: "说说动态", link: "/zh/guide/moments" },
      ],
    },
    {
      text: "站点定制",
      items: [
        { text: "站点设置", link: "/zh/guide/settings" },
        { text: "结构化数据", link: "/zh/guide/data" },
      ],
    },
    {
      text: "进阶",
      items: [
        { text: "平台导入", link: "/zh/guide/import" },
        { text: "AI 助手", link: "/zh/guide/ai" },
        { text: "提交和发布", link: "/zh/guide/publish" },
      ],
    },
  ],
  "/zh/api/": [
    {
      text: "开始",
      items: [{ text: "API 总览", link: "/zh/api/" }],
    },
    {
      text: "端点参考",
      items: [
        { text: "系统与预览", link: "/zh/api/system" },
        { text: "文章", link: "/zh/api/posts" },
        { text: "说说", link: "/zh/api/moments" },
        { text: "媒体上传", link: "/zh/api/media" },
        { text: "站点设置", link: "/zh/api/settings" },
        { text: "结构化数据", link: "/zh/api/data" },
        { text: "发布与校验", link: "/zh/api/publish" },
        { text: "AI 服务", link: "/zh/api/ai" },
        { text: "简书导入", link: "/zh/api/import" },
      ],
    },
  ],
};
