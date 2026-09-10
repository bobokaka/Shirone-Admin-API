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
  - title: Tableau de bord et aperçu réel
    icon: '<i class="fa-solid fa-gauge-high"></i>'
    details: Changements en attente et statistiques de contenu en un coup d'œil, avec aperçu intégré du vrai blog en temps réel
    link: /fr/guide/dashboard
  - title: Édition d'articles
    icon: '<i class="fa-solid fa-pen-nib"></i>'
    details: Éditeur Markdown en mode source avec extraits du thème (conteneurs triple-deux-points, file-tree, onglets de code…), images gérées avec le texte
    link: /fr/guide/post-editor
  - title: Moments
    icon: '<i class="fa-solid fa-messages"></i>'
    details: Humeur, lieu, tags et grille de neuf photos — images archivées automatiquement dans le pipeline de miniatures du thème
    link: /fr/guide/moments
  - title: Réglages du site
    icon: '<i class="fa-solid fa-palette"></i>'
    details: Infos du site, navigation, pied de page, apparence du thème et bannières — tout s'édite visuellement
    link: /fr/guide/settings
  - title: Données structurées
    icon: '<i class="fa-solid fa-diagram-project"></i>'
    details: Édition visuelle des projets, compétences, timeline, appareils, animes, compas, playlists et liens des data/*.ts, avec import par recherche
    link: /fr/guide/data
  - title: Assistant IA
    icon: '<i class="fa-solid fa-wand-magic-sparkles"></i>'
    details: Basculez entre plusieurs fournisseurs — réécriture, messages de commit et brouillons de timeline depuis chaque page
    link: /fr/guide/ai
  - title: Import de contenu
    icon: '<i class="fa-solid fa-cloud-arrow-down"></i>'
    details: Migration par lots des archives Jianshu, conversion instantanée au collage d'un article, import d'animes et de musique en un seul endroit
    link: /fr/guide/import
  - title: Publication en un clic
    icon: '<i class="fa-solid fa-rocket-launch"></i>'
    details: Commit et push git vers les deux dépôts, validation automatique du thème avant publication
    link: /fr/guide/publish

highlights:
  - header: Pourquoi Shirone-Admin
    image: /assets/image/home/diamond.svg
    bgImage: /assets/image/home/bg/1-light.svg
    bgImageDark: /assets/image/home/bg/1-dark.svg
    features:
      - title: Local d'abord
        icon: fa-hard-drive
        details: Toutes vos données restent dans votre propre dépôt de contenu — un outil local, sans serveur à déployer
      - title: Aperçu du site réel
        icon: fa-window-maximize
        details: astro dev du dépôt du thème intégré — ce que vous voyez est le vrai site que vous allez publier
      - title: Workflow à trois dépôts
        icon: fa-cubes
        details: Collabore avec le dépôt du thème Shirone et le dépôt Shirone-Content, chaque modification est traçable
      - title: Publication sécurisée
        icon: fa-clipboard-check
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
