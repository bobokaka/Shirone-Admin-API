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
  - title: 記事編集
    icon: '<i class="fa-solid fa-file-pen"></i>'
    details: Markdown ソースモードエディター。Shirone テーマ独自の拡張スニペット（三重コロンコンテナ、file-tree、コードタブなど）を内蔵し、画像も本文と一緒に管理
  - title: モーメンツ
    icon: '<i class="fa-solid fa-comment-dots"></i>'
    details: ひとこと投稿の公開と管理。画像はテーマのサムネイルパイプラインへ自動アーカイブ
  - title: 構造化データ
    icon: '<i class="fa-solid fa-table-list"></i>'
    details: プロジェクト、スキル、タイムライン、デバイス、アニメ、ナビゲーションなどの data/*.ts をビジュアル編集
  - title: AI アシスタント
    icon: '<i class="fa-solid fa-robot"></i>'
    details: 複数プロバイダーの切替に対応。取り込み記事のリライト、コミットメッセージ生成、タイムライン起草を支援
  - title: コンテンツ取り込み
    icon: '<i class="fa-solid fa-file-import"></i>'
    details: 簡書エクスポート、アニメ（Bangumi API）、音楽をワンストップで取り込み
  - title: ワンクリック公開
    icon: '<i class="fa-solid fa-rocket"></i>'
    details: 2 リポジトリへの git コミットとプッシュ。公開前にテーマ検証を自動実行

highlights:
  - header: Shirone-Admin を選ぶ理由
    image: /assets/image/home/diamond.svg
    bgImage: /assets/image/home/bg/1-light.svg
    bgImageDark: /assets/image/home/bg/1-dark.svg
    features:
      - title: ローカルファースト
        icon: fa-house-laptop
        details: データはすべて自分のコンテンツリポジトリに保存。サーバー展開不要の単体ツール
      - title: 実サイトプレビュー
        icon: fa-eye
        details: テーマリポジトリの astro dev を内蔵。表示されるのはまさに公開される本物のサイト
      - title: 3 リポジトリ連携
        icon: fa-cubes
        details: Shirone テーマリポジトリ、Shirone-Content コンテンツリポジトリと役割分担し、変更の由来を明確に追跡
      - title: 安全な公開
        icon: fa-shield-halved
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
