---
title: Artikelverwaltung
description: Alle Artikel durchstöbern, filtern, mustern und ordnen — zweispaltiges Layout mit Filterliste links und Vorschau rechts, plus Massen-Umbenennung und Zusammenführung von Kategorien und Tags.
---

# Artikelverwaltung

Die Seite „Artikelverwaltung“ ist deine zentrale Anlaufstelle für alles rund um Artikel: alle Artikel durchstöbern, nach Kategorie und Tag filtern, den Text schnell mustern und das Kategoriensystem per Massenoperation ordnen.

![Artikelverwaltung](/assets/guide/posts.png)

Die Seite ist zweispaltig aufgeteilt: **links die Artikelliste** (filtern + auswählen), **rechts die Inhaltsvorschau** (lesen oder direkt bearbeiten). Ein Klick auf einen Artikel links rendert rechts sofort seinen Markdown-Text.

## Neuen Artikel anlegen

Klicke in der Werkzeugleiste auf „**Neuer Artikel**“, gib im Dialog einen Titel ein (nach dem Anlegen jederzeit änderbar) und bestätige:

1. Das Backend erstellt im Content-Repository unter `content/posts/` einen Artikel im **Entwurfsstatus**
2. Automatischer Sprung zur Seite [Artikel bearbeiten](./post-editor.md) — los geht's mit dem Schreiben

Aus dem Titel wird per Pinyin-Umschrift ein URL-freundlicher Verzeichnisname (Slug) erzeugt, z. B. 《快速上手指南》 → `kuai-su-shang-shou-zhi-nan/index.md`. Bei Namensdoppelungen wird automatisch ein Zähler angehängt.

## Stöbern und Filtern

Die Werkzeugleiste bietet drei kombinierbare Filter:

| Filter | Verhalten |
|--------|-----------|
| Suchfeld | durchsucht **Titel, Kategorie und Tags** gleichzeitig (Groß-/Kleinschreibung egal) |
| Kategorie-Dropdown | zeigt nur Artikel dieser Kategorie; in Klammern hinter der Option steht die Artikelzahl |
| Tag-Dropdown | zeigt nur Artikel mit diesem Tag |

Der Listenkopf zeigt live „Artikel (gefiltert / gesamt)“. Jede Artikelzeile zeigt Titel, Veröffentlichungsdatum und Kategorie sowie Status-Badges: gelbes „Entwurf“, „Angeheftet“, rotes „Verschlüsselt“.

## Vorschau und Bearbeitung an Ort und Stelle

Nach der Auswahl zeigt die rechte Spalte:

- **Titel und Metainformationen**: Datum, Kategorie, Tags, Badges Entwurf/Angeheftet/Verschlüsselt
- **Gerenderter Text**: Markdown wird live gerendert; Bilder aus dem Artikelverzeichnis (Relative Referenzen `./images/…`) werden direkt angezeigt
- Schaltfläche **Bearbeiten**: wandelt die rechte Spalte an Ort und Stelle in den vollständigen Editor um (dieselbe Oberfläche wie die Seite [Artikel bearbeiten](./post-editor.md), nur ohne zweispaltige Vorschau). Über das Symbol „geteilte Bearbeitung“ oben rechts im Editor gelangst du zur vollständigen Editorseite mit Vorschau links/rechts; bei der Rückkehr wird der Bearbeitungszustand dieses Artikels automatisch wiederhergestellt
- Schaltfläche **Löschen**: bei verzeichnisbasierten Artikeln erscheint der Hinweis „Das Löschen entfernt den Artikel und sämtliche Bilder in seinem Verzeichnis“; bereits an git committete Inhalte lassen sich aus dem Verlauf wiederherstellen

> [!TIP]
> Wechselst du während der Bearbeitung an Ort und Stelle zu einem anderen Artikel, wird bei ungespeicherten Änderungen **zuerst stillschweigend automatisch gespeichert**, bevor gewechselt wird — nichts geht verloren (Details unter [Artikel bearbeiten · Automatisches Speichern](./post-editor.md#automatisches-speichern)).

## Kategorien / Tags verwalten

„**Kategorien verwalten**“ rechts in der Werkzeugleiste öffnet den Massenbearbeitungs-Dialog — die einzige Stelle, an der das Kategoriensystem der ganzen Website gepflegt werden muss:

- Oben zwei Reiter Kategorie / Tag, die Listen sind **absteigend nach Verwendungshäufigkeit** sortiert
- **Umbenennen / Zusammenführen**: benennt eine Kategorie (oder ein Tag) um; existiert der neue Name bereits, werden beide **zusammengeführt**. Das Backend schreibt dafür die frontmatter jedes betroffenen Artikels um und lässt Datumsformate unangetastet
- **Entfernen**: löscht diese Kategorie/dieses Tag aus allen Artikeln (die Artikel selbst bleiben unberührt)

Willst du etwa die verstreuten Tags „JS“ und „JavaScript“ zu „JavaScript“ vereinheitlichen: führe für „JS“ eine Umbenennung aus, trage `JavaScript` ein — nach dem Bestätigen werden alle betroffenen Artikel automatisch umgeschrieben.

## Wie Artikel auf der Festplatte aussehen

Wer die Speicherform versteht, bleibt bei Backup und Fehlersuche gelassen:

```
content/posts/
├── hello/                  # verzeichnisbasiert (Standard bei neuen Artikeln): Bilder liegen beim Artikel
│   ├── index.md
│   └── images/
│       └── cover.webp
└── old-post.md             # flach (historische Artikel oder externer Import): Einzeldatei
```

- Neue Artikel sind stets **verzeichnisbasiert**; im Editor hochgeladene Bilder landen automatisch im Unterverzeichnis `images/` des Artikelverzeichnisses
- Die Liste ist sortiert nach **Angeheftete zuerst, danach Veröffentlichungsdatum absteigend**

## Weiter geht's

- Auf die Seite [Artikel bearbeiten](./post-editor.md) für Editor, Artikelinformationen und KI-gestütztes Schreiben
- Nach den Änderungen zu [Committen und veröffentlichen](./publish.md) gehen und online bringen
