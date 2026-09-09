---
layout: home

hero:
  name: Shirone Admin API
  text: VitePress 2.0 ベースの多言語ドキュメントサイトテンプレート
  tagline: 9 言語 · Mermaid ダイアグラム · 数式 · 全文検索 · ダークモード · RSS フィード
  image:
    src: /assets/image/home/layout.svg
    alt: Shirone Admin API
  actions:
    - theme: brand
      text: GitHub リポジトリ
      link: https://github.com/bobokaka/Shirone-Admin-API
    - theme: alt
      text: VitePress ドキュメント
      link: https://vitepress.dev/

features:
  - title: 多言語アーキテクチャ
    icon: '<i class="fa-solid fa-language"></i>'
    details: 中国語（簡体・繁体）、英語、日本語、韓国語、フランス語、ドイツ語、スペイン語、ロシア語の 9 ロケール設定と、ローカライズされた UI 文言・言語別ディレクトリを内蔵
  - title: Mermaid ダイアグラム
    icon: '<i class="fa-solid fa-diagram-project"></i>'
    details: vitepress-plugin-mermaid によるフローチャート、シーケンス図、クラス図など。ダークモードにも対応
  - title: 数式
    icon: '<i class="fa-solid fa-square-root-variable"></i>'
    details: MathJax 3 によるインラインおよびブロック数式のレンダリング
  - title: 全文検索
    icon: '<i class="fa-solid fa-magnifying-glass"></i>'
    details: VitePress ローカル検索。言語ごとの UI カスタマイズに対応
  - title: Markdown 拡張
    icon: '<i class="fa-solid fa-markdown"></i>'
    details: ハイライト、上付き・下付き文字、脚注などの拡張構文
  - title: コメントとフィード
    icon: '<i class="fa-solid fa-comments"></i>'
    details: Giscus コメント（GitHub Discussions）と RSS フィードを利用可能

highlights:
  - header: はじめに
    image: /assets/image/home/box.svg
    bgImage: /assets/image/home/bg/1-light.svg
    bgImageDark: /assets/image/home/bg/1-dark.svg
    highlights:
      - リポジトリをクローンして pnpm install を実行
      - pnpm run dev で開発サーバーを起動し http://localhost:5173 を開く
      - docs/ja/ ディレクトリに Markdown ページを追加
      - sidebar-generated.ts にサイドバー設定を追記
      - config/locales/ja.ts でナビゲーションとフッターをカスタマイズ
      - pnpm run build で本番用にビルドし、任意の静的ホスティングへデプロイ
---
