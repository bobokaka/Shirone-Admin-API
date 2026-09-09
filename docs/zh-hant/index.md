---
layout: home

hero:
  name: Shirone-Admin
  text: Shirone 部落格的視覺化內容管理工具
  tagline: 本地單機運行 · AI 輔助寫作 · 一鍵雙倉發布——從安裝上手到 API 查閱，這裡是你了解它的第一站
  image:
    src: /assets/image/home/blog.svg
    alt: Shirone-Admin
  actions:
    - theme: brand
      text: 快速開始
      link: /zh-hant/guide/
    - theme: alt
      text: GitHub
      link: https://github.com/bobokaka/Shirone-Admin

features:
  - title: 文章編輯
    icon: '<i class="fa-solid fa-file-pen"></i>'
    details: Markdown 原始碼模式編輯器，內建 Shirone 主題私有擴充片段（三冒號容器、file-tree、程式碼標籤頁等），配圖隨文管理
  - title: 說說與動態
    icon: '<i class="fa-solid fa-comment-dots"></i>'
    details: 動態發布與管理，圖片自動歸檔到主題縮圖管線目錄
  - title: 結構化數據
    icon: '<i class="fa-solid fa-table-list"></i>'
    details: 專案、技能、時間線、設備、番劇、導航等 data/*.ts 視覺化編輯
  - title: AI 助手
    icon: '<i class="fa-solid fa-robot"></i>'
    details: 多服務商配置切換，輔助內容匯入改寫、提交訊息生成、時間線起草
  - title: 內容匯入
    icon: '<i class="fa-solid fa-file-import"></i>'
    details: 簡書匯出包、番劇（Bangumi API）、音樂一站式匯入
  - title: 一鍵發布
    icon: '<i class="fa-solid fa-rocket"></i>'
    details: 雙倉 git 提交與推送，發布前自動執行主題校驗

highlights:
  - header: 為什麼選擇 Shirone-Admin
    image: /assets/image/home/diamond.svg
    bgImage: /assets/image/home/bg/1-light.svg
    bgImageDark: /assets/image/home/bg/1-dark.svg
    features:
      - title: 本地優先
        icon: fa-house-laptop
        details: 數據全部保存在你自己的內容倉，單機運行，無需部署伺服端
      - title: 真站預覽
        icon: fa-eye
        details: 內嵌主題倉 astro dev 即時預覽，所見即即將發布的真實站點
      - title: 三倉協作
        icon: fa-cubes
        details: 與 Shirone 主題倉、Shirone-Content 內容倉各司其職，改動來源清晰可追溯
      - title: 安全發布
        icon: fa-shield-halved
        details: 發布前自動執行主題校驗，失敗即阻斷，杜絕壞內容上線

  - header: 三分鐘啟動
    image: /assets/image/home/box.svg
    bgImage: /assets/image/home/bg/2-light.svg
    bgImageDark: /assets/image/home/bg/2-dark.svg
    highlights:
      - 將 Shirone、Shirone-Content、Shirone-Admin 三個倉庫克隆到同一父目錄
      - 在 Shirone-Admin 與 Shirone 倉庫分別執行 pnpm install
      - 運行 node workspace/content-watch.mjs 一鍵啟動全部服務
      - 瀏覽器訪問 http://localhost:5173 進入管理後台
      - 詳細步驟與進階用法見指南章節
---
