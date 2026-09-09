---
layout: home

hero:
  name: Shirone Admin API
  text: A multilingual documentation template built on VitePress 2.0
  tagline: 9 languages · Mermaid diagrams · Math formulas · Full-text search · Dark mode · RSS feed
  image:
    src: /assets/image/home/layout.svg
    alt: Shirone Admin API
  actions:
    - theme: brand
      text: GitHub Repository
      link: https://github.com/bobokaka/Shirone-Admin-API
    - theme: alt
      text: VitePress Docs
      link: https://vitepress.dev/

features:
  - title: Multilingual Architecture
    icon: '<i class="fa-solid fa-language"></i>'
    details: 9 built-in locale configs (Simplified/Traditional Chinese, English, Japanese, Korean, French, German, Spanish, Russian) with localized UI strings and per-language directories
  - title: Mermaid Diagrams
    icon: '<i class="fa-solid fa-diagram-project"></i>'
    details: Powered by vitepress-plugin-mermaid — flowcharts, sequence diagrams, class diagrams and more, with dark mode support
  - title: Math Formulas
    icon: '<i class="fa-solid fa-square-root-variable"></i>'
    details: Inline and block math formulas rendered by MathJax 3
  - title: Full-text Search
    icon: '<i class="fa-solid fa-magnifying-glass"></i>'
    details: VitePress local search with per-language UI customization
  - title: Markdown Extensions
    icon: '<i class="fa-solid fa-markdown"></i>'
    details: Highlight marks, superscript, subscript and footnotes out of the box
  - title: Comments & Feed
    icon: '<i class="fa-solid fa-comments"></i>'
    details: Giscus comments (GitHub Discussions) and RSS feed ready to use

highlights:
  - header: Getting Started
    image: /assets/image/home/box.svg
    bgImage: /assets/image/home/bg/1-light.svg
    bgImageDark: /assets/image/home/bg/1-dark.svg
    highlights:
      - Clone the repository and run pnpm install
      - Start the dev server with pnpm run dev and open http://localhost:5173
      - Add Markdown pages under docs/en/
      - Register them in the sidebar-generated.ts config
      - Customize nav and footer in config/locales/en.ts
      - Build for production with pnpm run build and deploy to any static host
---
