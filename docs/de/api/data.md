---
title: Strukturierte Daten
description: Schnittstellenreferenz für das Lesen und Schreiben der acht Typen strukturierter Daten unter /api/data/:kind sowie die Anime-Suche und den Cover-Import unter /api/bangumi/*.
---

# Strukturierte Daten

Das Datenmodul liest und schreibt `data/*.ts` im Content-Repository — `interface`-Definitionen, Kommentare und Export-Anweisungen in der Datei **bleiben wortwörtlich erhalten**, ersetzt wird nur das exportierte Array-Literal. Das Lesen erfolgt per dynamischem tsx-import (mit mtime-Query gegen den Cache); Enumerationsfelder werden vor dem Speichern geprüft.

## kind und Datei-Zuordnung

Der Pfadparameter `kind` ist einer von acht Werten:

| `kind` | Datei | exportiertes Array | Einträge |
|--------|-------|--------------------|----------|
| `projects` | `data/projects.ts` | `projectsData` | Projekte |
| `skills` | `data/skills.ts` | `skillsData` | Fähigkeiten |
| `timeline` | `data/timeline.ts` | `timelineData` | Zeitleisten-Ereignisse |
| `devices` | `data/devices.ts` | `devicesData` | Geräte |
| `anime` | `data/anime.ts` | `animeData` | Anime |
| `compass` | `data/compass.ts` | `compassData` | Kompass-Regale |
| `music` | `data/music.ts` | `musicTracks` | Playlist-Tracks |
| `friends` | `data/friends.ts` | `friendsData` | Freundeslinks |

## GET /api/data/:kind

**Rückgabewert** `{ kind, items: DataItem[] }` — `DataItem` ist ein schwach typisiertes Objekt (zur Feldstruktur siehe das jeweilige interface in der Datei oder die Feldtabellen unter [Anleitung · Strukturierte Daten](../guide/data.md#acht-datentypen)).

```bash
curl http://127.0.0.1:5175/api/data/friends
```

## PUT /api/data/:kind

**Ersetzt vollständig** sämtliche Einträge dieses Datentyps.

| Body-Feld | Typ | Pflicht | Beschreibung |
|-----------|-----|---------|--------------|
| `items` | `object[]` | ja | vollständige Eintragsmenge (erst GET, dann ändern, dann PUT — niemals nur ein Delta senden) |

**Rückgabewert** `{ ok: true, changed }`. **Nebenwirkung**: schreibt den Array-Abschnitt in `data/*.ts` zurück; der Rest der Datei bleibt unberührt.

```bash
curl -X PUT http://127.0.0.1:5175/api/data/skills \
  -H "Content-Type: application/json" \
  -d '{"items":[{"name":"TypeScript","category":"frontend","level":"advanced","enable":true}]}'
```

---

# Bangumi-Anime-Suche

Das Trio des Anime-Imports; die Daten stammen aus der öffentlichen Bangumi-API und dienen der Ergänzung von Anime-Einträgen über die Suche.

## GET /api/bangumi/search

| Query-Parameter | Pflicht | Beschreibung |
|-----------------|---------|--------------|
| `keyword` | ja | Suchbegriff, 1–100 Zeichen (durchsucht fix Einträge vom Typ Animation) |

**Rückgabewert** `{ candidates: BangumiCandidate[] }` — je Eintrag `id` (Bangumi-subject-id), `title` / `originalTitle`, `year`, `cover?`, `summary`, `eps`, `bangumiScore?`, `link`.

```bash
curl "http://127.0.0.1:5175/api/bangumi/search?keyword=葬送的芙莉莲"
```

## GET /api/bangumi/subject

| Query-Parameter | Pflicht | Beschreibung |
|-----------------|---------|--------------|
| `id` | ja | Bangumi-subject-id (positive Ganzzahl, String geht auch) |

**Rückgabewert** `BangumiDetail`: ergänzt Candidate um `studio?` (Studio), `period?` (Ausstrahlungszeitraum `{ start, end? }`), `genres[]` (häufigste Genre-Tags, ≤4).

```bash
curl "http://127.0.0.1:5175/api/bangumi/subject?id=463652"
```

## POST /api/bangumi/cover-import

Cover-Import: der Server lädt das Bild aus dem Bangumi-Bildspeicher, benennt es nach dem Eintragstitel und legt es in `public/assets/anime/` ab.

| Body-Feld | Typ | Pflicht | Beschreibung |
|-----------|-----|---------|--------------|
| `url` | `string` | ja | Cover-Direktlink. **Whitelist-Prüfung**: akzeptiert nur `lain.bgm.tv` / `api.bgm.tv` / `bgm.tv` / `bangumi.tv` / `ei.hdslb.com`, sonst 400 |
| `title` | `string` | ja | Eintragstitel (1–200 Zeichen, dient der Benennung) |
| `currentPath` | `string` | nein | trifft auf dasselbe Verzeichnis zu, wird an Ort und Stelle ersetzt |

**Rückgabewert** `MediaUploadResult`.

```bash
curl -X POST http://127.0.0.1:5175/api/bangumi/cover-import \
  -H "Content-Type: application/json" \
  -d '{"url":"https://lain.bgm.tv/pic/cover/l/xx.jpg","title":"葬送的芙莉莲"}'
```
