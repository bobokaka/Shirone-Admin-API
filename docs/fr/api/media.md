---
title: Téléversement de médias
description: Référence de toutes les interfaces /api/media/* — illustrations d'articles, images de moments, images du site, pochettes de données et audio de musique, avec la correspondance target/kind vers les répertoires d'écriture.
---

# Téléversement de médias

Le module médias prend en charge tout dépôt de fichiers binaires. Les interfaces de téléversement sont toutes des **formulaires multipart**, un fichier à la fois, 30 Mo maximum par fichier ; liste blanche d'extensions d'images `webp / png / jpg / jpeg / gif / avif` (favicon accepte en plus `ico / svg`).

Répertoires d'écriture des interfaces (tous dans le dépôt de contenu) :

| Cas | Répertoire |
|------|------|
| Illustration d'article | `content/posts/<slug>/images/` |
| Image de moment | `public/images/moments/<lot>/` |
| Bannière (bureau / mobile) | `assets/images/banner/desktop/`, `assets/images/banner/mobile/` |
| Avatar | `assets/images/avatar/` |
| Image de pied de page | `public/images/footer/` |
| favicon | `public/favicon/` |
| Pochette de données | selon kind, voir [le tableau ci-dessous](#post-api-media-data-cover) |
| Audio de morceau | `public/assets/music/url/` |

## POST /api/media/post-image

Téléversement d'illustration d'article, déposé dans `images/` du répertoire d'article indiqué.

| Champ de formulaire | Requis | Description |
|----------|------|------|
| `file` | oui | fichier image |
| `slug` | oui | slug de l'article (détermine le répertoire d'écriture) |

**Valeur de retour** `MediaUploadResult` : `{ src, fileName }` — `src` est le chemin de référence frontmatter / corps (chemin relatif `./images/<name>`), à assembler directement dans le Markdown.

```bash
curl -X POST http://127.0.0.1:5175/api/media/post-image \
  -F "slug=hello" -F "file=@cover.webp"
```

## POST /api/media/moment-image

Téléversement d'image de moment, déposé dans `public/images/moments/<lot>/`. La règle du répertoire de lot est dictée par le pipeline de miniatures du thème et **ne peut être contournée**.

| Champ de formulaire | Requis | Description |
|----------|------|------|
| `file` | oui | fichier image |
| `batchId` | non | nom du répertoire de lot (`[\w-]+`, ex. `20260910-103000`) ; à défaut, généré par le serveur d'après l'heure courante |

**Valeur de retour** `MediaUploadResult` : `{ src, fileName, batchId? }` — `src` est le chemin absolu du site (`/images/moments/<lot>/<name>`) ; le `batchId` renvoyé se réutilise pour rester dans le même lot.

```bash
curl -X POST http://127.0.0.1:5175/api/media/moment-image \
  -F "batchId=20260910-103000" -F "file=@photo.webp"
```

## GET /api/media/site-images

Inventaire du répertoire d'hébergement d'images du site (bibliothèque d'images du pied de page, etc.).

| Paramètre query | Requis | Description |
|------------|------|------|
| `target` | oui | identifiant de répertoire, 1–40 caractères (ex. `footer`) |

**Valeur de retour** `SiteMediaResult[]` : chaque élément `{ src, previewUrl, fileName }`.

```bash
curl "http://127.0.0.1:5175/api/media/site-images?target=footer"
```

## POST /api/media/site-image

Téléversement d'image du site (multipart).

| Champ de formulaire | Requis | Description |
|----------|------|------|
| `file` | oui | fichier image |
| `target` | oui | `banner-desktop` / `banner-mobile` / `avatar` / `footer` / `favicon` |
| `name` | non | nom de fichier fixe (remplacement d'emplacement favicon, ex. `favicon-light`) |
| `currentSrc` | non | valeur courante du champ ; si elle pointe dans le répertoire d'hébergement de la même cible, l'ancien fichier est **remplacé en place** (cas de la mise à jour d'avatar) |

**Valeur de retour** `SiteMediaResult` : `src` est le chemin écrit dans le YAML, `previewUrl` le lien direct de prévisualisation côté administration.

```bash
curl -X POST http://127.0.0.1:5175/api/media/site-image \
  -F "target=avatar" -F "currentSrc=assets/images/avatar/old.webp" -F "file=@me.webp"
```

## POST /api/media/site-image-import

**Import par lien direct distant** d'une image du site : le serveur télécharge (contournant les restrictions cross-origin du navigateur) puis écrit comme site-image ; le webp est converti automatiquement en png/jpg (compatibilité du thème).

| Champ du corps | Type | Requis | Description |
|-----------|------|------|------|
| `target` | `string` | oui | identique à site-image |
| `url` | `string` | oui | lien direct http(s) public, ≤ 2000 caractères |
| `name` | `string` | non | nom de fichier imposé |
| `currentSrc` | `string` | non | cible du remplacement en place |

**Valeur de retour** identique à `SiteMediaResult`.

```bash
curl -X POST http://127.0.0.1:5175/api/media/site-image-import \
  -H "Content-Type: application/json" \
  -d '{"target":"footer","url":"https://example.com/badge.png"}'
```

## POST /api/media/data-cover

Téléversement de pochette de données structurées (multipart). Le kind détermine le répertoire d'écriture :

| `kind` | Répertoire |
|--------|------|
| `anime` | `public/assets/anime/` |
| `projects` | `public/assets/projects/` |
| `devices` | `public/images/devices/` |
| `friends` | `public/images/friends/` |
| `music` | `assets/images/music/` |

| Champ de formulaire | Requis | Description |
|----------|------|------|
| `file` | oui | fichier image |
| `kind` | oui | un des cinq du tableau ci-dessus |
| `path` | non | chemin de la pochette de l'entrée courante ; s'il vise le même répertoire, **remplacement en place** (changer d'image sans laisser d'ancien fichier) |

**Valeur de retour** `MediaUploadResult`.

```bash
curl -X POST http://127.0.0.1:5175/api/media/data-cover \
  -F "kind=anime" -F "file=@cover.webp"
```

## POST /api/media/data-cover-import

Import de pochette de données par lien direct distant (pochettes CDN repérées par la recherche IA, etc.) ; kind et répertoires identiques ci-dessus.

| Champ du corps | Type | Requis | Description |
|-----------|------|------|------|
| `kind` | `string` | oui | une des cinq valeurs de l'énumération |
| `url` | `string` | oui | lien direct, ≤ 2000 caractères |
| `title` | `string` | non | sert à générer un nom de fichier lisible |
| `currentPath` | `string` | non | cible du remplacement en place |

```bash
curl -X POST http://127.0.0.1:5175/api/media/data-cover-import \
  -H "Content-Type: application/json" \
  -d '{"kind":"music","url":"https://cdn.example.com/track-cover.jpg","title":"晴天"}'
```

## POST /api/media/music-audio

Téléversement local d'audio de morceau (multipart) → `public/assets/music/url/`.

| Champ de formulaire | Requis | Description |
|----------|------|------|
| `file` | oui | fichier audio |
| `currentSrc` | non | cible du remplacement en place |

```bash
curl -X POST http://127.0.0.1:5175/api/media/music-audio \
  -F "file=@song.mp3"
```

## POST /api/media/music-download

Récupération serveur d'un **lien direct distant** d'audio de morceau (télécharge même ce qu'un navigateur bloqué en cross-origin ne peut obtenir).

| Champ du corps | Type | Requis | Description |
|-----------|------|------|------|
| `url` | `string` | oui | lien direct audio, ≤ 2000 caractères |
| `filename` | `string` | non | nom de fichier imposé |
| `currentPath` | `string` | non | cible du remplacement en place |

```bash
curl -X POST http://127.0.0.1:5175/api/media/music-download \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com/song.mp3"}'
```
