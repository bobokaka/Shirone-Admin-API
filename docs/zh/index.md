---
layout: home

hero:
  name: Shirone Admin API
  text: 基于 VitePress 2.0 的多语言文档站模板
  tagline: 9 种语言 · Mermaid 图表 · 数学公式 · 全文搜索 · 暗色模式 · RSS 订阅
  image:
    src: /assets/image/home/layout.svg
    alt: Shirone Admin API
  actions:
    - theme: brand
      text: GitHub 仓库
      link: https://github.com/bobokaka/Shirone-Admin-API
    - theme: alt
      text: VitePress 文档
      link: https://vitepress.dev/

features:
  - title: 多语言架构
    icon: '<i class="fa-solid fa-language"></i>'
    details: 内置 9 种语言配置（简繁中文、英、日、韩、法、德、西、俄），本地化界面文案与独立目录开箱即用
  - title: Mermaid 图表
    icon: '<i class="fa-solid fa-diagram-project"></i>'
    details: 集成 vitepress-plugin-mermaid，支持流程图、时序图、类图等，并适配暗色模式
  - title: 数学公式
    icon: '<i class="fa-solid fa-square-root-variable"></i>'
    details: 基于 MathJax 3 渲染行内与块级数学公式
  - title: 全文搜索
    icon: '<i class="fa-solid fa-magnifying-glass"></i>'
    details: VitePress 本地搜索，支持按语言定制搜索界面文案
  - title: Markdown 扩展
    icon: '<i class="fa-solid fa-markdown"></i>'
    details: 高亮标记、上标、下标、脚注等扩展语法
  - title: 评论与订阅
    icon: '<i class="fa-solid fa-comments"></i>'
    details: Giscus 评论（基于 GitHub Discussions）与 RSS 订阅开箱即用

highlights:
  - header: 快速开始
    image: /assets/image/home/box.svg
    bgImage: /assets/image/home/bg/1-light.svg
    bgImageDark: /assets/image/home/bg/1-dark.svg
    highlights:
      - 克隆仓库后执行 pnpm install 安装依赖
      - 运行 pnpm run dev 启动开发服务器，访问 http://localhost:5173
      - 在 docs/zh/ 目录下新增 Markdown 文档
      - 在 sidebar-generated.ts 中补充对应语言的侧边栏配置
      - 修改 config/locales/zh.ts 定制导航与页脚
      - 执行 pnpm run build 构建生产产物，可部署到任意静态托管服务
---
