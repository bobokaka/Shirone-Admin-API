---
title: API-Referenz
description: Übersicht über die lokale API von Shirone-Admin — Grundkonventionen, Fehlerformat, statische Ressourcen-Mounts und der gruppierte Index sämtlicher Endpunkte.
---

# API-Referenz

Das Backend von Shirone-Admin ist ein lokaler Fastify-Dienst; die Verwaltungsoberfläche selbst arbeitet vollständig über diese API. Du kannst sie auch direkt aufrufen und das Admin damit als **programmierbares Gateway** auf dein Content-Repository nutzen — Batch-Skripte, die Anbindung externer Editoren und Automatisierungspipelines sind alles machbar.

Dieser Bereich wendet sich an Leser, die mit HTTP und der Struktur des Content-Repositories vertraut sind. Gliederung nach Backend-Modulen; jeder Endpunkt erhält Zweck, Parameter, Rückgabewert und ein kleinstes lauffähiges Beispiel.

## Grundkonventionen

| Punkt | Wert |
|-------|------|
| Basisadresse | `http://127.0.0.1:5175` (`ADMIN_PORT` änderbar; bindet ausschließlich das lokale Loopback) |
| Pfadpräfix | `/api` |
| Authentifizierung | **keine**. Lokales Einzelplatzwerkzeug, nicht im Netzwerk exponiert — bitte nicht öffentlich per Reverse-Proxy zugänglich machen |
| Request-Body | JSON (`bodyLimit` **2MB**); Datei-Uploads als multipart (max. **30MB** pro Datei, eine Datei pro Anfrage) |
| CORS | vollständig offen (`origin: true`), für bequemes Debuggen mit beliebigen lokalen Seiten |

## Fehlerformat

Alle Fehler geben ein JSON mit dem einzelnen Feld `message` (chinesisch) zurück, kombiniert mit einem passenden HTTP-Statuscode:

```json
{ "message": "文件不存在" }
```

| Statuscode | Ursache |
|------------|---------|
| `400` | fachliche Validierung fehlgeschlagen (`ApiError`) oder **zod-Request-Validierung fehlgeschlagen** — `message` nach dem Muster `body.title: 标题不能为空`, zusammengesetzt als „Feld: Grund“ |
| `404` | Pfad existiert nicht, oder das anvisierte Ziel (Artikel, Datei …) fehlt (`ENOENT`) |
| `413` | hochgeladene Datei größer als 30MB |
| `500` | unerwarteter Fehler; `message` enthält die ursprüngliche Fehlermeldung |

## Mounts für statische Ressourcen

Drei schreibgeschützte statische Routen bedienen direkt Dateien aus dem Content-Repository (trifft das Content-Repository zu, gewinnt es, ansonsten Rückfall auf den gleichnamigen Pfad im Theme-Repository); daraus speist sich die Bildvorschau der Verwaltungsoberfläche:

| Präfix | bedientes Verzeichnis | Zweck |
|--------|------------------------|-------|
| `/content-assets/*` | Content-Repository `assets/` (Rückfall: Theme-Repository `src/assets/`) | Vorschau von Build-Zeit-Ressourcen wie Avatar und Banner |
| `/content-public/*` | Content-Repository `public/` (Rückfall: Theme-Repository `public/`) | Vorschau von Moment-Bildern, Musik, Anime-Covern |
| `/content-posts/*` | Content-Repository `content/posts/` | Artikelbilder (Vereindeutigung der relativen Referenzen `./images/…` zu Direktlinks) |

Alle Pfade durchlaufen eine resolve-Prüfung und **können das Wurzelverzeichnis nicht verlassen** (Schutz vor Directory Traversal).

## Endpunkt-Index

| Gruppe | Inhalt |
|--------|--------|
| [System und Vorschau](./system.md) | Verbindungssonde, Start/Stopp/Status der Live-Vorschau-Prozesse |
| [Artikel](./posts.md) | Artikel-CRUD, Slug-Vorschläge, Massen-Umbenennung von Kategorien/Tags |
| [Momente](./moments.md) | Momente-CRUD |
| [Medien-Uploads](./media.md) | Artikelbilder, Moment-Bilder, Website-Bilder, Daten-Cover, Musik-Audio |
| [Website-Einstellungen](./settings.md) | Lesen/Schreiben der vier Konfigurationsbereiche (site/profile/navbar/footer) |
| [Strukturierte Daten](./data.md) | Lesen/Schreiben der acht `data/*.ts`, Anime-Suche und Cover-Import |
| [Veröffentlichen und Validieren](./publish.md) | Veröffentlichungs-Vorschau, Remote-Sonde, Ein-Klick-Veröffentlichung, dry-run-Validierung |
| [KI-Dienste](./ai.md) | Anbieterkonfiguration, Dialog/Umschreiben (inklusive SSE-Streaming), sämtliche KI-Workflows |
| [Jianshu-Import](./import.md) | Exportpaket-Sitzungen, Import-Hintergrundaufgaben, Einfügen einzelner Artikel |

## Allgemeine Verhaltenshinweise

- **Schreibziel**: abgesehen von den KI-Einstellungen (`server/data/ai-settings.json`) findet jedes Schreiben im Content-Repository statt, auf das `CONTENT_DIR` zeigt
- **Pfadparameter**: Parameter für Artikel-/Moment-Pfade sind POSIX-Stil relativ zum Content-Repository (z. B. `hello/index.md`), durchgängig mit `/` getrennt
- **Datumsformate**: Artikel `published` als `YYYY-MM-DD`; `publishedAt` als `YYYY-MM-DDTHH:mm:ss+08:00`; Momente `published` als `YYYY-MM-DD HH:mm:ss`

## Schnelltest

Läuft der Dienst, bestätigt ein einziger Befehl die Erreichbarkeit:

```bash
curl http://127.0.0.1:5175/api/status
```

Die Rückgabe enthält die Pfade von Content- und Theme-Repository, den Verbindungsstatus und die git-Übersicht — damit ist die API bereit.
