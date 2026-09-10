---
title: Données structurées
description: Référence des interfaces /api/data/:kind (lecture/écriture des huit familles de données structurées) et /api/bangumi/* (recherche d'entrées d'animes et import de pochettes).
---

# Données structurées

Le module de données structurées lit et écrit `data/*.ts` du dépôt de contenu — les `interface`, commentaires et instructions d'export du fichier sont **conservés au caractère près**, seul le littéral du tableau exporté est remplacé intégralement. La lecture passe par un import dynamique tsx (avec query mtime pour contourner le cache) ; les champs d'énumération sont validés avant enregistrement.

## Correspondance kind ↔ fichier

Le paramètre de chemin `kind` prend une de huit valeurs :

| `kind` | Fichier | Tableau exporté | Entrées |
|--------|------|----------|------|
| `projects` | `data/projects.ts` | `projectsData` | projets |
| `skills` | `data/skills.ts` | `skillsData` | compétences |
| `timeline` | `data/timeline.ts` | `timelineData` | événements de timeline |
| `devices` | `data/devices.ts` | `devicesData` | appareils |
| `anime` | `data/anime.ts` | `animeData` | animes |
| `compass` | `data/compass.ts` | `compassData` | bibliothèque de la boussole |
| `music` | `data/music.ts` | `musicTracks` | morceaux de la playlist |
| `friends` | `data/friends.ts` | `friendsData` | liens amis |

## GET /api/data/:kind

**Valeur de retour** `{ kind, items: DataItem[] }` — `DataItem` est un objet faiblement typé (structure des champs : voir les interface de chaque fichier, ou le tableau des champs dans [Guide · Données structurées](../guide/data.md#les-huit-familles-de-donnees)).

```bash
curl http://127.0.0.1:5175/api/data/friends
```

## PUT /api/data/:kind

**Remplace intégralement** toutes les entrées du type de données concerné.

| Champ du corps | Type | Requis | Description |
|-----------|------|------|------|
| `items` | `object[]` | oui | entrées complètes (d'abord GET, modifier, puis PUT ; ne pas envoyer un simple delta) |

**Valeur de retour** `{ ok: true, changed }`. **Effets de bord** : réécrit la plage du tableau dans `data/*.ts` ; le reste du fichier reste intact.

```bash
curl -X PUT http://127.0.0.1:5175/api/data/skills \
  -H "Content-Type: application/json" \
  -d '{"items":[{"name":"TypeScript","category":"frontend","level":"advanced","enable":true}]}'
```

---

# Recherche d'animes Bangumi

Le trio de l'import d'animes, alimenté par l'API publique Bangumi, sert à la complétion des entrées d'animes par recherche.

## GET /api/bangumi/search

| Paramètre query | Requis | Description |
|------------|------|------|
| `keyword` | oui | mot-clé, 1–100 caractères (recherche limitée aux entrées de type animation) |

**Valeur de retour** `{ candidates: BangumiCandidate[] }` — chaque élément contient `id` (subject id Bangumi), `title` / `originalTitle`, `year`, `cover?`, `summary`, `eps`, `bangumiScore?`, `link`.

```bash
curl "http://127.0.0.1:5175/api/bangumi/search?keyword=葬送的芙莉莲"
```

## GET /api/bangumi/subject

| Paramètre query | Requis | Description |
|------------|------|------|
| `id` | oui | subject id Bangumi (entier positif, chaîne acceptée) |

**Valeur de retour** `BangumiDetail` : complète le Candidate avec `studio?` (studio de production), `period?` (créneau de diffusion `{ start, end? }`), `genres[]` (tags de genres fréquents, ≤ 4).

```bash
curl "http://127.0.0.1:5175/api/bangumi/subject?id=463652"
```

## POST /api/bangumi/cover-import

Import de pochette : le serveur la télécharge depuis l'hébergeur Bangumi et la dépose dans `public/assets/anime/`, nommée d'après le titre de l'entrée.

| Champ du corps | Type | Requis | Description |
|-----------|------|------|------|
| `url` | `string` | oui | lien direct de la pochette. **Validation par liste blanche** : seuls `lain.bgm.tv` / `api.bgm.tv` / `bgm.tv` / `bangumi.tv` / `ei.hdslb.com` sont acceptés, sinon 400 |
| `title` | `string` | oui | titre de l'entrée (1–200 caractères, sert au nommage) |
| `currentPath` | `string` | non | remplacement en place si même répertoire |

**Valeur de retour** `MediaUploadResult`.

```bash
curl -X POST http://127.0.0.1:5175/api/bangumi/cover-import \
  -H "Content-Type: application/json" \
  -d '{"url":"https://lain.bgm.tv/pic/cover/l/xx.jpg","title":"葬送的芙莉莲"}'
```
