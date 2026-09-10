---
title: Momente
description: Schnittstellenreferenz für das Momente-CRUD unter /api/moments — veröffentlichen, aktualisieren und löschen.
---

# Momente

Das Momentemodul arbeitet auf `content/moments/` des Content-Repositories — ein Moment pro Markdown-Datei, der Dateiname ist die id: `<yyyymmdd-HHmmss>.md`. Die Liste ist zeitlich absteigend sortiert.

## Die MomentMeta-Struktur

Die von Liste und Detail geteilten Metadaten:

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| `id` | `string` | Dateiname ohne `.md`, z. B. `20260906-183000` |
| `path` | `string` | relativer Pfad |
| `published` | `string` | `YYYY-MM-DD HH:mm:ss` |
| `pinned` / `draft` | `boolean` | angeheftet / Entwurf |
| `location` | `string` | Ort |
| `mood` | `string` | Stimmung als Iconify-Symbolname (leerer String = nicht gewählt) |
| `tags` | `string[]` | Tags |
| `images` | `{ src, alt }[]` | Bilder; `src` ist der Website-Pfad |
| `body` | `string` | Text (auch in der Liste enthalten) |

## GET /api/moments

Vollständige Liste, keine Parameter.

```bash
curl http://127.0.0.1:5175/api/moments
```

## GET /api/moments/detail

| Query-Parameter | Pflicht | Beschreibung |
|-----------------|---------|--------------|
| `path` | ja | relativer Moment-Pfad |

**Rückgabewert** `MomentFile`: `{ meta: MomentMeta, body: string }`.

```bash
curl "http://127.0.0.1:5175/api/moments/detail?path=20260906-183000.md"
```

## POST /api/moments

Erstellt einen Moment. **Nebenwirkung**: schreibt `content/moments/<Veröffentlichungszeitstempel>.md`; die in `images` referenzierten Dateien sollten zuvor über den [Moment-Bild-Upload](./media.md#post-api-media-moment-image) im Repository liegen.

| Body-Feld | Typ | Pflicht | Standard | Beschreibung |
|-----------|-----|---------|----------|--------------|
| `published` | `string` | ja | — | `YYYY-MM-DD HH:mm:ss`, bestimmt den Dateinamen |
| `body` | `string` | nein | `""` | Text |
| `location` | `string` | nein | — | Ort |
| `mood` | `string` | nein | — | Stimmungssymbol-Name |
| `tags` | `string[]` | nein | — | Tags |
| `images` | `{ src, alt? }[]` | nein | — | Bildliste |
| `draft` / `pinned` | `boolean` | nein | `false` | Entwurf / angeheftet |

**Rückgabewert** das erstellte `MomentMeta`.

```bash
curl -X POST http://127.0.0.1:5175/api/moments \
  -H "Content-Type: application/json" \
  -d '{"published":"2026-09-10 10:30:00","body":"第一条说说！","mood":"material-symbols:celebration","tags":["开始"]}'
```

## PUT /api/moments

Aktualisiert einen Moment; Felder wie oben, zusätzlich:

| Body-Feld | Typ | Pflicht | Beschreibung |
|-----------|-----|---------|--------------|
| `path` | `string` | ja | Pfad des Ziel-Moments |

Nicht gesendete optionale Felder fallen auf ihre Standardwerte zurück (Semantik der vollständigen Überschreibung) — das robusteste Muster ist, vor dem Aufruf erst detail zu lesen und dann zu ändern (genau so arbeitet die Verwaltungsoberfläche).

```bash
curl -X PUT http://127.0.0.1:5175/api/moments \
  -H "Content-Type: application/json" \
  -d '{"path":"20260906-183000.md","published":"2026-09-06 18:30:00","body":"改过了","pinned":true}'
```

## DELETE /api/moments

Löscht einen Moment (die `.md`-Datei). **Die Bilddateien werden nicht mitgelöscht** — zum Aufräumen ist das jeweilige Batch-Verzeichnis unter `public/images/moments/` von Hand zu entfernen.

| Query-Parameter | Pflicht | Beschreibung |
|-----------------|---------|--------------|
| `path` | ja | relativer Moment-Pfad |

**Rückgabewert** `{ "ok": true }`.

```bash
curl -X DELETE "http://127.0.0.1:5175/api/moments?path=20260906-183000.md"
```
