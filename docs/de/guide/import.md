---
title: Plattform-Import
description: Jianshu-Artikel in den Blog umziehen — zwei Wege über das Exportpaket im Ganzen oder das Einfügen eines einzelnen Artikels aus der Webversion, geführt durch einen Fünf-Schritte-Assistenten, mit automatisch von der KI ergänzten Metadaten.
---

# Plattform-Import

Schreibst du noch auf einer anderen Plattform? Die Seite „Plattform-Import“ bietet den Migrationsweg — aktuell wird **Jianshu** unterstützt; oben gliedert die Seite nach Plattformen in Reiter, weitere Plattformen folgen nach demselben Muster.

Es gibt zwei Wege; auf der Seite entscheidest du dich zuerst für einen:

| Weg | geeignet für | Eingabe |
|-----|--------------|---------|
| **Exportpaket-Import** | Umzug der ganzen Website, Dutzende bis Hunderte Artikel | rar / zip aus Jianshus offizieller Funktion „Alle Artikel als Paket herunterladen“ |
| **Einzelnen Artikel einfügen** | ausgewählte Einzelartikel, sofort einfügen und konvertieren | der vollständig kopierte Inhalt einer Artikelseite der Webversion |

![Plattform-Import](/assets/guide/import.png)

## Exportpaket-Import

Fünf-Schritte-Assistent: **Weg wählen → Exportpaket hochladen → Artikel wählen → Inhalt konvertieren → Import abgeschlossen**.

### Schritt 1: Exportpaket hochladen

Beantrage den Export unter Jianshu „Einstellungen → Kontoverwaltung → Alle Artikel als Paket herunterladen“ (Jianshu mailt einen Download-Link) und ziehe das Archiv in die Upload-Fläche. Beschränkungen: Format zip / rar, höchstens 30MB pro Paket.

Nach dem Upload entpackt und analysiert der Server im Arbeitsspeicher und listet alle Artikel gruppiert nach **Sammlung** auf.

### Schritt 2: Artikel auswählen

- Nach erfolgreicher Analyse sind noch nicht importierte Artikel **standardmäßig alle angewählt**
- Ganze Sammlungen per Gruppen-Haken an-/abwählen, alles auswählen/leeren
- Bereits importierte Artikel sind als „importiert“ markiert und abgewählt — kein versehentliches Doppeltimportieren
- Jeder Artikel lässt sich vorab „mustern“ — die konvertierte Markdown-Ansicht ohne etwas auf die Platte zu schreiben

Rechts auf der Seite stellst du die Importoptionen ein:

| Option | Beschreibung |
|--------|--------------|
| Einheitliches Veröffentlichungsdatum | Jianshu-Exportpakete enthalten keine Daten; alle Artikel bekommen dasselbe Veröffentlichungsdatum (hinterher je Artikel änderbar) |
| Sammlung als Kategorie | mit Haken wird jeder Sammlungsname direkt zur Artikelkategorie; ohne Haken gibst du eine einheitliche Kategorie vor |
| Tags | hängt dieser Charge einheitlich Tags an |
| Bilder lokalisieren | lädt die Jianshu-CDN-Bilder in das `images/`-Verzeichnis jedes Artikels; fehlgeschlagene Downloads behalten den Remote-Link |
| Als Entwurf importieren | **Haken möglichst anlassen** — in der [Artikelverwaltung](./posts.md) mustern, dann veröffentlichen |

### Schritt 3: Inhalt konvertieren

Nach dem Start erstellt der Server eine **Hintergrundaufgabe**, die Artikel für Artikel konvertiert; die Seite fragt den Fortschritt alle 2 Sekunden ab: Gesamtzahl, erledigt, aktuell in Arbeit befindlicher Titel. Du kannst die Seite währenddessen verlassen — die Aufgabe läuft weiter.

### Schritt 4: Abschluss

Zum Ende zeigt die Ergebnisliste je Artikel: Erfolg oder Misserfolg, Zielpfad im Repository, Zahl der lokalisierten Bilder. Fehlgeschlagene bekommen eine Begründung (ein einzelner Fehlschlag beeinträchtigt die übrigen Artikel nicht). Weiter geht es mit „Nächstes Paket importieren“ oder einem Sprung in die Artikelverwaltung zur Kontrolle.

## Einzelnen Artikel einfügen

Fünf-Schritte-Assistent: **Weg wählen → Inhalt einfügen → Inhalt konvertieren → Artikelinformationen → Import abgeschlossen**.

1. **Einfügen** — öffne den Artikel in der Jianshu-Webversion, wähle alles aus, kopiere und füge es mit `Strg+V` direkt in den Editor ein: Rich Text wird automatisch zu Markdown (Überschriften, Fett, Links und Bilder bleiben erhalten), links der Quelltext, rechts die Vorschau, manuelle Korrekturen sind jederzeit möglich
2. **Inhalt konvertieren** — nach dem Bestätigen schreibt der Server ins Repository: Bilder werden automatisch ins Artikelverzeichnis heruntergeladen (fehlgeschlagene behalten den Remote-Link) und ein verzeichnisbasierter Artikel erzeugt
3. **Artikelinformationen** — die KI analysiert den Text und **ergänzt automatisch**: Titel (von der KI vorgeschlagen, wenn du das Feld leer lässt), Zusammenfassung, Kategorie, Tag-Vorschläge — alles von Hand änderbar; ohne KI greift der Rückfalleinschub des Textanfangs, klar gekennzeichnet durch `aiUsed=false`
4. **Fertigstellen** — die Metadaten werden in den Artikel zurückgeschrieben, fertig. Per Knopfdruck weiter zum [Artikel bearbeiten](./post-editor.md) zum Feinschliff

> [!TIP]
> Auch das Titel-Eingabefeld hat einen Einfüge-Fallback: Enthält die Zwischenablage nur Rich Text (beim Kopieren aus Webseiten häufig), wird automatisch der reine Text gezogen und zu einer einzigen Zeile verdichtet.

## Sitzungen und Aufgaben im Detail

- Nach dem Upload entsteht eine **Sitzung** (das Analyseergebnis bleibt im Arbeitsspeicher des Servers), 24 Stunden gültig, maximal 3 gleichzeitig — überfällige oder überzählige werden automatisch als älteste verworfen; „Anderes Paket verwenden“ verwirft die aktuelle Sitzung sofort
- Ergebnisse von Import-Hintergrundaufgaben bleiben 1 Stunde erhalten
- Nach einem Server-Neustart sind In-Memory-Sitzungen und -Aufgaben leer — einfach das Exportpaket erneut hochladen; **bereits importierte Artikel bleiben unberührt** (sie liegen längst im Content-Repository)

## Weiter geht's

- Importierte Artikel in der [Artikelverwaltung](./posts.md) einzeln prüfen und das Entwurfs-Badge entfernen
- Für Massenänderungen der Kategorien: [Artikelverwaltung · Kategorien verwalten](./posts.md#kategorien-tags-verwalten)
