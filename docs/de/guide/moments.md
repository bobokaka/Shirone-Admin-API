---
title: Momente
description: Momente veröffentlichen und verwalten — Stimmung, Ort, Tags, automatische Bündelung von bis zu neun Bildern beim Upload sowie KI-Politur und Tag-Vorschläge.
---

# Momente

„Momente“ sind das leichtgewichtigere Format neben Artikeln: ein kurzer Gedanke, ein paar Bilder, ein Stimmungssymbol. Der Veröffentlichen-Komponist sitzt oben auf der Seite, der Moment-Stream darunter — schreiben und posten in einem Zug.

![Momente](/assets/guide/moments.png)

## Einen Moment veröffentlichen

Die Komponisten-Karte von oben nach unten:

1. **Text** — mehrzeiliges Eingabefeld für den Gedanken des Moments
2. **Bereich für Bilder** — maximal **9 Stück**; per + auswählen oder direkt per Einfügen hochladen
3. **Meta-Zeile** — Stimmung / Ort / Tags / Veröffentlichungszeitpunkt / Anheften
4. **Aktionszeile** — KI-Politur (wenn KI aktiviert) / Entwurf speichern / Moment veröffentlichen

### Stimmungssymbole

Neun vorgegebene Stimmungen stehen zur Wahl: 😊 fröhlich, 🤩 begeistert, 😐 gelassen, 😔 bedrückt, 😢 traurig, ❤️ verliebt, 🎉 feiern, ☕ gemütlich, 🌙 Gute Nacht. Gespeichert werden die Symbole als Iconify-Namen (alle lokal eingebaut, keine Netzwerkzugriffe); das Frontend rendert sie als das jeweilige Symbol.

### Wie Bilder archiviert werden

Alle Bilder einer Veröffentlichung landen im **selben Batch-Verzeichnis**:

```
public/images/moments/<yyyymmdd-HHmmss>/   # Batch-Kennung identisch mit dem Moment-Dateinamen
├── 1.webp
└── 2.webp
```

Auch bei parallel laufenden Mehrfach-Uploads gehört alles zum selben Batch (die Batch-Kennung wird vorab erzeugt). Diese Verzeichnisregel ist nicht willkürlich — die Thumbnail-Pipeline des Themes **durchsucht ausschließlich** `public/images/moments/`; liegen die Moment-Bilder woanders, kann das Frontend keine Thumbnails erzeugen. Deshalb erzwingt das Backend den Ablageort.

> [!TIP]
> Ein Bild vor dem Veröffentlichen zu entfernen, nimmt es nur aus genau dieser Veröffentlichung heraus — die Datei bleibt im Repository. Auch beim Löschen eines ganzen Moments bleiben die Bilddateien erhalten; zum Aufräumen sind sie manuell zu entfernen.

### KI-Unterstützung (optional)

Ist die KI aktiviert, bietet der Komponist zwei zusätzliche Eingänge:

- **KI-Politur** — schreibt den Text streamend um; das Ergebnis wächst direkt im Eingabefeld (natürlich und umgangssprachlich, Ton und Fakten bleiben erhalten), jederzeit stoppbar — nach dem Stopp steht wieder der Originaltext
- **KI-Vorschlag** — zieht 2–4 Tags aus dem Text (mit der vorhandenen Tag-Liste zusammengeführt und dedupliziert) und rät eine Stimmung (eine bestehende Auswahl wird nicht überschrieben)

## Den Moment-Stream verwalten

Die Liste darunter unterstützt kombinierbares Filtern und Blättern (8 Einträge pro Seite):

| Filter | Beschreibung |
|--------|--------------|
| Suchfeld | durchsucht Text, Ort und Tags |
| Status-Dropdown | alle / veröffentlicht / Entwurf |
| Tag-Mehrfachauswahl | ein Klick auf ein Tag an einer Karte filtert ebenfalls schnell (erneuter Klick hebt die Auswahl auf) |
| nur Angeheftete | Kontrollkästchen |

Jede Moment-Karte bietet:

- **Bearbeiten** — befüllt den Komponisten oben wieder mit dem Inhalt (neu hochgeladene Bilder gehen in einen **neuen Batch**, nicht ins alte Verzeichnis); nach den Änderungen „Moment veröffentlichen“ klicken, um zu speichern
- **Anheften umschalten** — mit einem Klick anheften/lösen, die Liste aktualisiert sich sofort
- **Löschen** — entfernt nach erneuter Bestätigung die `.md`-Datei (Bilder bleiben erhalten)

## Momente und Artikel im Vergleich

| | Artikel | Moment |
|---|---------|--------|
| Inhaltsform | langer Text + Metadatensystem | kurzer Text + Bilder + Stimmung |
| Speicherort | `content/posts/<slug>/index.md` | `content/moments/<yyyymmdd-HHmmss>.md` |
| Typischer Einsatz | Tutorials, Notizen, vertiefte Gedanken | Aktuelles, kleine Notizen, schnelle festgehaltene Eindrücke |

## Weiter geht's

- Mit [strukturierten Daten](./data.md) deine Geräte, Anime und Freundeslinks präsentieren
- Wenn die Inhalte stehen: gehe zu [Committen und veröffentlichen](./publish.md)
