---
layout: home

hero:
  name: Shirone-Admin
  text: The visual content manager for your Shirone blog
  tagline: Runs locally · AI-assisted writing · One-click dual-repo publishing — from getting started to the API reference, this is your first stop
  image:
    src: /assets/image/home/blog.svg
    alt: Shirone-Admin
  actions:
    - theme: brand
      text: Get Started
      link: /en/guide/
    - theme: alt
      text: GitHub
      link: https://github.com/bobokaka/Shirone-Admin

features:
  - title: Article Editing
    icon: '<i class="fa-solid fa-file-pen"></i>'
    details: Markdown source-mode editor with built-in Shirone theme snippets (triple-colon containers, file-tree, code tabs and more), images managed alongside the text
  - title: Moments
    icon: '<i class="fa-solid fa-comment-dots"></i>'
    details: Publish short updates in seconds, with images automatically archived into the theme's thumbnail pipeline
  - title: Structured Data
    icon: '<i class="fa-solid fa-table-list"></i>'
    details: Visual editing for projects, skills, timeline, devices, anime, navigation and other data/*.ts entries
  - title: AI Assistant
    icon: '<i class="fa-solid fa-robot"></i>'
    details: Switch between multiple providers — rewrite imported content, generate commit messages, draft timelines
  - title: Content Import
    icon: '<i class="fa-solid fa-file-import"></i>'
    details: One-stop import for Jianshu archives, anime (Bangumi API) and music
  - title: One-click Publishing
    icon: '<i class="fa-solid fa-rocket"></i>'
    details: Git commit and push to both repositories, with automatic theme validation before release

highlights:
  - header: Why Shirone-Admin
    image: /assets/image/home/diamond.svg
    bgImage: /assets/image/home/bg/1-light.svg
    bgImageDark: /assets/image/home/bg/1-dark.svg
    features:
      - title: Local First
        icon: fa-house-laptop
        details: All data lives in your own content repository — runs as a single desktop tool, no server deployment
      - title: Live Site Preview
        icon: fa-eye
        details: Embedded astro dev from the theme repo — what you see is the real site you are about to publish
      - title: Three-repo Workflow
        icon: fa-cubes
        details: Plays its part alongside the Shirone theme repo and the Shirone-Content repo, with a clear trail of every change
      - title: Safe Publishing
        icon: fa-shield-halved
        details: Theme validation runs automatically before publishing and blocks the release on failure

  - header: Up and Running in Three Minutes
    image: /assets/image/home/box.svg
    bgImage: /assets/image/home/bg/2-light.svg
    bgImageDark: /assets/image/home/bg/2-dark.svg
    highlights:
      - Clone Shirone, Shirone-Content and Shirone-Admin into the same parent directory
      - Run pnpm install in both the Shirone-Admin and Shirone repositories
      - Start everything at once with node workspace/content-watch.mjs
      - Open http://localhost:5173 in your browser to enter the admin panel
      - See the guide for detailed steps and advanced usage
---
