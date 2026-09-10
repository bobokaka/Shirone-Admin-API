---
title: Import depuis plateformes
description: Rapatrier vos articles Jianshu dans le blog — deux voies, import par lots d'une archive d'export ou collage d'un article unique converti à la volée, avec assistant en cinq étapes et complétion automatique des métadonnées par l'IA.
---

# Import depuis plateformes

Vous bloguez sur une autre plateforme ? La page « Import depuis plateformes » offre un passage de migration ; **Jianshu** est pris en charge pour l'instant, avec un onglet par plateforme en haut de page et d'autres à venir sur le même modèle.

Deux voies d'import, à choisir dès l'entrée sur la page :

| Voie | Adaptée à | Entrée |
|------|------|------|
| **Import d'archive d'export** | déménagement complet du site, dizaines voire centaines d'articles | rar / zip obtenu via « télécharger tous mes articles en archive » de Jianshu |
| **Collage d'un article unique** | articles choisis, convertis dès le collage | contenu copié en intégralité depuis la page web de l'article |

![Import depuis plateformes](/assets/guide/import.png)

## Import d'archive d'export

Assistant en cinq étapes : **choix de la voie → téléversement de l'archive → sélection des articles → conversion → import terminé**.

### Étape 1 : téléverser l'archive d'export

Demandez l'export sur Jianshu via « Réglages → Gestion du compte → Télécharger tous mes articles en archive » (Jianshu envoie un lien de téléchargement par e-mail), puis glissez l'archive obtenue dans la zone de téléversement. Limites : formats zip / rar, 30 Mo maximum par archive.

Après l'envoi, le serveur décompresse et analyse en mémoire, puis liste tous les articles groupés par **recueil**.

### Étape 2 : sélectionner les articles

- Une fois l'analyse réussie, les articles jamais importés sont **tout cochés par défaut**
- La sélection se fait par recueil entier, ou tout / rien
- Les articles déjà importés portent la mention « importé » et sont décochables de façon bloquante, pour éviter les doublons
- Chaque article peut être « prévisualisé » — voir le Markdown converti sans rien écrire sur le disque

Les options d'import se règlent à droite de la page :

| Option | Description |
|------|------|
| Date de publication uniforme | l'archive Jianshu ne contient pas de dates ; toutes les articles reçoivent la même date de publication (modifiable ensuite un par un) |
| Recueils comme catégories | coché, chaque nom de recueil devient directement la catégorie des articles ; décoché, vous désignez une catégorie unique commune |
| Tags | ajoute les mêmes tags à toute la série |
| Localisation des images | télécharge les images du CDN Jianshu dans le répertoire `images/` de chaque article ; en cas d'échec, le lien distant est conservé |
| Importer comme brouillon | **recommandé de laisser coché** — relisez dans [Gestion des articles](./posts.md) avant de publier |

### Étape 3 : conversion du contenu

Au démarrage, le serveur crée une **tâche d'arrière-plan** convertissant article par article, et la page interroge la progression toutes les 2 secondes : total, terminés, titre de l'article en cours. Vous pouvez quitter la page en cours de route, la tâche continue.

### Étape 4 : terminé

La tâche finie affiche la liste des résultats : succès de chaque article, chemin d'écriture, nombre d'images localisées. Les échecs explicitent leur cause (un article en échec n'affecte pas les autres). Vous pouvez « importer l'archive suivante » ou sauter vers la gestion des articles pour vérifier le résultat.

## Coller un article unique

Assistant en cinq étapes : **choix de la voie → collage du contenu → conversion → informations de l'article → import terminé**.

1. **Coller** — ouvrez l'article sur le site web Jianshu, sélectionnez tout, copiez, puis `Ctrl+V` directement dans l'éditeur : le rich texte devient automatiquement du Markdown (titres, gras, liens, images conservés), source à gauche et prévisualisation à droite, retouchable à la main
2. **Conversion du contenu** — après confirmation, le serveur écrit dans le dépôt : images téléchargées automatiquement dans le répertoire de l'article (lien distant conservé en cas d'échec), article généré en répertoire
3. **Informations de l'article** — l'IA analyse le corps et **complète automatiquement** : titre (proposé par l'IA si laissé vide), résumé, catégorie, suggestions de tags, le tout retouchable ; sans IA, repli sur l'extraction du résumé du corps, signalé explicitement par `aiUsed=false`
4. **Finaliser** — les métadonnées sont réécrites dans l'article, c'est terminé. Un lien bascule vers [Éditeur d'articles](./post-editor.md) pour l'affinage

> [!TIP]
> Le champ de titre a aussi un repli de collage : quand le presse-papiers ne contient que du rich texte (cas fréquent d'une copie web), le texte brut est extrait et réduit à une seule ligne.

## Sessions et tâches

- Le téléversement d'une archive crée une **session** (résultat d'analyse mis en cache dans la mémoire du serveur), valable 24 heures, 3 au maximum simultanément, la plus ancienne étant évincée automatiquement à l'expiration ou au dépassement — « changer d'archive » rejette immédiatement la session courante
- Les résultats des tâches d'import d'arrière-plan sont conservés 1 heure
- Après un redémarrage du service, sessions et tâches en mémoire disparaissent : téléversez à nouveau l'archive, **les articles déjà importés ne sont pas affectés** (ils sont déjà dans le dépôt de contenu)

## Prochaines étapes

- Relisez les articles importés un par un dans [Gestion des articles](./posts.md) et retirez le marqueur brouillon
- Pour retoucher les catégories en masse : [Gestion des articles · Gestion des catégories](./posts.md#gestion-des-categories-tags)
