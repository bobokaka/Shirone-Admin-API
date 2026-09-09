---
layout: home

hero:
  name: Shirone-Admin
  text: L'outil de gestion visuelle de contenu pour votre blog Shirone
  tagline: Fonctionne en local · Rédaction assistée par IA · Publication en un clic sur deux dépôts — de l'installation à la référence API, commencez ici
  image:
    src: /assets/image/home/blog.svg
    alt: Shirone-Admin
  actions:
    - theme: brand
      text: Démarrer
      link: /fr/guide/
    - theme: alt
      text: GitHub
      link: https://github.com/bobokaka/Shirone-Admin

features:
  - title: Édition d'articles
    icon: '<i class="fa-solid fa-file-pen"></i>'
    details: Éditeur Markdown en mode source, avec les extraits propriétaires du thème Shirone (conteneurs triple-deux-points, file-tree, onglets de code…), images gérées avec le texte
  - title: Moments
    icon: '<i class="fa-solid fa-comment-dots"></i>'
    details: Publication et gestion de statuts courts, images automatiquement archivées dans le pipeline de miniatures du thème
  - title: Données structurées
    icon: '<i class="fa-solid fa-table-list"></i>'
    details: Édition visuelle des projets, compétences, timeline, appareils, animes, navigation et autres data/*.ts
  - title: Assistant IA
    icon: '<i class="fa-solid fa-robot"></i>'
    details: Bascule entre plusieurs fournisseurs — réécriture des imports, génération des messages de commit, brouillons de timeline
  - title: Import de contenu
    icon: '<i class="fa-solid fa-file-import"></i>'
    details: Import en un seul endroit — archives Jianshu, animes (API Bangumi) et musique
  - title: Publication en un clic
    icon: '<i class="fa-solid fa-rocket"></i>'
    details: Commit et push git vers les deux dépôts, avec validation automatique du thème avant publication

highlights:
  - header: Pourquoi Shirone-Admin
    image: /assets/image/home/diamond.svg
    bgImage: /assets/image/home/bg/1-light.svg
    bgImageDark: /assets/image/home/bg/1-dark.svg
    features:
      - title: Local d'abord
        icon: fa-house-laptop
        details: Toutes vos données restent dans votre propre dépôt de contenu — un outil local, sans serveur à déployer
      - title: Aperçu du site réel
        icon: fa-eye
        details: astro dev du dépôt du thème intégré — ce que vous voyez est le vrai site que vous allez publier
      - title: Workflow à trois dépôts
        icon: fa-cubes
        details: Collabore avec le dépôt du thème Shirone et le dépôt Shirone-Content, chaque modification est traçable
      - title: Publication sécurisée
        icon: fa-shield-halved
        details: La validation du thème s'exécute automatiquement avant publication et bloque la sortie en cas d'échec

  - header: Opérationnel en trois minutes
    image: /assets/image/home/box.svg
    bgImage: /assets/image/home/bg/2-light.svg
    bgImageDark: /assets/image/home/bg/2-dark.svg
    highlights:
      - Clonez les dépôts Shirone, Shirone-Content et Shirone-Admin dans le même répertoire parent
      - Exécutez pnpm install dans les dépôts Shirone-Admin et Shirone
      - Lancez tout d'un coup avec node workspace/content-watch.mjs
      - Ouvrez http://localhost:5173 dans votre navigateur pour accéder à l'admin
      - Consultez le guide pour les étapes détaillées et les usages avancés
---
