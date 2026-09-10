---
title: Dashboard und Vorschau
description: Die Startseite des Shirone-Admin-Panels kennenlernen — vier Statistikkarten, die Liste aktueller Inhalte und das Vorschau-Panel mit dem eingebetteten echten Blog.
---

# Dashboard und Vorschau

Die erste Seite, die du nach dem Öffnen von `http://localhost:5173/` siehst, ist das **Dashboard**. Es ist die Übersicht des gesamten Admin-Panels: Wie viele Änderungen warten auf Veröffentlichung, wie viele Artikel und Momente gibt es — plus ein Vorschaufenster, das deine Website live in ihrem echten Aussehen rendert.

![Dashboard](/assets/guide/dashboard.png)

## Vier Statistikkarten

| Karte | Bedeutung des Werts | Schnellzugriff |
|-------|---------------------|----------------|
| **Ausstehende Änderungen** | Gesamtzahl der geänderten Dateien im Content-Repository: gestaged + modifiziert + ungetrackt laut git | „Zur Veröffentlichung“ → springt zu [Committen und veröffentlichen](./publish.md) |
| **Artikel gesamt** | Alle Artikel im Content-Repository (inklusive Entwürfe) | „Artikel verwalten“ → springt zur [Artikelverwaltung](./posts.md) |
| **Momente gesamt** | Alle Momente (inklusive Entwürfe) | „Momente verwalten“ → springt zu [Momente](./moments.md) |
| **Entwürfe gesamt** | Summe der als Entwurf markierten Artikel und Momente | „Weiterschreiben“ → springt zur Artikelverwaltung |

„Ausstehende Änderungen“ fasst alle noch nicht committeten Änderungen zusammen, die du im Admin-Panel vorgenommen hast — wenn diese Zahl nach dem Schreiben eines Artikels oder dem Posten eines Moments nicht null ist, ist noch nichts veröffentlicht.

## Aktuelle Inhalte

Unter den Statistikkarten zeigen zwei Listenkarten die **6 neuesten Artikel** und die **6 neuesten Momente**:

- Eine Artikelzeile zeigt Titel und Veröffentlichungsdatum; Entwürfe tragen ein gelbes Badge
- Eine Moment-Zeile zeigt Zeit, Anheften/Entwurf/Tags; der Text wird auf die ersten drei Zeilen gekürzt, maximal 3 Vorschaubilder (anklickbar zum Vergrößern)
- „Mehr“ oben rechts springt zur jeweiligen Verwaltungsseite

## Live-Vorschau

Die Karte „Live-Vorschau“ am Ende der Seite bettet eine iframe ein, die direkt `http://localhost:4321/` lädt — also die **echte Website**, wie sie der Astro-Entwicklungsserver des Theme-Repositories rendert. Es ist kein Screenshot und keine vereinfachte Simulation: Die Vorschau entspricht exakt der später veröffentlichten Seite.

### Statusanzeige und Bedienung

Die Werkzeugleiste oben im Vorschau-Panel, von links nach rechts:

- **Status-Badge** (Abfrage alle 3 Sekunden):
  - Website bereit `:4321` — Vorschau nutzbar
  - Dev-Server läuft bereits `:4321` — Vorschau nutzbar (der Prozess wurde nicht von diesem Panel gestartet)
  - Startet, erste Kompilierung nötig … — Astro befindet sich im Kaltstart, kurzer Moment bitte
  - Läuft nicht — „Vorschau starten“ anklicken
- **Vorschau starten / Stopp** — startet oder beendet die Prozesse `content:watch` + `astro dev` des Theme-Repositories aus dem Admin-Panel heraus
- **In neuem Fenster öffnen** — öffnet einen Browser-Tab direkt auf `:4321`

Das Vorschau-Panel des Dashboards startet Prozesse nicht automatisch (um nicht zu stören) — „Vorschau starten“ muss bewusst geklickt werden. Hast du alles per `node workspace/content-watch.mjs` gestartet, läuft der Dev-Server bereits, und das Panel zeigt sofort „bereit“ an.

### Warum die Vorschau „echt“ ist

Im [Drei-Repository-Arbeitsbereich](./workspace.md) wurde der Datenfluss vorgestellt: Im Admin-Panel speichern → in das Content-Repository schreiben → `content:watch` materialisiert ins Theme-Repository → Astro kompiliert neu. Ändere also eine Textstelle im Admin-Panel und speichere — Sekunden später aktualisiert sich der Blog in der Vorschau: **Was du siehst, ist die echte Website, die gleich online geht.**

## Kopfzeile und globale Eingänge

Die Kopfzeile ist auf allen Seiten gleich:

- **Seitentitel** — Name der aktuell geöffneten Funktionsseite
- **Verbindungsstatus-Badge** — Content-Repository „Verbunden / Nicht verbunden“ (Details unter [Drei-Repository-Arbeitsbereich · Verbindungsstatus prüfen](./workspace.md#verbindungsstatus-prufen))
- **✨-Schaltfläche** — öffnet die globale [KI-Konsole](./ai.md#ki-konsole)
- **Zahnrad-Schaltfläche** — öffnet den „Einstellungen“-Dialog ([KI-Anbieter konfigurieren](./ai.md#anbieter-konfigurieren) und Info-Seite)

## Weiter geht's

- [Schreibe deinen ersten Artikel](./posts.md)
- [Veröffentliche einen Moment](./moments.md)
