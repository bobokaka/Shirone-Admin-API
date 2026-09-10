---
title: Gestion des articles
description: Parcourir, filtrer, prévisualiser et organiser tous vos articles — une mise en page à deux colonnes avec filtres à gauche et prévisualisation à droite, plus renommage et fusion en masse des catégories et tags.
---

# Gestion des articles

La page « Gestion des articles » est votre point d'entrée principal pour travailler avec les articles : parcourir l'ensemble, filtrer par catégorie ou tag, prévisualiser rapidement le contenu, et réorganiser en masse le système de catégories.

![Gestion des articles](/assets/guide/posts.png)

La page se divise en deux colonnes : **à gauche la liste d'articles** (filtres + sélection), **à droite la prévisualisation du contenu** (lecture ou édition sur place). Cliquez sur un article à gauche, son Markdown se rend immédiatement à droite.

## Créer un article

Cliquez sur « **Nouvel article** » dans la barre d'outils, saisissez le titre dans la fenêtre modale (modifiable à tout moment après création), puis confirmez :

1. le backend crée dans `content/posts/` du dépôt de contenu un article en **état de brouillon**
2. l'application bascule automatiquement sur la page [Éditeur d'articles](./post-editor.md) pour commencer à écrire

Le titre est transcrit en pinyin pour générer un nom de répertoire amical pour les URL (slug) : par exemple 《Guide de démarrage rapide》 → `kuai-su-shang-shou-zhi-nan/index.md`. En cas d'homonymie, un numéro est ajouté automatiquement.

## Parcourir et filtrer

La barre d'outils offre trois filtres combinables :

| Filtre | Comportement |
|--------|------|
| Champ de recherche | cherche simultanément dans les **titres, catégories et tags** (insensible à la casse) |
| Liste déroulante de catégories | n'affiche que les articles de cette catégorie ; le nombre d'articles apparaît entre parenèses après l'option |
| Liste déroulante de tags | n'affiche que les articles portant ce tag |

L'en-tête de liste affiche en direct « Articles (filtrés / total) ». Chaque ligne montre le titre, la date de publication, la catégorie, et les étiquettes d'état : « Brouillon » jaune, « Épinglé », « Protégé » rouge.

## Prévisualiser et éditer sur place

Un article sélectionné s'affiche à droite avec :

- **Titre et métadonnées** : date, catégorie, tags, étiquettes brouillon/épinglé/protégé
- **Rendu du contenu** : Markdown rendu en temps réel ; les illustrations du répertoire de l'article (références relatives `./images/…`) s'affichent directement
- Le bouton **Éditer** : la colonne se transforme sur place en éditeur complet (la même interface que la page [Éditeur d'articles](./post-editor.md), sans la prévisualisation en colonnes). L'icône « Édition en colonnes » en haut à droite de l'éditeur bascule vers la page d'édition complète avec prévisualisation gauche-droite, et le retour rétablit l'état d'édition de cet article
- Le bouton **Supprimer** : pour un article en répertoire, une invite précise « l'article et toutes les illustrations de son répertoire seront supprimés » ; un contenu déjà commité en git se récupère depuis l'historique

> [!TIP]
> En édition sur place, si vous changez d'article dans la colonne de gauche alors que des modifications ne sont pas enregistrées, un **enregistrement automatique silencieux** a lieu avant la bascule — aucune perte de texte (voir [Éditeur d'articles · Enregistrement automatique](./post-editor.md#enregistrement-automatique)).

## Gestion des catégories / tags

Le bouton « **Gestion des catégories** » à droite de la barre d'outils ouvre la fenêtre modale de réorganisation en masse — le seul endroit où maintenir le système de catégories de tout le site :

- en haut, deux onglets catégories / tags ; les listes sont triées par **nombre d'articles utilisateurs, en ordre décroissant**
- **Renommer / Fusionner** : donne à une catégorie (ou un tag) un nouveau nom ; si ce nom existe déjà, l'opération revient à **fusionner** les deux. Le backend réécrit le frontmatter article par article en préservant le format des dates
- **Retirer** : supprime cette catégorie / ce tag de tous les articles (les articles eux-mêmes ne sont pas affectés)

Par exemple, pour unifier les tags épars « JS » et « JavaScript » en « JavaScript » : renommez « JS », saisissez `JavaScript`, confirmez, et tous les articles concernés sont réécrits automatiquement.

## Forme des articles sur le disque

Comprendre le stockage rend les sauvegardes et le dépannage plus sereins :

```
content/posts/
├── hello/                  # En répertoire (par défaut à la création) : illustrations gérées avec l'article
│   ├── index.md
│   └── images/
│       └── cover.webp
└── old-post.md             # À plat (anciens articles ou import externe) : fichier unique
```

- Tout nouvel article est **en répertoire** ; les illustrations téléversées depuis l'éditeur vont automatiquement dans le sous-répertoire `images/` de son répertoire
- La liste est triée par **épinglés en priorité, puis date de publication décroissante**

## Prochaines étapes

- Entrer dans la page [Éditeur d'articles](./post-editor.md) pour découvrir l'éditeur, les informations d'article et la rédaction assistée par IA
- Une fois les articles modifiés, passer par [Commit et publication](./publish.md) pour la mise en ligne
