---
layout: home

hero:
  name: Shirone-Admin
  text: Das visuelle Content-Management-Tool für deinen Shirone-Blog
  tagline: Läuft lokal · KI-gestütztes Schreiben · Veröffentlichung in zwei Repositories mit einem Klick — von der Installation bis zur API-Referenz beginnt alles hier
  image:
    src: /assets/image/home/blog.svg
    alt: Shirone-Admin
  actions:
    - theme: brand
      text: Loslegen
      link: /de/guide/
    - theme: alt
      text: GitHub
      link: https://github.com/bobokaka/Shirone-Admin

features:
  - title: Dashboard und Vorschau
    icon: '<i class="fa-solid fa-gauge-high"></i>'
    details: Ausstehende Änderungen und Inhaltsstatistiken auf einen Blick, mit eingebetteter Live-Vorschau deines echten Blogs
    link: /de/guide/dashboard
  - title: Artikel bearbeiten
    icon: '<i class="fa-solid fa-pen-nib"></i>'
    details: Markdown-Editor im Quelltextmodus mit eingebauten Theme-Snippets (Dreifach-Doppelpunkt-Container, file-tree, Code-Tabs u. a.), Bilder werden direkt im Text verwaltet
    link: /de/guide/post-editor
  - title: Momente
    icon: '<i class="fa-solid fa-messages"></i>'
    details: Stimmung, Ort, Tags und Raster mit bis zu neun Fotos — Bilder landen automatisch in der Thumbnail-Pipeline des Themes
    link: /de/guide/moments
  - title: Website-Einstellungen
    icon: '<i class="fa-solid fa-palette"></i>'
    details: Basisinfos, Navigation, Footer, Theme-Erscheinungsbild und Banner-Wallpaper — alles visuell bearbeitet
    link: /de/guide/settings
  - title: Strukturierte Daten
    icon: '<i class="fa-solid fa-diagram-project"></i>'
    details: Projekte, Skills, Timeline, Geräte, Anime, Kompass, Playlists und Friend-Links aus data/*.ts visuell bearbeitet, inkl. Suche-Import
    link: /de/guide/data
  - title: KI-Assistent
    icon: '<i class="fa-solid fa-wand-magic-sparkles"></i>'
    details: Wechsle zwischen Anbietern — Inhalte umschreiben, Commit-Nachrichten generieren, Timelines entwerfen, auf jeder Seite verfügbar
    link: /de/guide/ai
  - title: Plattform-Import
    icon: '<i class="fa-solid fa-cloud-arrow-down"></i>'
    details: Jianshu-Exporte im Stapel migrieren, einzelne Artikel direkt beim Einfügen konvertieren, Anime und Musik an einem Ort importieren
    link: /de/guide/import
  - title: Veröffentlichung mit einem Klick
    icon: '<i class="fa-solid fa-rocket-launch"></i>'
    details: Git-Commit und Push in beide Repositories, mit automatischer Theme-Validierung vor der Veröffentlichung
    link: /de/guide/publish

highlights:
  - header: Warum Shirone-Admin
    image: /assets/image/home/diamond.svg
    bgImage: /assets/image/home/bg/1-light.svg
    bgImageDark: /assets/image/home/bg/1-dark.svg
    features:
      - title: Lokal zuerst
        icon: fa-hard-drive
        details: Alle Daten bleiben in deinem eigenen Content-Repository — ein lokales Tool ganz ohne Server
      - title: Live-Vorschau
        icon: fa-window-maximize
        details: astro dev des Theme-Repos eingebettet — was du siehst, ist die echte Seite, die gleich online geht
      - title: Drei-Repos-Workflow
        icon: fa-cubes
        details: Arbeitet Hand in Hand mit dem Shirone-Theme-Repo und dem Shirone-Content-Repo, jede Änderung ist nachvollziehbar
      - title: Sichere Veröffentlichung
        icon: fa-clipboard-check
        details: Die Theme-Validierung läuft vor jeder Veröffentlichung automatisch und blockiert sie bei Fehlern

  - header: In drei Minuten startklar
    image: /assets/image/home/box.svg
    bgImage: /assets/image/home/bg/2-light.svg
    bgImageDark: /assets/image/home/bg/2-dark.svg
    highlights:
      - Klone Shirone, Shirone-Content und Shirone-Admin ins selbe übergeordnete Verzeichnis
      - Führe pnpm install in den Repos Shirone-Admin und Shirone aus
      - Starte alles auf einmal mit node workspace/content-watch.mjs
      - Öffne http://localhost:5173 im Browser und gehe ins Admin-Panel
      - Details und weiterführende Nutzung findest du in der Anleitung
---
