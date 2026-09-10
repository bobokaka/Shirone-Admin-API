---
title: Moments
description: Publier et gérer des moments — humeur, lieu, tags, grille de neuf images archivées automatiquement par lot, avec amélioration IA et suggestions de tags.
---

# Moments

Un « moment » est un format plus léger qu'un article : une pensée, quelques images, une icône d'humeur. Le composeur est en haut de page, le flux en dessous — on écrit et on publie à la volée.

![Moments](/assets/guide/moments.png)

## Publier un moment

La carte du composeur, de haut en bas :

1. **Corps du texte** — zone de texte multiligne pour la pensée du moment
2. **Zone images** — jusqu'à **9 images** ; cliquez sur + pour choisir, ou collez directement
3. **Ligne de métadonnées** — humeur / lieu / tags / date de publication / épinglage
4. **Ligne d'actions** — Améliorer avec l'IA (IA activée) / Enregistrer comme brouillon / Publier le moment

### Icônes d'humeur

Neuf humeurs prédéfinies : 😊 joyeux, 🤩 enthousiaste, 😐 calme, 😔 maussade, 😢 triste, ❤️ amoureux, 🎉 célébration, ☕ petit verre, 🌙 bonne nuit. Les icônes sont stockées par nom Iconify (toutes intégrées localement, aucune requête réseau) et rendues côté public en icônes correspondantes.

### Comment sont archivées les images

Toutes les images d'une même publication vont dans **un même répertoire de lot** :

```
public/images/moments/<yyyymmdd-HHmmss>/   # l'identifiant de lot est identique au nom de fichier du moment
├── 1.webp
└── 2.webp
```

Même un téléversement multiple et simultané rejoint le même lot (l'identifiant est généré à l'avance). Cette règle de répertoire n'est pas arbitraire — le pipeline de miniatures du thème **ne scanne que** `public/images/moments/` : placées ailleurs, les images ne recevraient pas de miniature côté public ; le backend impose donc l'emplacement d'écriture.

> [!TIP]
> Retirer une image avant publication l'enlève seulement de la publication en cours ; le fichier reste dans le dépôt. Supprimer le moment entier conserve aussi ses images — le nettoyage éventuel se fait à la main.

### Assistance IA (facultatif)

IA activée, le composeur gagne deux entrées :

- **Améliorer avec l'IA** — réécrit le corps en flux, le résultat pousse directement dans la zone de saisie (naturel et parlé, préserve ton et faits), arrêtable à tout moment, l'arrêt restaurant le texte d'origine
- **Suggestions IA** — extrait 2–4 tags du corps (fusionnés et dédupliqués avec les tags existants) et devine l'humeur (sans écraser un choix déjà fait)

## Gérer le flux de moments

La liste en dessous offre filtres combinables et pagination (8 par page) :

| Filtre | Description |
|------|------|
| Champ de recherche | cherche dans le corps, le lieu, les tags |
| Liste déroulante d'état | tous / publiés / brouillons |
| Tags à choix multiples | cliquer un tag sur une carte filtre aussi (recliquer pour annuler) |
| Épinglés seulement | case à cocher |

Chaque carte de moment propose :

- **Éditer** — le contenu remonte dans le composeur (les nouvelles images vont dans un **nouveau lot**, sans mélanger l'ancien répertoire) ; cliquez ensuite « Publier le moment » pour enregistrer
- **Bascule épinglage** — épingle/désépingle en un clic, la liste se rafraîchit aussitôt
- **Supprimer** — après double confirmation, retire le fichier `.md` (les images sont conservées)

## Différences entre moments et articles

| | Articles | Moments |
|---|------|------|
| Format | long texte + système de métadonnées | texte court + images + humeur |
| Stockage | `content/posts/<slug>/index.md` | `content/moments/<yyyymmdd-HHmmss>.md` |
| Usage typique | tutoriels, notes, réflexions approfondies | actualités, pensées fugaces, prises de notes |

## Prochaines étapes

- Utiliser les [Données structurées](./data.md) pour afficher vos appareils, animes et liens amis
- Le contenu écrit, passer par [Commit et publication](./publish.md)
