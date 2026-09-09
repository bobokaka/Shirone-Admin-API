---
layout: home

hero:
  name: Shirone Admin API
  text: 基於 VitePress 2.0 的多語言文檔站模板
  tagline: 9 種語言 · Mermaid 圖表 · 數學公式 · 全文搜索 · 暗色模式 · RSS 訂閱
  image:
    src: /assets/image/home/layout.svg
    alt: Shirone Admin API
  actions:
    - theme: brand
      text: GitHub 倉庫
      link: https://github.com/bobokaka/Shirone-Admin-API
    - theme: alt
      text: VitePress 文檔
      link: https://vitepress.dev/

features:
  - title: 多語言架構
    icon: '<i class="fa-solid fa-language"></i>'
    details: 內置 9 種語言配置（簡繁中文、英、日、韓、法、德、西、俄），本地化界面文案與獨立目錄開箱即用
  - title: Mermaid 圖表
    icon: '<i class="fa-solid fa-diagram-project"></i>'
    details: 集成 vitepress-plugin-mermaid，支持流程圖、時序圖、類圖等，並適配暗色模式
  - title: 數學公式
    icon: '<i class="fa-solid fa-square-root-variable"></i>'
    details: 基於 MathJax 3 渲染行內與塊級數學公式
  - title: 全文搜索
    icon: '<i class="fa-solid fa-magnifying-glass"></i>'
    details: VitePress 本地搜索，支持按語言定制搜索界面文案
  - title: Markdown 擴展
    icon: '<i class="fa-solid fa-markdown"></i>'
    details: 高亮標記、上標、下標、腳註等擴展語法
  - title: 評論與訂閱
    icon: '<i class="fa-solid fa-comments"></i>'
    details: Giscus 評論（基於 GitHub Discussions）與 RSS 訂閱開箱即用

highlights:
  - header: 快速開始
    image: /assets/image/home/box.svg
    bgImage: /assets/image/home/bg/1-light.svg
    bgImageDark: /assets/image/home/bg/1-dark.svg
    highlights:
      - 克隆倉庫後執行 pnpm install 安裝依賴
      - 運行 pnpm run dev 啟動開發服務器，訪問 http://localhost:5173
      - 在 docs/zh-hant/ 目錄下新增 Markdown 文檔
      - 在 sidebar-generated.ts 中補充對應語言的側邊欄配置
      - 修改 config/locales/zh-hant.ts 定制導航與頁腳
      - 執行 pnpm run build 構建生產產物，可部署到任意靜態託管服務
---
