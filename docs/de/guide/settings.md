---
title: Website-Einstellungen
description: Die ganze Website konfigurieren, ohne eine Zeile YAML zu schreiben — fünf Bereiche für Grundinformationen, Navigation, Fußzeile, Theme-Erscheinungsbild und Banner-Wallpaper; rechts wirkt sich alles sofort in der Live-Vorschau aus.
---

# Website-Einstellungen

Die Seite „Website-Einstellungen“ macht sämtliche Konfigurationsoptionen des Themes zu Formularen: links die Bereichsformulare, rechts die eingebettete [Live-Vorschau](./dashboard.md#live-vorschau) — speichern, Vorschau aktualisiert sich, was du siehst, ist das Ergebnis.

Die Seite ist in fünf Reiter gegliedert: **Grundlegende Informationen**, **Navigation**, **Fußzeile**, **Theme-Erscheinungsbild**, **Banner-Wallpaper**.

![Website-Einstellungen · Grundlegende Informationen](/assets/guide/settings.png)

## Grundlegende Informationen

Sieben Bereiche, jeder speichert unabhängig:

| Bereich | Was konfiguriert wird |
|---------|------------------------|
| Website-Informationen | Websitename, Untertitel (mit KI-✨-Einzeiler-Generierung für den Untertitel) |
| Persönliches Profil | Avatar (Online-URL oder lokaler Upload, automatisch umbenannt ins Repository), Name, Signatur (ebenfalls mit KI-✨) |
| Externe Links | Liste externer Links wie GitHub / Bilibili: Name, Iconify-Symbol, Adresse |
| Favicon | Zwei Slots hell / dunkel; ohne eigene Auswahl zeigt ein Hinweis das aktuell wirksame Standard-Symbol des Themes; Uploads werden automatisch als `favicon-light/dark.<ext>` benannt und ersetzen die Datei an Ort und Stelle — alternativ genügt eine Online-Adresse |
| Allgemeine Einstellungen | Website-Adresse (die endgültige Domain nach dem Deployment), Unterpfad (bei Auslieferung im Wurzelverzeichnis `/`), Zeitzone (Dropdown gängiger Zonen, Freitext möglich) |
| Besucherbereich-Anzeige | steuert die Anzeige-Schalter, die das Frontend Besuchern freigibt: Farbwähler, Wechsel der Farbspezifikation, Hintergrundmodus, Listenlayout, reduzierte Animationen, Hintergrundtextur |
| Internationalisierung | ob Mehrsprachigkeit geöffnet wird: Sprachen per Haken auswählen; die Hauptsprache der Website muss Teil der Auswahl sein — ausgeschaltet bleibt die gesamte Website auf vereinfachtes Chinesisch festgelegt |

## Navigation

Der visuelle Menü-Editor für die Navigation:

- **Theme-Vorgaben** — aus 15 eingebauten Vorgaben (Startseite, Archiv, Freundeslinks u. a.) wählen und mit einem Klick einbinden
- **Eigene Links** — Name + Symbol + Adresse, optional als „in neuem Fenster öffnen“ markiert
- **Dropdown-Gruppen** — ein Untermenü herausziehen, um gleichartige Zugänge zu bündeln

Die Navigationskonfiguration wird als Ganzes gespeichert; Arrays haben die Semantik der **vollständigen Ersetzung**.

## Fußzeile

- **Aktivierungsschalter** — steuert, ob der eigene Fußzeilen-Inhalt über der Copyright-Zeile des Themes eingebracht wird
- **HTML-Editor** — CodeMirror-Editor mit **Prettier-Formatierungsschaltfläche**; der Fußzeilen-HTML-Rohtext liegt im Content-Repository unter `config/footer.html`
- **Fußzeilen-Bildbibliothek** — Bilder hochladen oder Online-Direktlinks einfügen (der Server lädt stellvertretend herunter, webp wird automatisch zu png/jpg) und landen in `public/images/footer/`; per „Pfad kopieren“ und Einfügen ins HTML übernehmen
- **Live-Vorschau** — eine iframe bildet die Fußzeilen-Darstellung des Themes ungefähr nach: Copyright-Zeile + dein eigener Inhalt

## Theme-Erscheinungsbild

![Website-Einstellungen · Theme-Erscheinungsbild](/assets/guide/settings-appearance.png)

Zwei Bereiche:

### Theme-Farben

- **Farbton-Slider** (0–360) — zeigt live eine Vorschau der 5-stufigen Palette zu diesem Farbton
- **Fixieren** — mit Haken ändert sich der Website-Farbton nicht mit Inhalt-/Besucherpräferenzen
- **Farbstil** — die 9 dynamischen Material-3-Farbstile: tonalSpot (klassisch-dezent), vibrant (lebendig), content (aus den Inhaltsfarben), expressive, rainbow, fruitSalad, monochrome, neutral, fidelity
- **Farbspezifikation** — die beiden Material-3-Generationen 2021 / 2025

### Wallpaper und Texturen

- **Standard-Hintergrundmodus** — banner / none, bestimmt das Frontend-Standardverhalten, wenn kein Wallpaper gewählt ist
- **Hintergrundtextur** — sechs Vorgaben: none, starlight (Sternenlicht), cyber-dots (Cyber-Punktmuster), topography (Höhenlinien), geometric (geometrisch), sakura (Kirschblüten); Deckkraft 0,05–0,25; Schalter für erlaubte Animationen

## Banner-Wallpaper

Die vollständige Kontrolle über das Startseiten-Banner:

- **Zwei Listen Desktop-Wallpaper / Mobile-Wallpaper** — lokaler Upload, Import per Online-Direktlink (Server lädt stellvertretend), Schaltfläche **KI-Wallpaper-Empfehlung** (Abruf eines Schwungs aus der safebooru-Bildquelle, gefiltert nach Größe: Desktop ≥1920 quer, Mobile ≥1920 hoch; zum Herunterladen ins Repository ankreuzen)
- **Anzeige-Steuerung** — Position (top/center/bottom), Abdunkelung (Schalter + Deckkraft)
- **Startseiten-Texte** — Titel, mehrzeilige Untertitel, Schreibmaschinen-Effekt (Geschwindigkeit/Löschgeschwindigkeit/Pausendauer/Schleife); für die Untertitel erzeugt **KI-Generierung** aus Websitename und Signatur mit einem Klick 4–6 rotierende Zeilen
- **Rotation** — bei mehreren Wallpapern aktivierbar; Wechselintervall, Überblenddauer, sechs Wechselanimationen (ken-burns langsames Schieben/Zoomen, zoom-in/out, pan-left/right, none)
- **Wellen-Deko** — Schalter für die Wellenanimation am unteren Banner-Rand

> [!TIP]
> Beim Speichern des Banners werden lokale Wallpaper-Dateien, auf die weder Desktop noch Mobile mehr verweisen, **automatisch aufgeräumt** — Dateien von Hand löschen ist unnötig.

## Wo die Konfiguration landet

Alle Einstellungen werden ins Content-Repository unter `config/*.yaml` geschrieben — nach dem Prinzip der **minimalen Überschreibung**: Nur geänderte Schlüssel werden geschrieben, nicht deklarierte Felder erben die Theme-Defaults — kommt eine neue Version des Themes mit zusätzlichen Optionen, zieht deine Website automatisch nach, statt an einem „Voll-Schnappschuss“ an einer alten Version festzuhängen. Dictionary-Schlüssel werden rekursiv gemerged, Arrays vollständig ersetzt.

## Weiter geht's

- Mit [strukturierten Daten](./data.md) die „Über mich“-Seite füllen
- Nach der Konfiguration das Ergebnis in der [Live-Vorschau](./dashboard.md#live-vorschau) prüfen und nach Gefallen [veröffentlichen](./publish.md)
