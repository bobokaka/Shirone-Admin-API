---
title: KI-Assistent
description: Die KI-Fähigkeiten von Shirone-Admin konfigurieren und nutzen — Wechsel zwischen mehreren Anbietern, Kompatibilität zu beiden Protokollen, globale Streaming-Konsole und eine Übersicht aller KI-Eingänge auf den Seiten.
---

# KI-Assistent

Die KI-Fähigkeiten von Shirone-Admin sind eine **optionale Ergänzung**: Ohne Konfiguration arbeitet jede Funktion ganz normal; mit Konfiguration entstehen in Schreiben, Import und Veröffentlichen zahlreiche intelligente Hilfen. Dieses Kapitel behandelt zuerst die Konfiguration, dann die Nutzung.

## Anbieter konfigurieren

Klicke in der Kopfzeile auf das **Zahnrad**, um den „Einstellungen“-Dialog zu öffnen, und wähle im linken Menü „KI-Assistent“.

![Konfiguration der KI-Anbieter](/assets/guide/app-settings.png)

### Kernkonzepte

- **Mehrere Anbieter** — es lassen sich mehrere Verbindungskonfigurationen speichern (maximal 20), und die aktive ist jederzeit umschaltbar. Ideal, wer neben der offiziellen API noch einen Proxy-Zugang hat oder je Aufgabe zwischen Modellen wechselt
- **Zwei Protokolle** — jede Konfiguration wählt eines von beiden:
  - `anthropic` — das Anthropic-kompatible Protokoll (`v1/messages`), für die offizielle API und sämtliche „Anthropic-kompatiblen“ Proxys
  - `openai` — das OpenAI-kompatible Protokoll (`chat/completions`), für OpenAI und die meisten chinesischen Modell-APIs
- **Hauptschalter** — ist „Aktivieren“ aus, verschwinden alle KI-Eingänge und die API lehnt grundsätzlich ab

### Felder je Anbieterkonfiguration

| Feld | Beschreibung |
|------|--------------|
| Name | Anzeigename, z. B. `Anthropic 官方` / `GLM 中转` |
| Protokoll | anthropic / openai |
| API-Adresse | die Basisadresse genügt (`https://api.anthropic.com` oder `https://api.openai.com/v1`); nackte Wurzel, mit `/v1` oder Proxy-Unterpfad — alles geduldet |
| API-Key | liegt ausschließlich lokal in `server/data/ai-settings.json`, **gelangt nie ins Content-Repository** und kann beim Veröffentlichen nicht lecken |
| Hauptmodell | für die Alltagsaufgaben, z. B. `claude-sonnet-5` / `gpt-4o-mini` / `glm-5.3` |
| Leichtgewichtiges Modell | für einfache Aufgaben wie Zusammenfassungen und Tag-Vorschläge; **leer = wie Hauptmodell** (spart eine Konfiguration) |
| Web-Suche | hängt unterstützten Anbietern ein Websuche-Werkzeug an; beherrscht der Server es nicht, fällt die Anfrage automatisch auf eine normale zurück |
| Temperatur | Sampling-Temperatur 0–2, Standard 0,7 |
| Zeitüberschreitung | Sekunden pro Anfrage, 5–86400, Standard 30 |

### Ablauf

1. Mit + **Anbieter hinzufügen** (Standardname „Standardkonfiguration N“ — tippen benennt sofort um)
2. Felder ausfüllen oder **Einfüge-Import** nutzen: den env-Block aus der `settings.json` von Claude Code, shell-`export`-Zeilen oder dotenv-Inhalte im Ganzen einfügen — `ANTHROPIC_*` / `OPENAI_*` und weitere 10 Schlüssel werden automatisch erkannt und in das Formular übertragen
3. **Verbindung testen** — geht auch ohne Speichern und liefert Latenz und Modellantwort; danach **speichern**

> [!WARNING]
> In `server/data/ai-settings.json` liegt der API-Key im Klartext. Die Datei steht in der gitignore — kopiere sie dennoch an keinen Ort, der committet oder geteilt wird.

## KI-Konsole

Das über die **✨-Schaltfläche** in der Kopfzeile geöffnete globale Fenster ist der Ausführungsort aller KI-Aufgaben:

![KI-Konsole](/assets/guide/ai-console.png)

Zwei Gestalten:

- **Aufgabengestalt** — die aus den Funktionsseiten ausgelösten KI-Aktionen (Politur, Weiterschreiben, Entwurf …) laufen hier: Befehlseinträge mit „Aufgabe“-Badge, sichtbarer **Gedankengang** des Modells (einklappbar), Textausgabe als Stream, Anzeige von Dauer und verwendetem Modell
- **Dialoggestalt** — im Anschluss an eine Aufgabe direkt im Eingabefeld nachfragen (mit übernommenem Kontext weiter am Text arbeiten) oder einfach plaudern; Enter sendet, Shift+Enter bricht um

Allgemeine Fähigkeiten: **jederzeitig stoppen** (nach dem Stopp bleibt bereits Generiertes je nach Szenario erhalten oder wird wiederhergestellt), die Titelleiste per Klick **einklappen**, damit sie den Bildschirm freigibt, **neuer Dialog** für einen sauberen Neustart. Wächst der Dialogverlauf über 60.000 Zeichen, werden automatisch die ältesten verworfen; der Gedankengang behält die letzten 8000 Zeichen.

## KI-Eingänge auf den Seiten

Nach dem Aktivieren erscheinen an diesen Stellen KI-Funktionen (nach Seiten geordnet):

| Seite | Eingang | Fähigkeit |
|-------|---------|-----------|
| [Artikel bearbeiten](./post-editor.md#ki-gestutztes-schreiben) | KI-Dropdown in der Werkzeugleiste | Inhalt vervollständigen / Format optimieren / Polieren (Auswahl vorrangig) / Weiterschreiben / Zusammenfassung / eigene Anweisung; artikelweite Umschreibungen mit Diff-Vorschau |
| [Momente](./moments.md#ki-unterstutzung-optional) | Komponisten-Schaltflächen | Text-Politur (streamend zurückgeschrieben), Vorschläge für Tags und Stimmung |
| [Datenverwaltung](./data.md#ki-auf-feldebene) | ✨ im Bearbeitungsdialog | Beschreibungsfelder für Projekte/Fähigkeiten/Anime u. a. erzeugen und überarbeiten |
| [Datenverwaltung · Zeitleiste](./data.md#zeitleiste-ki-entwurf) | Schaltfläche „KI-Entwurf“ | git-Historie destillieren / aus Beschreibung Ereignisse entwerfen, ankreuzen und einfügen |
| [Datenverwaltung · Playlist](./data.md#playlist-musik-importieren) | „Musik importieren“ | im Netz nach Tracks suchen, Lizenzinformationen inklusive |
| [Website-Einstellungen](./settings.md#grundlegende-informationen) | ✨ an Eingabefeldern | Untertitel und Signatur als Einzeiler erzeugen |
| [Website-Einstellungen · Banner](./settings.md#banner-wallpaper) | „KI-Generierung“ für Texte | den ganzen Satz rotierender Schreibmaschinen-Zeilen auf einmal erzeugen |
| [Plattform-Import](./import.md#einzelnen-artikel-einfugen) | automatisch ausgelöst | Titel/Zusammenfassung/Kategorie/Tags für eingefügte Artikel ergänzen |
| [Committen und veröffentlichen](./publish.md#commit-nachrichten) | Schaltfläche „KI-Generierung“ | Commit-Nachrichten für beide Repositories erzeugen (Rückfallebene bei Nichtkonformität) |

Zusätzlich zeigt das KI-Menü in der Editor-Werkzeugleiste während einer Generierung einen Ladeindikator und sperrt Doppeltrigger; alle Streaming-Aufgaben teilen sich eine Konsole — zur gleichen Zeit läuft genau eine.

## Design-Philosophie

- **Die KI blockiert nie den Hauptablauf** — scheitert die Commit-Nachrichten-Generierung, greift automatisch die Heuristik; scheitert das Ergänzen der Import-Metadaten, greift die Textzusammenfassung; nach dem Stopp der Politur steht wieder der Originaltext
- **Erst Vorschau, dann Anwendung** — artikelweite Umschreibungen laufen ausnahmslos über die Diff-Bestätigung und überschreiben niemals ungefragt deinen Text
- **Leichte Aufgaben, leichtes Modell** — kleine Aufgaben wie Tag-Vorschläge und Zusammenfassungen gehen über `modelFast` ohne Gedankengang — spart Geld und Zeit

## Weiter geht's

- Zurück zu [Artikel bearbeiten](./post-editor.md) und die KI-Politur einmal praktisch ausprobieren
- Die KI-Commit-Nachrichten unter [Committen und veröffentlichen](./publish.md) ansehen
