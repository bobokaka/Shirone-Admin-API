---
title: Site Settings
description: Configure your entire site without writing a line of YAML—five sections for basic info, navigation, footer, theme appearance, and banner wallpapers, with live site preview applying changes in real time on the right.
---

# Site Settings

The "Site Settings (“站点设置”)" page turns all of the theme's configuration options into forms: section forms on the left, an embedded [live site preview](./dashboard.md#live-site-preview) on the right—save your changes and the preview refreshes; what you see is what you get.

The page has five tabs: **Basic Info (“基础信息”)**, **Navigation (“导航”)**, **Footer (“页脚”)**, **Theme Appearance (“主题外观”)**, and **Banner Wallpaper (“横幅壁纸”)**.

![Site Settings · Basic Info](/assets/guide/settings.png)

## Basic Info

Seven sections, each saved independently:

| Section | What It Configures |
|---------|--------------------|
| Site info | Site name, subtitle (with an AI ✨ one-click generator) |
| Profile | Avatar (online URL or local upload, auto-renamed into the repository), nickname, bio (also with AI ✨) |
| Social links | External link list such as GitHub / Bilibili: name, Iconify icon, URL |
| Site favicon | Light / dark slots; when not customized, shows a notice that the theme's default icon is currently in effect; uploads are auto-named `favicon-light/dark.<ext>` and replace in place—you can also just enter an online URL |
| General | Site URL (the final domain after deployment), base path (`/` for root deployment), time zone (dropdown of common zones, manual entry allowed) |
| Visitor display panel | Toggles controlling what the frontend exposes to visitors: color picker, color spec switch, background mode, list layout, reduced motion, background texture |
| Internationalization | Whether to enable multiple languages: check the set of languages to open—the site's primary language must be within the set; when off, the entire site locks to Simplified Chinese |

## Navigation

A visual navigation menu editor:

- **Theme presets**—pick from 15 built-in presets (Home, Archive, Friends, etc.) and wire them in with one click
- **Custom links**—name + icon + URL, with an "open in new window (“新窗口打开”)" flag
- **Dropdown groups**—drag out second-level menus to gather related entries

The navigation configuration is saved as a whole; arrays use **full replacement** semantics.

## Footer

- **Enable toggle**—controls whether the custom footer content is injected above the theme's copyright line
- **HTML editor**—a CodeMirror code editor with a **Prettier format** button; the footer HTML source is stored in the content repository's `config/footer.html`
- **Footer image library**—upload images or paste online direct links (the server downloads on your behalf; webp is auto-converted to png/jpg) into `public/images/footer/`; click "Copy Path (“复制路径”)" and paste into the HTML
- **Live preview**—an iframe approximating the theme's footer rendering: copyright line + your custom content

## Theme Appearance

![Site Settings · Theme Appearance](/assets/guide/settings-appearance.png)

Two sections:

### Theme Colors

- **Hue slider** (0–360)—with a live 5-step palette preview generated from that hue
- **Lock**—when checked, the site hue no longer follows content/visitor preferences
- **Color style**—Material 3's 9 dynamic color styles: tonalSpot (classic soft), vibrant, content (sourced from content colors), expressive, rainbow, fruitSalad, monochrome, neutral, fidelity
- **Color spec**—Material 3's two spec generations, 2021 / 2025

### Wallpaper and Texture

- **Default background mode**—banner / none, deciding the frontend default when no wallpaper is selected
- **Background texture**—six presets: none, starlight, cyber-dots, topography, geometric, sakura; opacity 0.05–0.25; a motion toggle

## Banner Wallpaper

Full control over the home banner:

- **Desktop wallpaper / Mobile wallpaper** lists—local upload, online direct-link import (fetched server-side), and an **AI Recommended Wallpaper** button (grabs a batch from the safebooru image source filtered by size: desktop ≥1920 landscape, mobile ≥1920 portrait; check and download into the repository)
- **Display controls**—position (top/center/bottom), dim overlay (toggle + opacity)
- **Home text**—title, multiple subtitle lines, typewriter effect (speed/delete speed/pause duration/loop); subtitles can be generated all at once via **AI Generate (“AI生成”)**—4–6 rotating lines based on the site name and bio
- **Carousel**—enabled with multiple wallpapers; switch interval, fade duration, six transition animations (ken-burns slow zoom, zoom-in/out, pan-left/right, none)
- **Wave decoration**—toggle for the wave animation at the bottom of the banner

> [!TIP]
> When you save the banner, local wallpaper files no longer referenced by either desktop or mobile are **cleaned up automatically**—no manual file deletion needed.

## Where the Configuration Lands

All settings are written to the content repository's `config/*.yaml`, following the **minimal override** principle: only keys you changed get written, undeclared fields inherit theme defaults—when a theme upgrade adds new options your site follows along automatically instead of being stuck on an old version by a "full snapshot". Dictionary keys merge recursively; arrays are replaced wholesale.

## Next Steps

- Enrich the "Me" page with [Structured Data](./data.md)
- After configuring, check the result in the [live site preview](./dashboard.md#live-site-preview), then [publish](./publish.md) when satisfied
