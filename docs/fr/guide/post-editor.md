---
title: Éditeur d'articles
description: L'usage complet de l'éditeur Markdown en mode source — barre d'outils, téléversement des illustrations, panneau d'informations de l'article (date, catégorie, protection, chemin d'accès), rédaction assistée par IA et enregistrement automatique.
---

# Éditeur d'articles

L'éditeur d'articles est la page la plus dense en fonctionnalités de l'administration. On y entre en créant un article depuis [Gestion des articles](./posts.md) ou en cliquant sur « Éditer » ; la page d'édition complète offre une **prévisualisation en direct en deux colonnes**, tandis que l'édition sur place de la page de gestion est la forme mono-colonne du même éditeur.

![Éditeur d'articles](/assets/guide/post-editor.png)

## Actions de la barre supérieure

De gauche à droite :

| Bouton | Rôle |
|------|------|
| Retour | enregistre automatiquement puis revient à la page précédente |
| Champ de titre | grand champ de saisie permanent, renommable à tout moment |
| Informations de l'article | ouvre le panneau de métadonnées (voir ci-dessous) |
| Supprimer | supprime l'article et toutes les illustrations de son répertoire, avec double confirmation |
| Enregistrer | écrit immédiatement dans le dépôt de contenu |
| Enregistrer et publier | enregistre puis bascule directement sur [Commit et publication](./publish.md) |

La barre supérieure affiche aussi « Enregistré automatiquement à HH:mm:ss » pour indiquer l'heure du dernier enregistrement automatique.

## L'éditeur

L'éditeur adopte le **mode source Markdown** (basé sur md-editor-v3 + CodeMirror) : vous écrivez directement le Markdown source, et la colonne de droite rend la prévisualisation en temps réel. La barre d'outils couvre la mise en forme usuelle : gras, italique, barré, titres, citation, listes, tâches, code en ligne, blocs de code, liens, images, tableaux, annuler/rétablir, plus les bascules prévisualisation/sommaire.

**Illustrations sans friction** : collez une capture ou téléversez via le bouton image, le fichier va automatiquement dans le sous-répertoire `images/` du répertoire de l'article courant, et le corps de texte insère une référence relative (`./images/xxx.webp`). L'article est ainsi autonome — copiez le répertoire entier, vous avez l'article complet.

Quand l'IA est activée, un **menu déroulant IA** s'ajoute en fin de barre d'outils — voir ci-dessous [Rédaction assistée par IA](#redaction-assistee-par-ia).

## Panneau d'informations de l'article

Le panneau « Informations de l'article » rassemble toutes les métadonnées (correspondant au frontmatter de l'article) :

### Champs de base

- **Date de publication** (`YYYY-MM-DD`) et **heure précise** — sert à ordonner plusieurs articles publiés le même jour ; le fuseau horaire est normalisé automatiquement en `+08:00`
- **Catégorie** — liste déroulante des catégories existantes (avec compteur d'utilisation) ; saisissez directement un nouveau nom et validez pour la créer
- **Tags** — sélection multiple, création par saisie également possible
- **Résumé** — laissé vide, le thème extrait automatiquement le début du contenu ; la couverture accepte un téléversement local ou un lien externe
- **Interrupteurs** — brouillon / épinglé / commentaires / protection par mot de passe

### Articles protégés par mot de passe

Cocher « Protégé » déploie trois champs :

- **Mot de passe d'accès** — pour un article déjà doté d'un mot de passe, en saisir un nouveau le modifie, le laisser vide le conserve ; décocher « Protégé » supprime le mot de passe
- **Indice de mot de passe** — indice montré au visiteur avant la saisie
- **Masquer la prévisualisation sur la carte d'accueil** — évite que le contenu protégé fuite sous forme de résumé sur la page d'accueil

### Chemin d'accès

Trois modes déterminent l'URL finale de l'article, avec un aperçu d'adresse en direct en bas :

| Mode | Forme de l'adresse | Cas d'usage |
|------|----------|----------|
| Par défaut | `/posts/<nom d'article>/` | article ordinaire |
| Alias personnalisé | `/posts/<alias>/` | pour une URL plus courte et plus parlante |
| Permalien racine | `/<chemin personnalisé>/` | page vitrine travaillée, comme `/about-me/` |

## Rédaction assistée par IA

> [!NOTE]
> Les fonctions ci-dessous exigent d'abord d'activer l'Assistant IA (voir [Configuration](./ai.md#configurer-les-fournisseurs)). Sans activation, aucune entrée IA n'apparaît dans la barre d'outils et la rédaction fonctionne normalement.

Le menu déroulant IA embarque 5 actions + des instructions personnalisées ; toutes les actions **préservent telles quelles le code et la syntaxe propriétaire du thème Shirone** (conteneurs triple-deux-points, file-tree, etc.) :

| Action | Portée | Application du résultat |
|------|----------|--------------|
| IA - Compléter le contenu | tout le texte | comble les manques argumentaires, renforce les enchaînements logiques — prévisualisation avant application |
| IA - Optimiser le formatage | tout le texte | normalise la hiérarchie des titres, unifie la ponctuation, complète le langage des clôtures de code — prévisualisation avant application |
| IA - Améliorer le style | **sélection prioritaire** | remplace directement la sélection s'il y en a une ; sinon prévisualisation diff de tout le texte |
| IA - Poursuivre le texte | fin du texte | prolonge naturellement depuis la fin ; le résultat est ajouté au bout du corps |
| IA - Générer le résumé | tout le texte | génère un résumé de 80–160 caractères pour renseigner « Informations de l'article » (confirmation d'abord si un résumé existe) |
| Instructions personnalisées | sélection ou tout le texte | exécute toute instruction saisie (ex. « passer à un style plus parlé ») |

La **prévisualisation diff** est le filet de sécurité des actions de réécriture intégrale (complétion / optimisation / amélioration sans sélection / instructions personnalisées) : le résultat IA s'affiche en flux dans une vue comparative gauche-droite, les longues suites de lignes inchangées se replient automatiquement, et les boutons « précédent / suivant » permettent de sauter de bloc en bloc. Ce n'est qu'après vérification que « Appliquer le remplacement » réécrit réellement le corps ; un contenu interrompu en cours de génération est incomplet et inapplicable. Si la longueur du texte varie de plus de 20 %, la fenêtre de prévisualisation alerte en rouge et invite à une relecture attentive.

Toutes les actions IA s'exécutent dans la [Console IA](./ai.md#console-ia) globale : processus de réflexion visible, arrêtable à tout moment.

## Enregistrement automatique

L'éditeur dispose d'un mécanisme d'enregistrement automatique discret :

- une vérification toutes les **10 secondes** ; seuls un titre ou un corps modifiés déclenchent une écriture silencieuse
- l'instant où vous **changez d'article, cliquez sur Retour ou quittez la page d'édition** déclenche aussi l'enregistrement
- le seul cas qui vous intercepte : un titre vide (impossible à enregistrer) — une invite demande alors de remplir le titre d'abord

L'enregistrement automatique ne couvre que le titre et le corps ; les métadonnées du panneau « Informations de l'article » s'écrivent via le bouton « Enregistrer ».

## Prochaines étapes

- Découvrir [Moments](./moments.md) — un format de partage plus léger que l'article
- Le contenu prêt, passer par [Commit et publication](./publish.md)
