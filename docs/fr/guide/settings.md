---
title: Paramètres du site
description: Configurer tout le site sans écrire une ligne de YAML — cinq sections (informations de base, navigation, pied de page, apparence du thème, fonds d'écran de bannière) avec aperçu du site réel en direct à droite.
---

# Paramètres du site

La page « Paramètres du site » transforme en formulaires tous les réglages du thème : sections de formulaire à gauche, [aperçu du site réel](./dashboard.md#apercu-du-site-reel) intégré à droite — enregistrez, l'aperçu se rafraîchit, ce que vous voyez est ce que vous obtenez.

La page compte cinq onglets : **Informations de base**, **Navigation**, **Pied de page**, **Apparence du thème**, **Fonds d'écran de bannière**.

![Paramètres du site · Informations de base](/assets/guide/settings.png)

## Informations de base

Sept sections, chacune s'enregistre indépendamment :

| Section | Ce qu'elle configure |
|------|----------|
| Informations du site | nom du site, sous-titre (avec génération IA ✨ en une phrase pour le sous-titre) |
| Profil | avatar (URL en ligne ou téléversement local, renommé automatiquement à l'écriture), pseudonyme, signature (avec IA ✨ également) |
| Liens sociaux | liste de liens externes type GitHub / Bilibili : nom, icône Iconify, adresse |
| Favicon du site | deux emplacements clair / sombre ; sans personnalisation, une note indique l'icône par défaut du thème actuellement effective ; le téléversement nomme automatiquement `favicon-light/dark.<ext>` en remplacement en place, ou saisissez directement une adresse en ligne |
| Réglages généraux | adresse du site (domaine final après déploiement), sous-chemin (`/` pour un déploiement à la racine), fuseau horaire (liste déroulante des fuseaux usuels, saisie manuelle possible) |
| Panneau d'affichage visiteur | interrupteurs de ce que le site public expose aux visiteurs : sélecteur de palette, bascule de spécification des palettes, mode d'arrière-plan, mise en page des listes, réduction des animations, texture de fond |
| Internationalisation | activer ou non le multilingue : cochez l'ensemble des langues ouvertes, la langue principale doit en faire partie ; désactivé, tout le site reste verrouillé en chinois simplifié |

## Navigation

L'éditeur visuel du menu de navigation :

- **Préréglages du thème** — choisissez parmi 15 préréglages intégrés (accueil, archives, liens amis, etc.), branchés en un clic
- **Liens personnalisés** — nom + icône + adresse, avec marqueur « ouvrir dans une nouvelle fenêtre »
- **Groupes déroulants** — tirez un menu de second niveau pour rassembler des entrées voisines

La configuration de navigation s'enregistre globalement, avec une sémantique de tableau : **remplacement intégral**.

## Pied de page

- **Interrupteur d'activation** — contrôle l'injection du contenu personnalisé au-dessus de la ligne de copyright du thème
- **Éditeur HTML** — éditeur de code CodeMirror, avec bouton **formatage Prettier** ; le HTML du pied de page est conservé en l'état dans `config/footer.html` du dépôt de contenu
- **Bibliothèque d'images du pied de page** — téléversez ou collez un lien direct en ligne (téléchargement par le serveur, webp converti automatiquement en png/jpg), déposé dans `public/images/footer/` ; cliquez « Copier le chemin » pour l'insérer dans le HTML
- **Prévisualisation en direct** — iframe restituant à l'identique le rendu du pied de page du thème : ligne de copyright + votre contenu personnalisé

## Apparence du thème

![Paramètres du site · Apparence du thème](/assets/guide/settings-appearance.png)

Deux sections :

### Palette de couleurs du thème

- **Curseur de teinte** (0–360) — affiche en direct l'aperçu d'une rampe de 5 nuances générée depuis cette teinte
- **Verrouiller** — coché, la teinte du site ne suit plus les préférences du contenu / du visiteur
- **Style de palette** — les 9 styles dynamiques de Material 3 : tonalSpot (classique doux), vibrant, content (teinté par le contenu), expressive, rainbow, fruitSalad, monochrome, neutral, fidelity
- **Spécification des palettes** — les deux générations Material 3 : 2021 / 2025

### Fonds d'écran et textures

- **Mode d'arrière-plan par défaut** — binaire banner / none, décide de l'apparence par défaut du site quand aucun fond n'est choisi
- **Texture de fond** — six préréglages : none, starlight (ciel étoilé), cyber-dots (trame cyber), topography (courbes de niveau), geometric (géométrique), sakura (cerisier) ; opacité 0.05–0.25 ; interrupteur d'animation autorisé

## Fonds d'écran de bannière

Le contrôle complet de la bannière d'accueil :

- **Deux listes fond de bureau / fond mobile** — téléversement local, import de lien direct en ligne (téléchargement par le serveur), bouton **fonds d'écran recommandés par l'IA** (récupère un lot depuis la source safebooru filtré par taille : paysage ≥1920 pour le bureau, portrait ≥1920 pour le mobile, à cocher avant téléchargement)
- **Contrôles d'affichage** — position (top/center/bottom), voile (interrupteur + opacité)
- **Texte d'accueil** — titre, plusieurs sous-titres, effet machine à écrire (vitesse / vitesse d'effacement / pause / boucle) ; les sous-titres peuvent être générés d'un clic via **IA - Générer**, à raison de 4–6 phrases tournantes à partir du nom et de la signature du site
- **Carrousel** — actif avec plusieurs fonds ; intervalle de bascule, durée de fondu, six animations de transition (ken-burns travelling lent, zoom-in/out, pan-left/right, none)
- **Décoration de vagues** — interrupteur de l'animation de vagues en bas de bannière

> [!TIP]
> À l'enregistrement de la bannière, les fichiers locaux de fonds d'écran devenus sans référence côté bureau ou mobile sont **nettoyés automatiquement** — inutile de supprimer à la main.

## Où atterrissent les réglages

Tous les réglages s'écrivent dans `config/*.yaml` du dépôt de contenu, selon le principe de **recouvrement minimal** : seules les clés modifiées sont écrites, les champs non déclarés héritent des valeurs par défaut du thème — quand une montée de version du thème ajoute des réglages, votre site les suit automatiquement, sans rester coincé sur une « photographie exhaustive » d'une ancienne version. Les clés de dictionnaire fusionnent récursivement, les tableaux sont remplacés intégralement.

## Prochaines étapes

- Enrichir la page « À propos » avec les [Données structurées](./data.md)
- Une fois configuré, vérifier le rendu dans l'[aperçu du site réel](./dashboard.md#apercu-du-site-reel), puis [publier](./publish.md) quand vous êtes satisfait
