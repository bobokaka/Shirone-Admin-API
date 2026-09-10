---
title: Import Jianshu
description: Référence des interfaces /api/import/jianshu/* — sessions d'archives d'export, tâches d'import d'arrière-plan, conversion du collage d'un article unique et suggestions de métadonnées par IA.
---

# Import Jianshu

Deux groupes d'interfaces pour la migration Jianshu : **flux d'archive d'export** (à base de sessions : téléversement → inventaire → prévisualisation → tâche d'arrière-plan) et **flux de collage d'un article unique** (sans session, converti dès le collage).

Sessions et tâches résident en **mémoire du serveur** : session valable 24 heures, 3 au maximum (évacuation LRU) ; résultats de tâches conservés 1 heure ; un redémarrage du service efface tout — les articles déjà importés ne sont pas affectés (déjà écrits dans le dépôt).

## POST /api/import/jianshu/archive

Téléverse l'archive d'export Jianshu (multipart).

| Champ de formulaire | Requis | Description |
|----------|------|------|
| `file` | oui | archive rar / zip, ≤ 30 Mo |

**Effets de bord** : décompresse et analyse en mémoire (sans écriture disque). **Valeur de retour** `JianshuArchiveSummary` :

```json
{
  "sessionId": "s-xxxx",
  "notebooks": [{ "name": "技术随笔", "articles": [{ "id": "技术随笔/a.md", "title": "标题", "bytes": 8213 }] }],
  "total": 42,
  "importedIds": ["技术随笔/a.md"]
}
```

`id` est l'identifiant unique au sein de la session (chemin normalisé dans l'archive) ; les essais isolés à la racine vont dans « 未分组 ».

```bash
curl -X POST http://127.0.0.1:5175/api/import/jianshu/archive \
  -F "file=@jianshu-export.zip"
```

## GET /api/import/jianshu/preview

Prévisualisation de conversion d'un article, **sans écriture disque**, images maintenues en liens distants.

| Paramètre query | Requis | Description |
|------------|------|------|
| `sessionId` | oui | id de session renvoyé à l'étape précédente |
| `id` | oui | id de l'article |

**Valeur de retour** `JianshuPreview` : `{ title, markdown, imageCount, wordCount }` — `wordCount` est le nombre de caractères du texte brut du corps (trop faible : il ne reste peut-être que du contenu de substitution).

```bash
curl "http://127.0.0.1:5175/api/import/jianshu/preview?sessionId=s-xxxx&id=技术随笔/a.md"
```

## POST /api/import/jianshu/run

Démarre la **tâche d'import d'arrière-plan** ; le retour est immédiat, la progression se suit par sondage.

| Champ du corps | Type | Requis | Description |
|-----------|------|------|------|
| `sessionId` | `string` | oui | id de session |
| `ids` | `string[]` | oui | id des articles à importer, 1–2000 |
| `options.published` | `string` | oui | date de publication uniforme `YYYY-MM-DD` (l'archive n'en contient pas) |
| `options.categoryFromNotebook` | `boolean` | oui | nom du recueil comme catégorie |
| `options.category` | `string` | non | catégorie uniforme hors recueils (≤ 40 caractères) |
| `options.tags` | `string[]` | oui | tags uniformes (≤ 12, chacun ≤ 30 caractères) |
| `options.localizeImages` | `boolean` | oui | télécharge les images dans le dépôt (lien distant conservé en cas d'échec) |
| `options.draft` | `boolean` | oui | importer comme brouillon |

**Valeur de retour** `{ jobId }`. **Effets de bord** : écrit `content/posts/<slug>/index.md` article par article, télécharge les images.

```bash
curl -X POST http://127.0.0.1:5175/api/import/jianshu/run \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"s-xxxx","ids":["技术随笔/a.md"],"options":{"published":"2026-09-10","categoryFromNotebook":true,"tags":["简书迁移"],"localizeImages":true,"draft":true}}'
```

## GET /api/import/jianshu/job

Sonde la progression de la tâche (intervalle conseillé : 2 secondes).

| Paramètre query | Requis | Description |
|------------|------|------|
| `id` | oui | id de la tâche |

**Valeur de retour** `JianshuImportJob` : `{ id, sessionId, status: "running" | "done", total, done, current, results, log }`. Chaque élément de `results` : `{ id, title, ok, path?, error?, images }` ; `log` conserve les 200 dernières lignes.

```bash
curl "http://127.0.0.1:5175/api/import/jianshu/job?id=job-xxxx"
```

## DELETE /api/import/jianshu/session

Rejette la session (vide le cache de l'archive). Refusé pendant l'exécution d'une tâche.

| Paramètre query | Requis | Description |
|------------|------|------|
| `id` | oui | id de session |

**Valeur de retour** `{ ok: boolean }`.

```bash
curl -X DELETE "http://127.0.0.1:5175/api/import/jianshu/session?id=s-xxxx"
```

## POST /api/import/jianshu/paste-preview

**Prévisualisation de conversion** du collage d'un article (sans écriture disque). Au moins une des trois charges non vide, chacune ≤ 2 Mo ; priorité d'analyse : **markdown (définitif de l'éditeur) > html (rich texte) > text (texte brut, repli Markdown)**.

| Champ du corps | Type | Requis | Description |
|-----------|------|------|------|
| `markdown` | `string` | un des trois | définitif de l'éditeur, prioritaire |
| `html` | `string` | un des trois | rich texte (copie web), converti en Markdown |
| `text` | `string` | un des trois | repli texte brut |

**Valeur de retour** identique à `JianshuPreview`.

```bash
curl -X POST http://127.0.0.1:5175/api/import/jianshu/paste-preview \
  -H "Content-Type: application/json" \
  -d '{"html":"<h1>标题</h1><p>段落</p>"}'
```

## POST /api/import/jianshu/paste-run

**Écrit dans le dépôt** le collage d'un article : images téléchargées automatiquement dans le répertoire de l'article (lien distant conservé en cas d'échec).

Corps = charge du collage (ci-dessus) + `options` :

| Champ | Contrainte |
|------|------|
| `title` | requis, 1–100 caractères |
| `published` | requis, `YYYY-MM-DD` |
| `category` | facultatif, ≤ 40 caractères |
| `tags` | ≤ 12, chacun ≤ 30 caractères |
| `draft` | booléen |

**Valeur de retour** `JianshuPasteResult` : `{ title, path, slug, images, failedImages[] }` — `images` est le nombre localisé avec succès, `failedImages` les images restées en lien distant.

```bash
curl -X POST http://127.0.0.1:5175/api/import/jianshu/paste-run \
  -H "Content-Type: application/json" \
  -d '{"markdown":"# 标题\n正文","options":{"title":"标题","published":"2026-09-10","tags":[],"draft":true}}'
```

## POST /api/import/jianshu/suggest-meta

L'IA analyse le corps et complète les métadonnées (IA désactivée ou en échec : repli automatique sur le résumé du corps, `aiUsed=false`).

| Champ du corps | Type | Requis | Description |
|-----------|------|------|------|
| `title` | `string` | non | vide = laisser l'IA proposer aussi le titre, ≤ 100 caractères |
| `markdown` | `string` | oui | corps, 1–2 Mo |

**Valeur de retour** `JianshuMetaSuggestion` : `{ title?, description, category, tags[], aiUsed }`.

```bash
curl -X POST http://127.0.0.1:5175/api/import/jianshu/suggest-meta \
  -H "Content-Type: application/json" \
  -d '{"title":"","markdown":"# 我的博客搭建记\n…"}'
```
