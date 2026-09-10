---
title: Système et aperçu
description: Référence des interfaces /api/status (sonde d'état de connexion) et /api/preview/* (gestion du processus d'aperçu du site réel).
---

# Système et aperçu

Le module système répond à deux questions : **la connexion à l'espace de travail est-elle bonne** et **le dev server du frontend du blog tourne-t-il**. L'étiquette de connexion de la barre supérieure et les panneaux d'aperçu du site réel de chaque page reposent sur ce groupe d'interfaces.

## GET /api/status

Sonde l'état de l'espace de travail. Sans paramètre, n'échoue jamais (les champs dont la sonde interne échoue valent `null`/`false`).

**Valeur de retour** `SystemStatus` :

| Champ | Type | Description |
|------|------|------|
| `contentDir` / `themeDir` | `string` | chemins absolus résolus du dépôt de contenu / du dépôt du thème (source : `.env` ou position relative par défaut) |
| `contentConnected` | `boolean` | `true` si un répertoire `content/` existe sous le dépôt de contenu |
| `themeConnected` | `boolean` | `true` si le dépôt du thème contient `scripts/content/sync.mjs` |
| `themeDepsInstalled` | `boolean` | `node_modules` présent dans le dépôt du thème (conditionne la validation locale) |
| `git` | `GitStatus \| null` | résumé git du dépôt de contenu ; `null` si ce n'est pas un dépôt git |

`GitStatus` : `branch`, `ahead`, `behind`, `staged[]`, `modified[]`, `untracked[]` (listes de chemins relatifs de fichiers).

```bash
curl http://127.0.0.1:5175/api/status
```

```json
{
  "contentDir": "D:\\blogs\\Shirone-Content",
  "themeDir": "D:\\blogs\\Shirone",
  "contentConnected": true,
  "themeConnected": true,
  "themeDepsInstalled": true,
  "git": { "branch": "main", "ahead": 0, "behind": 0, "staged": [], "modified": [], "untracked": [] }
}
```

## POST /api/preview/start

Démarre le processus d'aperçu du site réel : lance dans le dépôt du thème `content:watch` (veille et synchronisation du contenu) et `astro dev` (:4321). Déjà en cours, renvoie directement « déjà en cours ». **Effets de bord** : crée deux arborescences de processus d'arrière-plan ; sous Windows, lancement via `cmd /c`, récupération à l'arrêt du service par `taskkill` sur l'arbre entier.

```bash
curl -X POST http://127.0.0.1:5175/api/preview/start
```

```json
{ "started": true, "message": "真站预览已启动，首次启动需等待依赖编译" }
```

Pour savoir si `ready`, fiez-vous au sondage de `/api/preview/status` (la première fois exige une compilation, la disponibilité suit le lancement avec un décalage).

## POST /api/preview/stop

Interrompt l'arborescence de processus d'aperçu. **Effets de bord** : tue tous les processus enfants issus de start ; un dev server venu d'une autre source (le script de lancement tout-en-un, par exemple) n'est pas concerné.

```bash
curl -X POST http://127.0.0.1:5175/api/preview/stop
```

Renvoie `{ "stopped": true }`.

## GET /api/preview/status

Interroge l'état de l'aperçu ; le frontend sonde toutes les 3 secondes.

```bash
curl http://127.0.0.1:5175/api/preview/status
```

```json
{ "running": true, "ready": true, "procs": ["node content-watch.mjs", "astro dev"] }
```

| Champ | Description |
|------|------|
| `running` | le processus d'aperçu géré par ce service tourne |
| `ready` | `http://localhost:4321/` réellement joignable (tout dev server, quelle que soit sa source) |
| `procs` | liste de descriptions des processus |
