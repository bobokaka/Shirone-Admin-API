---
title: KI-Dienste
description: Schnittstellenreferenz für /api/ai/* — Anbieterkonfiguration, Dialog und streamendes Umschreiben (SSE), Commit-Nachrichten-Generierung, Zeitleisten-Entwurf, Musiksuche und Wallpaper-Abruf.
---

# KI-Dienste

Das KI-Modul umfasst die Konfigurationsverwaltung und sämtliche KI-Workflows. Mit Ausnahme des Wallpaper-Abrufs **verlangen alle Schnittstellen eine aktivierte KI** (Hauptschalter an + aktuelle Anbieterkonfiguration vollständig), ansonsten `400` „AI-Assistent nicht aktiviert …“.

Die Konfiguration liegt persistent in der lokalen `server/data/ai-settings.json` (gitignore), vollständig getrennt vom Content-Repository.

## GET /api/ai/settings

**Rückgabewert** `AiSettings`:

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

`protocol`, eines von beiden: `anthropic` (v1/messages, Standard) / `openai` (chat/completions). Ein leeres `modelFast` bedeutet: leichte Aufgaben nehmen dasselbe Modell wie das Hauptmodell.

```bash
curl http://127.0.0.1:5175/api/ai/settings
```

## PUT /api/ai/settings

Speichert die Konfiguration. Der Body ist ein vollständiges `AiSettings`: `enable` (boolean), `providers` (1–20 Konfigurationen; Feldbeschränkungen: `temperature` 0–2 Standard 0.7, `timeoutSeconds` 5–86400 Standard 30, `webSearch` Standard true), `activeId` (muss auf einen Eintrag in providers zeigen). **Im aktivierten Zustand** muss der aktuelle Anbieter vollständig ausgefüllt sein (Adresse beginnend mit http(s), Key, Modellname), sonst 400.

**Rückgabewert** das normalisierte und gespeicherte `AiSettings` (verträgt die alte flache Struktur, beim Lesen automatisch migriert).

```bash
curl -X PUT http://127.0.0.1:5175/api/ai/settings \
  -H "Content-Type: application/json" \
  -d '{"enable":true,"providers":[{"id":"p1","name":"官方","protocol":"anthropic","baseUrl":"https://api.anthropic.com","apiKey":"sk-…","model":"claude-sonnet-5","modelFast":"","webSearch":true,"temperature":0.7,"timeoutSeconds":30}],"activeId":"p1"}'
```

## POST /api/ai/test

Verbindungstest. **Bevorzugt die Formularkonfiguration aus dem Request-Body** (testen geht auch ungespeichert); schlägt das Parsen fehl, fällt der Test auf die gespeicherte Konfiguration zurück. Die Testanfrage ist fix auf `maxTokens: 16`, `temperature: 0`, ohne Gedankengang und ohne Websuche gestellt; die Zeitüberschreitung ist das Minimum aus Anbieterkonfiguration und 30 Sekunden.

**Rückgabewert** `AiTestResult`: `{ ok, latencyMs, reply?, error? }` — bei `ok=true` ist `reply` ein Stück der Modellantwort (≤120 Zeichen).

```bash
curl -X POST http://127.0.0.1:5175/api/ai/test \
  -H "Content-Type: application/json" \
  -d '{"enable":true,"providers":[{"id":"p1","name":"t","protocol":"anthropic","baseUrl":"https://api.anthropic.com","apiKey":"sk-…","model":"claude-sonnet-5","modelFast":"","webSearch":false,"temperature":0.7,"timeoutSeconds":30}],"activeId":"p1"}'
```

## POST /api/ai/chat

Der nicht-streamende Dialogeingang (nutzt stets die gespeicherte Konfiguration).

| Body-Feld | Typ | Pflicht | Beschreibung |
|-----------|-----|---------|--------------|
| `messages` | `{ role: system/user/assistant, content }[]` | ja | vollständige Nachrichtenliste, ≤200k Zeichen pro Eintrag |
| `maxTokens` | `number` | nein | 16–16384 |
| `fast` | `boolean` | nein | `true` nimmt das leichte Modell (ohne Konfiguration Rückfall aufs Hauptmodell) und schaltet den Gedankengang ab |

**Rückgabewert** `AiChatResult`: `{ content, model, promptTokens?, completionTokens?, searchUsed? }`.

```bash
curl -X POST http://127.0.0.1:5175/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"用一句话介绍 Markdown"}],"fast":true}'
```

## POST /api/ai/edit

Umschreiben mit einer einzelnen Anweisung: der Server setzt ein fixes system (Markdown-Schreibassistent, gibt nur das Ergebnis aus) und legt keine system-Anpassung offen.

| Body-Feld | Typ | Pflicht | Beschreibung |
|-----------|-----|---------|--------------|
| `instruction` | `string` | ja | Umschreibanweisung, ≤2000 Zeichen |
| `text` | `string` | ja | umzuschreibender Text, ≤100k Zeichen |
| `maxTokens` | `number` | nein | Standard 4096 |

**Rückgabewert** wie `AiChatResult`.

```bash
curl -X POST http://127.0.0.1:5175/api/ai/edit \
  -H "Content-Type: application/json" \
  -d '{"instruction":"润色：保留原意，只输出结果","text":"这算一个测试文本"}'
```

## Streaming-Schnittstellen (SSE) {#streaming-schnittstellen-sse}

`edit-stream` und `chat-stream` teilen sich dasselbe Streaming-Weitergabeprotokoll:

- Antwort `Content-Type: text/event-stream`, jede Frame eine Zeile `data: <JSON>` (nicht die mehrzeiligen events des Standard-SSE)
- Frametypen: `{ "type": "thinking", "text": "…" }` (Gedankengang-Zuwachs), `{ "type": "text", "text": "…" }` (Textzuwachs), `{ "type": "done", "content": "Volltext", "model": "…", "completionTokens": n }`, `{ "type": "error", "message": "…" }`
- **Trennt der Client die Verbindung, wird die Upstream-Anfrage abgebrochen** (das ist das einzige Stoppmittel)
- Die Zeitüberschreitung zählt „Ausbleiben von Ausgaben“ (Dauer = `timeoutSeconds` des aktuellen Anbieters); lange Generierungen unterliegen keiner Gesamtdauerbegrenzung

### POST /api/ai/edit-stream

Streamendes Umschreiben; der Request-Body ist mit `edit` identisch (`maxTokens` Standard 4096).

```bash
curl -N -X POST http://127.0.0.1:5175/api/ai/edit-stream \
  -H "Content-Type: application/json" \
  -d '{"instruction":"续写这篇文章","text":"正文…"}'
```

### POST /api/ai/chat-stream

Streamender Mehrfachdialog.

| Body-Feld | Typ | Pflicht | Beschreibung |
|-----------|-----|---------|--------------|
| `messages` | `{ role: user/assistant, content }[]` | ja | 1–40 Einträge (system zählt nicht dazu) |
| `system` | `string` | nein | Systemprompt, getrennt übertragen, ≤10k Zeichen |
| `maxTokens` | `number` | nein | Standard 8192 |

## POST /api/ai/commit-message

KI-Commit-Nachrichten-Generierung. **Wirft niemals einen blockierenden Fehler**: ist die KI nicht aktiviert, greift die Heuristik, gekennzeichnet über `source`.

| Body-Feld | Typ | Pflicht | Standard | Beschreibung |
|-----------|-----|---------|----------|--------------|
| `repo` | `"content" \| "theme"` | nein | `content` | nach den Änderungen welches Repositorys erzeugt wird |

**Rückgabewert** `{ message, source: "ai" \| "heuristic" }` — die KI-Ausgabe wird nur übernommen, wenn sie die Formatprüfung `type(scope): ≤30 Zeichen` besteht, ansonsten greift automatisch die Erzeugung nach Änderungsinhalt.

```bash
curl -X POST http://127.0.0.1:5175/api/ai/commit-message \
  -H "Content-Type: application/json" -d '{"repo":"content"}'
```

## POST /api/ai/timeline-draft

Entwirft Zeitleisten-Ereignisse.

| Body-Feld | Typ | Pflicht | Beschreibung |
|-----------|-----|---------|--------------|
| `mode` | `"note" \| "git"` | ja | `note` entwirft nach Beschreibung; `git` destilliert aus der Commit-Historie aller drei Repositories |
| `note` | `string` | Pflicht bei mode=note | Ereignisbeschreibung, ≤500 Zeichen |
| `limit` | `number` | nein | 1–5, Obergrenze der erzeugten Einträge |
| `existing` | `{ title, date }[]` | nein | bereits erfasste Ereignisse (≤300), zur Deduplizierung |

**Rückgabewert** Array von Entwürfen (strict JSON + zod-Filter, unzulässige Einträge bereits entfernt).

```bash
curl -X POST http://127.0.0.1:5175/api/ai/timeline-draft \
  -H "Content-Type: application/json" \
  -d '{"mode":"note","note":"2025年6月上线了个人博客","limit":3}'
```

## POST /api/ai/music-search

Musik-Lizenzsuche (Web bevorzugt; beherrscht der Dienst keine Web-Suche, fällt die Anfrage automatisch auf eine normale zurück und wird gekennzeichnet).

| Body-Feld | Typ | Pflicht | Beschreibung |
|-----------|-----|---------|--------------|
| `query` | `string` | ja | Suchbegriff, ≤200 Zeichen |

**Rückgabewert** Array von Kandidaten, je Eintrag `title` / `artist?` / `license` (`freeCommercial`, `summary`, `evidence?`, `sourceUrl?`) / `audioUrl?` / `coverUrl?`.

```bash
curl -X POST http://127.0.0.1:5175/api/ai/music-search \
  -H "Content-Type: application/json" -d '{"query":"安静的钢琴曲 免费商用"}'
```

## POST /api/ai/wallpaper-search

Wallpaper-Abruf (Direktabruf von der safebooru-Bildquelle). **Kein KI-Weg, keine Aktivierungsschwelle** — jederzeit aufrufbar.

| Body-Feld | Typ | Pflicht | Beschreibung |
|-----------|-----|---------|--------------|
| `query` | `string` | nein | Suchbegriff, Standard leer (zufällig) |
| `target` | `"desktop" \| "mobile"` | ja | Größenziel: Desktop ≥1920 quer, Mobile ≥1920 hochkant |

**Rückgabewert** `WallpaperCandidate[]` (bis ein Schwung beisammen ist): `{ imageUrl, previewUrl?, width?, height? }`.

```bash
curl -X POST http://127.0.0.1:5175/api/ai/wallpaper-search \
  -H "Content-Type: application/json" -d '{"query":"星空","target":"desktop"}'
```
