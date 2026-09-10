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
    icon: '<i class="fa-solid fa-messages"></i>'
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
    icon: '<i class="fa-solid fa-rocket-launch"></i>'
    details: 2 リポジトリへの git コミットとプッシュ。公開前にテーマ検証を自動実行し、失敗すればブロック
    link: /ja/guide/publish

highlights:
  - header: Shirone-Admin を選ぶ理由
    image: /assets/image/home/diamond.svg
    bgImage: /assets/image/home/bg/1-light.svg
    bgImageDark: /assets/image/home/bg/1-dark.svg
    features:
      - title: ローカルファースト
        icon: fa-hard-drive
        details: データはすべて自分のコンテンツリポジトリに保存。サーバー展開不要の単体ツール
      - title: 実サイトプレビュー
        icon: fa-window-maximize
        details: テーマリポジトリの astro dev を内蔵。表示されるのはまさに公開される本物のサイト
      - title: 3 リポジトリ連携
        icon: fa-cubes
        details: Shirone テーマリポジトリ、Shirone-Content コンテンツリポジトリと役割分担し、変更の由来を明確に追跡
      - title: 安全な公開
        icon: fa-clipboard-check
        details: 公開前にテーマ検証を自動実行し、失敗すれば公開をブロック

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
