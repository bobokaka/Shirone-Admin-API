---
title: System und Vorschau
description: Schnittstellenreferenz für die Verbindungssonde /api/status und die Prozessverwaltung der Live-Vorschau unter /api/preview/*.
---

# System und Vorschau

Das Systemmodul beantwortet zwei Fragen: **ist die Arbeitsumgebung verbunden** und **läuft der Dev-Server des Blog-Frontends**. Das Verbindungs-Badge in der Kopfzeile des Admin-Panels und die Live-Vorschau-Panels der Seiten werden von dieser Schnittstellengruppe angetrieben.

## GET /api/status

Sondiert den Zustand der Arbeitsumgebung. Keine Parameter, fehlerfrei (intern fehlgeschlagene Felder geben `null`/`false` zurück).

**Rückgabewert** `SystemStatus`:

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| `contentDir` / `themeDir` | `string` | aufgelöste absolute Pfade von Content-Repository / Theme-Repository (Quelle: `.env` oder die standardmäßige relative Position) |
| `contentConnected` | `boolean` | `true`, sobald das Content-Repository-Verzeichnis `content/` enthält |
| `themeConnected` | `boolean` | `true`, sobald das Theme-Repository `scripts/content/sync.mjs` enthält |
| `themeDepsInstalled` | `boolean` | `node_modules` des Theme-Repositories vorhanden (bestimmt, ob lokale Validierung möglich ist) |
| `git` | `GitStatus \| null` | git-Übersicht des Content-Repositories; `null`, wenn kein git-Repository |

`GitStatus`: `branch`, `ahead`, `behind`, `staged[]`, `modified[]`, `untracked[]` (Listen relativer Dateipfade).

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

Startet die Live-Vorschau-Prozesse: bringt im Theme-Repository `content:watch` (Überwachung und Synchronisation der Inhalte) und `astro dev` (:4321) hoch. Läuft bereits, kommt direkt die Antwort „läuft bereits“. **Nebenwirkung**: erzeugt zwei Hintergrund-Prozessbäume; unter Windows gestartet über `cmd /c`, beim Dienstende per `taskkill` mitsamt Baum eingesammelt.

```bash
curl -X POST http://127.0.0.1:5175/api/preview/start
```

```json
{ "started": true, "message": "真站预览已启动，首次启动需等待依赖编译" }
```

Ob `ready` zutrifft, ist am Polling von `/api/preview/status` abzulesen (der erste Start kompiliert erst, bereit kommt später als gestartet).

## POST /api/preview/stop

Beendet den Vorschau-Prozessbaum. **Nebenwirkung**: killt sämtliche von start erzeugten Kindprozesse; stammt der Dev-Server aus anderer Quelle (etwa dem Sammelstart-Skript), fällt er nicht unter die Einsammlung.

```bash
curl -X POST http://127.0.0.1:5175/api/preview/stop
```

Rückgabe `{ "stopped": true }`.

## GET /api/preview/status

Fragt den Vorschau-Status ab; das Frontend pollt alle 3 Sekunden.

```bash
curl http://127.0.0.1:5175/api/preview/status
```

```json
{ "running": true, "ready": true, "procs": ["node content-watch.mjs", "astro dev"] }
```

| Feld | Beschreibung |
|------|--------------|
| `running` | der von diesem Dienst verwaltete Vorschau-Prozess läuft |
| `ready` | `http://localhost:4321/` ist tatsächlich erreichbar (ein Dev-Server beliebiger Herkunft genügt) |
| `procs` | Liste von Prozessbeschreibungen |
