---
layout: home

hero:
  name: Shirone Admin API
  text: Eine mehrsprachige Dokumentations-Website-Vorlage auf Basis von VitePress 2.0
  tagline: 9 Sprachen · Mermaid-Diagramme · mathematische Formeln · Volltextsuche · Dunkelmodus · RSS-Feed
  image:
    src: /assets/image/home/layout.svg
    alt: Shirone Admin API
  actions:
    - theme: brand
      text: GitHub-Repository
      link: https://github.com/bobokaka/Shirone-Admin-API
    - theme: alt
      text: VitePress-Dokumentation
      link: https://vitepress.dev/

features:
  - title: Mehrsprachige Architektur
    icon: '<i class="fa-solid fa-language"></i>'
    details: 9 integrierte Sprachkonfigurationen (vereinfachtes/traditionelles Chinesisch, Englisch, Japanisch, Koreanisch, Französisch, Deutsch, Spanisch, Russisch) mit lokalisierten Oberflächentexten und Verzeichnissen pro Sprache
  - title: Mermaid-Diagramme
    icon: '<i class="fa-solid fa-diagram-project"></i>'
    details: Basierend auf vitepress-plugin-mermaid — Flussdiagramme, Sequenzdiagramme, Klassendiagramme und mehr, mit Dunkelmodus-Unterstützung
  - title: Mathematische Formeln
    icon: '<i class="fa-solid fa-square-root-variable"></i>'
    details: Inline- und Blockformeln, gerendert mit MathJax 3
  - title: Volltextsuche
    icon: '<i class="fa-solid fa-magnifying-glass"></i>'
    details: Lokale VitePress-Suche mit anpassbarer Benutzeroberfläche pro Sprache
  - title: Markdown-Erweiterungen
    icon: '<i class="fa-solid fa-markdown"></i>'
    details: Texthervorhebung, hoch- und tiefgestellte Zeichen sowie Fußnoten inklusive
  - title: Kommentare & Feed
    icon: '<i class="fa-solid fa-comments"></i>'
    details: Giscus-Kommentare (GitHub Discussions) und RSS-Feed sofort einsatzbereit

highlights:
  - header: Schnellstart
    image: /assets/image/home/box.svg
    bgImage: /assets/image/home/bg/1-light.svg
    bgImageDark: /assets/image/home/bg/1-dark.svg
    highlights:
      - Repository klonen und pnpm install ausführen
      - Entwicklungsserver mit pnpm run dev starten und http://localhost:5173 öffnen
      - Markdown-Seiten unter docs/de/ hinzufügen
      - Sie in der Konfiguration sidebar-generated.ts registrieren
      - Navigation und Footer in config/locales/de.ts anpassen
      - Mit pnpm run build für Produktion bauen und auf einem beliebigen statischen Hosting bereitstellen
---
