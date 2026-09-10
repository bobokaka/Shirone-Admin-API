---
title: Medien-Uploads
description: Schnittstellenreferenz für sämtliche Upload-Endpunkte unter /api/media/* — Artikelbilder, Moment-Bilder, Website-Bilder, Daten-Cover und Musik-Audio, inklusive der Zielverzeichnis-Zuordnung je target/kind.
---

# Medien-Uploads

Das Medienmodul wickelt jede Form von Binärdatei-Übergabe ins Repository ab. Alle Upload-Schnittstellen sind **multipart-Formulare**, eine Datei pro Anfrage, maximal 30MB pro Datei; die Whitelist der Bild-Dateiendungen lautet `webp / png / jpg / jpeg / gif / avif` (favicon erlaubt zusätzlich `ico / svg`).

Die Zielverzeichnisse der einzelnen Schnittstellen (alle im Content-Repository):

| Szenario | Verzeichnis |
|----------|-------------|
| Artikelbilder | `content/posts/<slug>/images/` |
| Moment-Bilder | `public/images/moments/<Batch>/` |
| Banner (Desktop/Mobile) | `assets/images/banner/desktop/`, `assets/images/banner/mobile/` |
| Avatar | `assets/images/avatar/` |
| Fußzeilen-Bilder | `public/images/footer/` |
| favicon | `public/favicon/` |
| Daten-Cover | je kind siehe [Tabelle unten](#post-api-media-data-cover) |
| Song-Audio | `public/assets/music/url/` |

## POST /api/media/post-image

Upload eines Artikelbilds, abgelegt im `images/`-Verzeichnis des angegebenen Artikels.

| Formularfeld | Pflicht | Beschreibung |
|--------------|---------|--------------|
| `file` | ja | Bilddatei |
| `slug` | ja | Artikel-Slug (bestimmt das Zielverzeichnis) |

**Rückgabewert** `MediaUploadResult`: `{ src, fileName }` — `src` ist der in frontmatter / Text zu verwendende Referenzpfad (relativ: `./images/<name>`), direkt in Markdown einbaubar.

```bash
curl -X POST http://127.0.0.1:5175/api/media/post-image \
  -F "slug=hello" -F "file=@cover.webp"
```

## POST /api/media/moment-image

Upload eines Moment-Bilds, abgelegt in `public/images/moments/<Batch>/`. Die Batch-Verzeichnisregel gibt die Thumbnail-Pipeline des Themes vor und **ist nicht umgehbar**.

| Formularfeld | Pflicht | Beschreibung |
|--------------|---------|--------------|
| `file` | ja | Bilddatei |
| `batchId` | nein | Batch-Verzeichnisname (`[\w-]+`, z. B. `20260910-103000`); ohne Angabe erzeugt der Server ihn aus der aktuellen Zeit |

**Rückgabewert** `MediaUploadResult`: `{ src, fileName, batchId? }` — `src` ist der absolute Website-Pfad (`/images/moments/<Batch>/<Name>`); die zurückgegebene `batchId` ist bei der Bündelung weiterzuverwenden.

```bash
curl -X POST http://127.0.0.1:5175/api/media/moment-image \
  -F "batchId=20260910-103000" -F "file=@photo.webp"
```

## GET /api/media/site-images

Listet den Website-Bildspeicher auf (Szenarien wie die Fußzeilen-Bildbibliothek).

| Query-Parameter | Pflicht | Beschreibung |
|-----------------|---------|--------------|
| `target` | ja | Verzeichnungskennung, 1–40 Zeichen (z. B. `footer`) |

**Rückgabewert** `SiteMediaResult[]`: je Eintrag `{ src, previewUrl, fileName }`.

```bash
curl "http://127.0.0.1:5175/api/media/site-images?target=footer"
```

## POST /api/media/site-image

Upload eines Website-Bilds (multipart).

| Formularfeld | Pflicht | Beschreibung |
|--------------|---------|--------------|
| `file` | ja | Bilddatei |
| `target` | ja | `banner-desktop` / `banner-mobile` / `avatar` / `footer` / `favicon` |
| `name` | nein | fester Dateiname (zum Ersetzen der favicon-Slots, z. B. `favicon-light`) |
| `currentSrc` | nein | aktueller Feldwert; zeigt er in dasselbe Zielverzeichnis, wird die alte Datei **an Ort und Stelle ersetzt** (so funktioniert die Avatar-Aktualisierung) |

**Rückgabewert** `SiteMediaResult`: `src` ist der in YAML geschriebene Pfad, `previewUrl` der Direktlink für die Vorschau im Admin-Panel.

```bash
curl -X POST http://127.0.0.1:5175/api/media/site-image \
  -F "target=avatar" -F "currentSrc=assets/images/avatar/old.webp" -F "file=@me.webp"
```

## POST /api/media/site-image-import

**Import eines Website-Bilds per Remote-Direktlink**: der Server lädt stellvertretend herunter (umgeht die Same-Origin-Beschränkung des Browsers) und legt über site-image im Repository ab; webp wird automatisch zu png/jpg konvertiert (Theme-Kompatibilität).

| Body-Feld | Typ | Pflicht | Beschreibung |
|-----------|-----|---------|--------------|
| `target` | `string` | ja | wie site-image |
| `url` | `string` | ja | öffentlicher http(s)-Direktlink, ≤2000 Zeichen |
| `name` | `string` | nein | gewünschter Dateiname |
| `currentSrc` | `string` | nein | Ziel der Ersetzung an Ort und Stelle |

**Rückgabewert** wie `SiteMediaResult`.

```bash
curl -X POST http://127.0.0.1:5175/api/media/site-image-import \
  -H "Content-Type: application/json" \
  -d '{"target":"footer","url":"https://example.com/badge.png"}'
```

## POST /api/media/data-cover

Upload eines Covers für strukturierte Daten (multipart). `kind` bestimmt das Zielverzeichnis:

| `kind` | Verzeichnis |
|--------|-------------|
| `anime` | `public/assets/anime/` |
| `projects` | `public/assets/projects/` |
| `devices` | `public/images/devices/` |
| `friends` | `public/images/friends/` |
| `music` | `assets/images/music/` |

| Formularfeld | Pflicht | Beschreibung |
|--------------|---------|--------------|
| `file` | ja | Bilddatei |
| `kind` | ja | einer der fünf Werte aus der Tabelle |
| `path` | nein | aktueller Cover-Pfad des Eintrags; trifft er auf dasselbe Verzeichnis zu, wird **an Ort und Stelle überschrieben** (beim Bildwechsel bleibt keine alte Datei zurück) |

**Rückgabewert** `MediaUploadResult`.

```bash
curl -X POST http://127.0.0.1:5175/api/media/data-cover \
  -F "kind=anime" -F "file=@cover.webp"
```

## POST /api/media/data-cover-import

Cover-Import per Remote-Direktlink für strukturierte Daten (Szenarien wie von der KI gefundene CDN-Cover); `kind` und Verzeichnisse wie oben.

| Body-Feld | Typ | Pflicht | Beschreibung |
|-----------|-----|---------|--------------|
| `kind` | `string` | ja | einer der fünf Enumerationswerte |
| `url` | `string` | ja | Direktlink, ≤2000 Zeichen |
| `title` | `string` | nein | dient zum Erzeugen eines lesbaren Dateinamens |
| `currentPath` | `string` | nein | Ziel des Überschreibens an Ort und Stelle |

```bash
curl -X POST http://127.0.0.1:5175/api/media/data-cover-import \
  -H "Content-Type: application/json" \
  -d '{"kind":"music","url":"https://cdn.example.com/track-cover.jpg","title":"晴天"}'
```

## POST /api/media/music-audio

Lokaler Upload von Song-Audio (multipart) → `public/assets/music/url/`.

| Formularfeld | Pflicht | Beschreibung |
|--------------|---------|--------------|
| `file` | ja | Audiodatei |
| `currentSrc` | nein | Ziel der Ersetzung an Ort und Stelle |

```bash
curl -X POST http://127.0.0.1:5175/api/media/music-audio \
  -F "file=@song.mp3"
```

## POST /api/media/music-download

Song-Audio per **Remote-Direktlink**: der Server lädt die Datei und legt sie im Repository ab (auch das, was der Browser wegen Cross-Origin nicht bekäme).

| Body-Feld | Typ | Pflicht | Beschreibung |
|-----------|-----|---------|--------------|
| `url` | `string` | ja | Audio-Direktlink, ≤2000 Zeichen |
| `filename` | `string` | nein | gewünschter Dateiname |
| `currentPath` | `string` | nein | Ziel der Ersetzung an Ort und Stelle |

```bash
curl -X POST http://127.0.0.1:5175/api/media/music-download \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com/song.mp3"}'
```
