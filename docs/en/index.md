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
  - title: Dashboard & Live Preview
    icon: '<i class="fa-solid fa-gauge-high"></i>'
    details: Pending changes and content stats at a glance, with an embedded live preview of your real blog
    link: /en/guide/dashboard
  - title: Article Editing
    icon: '<i class="fa-solid fa-pen-nib"></i>'
    details: Markdown source-mode editor with built-in theme snippets (triple-colon containers, file-tree, code tabs…), images managed alongside the text
    link: /en/guide/post-editor
  - title: Moments
    icon: '<i class="fa-solid fa-messages"></i>'
    details: Mood, location, tags and a nine-photo grid, with images archived into the theme's thumbnail pipeline automatically
    link: /en/guide/moments
  - title: Site Settings
    icon: '<i class="fa-solid fa-palette"></i>'
    details: Site profile, navigation, footer, theme appearance and banner wallpapers — all edited visually
    link: /en/guide/settings
  - title: Structured Data
    icon: '<i class="fa-solid fa-diagram-project"></i>'
    details: Visual editing for projects, skills, timeline, devices, anime, compass, playlists and links in data/*.ts, with search-based import
    link: /en/guide/data
  - title: AI Assistant
    icon: '<i class="fa-solid fa-wand-magic-sparkles"></i>'
    details: Switch between providers to rewrite content, generate commit messages and draft timelines — AI entries on every page
    link: /en/guide/ai
  - title: Content Import
    icon: '<i class="fa-solid fa-cloud-arrow-down"></i>'
    details: Bulk-migrate Jianshu archives, paste a single post for instant conversion, import anime and music in one place
    link: /en/guide/import
  - title: One-click Publishing
    icon: '<i class="fa-solid fa-rocket-launch"></i>'
    details: Git commit and push to both repositories, with automatic theme validation before release
    link: /en/guide/publish

highlights:
  - header: Why Shirone-Admin
    image: /assets/image/home/diamond.svg
    bgImage: /assets/image/home/bg/1-light.svg
    bgImageDark: /assets/image/home/bg/1-dark.svg
    features:
      - title: Local First
        icon: fa-hard-drive
        details: All data lives in your own content repository — runs as a single desktop tool, no server deployment
      - title: Live Site Preview
        icon: fa-window-maximize
        details: Embedded astro dev from the theme repo — what you see is the real site you are about to publish
      - title: Three-repo Workflow
        icon: fa-cubes
        details: Plays its part alongside the Shirone theme repo and the Shirone-Content repo, with a clear trail of every change
      - title: Safe Publishing
        icon: fa-clipboard-check
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
