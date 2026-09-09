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
  - title: Artikel bearbeiten
    icon: '<i class="fa-solid fa-file-pen"></i>'
    details: Markdown-Editor im Quelltextmodus mit eingebauten Shirone-Theme-Snippets (Dreifach-Doppelpunkt-Container, file-tree, Code-Tabs u. a.), Bilder werden direkt im Text verwaltet
  - title: Momente
    icon: '<i class="fa-solid fa-comment-dots"></i>'
    details: Kurze Beiträge veröffentlichen und verwalten, Bilder landen automatisch im Thumbnail-Pipeline-Verzeichnis des Themes
  - title: Strukturierte Daten
    icon: '<i class="fa-solid fa-table-list"></i>'
    details: Visuelle Bearbeitung von Projekten, Skills, Timeline, Geräten, Anime, Navigation und weiteren data/*.ts-Einträgen
  - title: KI-Assistent
    icon: '<i class="fa-solid fa-robot"></i>'
    details: Wechsel zwischen mehreren Anbietern — Importe umschreiben, Commit-Nachrichten generieren, Timelines entwerfen
  - title: Content-Import
    icon: '<i class="fa-solid fa-file-import"></i>'
    details: Alles an einem Ort – Jianshu-Exporte, Anime (Bangumi API) und Musik importieren
  - title: Veröffentlichung mit einem Klick
    icon: '<i class="fa-solid fa-rocket"></i>'
    details: Git-Commit und Push in beide Repositories, mit automatischer Theme-Validierung vor der Veröffentlichung

highlights:
  - header: Warum Shirone-Admin
    image: /assets/image/home/diamond.svg
    bgImage: /assets/image/home/bg/1-light.svg
    bgImageDark: /assets/image/home/bg/1-dark.svg
    features:
      - title: Lokal zuerst
        icon: fa-house-laptop
        details: Alle Daten bleiben in deinem eigenen Content-Repository — ein lokales Tool ganz ohne Server
      - title: Live-Vorschau
        icon: fa-eye
        details: astro dev des Theme-Repos eingebettet — was du siehst, ist die echte Seite, die gleich online geht
      - title: Drei-Repos-Workflow
        icon: fa-cubes
        details: Arbeitet Hand in Hand mit dem Shirone-Theme-Repo und dem Shirone-Content-Repo, jede Änderung ist nachvollziehbar
      - title: Sichere Veröffentlichung
        icon: fa-shield-halved
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
