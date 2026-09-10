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
  - title: 儀表板與真站預覽
    icon: '<i class="fa-solid fa-gauge-high"></i>'
    details: 待發布變更與內容統計一目了然，內嵌真實部落格的即時預覽面板
    link: /zh-hant/guide/dashboard
  - title: 文章編輯
    icon: '<i class="fa-solid fa-pen-nib"></i>'
    details: Markdown 原始碼編輯器，內建三冒號容器、file-tree 等主題擴充片段，配圖隨文管理
    link: /zh-hant/guide/post-editor
  - title: 說說動態
    icon: '<i class="fa-solid fa-comments"></i>'
    details: 心情、地點、標籤與九宮格配圖，圖片自動歸檔到主題縮圖管線
    link: /zh-hant/guide/moments
  - title: 站點設定
    icon: '<i class="fa-solid fa-palette"></i>'
    details: 基本資訊、導航、頁尾、主題外觀與橫幅桌布，全部視覺化調整
    link: /zh-hant/guide/settings
  - title: 結構化資料
    icon: '<i class="fa-solid fa-diagram-project"></i>'
    details: 專案、技能、時間線、設備、番劇、羅盤、歌單、友鏈視覺化編輯，支援搜尋匯入
    link: /zh-hant/guide/data
  - title: AI 助手
    icon: '<i class="fa-solid fa-wand-magic-sparkles"></i>'
    details: 多服務商自由切換，內容改寫、提交訊息生成、時間線起草全站可用
    link: /zh-hant/guide/ai
  - title: 內容匯入
    icon: '<i class="fa-solid fa-cloud-arrow-down"></i>'
    details: 簡書匯出包整批遷移、單篇貼上即貼即轉，番劇與音樂一站式匯入
    link: /zh-hant/guide/import
  - title: 一鍵發布
    icon: '<i class="fa-solid fa-rocket"></i>'
    details: 雙倉 git 提交與推送，發布前自動執行主題校驗，失敗即阻斷
    link: /zh-hant/guide/publish

highlights:
  - header: 為什麼選擇 Shirone-Admin
    image: /assets/image/home/diamond.svg
    bgImage: /assets/image/home/bg/1-light.svg
    bgImageDark: /assets/image/home/bg/1-dark.svg
    features:
      - title: 數據可追溯
        icon: fa-clock-rotate-left
        details: 每次發布對應一條 git 提交，何時改了什麼一目瞭然，出問題隨時回滾
      - title: 三倉各司其職
        icon: fa-cubes
        details: 管理工具、主題、內容三個倉庫邊界清晰，升級互不干擾，換主題不丟內容
      - title: 數據主權在你
        icon: fa-user-shield
        details: 文章、設定與媒體始終保存在你自己的倉庫裡，工具只是操作台，隨時可帶著全部數據遷移
      - title: 零運維成本
        icon: fa-house-laptop
        details: 無需伺服器、資料庫與日常運維，一台電腦就是全部基礎設施

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
