---
layout: home

hero:
  name: Shirone-Admin
  text: Shirone ブログのためのビジュアルコンテンツ管理ツール
  tagline: ローカルで動作 · AI ライティング支援 · ワンクリックで 2 リポジトリ公開 — インストールから API リファレンスまで、まずはここから
  image:
    src: /assets/image/home/blog.svg
    alt: Shirone-Admin
  actions:
    - theme: brand
      text: 始めましょう
      link: /ja/guide/
    - theme: alt
      text: GitHub
      link: https://github.com/bobokaka/Shirone-Admin

features:
  - title: ダッシュボードと実サイトプレビュー
    icon: '<i class="fa-solid fa-gauge-high"></i>'
    details: 未公開の変更とコンテンツ統計を一目で把握。本物のブログを内蔵したライブプレビュー
    link: /ja/guide/dashboard
  - title: 記事編集
    icon: '<i class="fa-solid fa-pen-nib"></i>'
    details: Markdown ソースモードエディター。三重コロンコンテナ、file-tree などテーマ拡張スニペットを内蔵し、画像も本文と一緒に管理
    link: /ja/guide/post-editor
  - title: モーメンツ
    icon: '<i class="fa-solid fa-comments"></i>'
    details: 気分、場所、タグ、9 枚のグリッド写真。画像はテーマのサムネイルパイプラインへ自動アーカイブ
    link: /ja/guide/moments
  - title: サイト設定
    icon: '<i class="fa-solid fa-palette"></i>'
    details: 基本情報、ナビゲーション、フッター、テーマ外観、バナー壁紙をすべてビジュアル編集
    link: /ja/guide/settings
  - title: 構造化データ
    icon: '<i class="fa-solid fa-diagram-project"></i>'
    details: プロジェクト、スキル、タイムライン、デバイス、アニメ、コンパス、プレイリスト、リンクなどの data/*.ts をビジュアル編集、検索取り込み対応
    link: /ja/guide/data
  - title: AI アシスタント
    icon: '<i class="fa-solid fa-wand-magic-sparkles"></i>'
    details: 複数プロバイダーを自由に切替。コンテンツのリライト、コミットメッセージ生成、タイムライン起草を各ページから利用可能
    link: /ja/guide/ai
  - title: コンテンツ取り込み
    icon: '<i class="fa-solid fa-cloud-arrow-down"></i>'
    details: 簡書エクスポートの一括移行、単票の貼り付けで即時変換、アニメと音楽をワンストップで取り込み
    link: /ja/guide/import
  - title: ワンクリック公開
    icon: '<i class="fa-solid fa-rocket"></i>'
    details: 2 リポジトリへの git コミットとプッシュ。公開前にテーマ検証を自動実行し、失敗すればブロック
    link: /ja/guide/publish

highlights:
  - header: Shirone-Admin を選ぶ理由
    image: /assets/image/home/diamond.svg
    bgImage: /assets/image/home/bg/1-light.svg
    bgImageDark: /assets/image/home/bg/1-dark.svg
    features:
      - title: 追跡可能な履歴
        icon: fa-clock-rotate-left
        details: 公開のたびに git コミットが残る。いつ何を変えたか一目で確認でき、問題があればいつでもロールバック
      - title: 3 リポジトリの役割分担
        icon: fa-cubes
        details: ツール・テーマ・コンテンツが別々のリポジトリで明確に分離。アップグレードは干渉せず、テーマを変えてもコンテンツは失われない
      - title: データの主権はあなたに
        icon: fa-user-shield
        details: 記事・設定・メディアは常に自分のリポジトリに保存。ツールは操作盤にすぎず、全データを持っていつでも移行できる
      - title: 運用不要
        icon: fa-house-laptop
        details: サーバーもデータベースも日常運用も不要。一台の PC がインフラのすべて

  - header: 3 分で起動
    image: /assets/image/home/box.svg
    bgImage: /assets/image/home/bg/2-light.svg
    bgImageDark: /assets/image/home/bg/2-dark.svg
    highlights:
      - Shirone、Shirone-Content、Shirone-Admin の 3 リポジトリを同じ親ディレクトリにクローン
      - Shirone-Admin と Shirone の両リポジトリで pnpm install を実行
      - node workspace/content-watch.mjs で全サービスを一括起動
      - ブラウザで http://localhost:5173 を開き管理画面へ
      - 詳細な手順と応用はガイドを参照
---
