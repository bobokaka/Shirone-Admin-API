---
title: Strukturierte Daten
description: Acht Typen strukturter Daten des Blogs visuell bearbeiten — Projekte, Fähigkeiten, Zeitleiste, Geräte, Anime, Kompass, Playlist, Freundeslinks; inklusive Anime-Import per Suche, Musikimport und KI-Entwurf für die Zeitleiste.
---

# Strukturierte Daten

Die Projekte, Fähigkeiten und Gerätelisten auf der „Über mich“-Seite des Blogs, die Anime-Liste in der Seitenleiste, Freundeslinks und die Hintergrund-Playlist — all das sind **strukturierte Daten**: Jeder Typ ist ein TypeScript-Array in `data/*.ts` des Content-Repositories. Die Seite „Datenverwaltung“ macht daraus durchgehend visuelle Bearbeitung per Tabelle + Formular; Änderungen **landen sofort im Repository**.

![Datenverwaltung](/assets/guide/data.png)

## Acht Datentypen

| Reiter | Einträge | Typische Felder |
|--------|----------|-----------------|
| Projekte | Projekt | Name, Kurzbeschreibung, Kategorie, Phase (veröffentlicht/in Entwicklung/erkundet), Tech-Stack, Empfohlen |
| Fähigkeiten | Fähigkeit | Name, Kategorie (Frontend/Backend/Werkzeuge/Game-Entwicklung), Niveau (Einsteiger→Experte), Symbol |
| Zeitleiste | Ereignis | Titel, Datum, Kategorie (Meilenstein/Projekt/Station/Leben), Kernpunkte, zugehörige Links |
| Geräte | Gerät | Name, Marke, Kategorie, Status (im Einsatz/Reserve/ausgemustert/Wunsch), Spezifikation |
| Anime | Anime-Titel | Titel, Status (am Schauen/gesehen/geplant/parkiert/abgebrochen), Bewertung, Fortschritt, Genre, Cover |
| Kompass | Regal | Name, Symbol, Navigationseinträge (Name + Link + Notiz) |
| Playlist | Track | Titel, Künstler, Cover, Audio-Adresse, Länge |
| Freundeslinks | Freundeslink | Websitename, Avatar, Beschreibung, Adresse, Tags |

## Allgemeine Operationen

- **Neu** — öffnet den Bearbeitungsdialog zum Feld-für-Feld-Ausfüllen; fehlende Pflichtfelder blockieren mit Hinweis
- **Direkt in der Tabelle umschalten** — Boolesche Felder wie „Empfohlen“ oder „Aktiv“ sind in der Tabelle Schalter; umlegen speichert sofort
- **Sortieren** — die ↑↓-Schaltflächen rechts in jeder Zeile passen die Reihenfolge an (die Array-Reihenfolge ist die Anzeigereihenfolge im Frontend), sofort im Repository
- **Bearbeiten / Löschen** — Bearbeiten öffnet den Dialog mit allen Feldern befüllt; Löschen verlangt eine zweite Bestätigung

Ein paar arbeitssparende Details:

- **Kennungsfelder entstehen automatisch** — Kennungsspalten wie Projekt-key, Gerät-id oder Track-id müssen nicht von Hand gefüllt werden: Beim Anlegen wird aus dem Titel automatisch ein Pinyin-Slug erzeugt (bei Doppelung mit Zähler), die Freundeslink-id nimmt Maximum + 1
- **Symbolfelder** — Iconify-Symbolnamen (z. B. `simple-icons:typescript`) zeigen sofort eine Vorschau; alle Symbole sind lokal eingebaut, es gehen keine Netzwerkzugriffe hinaus
- **Bildfelder** — Covers per lokalem Upload (automatisch ins passende Ressourcenverzeichnis des Datentyps) oder durch Einfügen eines Pfads; für Anime und die Playlist gibt es den eigenen Ein-Klick-Import, siehe unten
- **Eintragslisten für Kompass und Zeitleiste** — verschachtelte Arrays wie „Navigationseinträge“ oder „zugehörige Links“ bearbeitest du als visuelle Karten; Name/Symbol/Adresse je Untereintrag in einer Zeile, mit Pflichtfeld-Prüfung

Alle Änderungen fließen über eine **serielle Speicherwarteschlange** zurück in `data/*.ts` — interface-Definitionen, Kommentare und Export-Anweisungen in der Datei bleiben wortwörtlich erhalten, nur das Array-Literal wird ersetzt. Von Hand gepflegter Code wird nicht angetastet.

## Anime: Suche und Import

Die reiterexklusive Schaltfläche „**Suche-Import**“ im Anime-Reiter bezieht ihre Daten aus der öffentlichen API von [Bangumi](https://bgm.tv/):

![Anime-Suche-Import](/assets/guide/data-anime.png)

1. **Suchen** — chinesischen/japanischen/englischen Titel eingeben; die Kandidatenliste kommt mit Jahr, Episodenzahl, Bewertung und Cover zurück
2. **Eintrag wählen** — die Details werden automatisch nachgezogen: Studio, Ausstrahlungszeitraum, häufigste Genre-Tags
3. **Bestätigen** — erzeugt einen neuen Anime-Entwurf mit bereits ausgefüllten Titel/Jahr/Genre/Beschreibung/Cover/Studio — **Status und Bewertung bleiben dir überlassen**; das Cover wird aus dem offiziellen Bangumi-Bildspeicher heruntergeladen und landet in `public/assets/anime/`

Die persönliche Anime-Liste braucht damit keine Metadaten mehr von Hand — ein Titel gesucht, ein Titel eingetragen.

## Playlist: Musik importieren

„**Musik importieren**“ im Playlist-Reiter bietet drei Wege zum Track:

- **KI-Suche** — beschreibe den gesuchten Song (Titel/Stil); die KI sucht im Netz und liefert die **Lizenzinformationen** mit (frei kommerziell nutzbar? Beleg-Link?) — nach dem Bestätigen landen Audio und Cover automatisch im Repository
- **Direktlink-Import** — Audio-Direktlink einfügen; der Server lädt stellvertretend herunter (auch das, was der Browser wegen Same-Origin-Policy nicht bekäme)
- **Lokaler Upload** — Audiodatei direkt hochladen

Nach dem Import in der Tabelle auf **▶ Anhören** klicken: Die Player-Leiste unten spielt die Auswahl sofort — erst speichern, wenn es der richtige Track ist.

## Zeitleiste: KI-Entwurf

Die Schaltfläche „**KI-Entwurf**“ im Zeitleisten-Reiter (erscheint bei aktivierter KI) erzeugt Ereignisentwürfe in zwei Modi massenhaft:

- **git-Modus** — durchsucht die Commit-Historie aller drei Repositories (maximal 30 je Repository, inklusive Datei-Zählerstatistik) und lässt die KI daraus Zeitleisten-Ereignisse destillieren: ideal für Rückblicke à la „Was habe ich diesen Monat gemacht“
- **Beschreibungsmodus** — du schreibst einen Satz, die KI entwirft daraus ein normiertes Ereignis (Titel/Datum/Kategorie/Kernpunkte/Tags)

Die generierte Entwurfsliste lässt sich **Eintrag für Eintrag ankreuzen**; bereits erfasste Ereignisse werden automatisch dedupliziert (Abgleich über Titel + Datum). Beim Einfügen wird der richtige Platz in der Liste anhand des Datums gefunden und eingefügt; das Datumsformat wandelt sich automatisch in den punktierten Stil der Website (`2025.06.01`).

## KI auf Feldebene

Lange Textfelder wie Kurzbeschreibungen (Projektbeschreibung, Fähigkeitsbeschreibung, Anime-Beschreibung, Freundeslink-Beschreibung, Zeitleisten-Beschreibung, Gerätebeschreibung) haben im Bearbeitungsdialog oben rechts eine **✨-Schaltfläche**: Ist der Eintragstitel gefüllt, erzeugt oder überarbeitet ein Klick die KI das Feld in 1–3 chinesischen Sätzen — das Ergebnis streamt direkt ins Eingabefeld, ist stoppbar und von Hand nachbesserbar.

## Weiter geht's

- Wenn die Visitenkarte der Website steht: weiter zu [Website-Einstellungen](./settings.md)
- Wenn die Daten vollständig sind: online gehen mit [Committen und veröffentlichen](./publish.md)
