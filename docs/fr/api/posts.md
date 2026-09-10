---
title: Articles
description: Référence des interfaces /api/posts (CRUD des articles), /api/slug (suggestion de slug) et /api/taxonomy/rename (réécriture en masse des catégories et tags).
---

# Articles

Le module articles opère directement sur `content/posts/` du dépôt de contenu. Tous les paramètres de chemin sont des chemins de style POSIX relatifs à ce répertoire. La liste est **épinglés en priorité, puis date de publication décroissante**.

## GET /api/posts

Renvoie la liste complète des métadonnées d'articles (corps non inclus).

**Valeur de retour** `PostMeta[]`, champs clés de chaque élément :

| Champ | Type | Description |
|------|------|------|
| `slug` | `string` | nom de répertoire (article en répertoire) ou nom de fichier sans `.md` |
| `path` | `string` | chemin relatif, ex. `hello/index.md` |
| `layout` | `"directory" \| "file"` | en répertoire / à plat |
| `title` / `published` / `description` / `image` / `category` / `tags` | — | métadonnées, `published` au format `YYYY-MM-DD` |
| `publishedAt` / `updated` / `updatedAt` | `string?` | heure précise et dates de mise à jour |
| `pinned` / `draft` / `comment` / `encrypted` / `hideHomeContent` | `boolean` | interrupteurs |
| `hasPassword` | `boolean` | mot de passe défini ou non (**le mot de passe lui-même n'est jamais renvoyé**) |
| `passwordHint` | `string` | indice du mot de passe |
| `alias` / `permalink` | `string?` | chemin d'accès personnalisé |

```bash
curl http://127.0.0.1:5175/api/posts
```

## GET /api/posts/detail

Lit le contenu complet d'un article.

| Paramètre query | Requis | Description |
|------------|------|------|
| `path` | oui | chemin relatif de l'article |

**Valeur de retour** `PostFile` : `{ meta: PostMeta, body: string }`. Chemin inexistant : `404`.

```bash
curl "http://127.0.0.1:5175/api/posts/detail?path=hello/index.md"
```

## POST /api/posts

Crée un article (**état brouillon**). En répertoire, écrit `content/posts/<slug>/index.md`.

| Champ du corps | Type | Requis | Défaut | Description |
|-----------|------|------|------|------|
| `title` | `string` | oui | — | titre, ne peut être vide |
| `slug` | `string` | non | translittération pinyin du titre | nom de répertoire personnalisé ; caractères illégaux nettoyés, doublons dédupliqués |

**Valeur de retour** `PostFile` (l'article créé). **Effets de bord** : crée le répertoire et l'`index.md` dans le dépôt de contenu ; sans `slug`, déduplique selon les articles existants.

```bash
curl -X POST http://127.0.0.1:5175/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"我的第一篇文章"}'
```

## PUT /api/posts

Enregistre un article. Le frontmatter est **réécrit par fusion** : seules les clés présentes dans `meta` sont mises à jour, le corps est remplacé intégralement ; la sérialisation garantit l'invariance des formats de date comme `published`.

| Champ du corps | Type | Requis | Défaut | Description |
|-----------|------|------|------|------|
| `path` | `string` | oui | — | chemin de l'article cible |
| `body` | `string` | non | `""` | corps intégral (remplacement intégral) |
| `meta` | `object` | non | `{}` | clés/valeurs de frontmatter à mettre à jour ; `alias`/`permalink` à chaîne vide suppriment la clé |
| `password` | `string` | non | — | **à transmettre uniquement pour définir/modifier le mot de passe** ; absent, la valeur est conservée |
| `clearPassword` | `boolean` | non | — | `true` supprime le mot de passe (décocher la protection, par exemple) |

**Valeur de retour** le `PostFile` enregistré.

```bash
curl -X PUT http://127.0.0.1:5175/api/posts \
  -H "Content-Type: application/json" \
  -d '{"path":"hello/index.md","meta":{"draft":false},"body":"# 你好\n\n正文。"}'
```

## DELETE /api/posts

Supprime un article. Un article en répertoire se supprime au niveau du `slug` racine (répertoire entier avec illustrations), un article à plat supprime le fichier seul.

| Paramètre query | Requis | Description |
|------------|------|------|
| `path` | oui | chemin relatif de l'article |

**Valeur de retour** `{ "ok": true }`.

```bash
curl -X DELETE "http://127.0.0.1:5175/api/posts?path=hello/index.md"
```

## POST /api/slug

Génère ou nettoie un slug (translittération pinyin du titre, remplacement des caractères illégaux, déduplication avec les articles existants).

| Champ du corps | Type | Requis | Description |
|-----------|------|------|------|
| `title` | `string` | non (défaut `""`) | titre ; ne sert à la génération que si **`slug` n'est pas transmis** |
| `slug` | `string` | non | transmis, seul le nettoyage est fait, pas de génération |

**Valeur de retour** `SlugSuggestion` : `{ slug: string, adjusted: boolean, note?: string }` — `adjusted=true` signale un remplacement ou une déduplication, `note` en donne la raison.

```bash
curl -X POST http://127.0.0.1:5175/api/slug \
  -H "Content-Type: application/json" \
  -d '{"title":"快速上手指南"}'
```

## POST /api/taxonomy/rename

Renommage en masse de catégorie / tag : réécrit le frontmatter de **tous les articles concernés**. Un nom cible existant équivaut à une fusion ; `to` en chaîne vide = retrait de tous les articles.

| Champ du corps | Type | Requis | Description |
|-----------|------|------|------|
| `kind` | `"category" \| "tag"` | oui | catégorie ou tag |
| `from` | `string` | oui | nom d'origine (non vide) |
| `to` | `string` | oui | nom cible ; chaîne vide = retrait |

**Valeur de retour** `{ changed, kind, from, to }` — `changed` est le nombre d'articles réécrits. **Effets de bord** : réécrit les fichiers un par un (déduplication automatique dans le cas des tags), formats des champs de date préservés.

```bash
curl -X POST http://127.0.0.1:5175/api/taxonomy/rename \
  -H "Content-Type: application/json" \
  -d '{"kind":"tag","from":"JS","to":"JavaScript"}'
```
