---
title: Artikel bearbeiten
description: Die vollständige Nutzung des Markdown-Quelltext-Editors — Werkzeugleiste, Bild-Uploads, der Artikelinfo-Drawer (Datum/Kategorie/Verschlüsselung/Zugriffspfad) sowie KI-gestütztes Schreiben und die automatische Speicherung.
---

# Artikel bearbeiten

Der Artikel-Editor ist die funktionsdichteste Seite des Admin-Panels. Du gelangst über die [Artikelverwaltung](./posts.md) durch einen neuen Artikel oder einen Klick auf „Bearbeiten“ hierher; die vollständige Editorseite bringt eine **zweispaltige Live-Vorschau** mit. Die Bearbeitung an Ort und Stelle in der Artikelverwaltung ist derselbe Editor im einspaltigen Gewand.

![Artikel bearbeiten](/assets/guide/post-editor.png)

## Aktionen in der Kopfzeile

Von links nach rechts:

| Schaltfläche | Wirkung |
|--------------|---------|
| Zurück | speichert automatisch und kehrt zur vorherigen Seite zurück |
| Titel-Eingabefeld | dauerhaft großes Eingabefeld, Umbenennen jederzeit möglich |
| Artikelinformationen | öffnet den Metadaten-Drawer (siehe unten) |
| Löschen | entfernt den Artikel samt allen Bildern in seinem Verzeichnis, mit erneuter Bestätigung |
| Speichern | schreibt sofort ins Content-Repository |
| Speichern und veröffentlichen | speichert und springt direkt zu [Committen und veröffentlichen](./publish.md) |

Die Kopfzeile zeigt zudem „Automatisch gespeichert HH:mm:ss“ mit dem Zeitpunkt der letzten automatischen Speicherung.

## Der Editor

Der Editor arbeitet im **Markdown-Quelltextmodus** (basierend auf md-editor-v3 + CodeMirror): Du schreibst Markdown-Rohtext, die rechte Spalte rendert die Live-Vorschau. Die Werkzeugleiste bietet die übliche Typografie: fett, kursiv, durchgestrichen, Überschriften, Zitat, Listen, Aufgaben, Inline-Code, Codeblöcke, Links, Bilder, Tabellen, rückgängig/wiederherstellen sowie die Umschaltung Vorschau/Gliederung.

**Bilder ohne Aufwand**: Fügst du im Editor einen Screenshot ein oder lädst über die Bild-Schaltfläche hoch, landet die Datei automatisch im Unterverzeichnis `images/` des aktuellen Artikelverzeichnisses, und im Text wird automatisch die relative Referenz (`./images/xxx.webp`) eingefügt. Der Artikel ist damit in sich geschlossen — das Verzeichnis als Ganzes zu kopieren ergibt einen vollständigen Artikel.

Ist die KI aktiviert, erscheint am Ende der Werkzeugleiste zusätzlich das **KI-Dropdown-Werkzeug** — Details unten unter [KI-gestütztes Schreiben](#ki-gestutztes-schreiben).

## Der Artikelinfo-Drawer

Der Drawer „Artikelinformationen“ versammelt alle Metadaten (er entspricht der frontmatter des Artikels):

### Grundlegende Felder

- **Veröffentlichungsdatum** (`YYYY-MM-DD`) und **Uhrzeit** — steuert die Sortierung, wenn mehrere Artikel am selben Tag erscheinen; die Zeitzone wird automatisch auf `+08:00` normiert
- **Kategorie** — per Dropdown wählbar (mit Verwendungszähler); einen neuen Namen eintippen und mit Enter bestätigen legt ihn an
- **Tags** — Mehrfachauswahl, ebenfalls mit Anlegen durch Eingabe
- **Zusammenfassung** — bleibt das Feld leer, übernimmt das Thema automatisch den Anfang des Textes; das Cover kann hochgeladen oder als externe URL angegeben werden
- **Schalter** — Entwurf / Anheften / Kommentare / Verschlüsselung

### Verschlüsselte Artikel

Ein Haken bei „Verschlüsselt“ klappt drei Felder aus:

- **Zugriffspasswort** — bei bereits verschlüsselten Artikeln ändert eine Eingabe das Passwort, ein leeres Feld belässt es unverändert; der Haken „Verschlüsselt“ entfernt das Passwort
- **Passwort-Hinweis** — der Hinweis, den Besucher vor der Passworteingabe sehen
- **Vorschau auf der Startkarte ausblenden** — verhindert, dass verschlüsselter Inhalt als Zusammenfassung auf die Startseite sickert

### Zugriffspfad

Drei Modi bestimmen die endgültige URL des Artikels; unten zeigt eine Live-Adresse die Wirkung:

| Modus | Adressform | Passendes Szenario |
|-------|------------|--------------------|
| Standard | `/posts/<Artikelname>/` | gewöhnliche Artikel |
| Eigener Alias | `/posts/<Alias>/` | kürzere, aussagekräftigere URLs |
| Fester Stamm-Pfad | `/<eigener Pfad>/` | sorgfältig gestaltete Visitenkarten-Seiten wie `/about-me/` |

## KI-gestütztes Schreiben

> [!NOTE]
> Die folgenden Funktionen erfordern einen aktivierten KI-Assistenten ([Konfiguration](./ai.md#anbieter-konfigurieren)). Ist er deaktiviert, erscheint kein KI-Eingang in der Werkzeugleiste — die Schreibfunktionen arbeiten ganz normal weiter.

Das KI-Dropdown-Werkzeug enthält 5 Aktionen + eigene Anweisungen; alle Aktionen **lassen Code und die privaten Erweiterungssyntaxen des Shirone-Themes unangetastet** (Doppeldoppelpunkt-Container, file-tree usw.):

| Aktion | Anwendungsbereich | Wie das Ergebnis übernommen wird |
|--------|-------------------|----------------------------------|
| Inhalt vervollständigen | ganzer Artikel | füllt argumentative Lücken, verbessert Übergänge — erst Vorschau, dann übernehmen |
| Format optimieren | ganzer Artikel | normalisiert Überschriftenebenen, vereinheitlicht Zeichensetzung, ergänzt Code-Fence-Sprachen — erst Vorschau, dann übernehmen |
| Text polieren | **Auswahl vorrangig** | mit markiertem Text wird dieser direkt ersetzt; ohne Auswahl läuft eine Diff-Vorschau über den ganzen Artikel |
| Weiterschreiben | Artikelende | setzt natürlich am Schluss fort; das Ergebnis wird am Textende angehängt |
| Zusammenfassung erzeugen | ganzer Artikel | erzeugt eine 80–160-Zeichen-Zusammenfassung und trägt sie in „Artikelinformationen“ ein (bei bestehender Zusammenfassung erfolgt eine Rückfrage) |
| Eigene Anweisung | Auswahl oder ganzer Artikel | beliebige Anweisung (z. B. „in einen umgangssprachlicheren Stil bringen“) ausführen |

Die **Diff-Vorschau** ist das Sicherheitsnetz der artikelweiten Umschreibaktionen (Vervollständigen/Format optimieren/Polieren ohne Auswahl/eigene Anweisung): Das KI-Ergebnis erscheint als nebeneinanderliegende Diff-Ansicht mit gestreamten Aktualisierungen, unveränderte lange Passagen kollabieren automatisch, und mit „Vorheriger/Nächster“ springst du Block für Block. Erst nach Prüfung schreibt „Ersetzen anwenden“ den Text wirklich um; abgebrochene, unvollständige Generierungen lassen sich nicht anwenden. Ändert sich die Textlänge um mehr als 20 %, warnt der Vorschau-Dialog in roter Schrift zum sorgfältigen Prüfen.

Alle KI-Aktionen laufen in der globalen [KI-Konsole](./ai.md#ki-konsole): Der Gedankengang ist sichtbar und jederzeit anhaltbar.

## Automatisches Speichern

Der Editor hat eine unaufdringliche automatische Speicherung:

- Alle **10 Sekunden** wird geprüft; nur wenn Titel oder Text geändert wurden, wird stillschweigend gespeichert
- Auch **beim Artikelwechsel, Klick auf Zurück und Verlassen der Editorseite** wird zuerst automatisch gespeichert
- Der einzige Fall, der dich aufhält: ein leerer Titel (ohne Titel kein Speichern) — dann erscheint der Hinweis, zuerst den Titel einzutragen

Die automatische Speicherung deckt nur Titel und Text ab; die Metadaten im Drawer „Artikelinformationen“ werden über die Schaltfläche „Speichern“ geschrieben.

## Weiter geht's

- [Momente](./moments.md) kennenlernen — das leichtgewichtigere Format
- Wenn die Inhalte stehen: gehe zu [Committen und veröffentlichen](./publish.md)
