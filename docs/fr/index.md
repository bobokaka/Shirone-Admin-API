---
layout: home

hero:
  name: Shirone Admin API
  text: Un modèle de site de documentation multilingue basé sur VitePress 2.0
  tagline: 9 langues · Diagrammes Mermaid · Formules mathématiques · Recherche plein texte · Mode sombre · Flux RSS
  image:
    src: /assets/image/home/layout.svg
    alt: Shirone Admin API
  actions:
    - theme: brand
      text: Dépôt GitHub
      link: https://github.com/bobokaka/Shirone-Admin-API
    - theme: alt
      text: Documentation VitePress
      link: https://vitepress.dev/

features:
  - title: Architecture multilingue
    icon: '<i class="fa-solid fa-language"></i>'
    details: 9 configurations de langue intégrées (chinois simplifié/traditionnel, anglais, japonais, coréen, français, allemand, espagnol, russe) avec textes d'interface localisés et répertoires par langue
  - title: Diagrammes Mermaid
    icon: '<i class="fa-solid fa-diagram-project"></i>'
    details: Propulsé par vitepress-plugin-mermaid — organigrammes, diagrammes de séquence, diagrammes de classes, avec prise en charge du mode sombre
  - title: Formules mathématiques
    icon: '<i class="fa-solid fa-square-root-variable"></i>'
    details: Formules mathématiques en ligne et en bloc rendues par MathJax 3
  - title: Recherche plein texte
    icon: '<i class="fa-solid fa-magnifying-glass"></i>'
    details: Recherche locale VitePress avec interface personnalisable par langue
  - title: Extensions Markdown
    icon: '<i class="fa-solid fa-markdown"></i>'
    details: Surlignage, exposants, indices et notes de bas de page inclus
  - title: Commentaires et flux
    icon: '<i class="fa-solid fa-comments"></i>'
    details: Commentaires Giscus (GitHub Discussions) et flux RSS prêts à l'emploi

highlights:
  - header: Démarrage rapide
    image: /assets/image/home/box.svg
    bgImage: /assets/image/home/bg/1-light.svg
    bgImageDark: /assets/image/home/bg/1-dark.svg
    highlights:
      - Clonez le dépôt puis exécutez pnpm install
      - Démarrez le serveur de développement avec pnpm run dev et ouvrez http://localhost:5173
      - Ajoutez des pages Markdown dans docs/fr/
      - Enregistrez-les dans la configuration sidebar-generated.ts
      - Personnalisez la navigation et le pied de page dans config/locales/fr.ts
      - Compilez avec pnpm run build et déployez sur n'importe quel hébergement statique
---
