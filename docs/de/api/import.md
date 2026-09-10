---
title: Jianshu-Import
description: Schnittstellenreferenz für /api/import/jianshu/* — Exportpaket-Sitzungen, Import-Hintergrundaufgaben, Konvertierung eingefügter Einzelartikel und KI-Metadaten-Vorschläge.
---

# Jianshu-Import

Zwei Schnittstellengruppen für die Jianshu-Migration: der **Exportpaket-Ablauf** (sitzungsbasiert: hochladen → Liste → Vorschau → Hintergrundaufgabe) und der **Einzelartikel-Einfüge-Ablauf** (ohne Sitzung, sofort einfügen und konvertieren).

Sitzungen und Aufgaben leben beide **im Arbeitsspeicher des Servers**: Sitzungen sind 24 Stunden gültig, maximal 3 (LRU-Verdrängung); Auftragsergebnisse bleiben 1 Stunde; ein Server-Neustart leert beides — bereits importierte Artikel bleiben unberührt (sie liegen längst im Repository).

## POST /api/import/jianshu/archive

Lädt ein Jianshu-Exportpaket hoch (multipart).

| Formularfeld | Pflicht | Beschreibung |
|--------------|---------|--------------|
| `file` | ja | rar-/zip-Archiv, ≤30MB |

**Nebenwirkung**: entpackt und analysiert im Arbeitsspeicher (nichts auf der Platte). **Rückgabewert** `JianshuArchiveSummary`:

```json
{
  "sessionId": "s-xxxx",
  "notebooks": [{ "name": "技术随笔", "articles": [{ "id": "技术随笔/a.md", "title": "标题", "bytes": 8213 }] }],
  "total": 42,
  "importedIds": ["技术随笔/a.md"]
}
```

`id` ist die innerhalb der Sitzung eindeutige Kennung (normalisierter Paketpfad); lose Artikel auf der Root-Ebene wandern nach „Ungruppiert“.

```bash
curl -X POST http://127.0.0.1:5175/api/import/jianshu/archive \
  -F "file=@jianshu-export.zip"
```

## GET /api/import/jianshu/preview

Konvertierungsvorschau eines einzelnen Artikels, **ohne Schreiben auf die Platte**; Bilder behalten ihre Remote-Links.

| Query-Parameter | Pflicht | Beschreibung |
|-----------------|---------|--------------|
| `sessionId` | ja | die im vorherigen Schritt zurückgegebene Sitzungs-id |
| `id` | ja | Artikel-id |

**Rückgabewert** `JianshuPreview`: `{ title, markdown, imageCount, wordCount }` — `wordCount` ist die Zahl der reinen Textzeichen des Artikels (ein sehr kleiner Wert deutet auf übrig gebliebenen Platzhalterinhalt hin).

```bash
curl "http://127.0.0.1:5175/api/import/jianshu/preview?sessionId=s-xxxx&id=技术随笔/a.md"
```

## POST /api/import/jianshu/run

Startet die **Import-Hintergrundaufgabe** und kehrt sofort zurück; danach den Fortschritt pollen.

| Body-Feld | Typ | Pflicht | Beschreibung |
|-----------|-----|---------|--------------|
| `sessionId` | `string` | ja | Sitzungs-id |
| `ids` | `string[]` | ja | zu importierende Artikel-ids, 1–2000 Einträge |
| `options.published` | `string` | ja | einheitliches Veröffentlichungsdatum `YYYY-MM-DD` (Exportpakete enthalten keins) |
| `options.categoryFromNotebook` | `boolean` | ja | Sammlungsname als Kategorie |
| `options.category` | `string` | nein | einheitliche Kategorie, wenn nicht nach Sammlung (≤40 Zeichen) |
| `options.tags` | `string[]` | ja | einheitliche Tags (≤12, je ≤30 Zeichen) |
| `options.localizeImages` | `boolean` | ja | Bilder herunterladen und ins Repository legen (fehlgeschlagene behalten den Remote-Link) |
| `options.draft` | `boolean` | ja | als Entwurf importieren |

**Rückgabewert** `{ jobId }`. **Nebenwirkung**: schreibt Artikel für Artikel `content/posts/<slug>/index.md` und lädt Bilder herunter.

```bash
curl -X POST http://127.0.0.1:5175/api/import/jianshu/run \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"s-xxxx","ids":["技术随笔/a.md"],"options":{"published":"2026-09-10","categoryFromNotebook":true,"tags":["简书迁移"],"localizeImages":true,"draft":true}}'
```

## GET /api/import/jianshu/job

Fragt den Auftragsfortschritt ab (empfohlen im 2-Sekunden-Intervall).

| Query-Parameter | Pflicht | Beschreibung |
|-----------------|---------|--------------|
| `id` | ja | Aufgaben-id |

**Rückgabewert** `JianshuImportJob`: `{ id, sessionId, status: "running" | "done", total, done, current, results, log }`. Je `results`-Eintrag `{ id, title, ok, path?, error?, images }`; `log` behält die letzten 200 Zeilen.

```bash
curl "http://127.0.0.1:5175/api/import/jianshu/job?id=job-xxxx"
```

## DELETE /api/import/jianshu/session

Verwirft eine Sitzung (leert den Paketcache). Während einer laufenden Aufgabe wird das abgelehnt.

| Query-Parameter | Pflicht | Beschreibung |
|-----------------|---------|--------------|
| `id` | ja | Sitzungs-id |

**Rückgabewert** `{ ok: boolean }`.

```bash
curl -X DELETE "http://127.0.0.1:5175/api/import/jianshu/session?id=s-xxxx"
```

## POST /api/import/jianshu/paste-preview

**Konvertierungsvorschau** für eingefügte Einzelartikel (ohne Schreiben). Mindestens einer der drei Nutzdatenbestandteile muss nichtleer sein, je ≤2MB; Parse-Priorität: **markdown (Editor-Fassung) > html (Rich Text) > text (reiner Text als Markdown-Fallback)**.

| Body-Feld | Typ | Pflicht | Beschreibung |
|-----------|-----|---------|--------------|
| `markdown` | `string` | einer von dreien | Editor-Fassung, wird bevorzugt verwendet |
| `html` | `string` | einer von dreien | Rich Text (von Webseiten kopiert), wird zu Markdown konvertiert |
| `text` | `string` | einer von dreien | Fallback für reinen Text |

**Rückgabewert** wie `JianshuPreview`.

```bash
curl -X POST http://127.0.0.1:5175/api/import/jianshu/paste-preview \
  -H "Content-Type: application/json" \
  -d '{"html":"<h1>标题</h1><p>段落</p>"}'
```

## POST /api/import/jianshu/paste-run

**Schreibt den eingefügten Einzelartikel ins Repository**: Bilder werden automatisch ins Artikelverzeichnis heruntergeladen (fehlgeschlagene behalten den Remote-Link).

Body = Einfüge-Nutzdaten (wie oben) + `options`:

| Feld | Einschränkung |
|------|---------------|
| `title` | Pflicht, 1–100 Zeichen |
| `published` | Pflicht, `YYYY-MM-DD` |
| `category` | optional, ≤40 Zeichen |
| `tags` | ≤12, je ≤30 Zeichen |
| `draft` | boolean |

**Rückgabewert** `JianshuPasteResult`: `{ title, path, slug, images, failedImages[] }` — `images` ist die Zahl erfolgreich lokalisierter Bilder, `failedImages` die mit verbliebenem Remote-Link.

```bash
curl -X POST http://127.0.0.1:5175/api/import/jianshu/paste-run \
  -H "Content-Type: application/json" \
  -d '{"markdown":"# 标题\n正文","options":{"title":"标题","published":"2026-09-10","tags":[],"draft":true}}'
```

## POST /api/import/jianshu/suggest-meta

Die KI analysiert den Text und ergänzt Metadaten (bei deaktivierter KI oder Fehlschlag automatischer Rückfall auf die Textzusammenfassung, `aiUsed=false`).

| Body-Feld | Typ | Pflicht | Beschreibung |
|-----------|-----|---------|--------------|
| `title` | `string` | nein | leer lassen = die KI schlägt auch den Titel vor, ≤100 Zeichen |
| `markdown` | `string` | ja | Text, 1–2MB |

**Rückgabewert** `JianshuMetaSuggestion`: `{ title?, description, category, tags[], aiUsed }`.

```bash
curl -X POST http://127.0.0.1:5175/api/import/jianshu/suggest-meta \
  -H "Content-Type: application/json" \
  -d '{"title":"","markdown":"# 我的博客搭建记\n…"}'
```
