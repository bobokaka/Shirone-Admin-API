---
title: Tableau de bord et aperçu
description: Découvrir la page d'accueil de l'administration Shirone-Admin — quatre cartes de statistiques, la liste du contenu récent et un panneau d'aperçu intégrant le vrai site du blog.
---

# Tableau de bord et aperçu

La première page visible après avoir ouvert `http://localhost:5173/` est le **tableau de bord**. C'est la vue d'ensemble de toute l'administration : combien de modifications attendent d'être publiées, combien d'articles et de moments, plus une fenêtre d'aperçu qui rend en temps réel l'apparence réelle de votre blog.

![Tableau de bord](/assets/guide/dashboard.png)

## Les quatre cartes de statistiques

| Carte | Signification du chiffre | Bouton rapide |
|------|----------|----------|
| **Modifications à publier** | Total des fichiers du dépôt de contenu en git : stagés + modifiés + non suivis | « Publier » → ouvre [Commit et publication](./publish.md) |
| **Total d'articles** | Tous les articles du dépôt de contenu, brouillons compris | « Gérer les articles » → ouvre [Gestion des articles](./posts.md) |
| **Total de moments** | Tous les moments, brouillons compris | « Gérer les moments » → ouvre [Moments](./moments.md) |
| **Total de brouillons** | Somme des articles et moments marqués comme brouillons | « Continuer » → ouvre la gestion des articles |

« Modifications à publier » agrège toutes vos modifications pas encore commitées : après avoir écrit un article ou publié un moment, si ce chiffre n'est pas nul, c'est que rien n'est encore en ligne.

## Contenu récent

Sous les cartes de statistiques, deux listes présentent les **6 derniers articles** et les **6 derniers moments** :

- chaque ligne d'article affiche le titre et la date de publication ; les brouillons portent une étiquette jaune
- chaque ligne de moment affiche l'heure, les étiquettes épinglé/brouillon/tags, les trois premières lignes du texte et jusqu'à 3 miniatures (cliquables pour un agrandissement)
- le lien « Plus » en haut à droite ouvre la page de gestion correspondante

## Aperçu du site réel

La carte « Aperçu du site réel » en bas de page intègre une iframe qui charge directement `http://localhost:4321/` — c'est-à-dire le **site réel** rendu par le serveur de développement Astro du dépôt du thème. Ce n'est ni une capture ni une maquette simplifiée : l'aperçu est strictement identique au futur site publié.

### Indicateur d'état et actions

La barre d'outils en haut du panneau, de gauche à droite :

- **Étiquette d'état** (sondée toutes les 3 secondes) :
  - Site prêt `:4321` — aperçu disponible
  - Dev server déjà en cours d'exécution détecté sur `:4321` — aperçu disponible (processus non lancé par ce panneau)
  - Démarrage, première compilation en cours… — Astro est en démarrage à froid, patientez un instant
  - Non lancé — il faut cliquer sur « Démarrer l'aperçu »
- **Démarrer l'aperçu / Arrêter** — lance ou interrompt depuis l'administration les processus `content:watch` + `astro dev` du dépôt du thème
- **Ouvrir dans une nouvelle fenêtre** — ouvre un onglet de navigateur accédant directement à `:4321`

Le panneau du tableau de bord ne lance pas les processus tout seul (pour ne pas vous surprendre) : cliquez manuellement sur « Démarrer l'aperçu ». Si vous avez démarré via `node workspace/content-watch.mjs`, le dev server tourne déjà et le panneau affiche directement « prêt ».

### Pourquoi l'aperçu est-il « réel »

Le flux de données présenté dans [L'espace de travail à trois dépôts](./workspace.md) : enregistrement dans l'administration → écriture dans le dépôt de contenu → matérialisation vers le dépôt du thème par `content:watch` → recompilation Astro. Changez donc une phrase dans l'administration, enregistrez, et quelques secondes plus tard le blog se met à jour dans l'aperçu — **ce que vous voyez est le site réel qui sera publié**.

## Barre supérieure et accès globaux

La barre supérieure, commune à toutes les pages :

- **Titre de page** — nom de la page fonctionnelle courante
- **Étiquette d'état de connexion** — dépôt de contenu « Connecté / Non connecté » (voir [L'espace de travail à trois dépôts · Comment consulter l'état de connexion](./workspace.md#comment-consulter-l-etat-de-connexion))
- **Bouton ✨** — ouvre la [Console IA](./ai.md#console-ia) globale
- **Bouton engrenage** — ouvre la fenêtre « Réglages » (configuration des [fournisseurs IA](./ai.md#configurer-les-fournisseurs) et page « À propos »)

## Prochaines étapes

- [Écrire votre premier article](./posts.md)
- [Publier un moment](./moments.md)
