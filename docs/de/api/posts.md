---
title: Artikel
description: Schnittstellenreferenz für /api/posts (Artikel-CRUD), /api/slug (Slug-Vorschläge) und /api/taxonomy/rename (Massen-Umbenennung von Kategorien und Tags).
---

# Artikel

Das Artikelmodul arbeitet direkt auf `content/posts/` des Content-Repositories. Alle Pfadparameter sind POSIX-Pfade relativ zu diesem Verzeichnis. Die Liste ist sortiert nach **Angeheftete zuerst, Veröffentlichungsdatum absteigend**.

## GET /api/posts

Gibt die vollständige Liste der Artikel-Metadaten zurück (ohne Textkörper).

**Rückgabewert** `PostMeta[]`, wesentliche Felder je Eintrag:

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| `slug` | `string` | Verzeichnisname (verzeichnisbasiert) oder Dateiname ohne `.md` |
| `path` | `string` | relativer Pfad, z. B. `hello/index.md` |
| `layout` | `"directory" \| "file"` | verzeichnisbasiert / flach |
| `title` / `published` / `description` / `image` / `category` / `tags` | — | Metadaten; `published` als `YYYY-MM-DD` |
| `publishedAt` / `updated` / `updatedAt` | `string?` | genaue Zeit und Änderungszeitpunkt |
| `pinned` / `draft` / `comment` / `encrypted` / `hideHomeContent` | `boolean` | Schalter |
| `hasPassword` | `boolean` | ob ein Passwort gesetzt ist (**das Passwort selbst kommt nie zurück**) |
| `passwordHint` | `string` | Passwort-Hinweis |
| `alias` / `permalink` | `string?` | eigener Zugriffspfad |

```bash
curl http://127.0.0.1:5175/api/posts
```

## GET /api/posts/detail

Liest den vollständigen Inhalt eines einzelnen Artikels.

| Query-Parameter | Pflicht | Beschreibung |
|-----------------|---------|--------------|
| `path` | ja | relativer Artikelpfad |

**Rückgabewert** `PostFile`: `{ meta: PostMeta, body: string }`. Existiert der Pfad nicht, `404`.

```bash
curl "http://127.0.0.1:5175/api/posts/detail?path=hello/index.md"
```

## POST /api/posts

Legt einen Artikel an (**Entwurfsstatus**). Verzeichnisbasiert landet er als `content/posts/<slug>/index.md`.

| Body-Feld | Typ | Pflicht | Standard | Beschreibung |
|-----------|-----|---------|----------|--------------|
| `title` | `string` | ja | — | Titel, darf nicht leer sein |
| `slug` | `string` | nein | Pinyin-Umschrift des Titels | eigener Verzeichnisname; unzulässige Zeichen werden automatisch bereinigt, Doppelungen dedupliziert |

**Rückgabewert** `PostFile` (der neu erstellte Artikel). **Nebenwirkung**: erzeugt Verzeichnis und `index.md` im Content-Repository; ohne `slug` wird gegen vorhandene Artikel dedupliziert.

```bash
curl -X POST http://127.0.0.1:5175/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"我的第一篇文章"}'
```

## PUT /api/posts

Speichert einen Artikel. Die frontmatter wird per **Merge zurückschrieben**: aktualisiert werden nur die in `meta` vorkommenden Schlüssel, der Textkörper wird als Ganzes ersetzt; die Serialisierung bewahrt Datumsformate wie `published`.

| Body-Feld | Typ | Pflicht | Standard | Beschreibung |
|-----------|-----|---------|----------|--------------|
| `path` | `string` | ja | — | Pfad des Zielartikels |
| `body` | `string` | nein | `""` | vollständiger Text (Ganzersetzung) |
| `meta` | `object` | nein | `{}` | zu aktualisierende frontmatter-Schlüssel; bei `alias`/`permalink` entfernt ein leerer String den Schlüssel |
| `password` | `string` | nein | — | **nur beim Setzen/Ändern des Passworts senden**; ohne Angabe bleibt der alte Wert |
| `clearPassword` | `boolean` | nein | — | `true` entfernt das Passwort (z. B. beim Aufheben der Verschlüsselung) |

**Rückgabewert** das gespeicherte `PostFile`.

```bash
curl -X PUT http://127.0.0.1:5175/api/posts \
  -H "Content-Type: application/json" \
  -d '{"path":"hello/index.md","meta":{"draft":false},"body":"# 你好\n\n正文。"}'
```

## DELETE /api/posts

Löscht einen Artikel. Bei verzeichnisbasierten Artikeln wird auf oberster `slug`-Ebene gelöscht (das ganze Verzeichnis samt Bildern), bei flachen die Einzeldatei.

| Query-Parameter | Pflicht | Beschreibung |
|-----------------|---------|--------------|
| `path` | ja | relativer Artikelpfad |

**Rückgabewert** `{ "ok": true }`.

```bash
curl -X DELETE "http://127.0.0.1:5175/api/posts?path=hello/index.md"
```

## POST /api/slug

Erzeugt oder bereinigt einen Slug (Pinyin-Umschrift des Titels, Ersatz unzulässiger Zeichen, Deduplizierung gegen vorhandene Artikel).

| Body-Feld | Typ | Pflicht | Beschreibung |
|-----------|-----|---------|--------------|
| `title` | `string` | nein (Standard `""`) | Titel; wird nur zur Erzeugung verwendet, **wenn kein `slug` gesendet wird** |
| `slug` | `string` | nein | mit Angabe wird ausschließlich bereinigt, nicht erzeugt |

**Rückgabewert** `SlugSuggestion`: `{ slug: string, adjusted: boolean, note?: string }` — `adjusted=true` bedeutet, dass ersetzt oder dedupliziert wurde; `note` nennt den Grund.

```bash
curl -X POST http://127.0.0.1:5175/api/slug \
  -H "Content-Type: application/json" \
  -d '{"title":"快速上手指南"}'
```

## POST /api/taxonomy/rename

Massen-Umbenennung von Kategorien/Tags: schreibt die frontmatter **aller getroffenen Artikel** um. Existiert der Zielname bereits, werden beide zusammengeführt; ein leerer String in `to` = aus allen Artikeln entfernen.

| Body-Feld | Typ | Pflicht | Beschreibung |
|-----------|-----|---------|--------------|
| `kind` | `"category" \| "tag"` | ja | Kategorie oder Tag ändern |
| `from` | `string` | ja | alter Name (darf nicht leer sein) |
| `to` | `string` | ja | Zielname; leerer String = entfernen |

**Rückgabewert** `{ changed, kind, from, to }` — `changed` ist die Zahl der umgeschriebenen Artikel. **Nebenwirkung**: schreibt die Dateien einzeln um (im Tag-Fall mit automatischer Deduplizierung); Datumsfelder behalten ihr Format.

```bash
curl -X POST http://127.0.0.1:5175/api/taxonomy/rename \
  -H "Content-Type: application/json" \
  -d '{"kind":"tag","from":"JS","to":"JavaScript"}'
```
