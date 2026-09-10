---
title: Moments
description: "Référence des interfaces /api/moments — CRUD des moments : publier, mettre à jour, supprimer."
---

# Moments

Le module moments opère sur `content/moments/` du dépôt de contenu : un fichier Markdown par moment, le nom de fichier étant l'id : `<yyyymmdd-HHmmss>.md`. La liste est en ordre chronologique inverse.

## Structure MomentMeta

Métadonnées communes à la liste et au détail :

| Champ | Type | Description |
|------|------|------|
| `id` | `string` | nom de fichier sans `.md`, ex. `20260906-183000` |
| `path` | `string` | chemin relatif |
| `published` | `string` | `YYYY-MM-DD HH:mm:ss` |
| `pinned` / `draft` | `boolean` | épinglé / brouillon |
| `location` | `string` | lieu |
| `mood` | `string` | nom d'icône Iconify d'humeur (chaîne vide = non choisie) |
| `tags` | `string[]` | tags |
| `images` | `{ src, alt }[]` | illustrations, `src` est le chemin du site |
| `body` | `string` | texte du corps (inclus dès la liste) |

## GET /api/moments

Liste complète, sans paramètre.

```bash
curl http://127.0.0.1:5175/api/moments
```

## GET /api/moments/detail

| Paramètre query | Requis | Description |
|------------|------|------|
| `path` | oui | chemin relatif du moment |

**Valeur de retour** `MomentFile` : `{ meta: MomentMeta, body: string }`.

```bash
curl "http://127.0.0.1:5175/api/moments/detail?path=20260906-183000.md"
```

## POST /api/moments

Crée un moment. **Effets de bord** : écrit `content/moments/<horodatage de publication>.md` ; les fichiers référencés par `images` doivent déjà être dans le dépôt via le [téléversement d'images de moments](./media.md#post-api-media-moment-image).

| Champ du corps | Type | Requis | Défaut | Description |
|-----------|------|------|------|------|
| `published` | `string` | oui | — | `YYYY-MM-DD HH:mm:ss`, détermine le nom de fichier |
| `body` | `string` | non | `""` | corps du texte |
| `location` | `string` | non | — | lieu |
| `mood` | `string` | non | — | nom d'icône d'humeur |
| `tags` | `string[]` | non | — | tags |
| `images` | `{ src, alt? }[]` | non | — | liste d'illustrations |
| `draft` / `pinned` | `boolean` | non | `false` | brouillon / épinglé |

**Valeur de retour** le `MomentMeta` créé.

```bash
curl -X POST http://127.0.0.1:5175/api/moments \
  -H "Content-Type: application/json" \
  -d '{"published":"2026-09-10 10:30:00","body":"第一条说说！","mood":"material-symbols:celebration","tags":["开始"]}'
```

## PUT /api/moments

Met à jour un moment, champs identiques ci-dessus, plus :

| Champ du corps | Type | Requis | Description |
|-----------|------|------|------|
| `path` | `string` | oui | chemin du moment cible |

Les champs facultatifs non transmis retombent sur leur valeur par défaut (sémantique de remplacement intégral) ; lire detail puis modifier avant l'appel est le schéma le plus sûr (c'est ce que fait l'interface d'administration).

```bash
curl -X PUT http://127.0.0.1:5175/api/moments \
  -H "Content-Type: application/json" \
  -d '{"path":"20260906-183000.md","published":"2026-09-06 18:30:00","body":"改过了","pinned":true}'
```

## DELETE /api/moments

Supprime un moment (fichier `.md`). **Les fichiers d'illustration ne sont pas supprimés avec** ; au besoin, nettoyez à la main le répertoire du lot correspondant sous `public/images/moments/`.

| Paramètre query | Requis | Description |
|------------|------|------|
| `path` | oui | chemin relatif du moment |

**Valeur de retour** `{ "ok": true }`.

```bash
curl -X DELETE "http://127.0.0.1:5175/api/moments?path=20260906-183000.md"
```
