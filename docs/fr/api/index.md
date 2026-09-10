---
title: Référence API
description: Panorama de l'API locale de Shirone-Admin — conventions de base, format des erreurs, montage des ressources statiques et index de tous les groupes de points de terminaison.
---

# Référence API

Le backend de Shirone-Admin est un service Fastify local, et l'interface d'administration fonctionne entièrement au travers de cet ensemble d'API. Vous pouvez aussi les appeler directement et traiter l'Admin comme une **passerelle programmable** vers votre dépôt de contenu — scripts par lots, raccordement d'éditeurs externes, pipelines d'automatisation : tout est possible.

Cette section s'adresse aux lecteurs familiers de HTTP et de la structure du dépôt de contenu ; elle est organisée par module backend, chaque point de terminaison étant décrit avec son usage, ses paramètres, sa valeur de retour et un exemple minimal exécutable.

## Conventions de base

| Élément | Valeur |
|----|----|
| Adresse de base | `http://127.0.0.1:5175` (modifiable via `ADMIN_PORT`, liée uniquement à la boucle locale) |
| Préfixe de chemin | `/api` |
| Authentification | **aucune**. Outil local mono-poste, non exposé au réseau local ; ne le placez pas derrière un reverse proxy public |
| Corps de requête | JSON (`bodyLimit` **2 Mo**) ; les téléversements de fichiers passent en multipart (≤ **30 Mo** par fichier, un seul fichier à la fois) |
| CORS | grand ouvert (`origin: true`), pratique pour déboguer depuis n'importe quelle page locale |

## Format des erreurs

Toutes les erreurs renvoient un JSON à champ unique `message` (en chinois), accompagné d'un code HTTP approprié :

```json
{ "message": "文件不存在" }
```

| Code | Origine |
|--------|------|
| `400` | échec de validation métier (`ApiError`) ou **échec de validation de requête zod** — `message` de la forme `body.title: 标题不能为空`, concaténé « champ : raison » |
| `404` | chemin inexistant, ou cible absente (article, fichier…) (`ENOENT`) |
| `413` | fichier téléversé dépassant 30 Mo |
| `500` | erreur inattendue, `message` contient l'erreur brute |

## Montage des ressources statiques

Trois routes statiques en lecture seule servent directement les fichiers du dépôt de contenu (si le dépôt de contenu fournit le fichier, il est utilisé ; sinon repli sur le même chemin côté dépôt du thème) ; c'est ainsi que l'interface d'administration réalise ses prévisualisations d'images :

| Préfixe | Répertoire servi | Usage |
|------|----------|------|
| `/content-assets/*` | `assets/` du dépôt de contenu (repli `src/assets/` du thème) | prévisualisation des ressources de construction : avatar, bannières, etc. |
| `/content-public/*` | `public/` du dépôt de contenu (repli `public/` du thème) | prévisualisation des images de moments, musique, pochettes d'animes |
| `/content-posts/*` | `content/posts/` du dépôt de contenu | illustrations d'articles (déréférencement des chemins relatifs `./images/…`) |

Tous les chemins passent par une validation resolve et **ne peuvent sortir du répertoire racine** (protection contre la traversée de répertoires).

## Index des points de terminaison

| Groupe | Contenu |
|------|------|
| [Système et aperçu](./system.md) | sonde d'état de connexion, démarrage/arrêt et état du processus d'aperçu du site réel |
| [Articles](./posts.md) | CRUD des articles, suggestion de slug, renommage en masse des catégories / tags |
| [Moments](./moments.md) | CRUD des moments |
| [Téléversement de médias](./media.md) | illustrations d'articles, images de moments, images du site, pochettes de données, audio de musique |
| [Paramètres du site](./settings.md) | lecture/écriture des quatre domaines de réglages (site/profile/navbar/footer) |
| [Données structurées](./data.md) | lecture/écriture des huit familles `data/*.ts`, recherche d'entrées d'animes et import de pochettes |
| [Publication et validation](./publish.md) | aperçu de publication, sonde distante, publication en un clic, validation dry-run |
| [Services IA](./ai.md) | configuration des fournisseurs, dialogue/réécriture (SSE en flux inclus), flux de travail IA |
| [Import Jianshu](./import.md) | sessions d'archives d'export, tâches d'import d'arrière-plan, collage d'un article unique |

## Comportements généraux

- **Cible d'écriture** : hors réglages IA (`server/data/ai-settings.json`), toute écriture se produit dans le dépôt de contenu pointé par `CONTENT_DIR`
- **Paramètres de chemin** : les paramètres désignant des chemins d'articles / moments sont des chemins de style POSIX relatifs au dépôt de contenu (ex. `hello/index.md`), avec `/` comme séparateur unique
- **Formats de date** : `published` d'article en `YYYY-MM-DD` ; `publishedAt` en `YYYY-MM-DDTHH:mm:ss+08:00` ; `published` de moment en `YYYY-MM-DD HH:mm:ss`

## Vérification rapide

Service en marche, une commande suffit à confirmer la connectivité :

```bash
curl http://127.0.0.1:5175/api/status
```

Le retour des chemins des dépôts de contenu et du thème, de l'état de connexion et du résumé git signale que l'API est prête.
