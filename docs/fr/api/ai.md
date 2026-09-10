---
title: Services IA
description: Référence des interfaces /api/ai/* — configuration des fournisseurs, dialogue et réécriture en flux (SSE), génération de messages de commit, brouillons de timeline, recherche musicale et récupération de fonds d'écran.
---

# Services IA

Le module IA couvre la gestion de configuration et tous les flux de travail IA. Hors récupération de fonds d'écran, **toutes les interfaces exigent l'IA activée** (interrupteur général ouvert + configuration complète du fournisseur courant), sinon `400` « AI 助手未启用… ».

La configuration est persistée dans `server/data/ai-settings.json` sur la machine locale (gitignore), totalement isolée du dépôt de contenu.

## GET /api/ai/settings

**Valeur de retour** `AiSettings` :

```json
{
  "enable": true,
  "providers": [
    {
      "id": "uuid", "name": "Anthropic 官方",
      "protocol": "anthropic", "baseUrl": "https://api.anthropic.com",
      "apiKey": "sk-…", "model": "claude-sonnet-5", "modelFast": "",
      "webSearch": true, "temperature": 0.7, "timeoutSeconds": 30
    }
  ],
  "activeId": "uuid"
}
```

`protocol`, un choix binaire : `anthropic` (v1/messages, par défaut) / `openai` (chat/completions). `modelFast` vide signifie modèle principal pour les tâches légères.

```bash
curl http://127.0.0.1:5175/api/ai/settings
```

## PUT /api/ai/settings

Enregistre la configuration. Le corps est un `AiSettings` complet : `enable` (booléen), `providers` (1–20 jeux, contraintes de champs : `temperature` 0–2 défaut 0.7, `timeoutSeconds` 5–86400 défaut 30, `webSearch` défaut true), `activeId` (doit désigner un élément de providers). **À l'état activé**, le fournisseur courant doit être entièrement renseigné (adresse commençant par http(s), Key, nom de modèle), sinon 400.

**Valeur de retour** le `AiSettings` normalisé et enregistré (compatible avec l'ancienne structure plate, migration automatique à la lecture).

```bash
curl -X PUT http://127.0.0.1:5175/api/ai/settings \
  -H "Content-Type: application/json" \
  -d '{"enable":true,"providers":[{"id":"p1","name":"官方","protocol":"anthropic","baseUrl":"https://api.anthropic.com","apiKey":"sk-…","model":"claude-sonnet-5","modelFast":"","webSearch":true,"temperature":0.7,"timeoutSeconds":30}],"activeId":"p1"}'
```

## POST /api/ai/test

Test de connexion. **Utilise en priorité la configuration du formulaire dans le corps** (testable sans enregistrer) ; en cas d'échec d'analyse, repli sur la configuration enregistrée. La requête de test est figée sur `maxTokens: 16`, `temperature: 0`, réflexion et recherche web coupées, délai au minimum de la configuration du fournisseur et de 30 secondes.

**Valeur de retour** `AiTestResult` : `{ ok, latencyMs, reply?, error? }` — `ok=true` : `reply` est un extrait de la réponse du modèle (≤ 120 caractères).

```bash
curl -X POST http://127.0.0.1:5175/api/ai/test \
  -H "Content-Type: application/json" \
  -d '{"enable":true,"providers":[{"id":"p1","name":"t","protocol":"anthropic","baseUrl":"https://api.anthropic.com","apiKey":"sk-…","model":"claude-sonnet-5","modelFast":"","webSearch":false,"temperature":0.7,"timeoutSeconds":30}],"activeId":"p1"}'
```

## POST /api/ai/chat

Point d'entrée de dialogue non fluide (utilise toujours la configuration enregistrée).

| Champ du corps | Type | Requis | Description |
|-----------|------|------|------|
| `messages` | `{ role: system/user/assistant, content }[]` | oui | liste complète des messages, 200k caractères max par message |
| `maxTokens` | `number` | non | 16–16384 |
| `fast` | `boolean` | non | `true` passe par le modèle léger (repli sur le modèle principal si non configuré) et coupe la réflexion |

**Valeur de retour** `AiChatResult` : `{ content, model, promptTokens?, completionTokens?, searchUsed? }`.

```bash
curl -X POST http://127.0.0.1:5175/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"用一句话介绍 Markdown"}],"fast":true}'
```

## POST /api/ai/edit

Réécriture à instruction unique : le serveur fixe le system (assistant de rédaction Markdown, ne sort que le résultat), sans exposer de personnalisation du system.

| Champ du corps | Type | Requis | Description |
|-----------|------|------|------|
| `instruction` | `string` | oui | instruction de réécriture, ≤ 2000 caractères |
| `text` | `string` | oui | texte à réécrire, ≤ 100k caractères |
| `maxTokens` | `number` | non | défaut 4096 |

**Valeur de retour** identique à `AiChatResult`.

```bash
curl -X POST http://127.0.0.1:5175/api/ai/edit \
  -H "Content-Type: application/json" \
  -d '{"instruction":"润色：保留原意，只输出结果","text":"这算一个测试文本"}'
```

## Interfaces en flux (SSE) {#streaming}

`edit-stream` et `chat-stream` partagent le même protocole de relais en flux :

- réponse `Content-Type: text/event-stream`, une ligne `data: <JSON>` par trame (et non l'event multiligne du SSE standard)
- types de trame : `{ "type": "thinking", "text": "…" }` (incrément de réflexion), `{ "type": "text", "text": "…" }` (incrément de corps), `{ "type": "done", "content": "全文", "model": "…", "completionTokens": n }`, `{ "type": "error", "message": "…" }`
- **la déconnexion du client interrompt la requête amont** (c'est le seul moyen d'arrêt)
- le délai se compte en « inactivité sans sortie » (durée = `timeoutSeconds` du fournisseur courant) ; la génération d'un long texte n'est pas limitée par la durée totale

### POST /api/ai/edit-stream

Réécriture en flux, corps de requête rigoureusement identique à `edit` (`maxTokens` défaut 4096).

```bash
curl -N -X POST http://127.0.0.1:5175/api/ai/edit-stream \
  -H "Content-Type: application/json" \
  -d '{"instruction":"续写这篇文章","text":"正文…"}'
```

### POST /api/ai/chat-stream

Dialogue multitours en flux.

| Champ du corps | Type | Requis | Description |
|-----------|------|------|------|
| `messages` | `{ role: user/assistant, content }[]` | oui | 1–40 messages (system non compté) |
| `system` | `string` | non | invite système, transmise séparément, ≤ 10k caractères |
| `maxTokens` | `number` | non | défaut 8192 |

## POST /api/ai/commit-message

Génération IA du message de commit. **N'échoue et ne bloque jamais** : IA désactivée, repli heuristique et marquage par `source`.

| Champ du corps | Type | Requis | Défaut | Description |
|-----------|------|------|------|------|
| `repo` | `"content" \| "theme"` | non | `content` | dépôt dont les changements servent à la génération |

**Valeur de retour** `{ message, source: "ai" \| "heuristic" }` — la sortie IA n'est retenue qu'en passant la validation de format `type(scope): ≤30 caractères`, avec repli automatique sur une génération selon les changements sinon.

```bash
curl -X POST http://127.0.0.1:5175/api/ai/commit-message \
  -H "Content-Type: application/json" -d '{"repo":"content"}'
```

## POST /api/ai/timeline-draft

Brouillons d'événements de timeline.

| Champ du corps | Type | Requis | Description |
|-----------|------|------|------|
| `mode` | `"note" \| "git"` | oui | `note` rédige depuis la description ; `git` scanne et condense l'historique de commits des trois dépôts |
| `note` | `string` | requis si mode=note | description de l'événement, ≤ 500 caractères |
| `limit` | `number` | non | 1–5, plafond du nombre de brouillons |
| `existing` | `{ title, date }[]` | non | événements déjà collectés (≤ 300), pour la déduplication |

**Valeur de retour** tableau de brouillons (JSON strict + filtrage zod, entrées illégales retirées).

```bash
curl -X POST http://127.0.0.1:5175/api/ai/timeline-draft \
  -H "Content-Type: application/json" \
  -d '{"mode":"note","note":"2025年6月上线了个人博客","limit":3}'
```

## POST /api/ai/music-search

Recherche musicale avec licence (recherche web en priorité ; si le service ne la supporte pas, repli automatique en requête ordinaire, signalé dans le retour).

| Champ du corps | Type | Requis | Description |
|-----------|------|------|------|
| `query` | `string` | oui | terme de recherche, ≤ 200 caractères |

**Valeur de retour** tableau de candidates, chacune avec `title` / `artist?` / `license` (`freeCommercial`, `summary`, `evidence?`, `sourceUrl?`) / `audioUrl?` / `coverUrl?`.

```bash
curl -X POST http://127.0.0.1:5175/api/ai/music-search \
  -H "Content-Type: application/json" -d '{"query":"安静的钢琴曲 免费商用"}'
```

## POST /api/ai/wallpaper-search

Récupération de fonds d'écran (interrogation directe de la source safebooru). **Ne passe pas par l'IA, sans seuil d'activation**, appelable à tout moment.

| Champ du corps | Type | Requis | Description |
|-----------|------|------|------|
| `query` | `string` | non | terme de recherche, vide par défaut (aléatoire) |
| `target` | `"desktop" \| "mobile"` | oui | cible de taille : bureau prend des paysages ≥1920, mobile des portraits ≥1920 |

**Valeur de retour** `WallpaperCandidate[]` (jusqu'à constituer un lot) : `{ imageUrl, previewUrl?, width?, height? }`.

```bash
curl -X POST http://127.0.0.1:5175/api/ai/wallpaper-search \
  -H "Content-Type: application/json" -d '{"query":"星空","target":"desktop"}'
```
