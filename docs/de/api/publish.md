---
title: Veröffentlichen und Validieren
description: Schnittstellenreferenz für /api/publish/* (Veröffentlichungs-Vorschau, Remote-Sonde, Ein-Klick-Veröffentlichung) und /api/validate (dry-run-Validierung).
---

# Veröffentlichen und Validieren

Das Veröffentlichungsmodul kapselt die git-Operationen beider Repositories (Content-Repository + Theme-Repository). Die beiden Repositories **blockieren sich nicht gegenseitig** und geben je ein eigenes `RepoPublishResult` zurück.

## GET /api/publish/preview

Die Daten für den ersten Bildschirmaufbau der Veröffentlichungsseite: Änderungsdetails beider Repositories, automatisch erzeugte Commit-Nachrichten, letzte Commits und Status. Keine Parameter.

**Rückgabewert** `PublishPreview`, wesentliche Felder:

| Feld | Beschreibung |
|-------|--------------|
| `branch` / `ahead` / `behind` | Branch des Content-Repositories und voraus/zurück (lokal zwischengespeicherte Werte) |
| `changes` / `files` | Änderungsdetails des Content-Repositories `{ path, state: "new" \| "modified" }[]` und Dateiliste |
| `message` | automatisch erzeugte Commit-Nachricht des Content-Repositories |
| `themeChanges` / `themeFiles` / `themeMessage` / `themeStatus` / `themeRecent` | die entsprechenden Informationen des Theme-Repositories (bei nicht verbundenem Repository ist `themeStatus` `null`) |
| `themeDepsInstalled` | ob die Theme-Abhängigkeiten installiert sind (bestimmt, ob lokale Validierung möglich ist) |
| `recent` | die letzten 20 Commits des Content-Repositories `{ hash, date, subject }` |

```bash
curl http://127.0.0.1:5175/api/publish/preview
```

## POST /api/publish/probe

Leichtgewichtiger Remote-Abgleich: `git ls-remote` vergleicht die Branch-Spitzen, **zieht weder Code noch Objekte**.

| Body-Feld | Typ | Pflicht | Beschreibung |
|-----------|-----|---------|--------------|
| `repo` | `"content" \| "theme"` | ja | welches Repository sondiert wird |

**Rückgabewert** `RemoteProbe`: `{ behind: number | null }` — `0` im Einklang mit dem Remote; `>0` exakter Rückstand; `null` das Remote ist fortgeschritten, die Zahl aber unbekannt (erst nach einem Pull bestimmbar).

```bash
curl -X POST http://127.0.0.1:5175/api/publish/probe \
  -H "Content-Type: application/json" -d '{"repo":"content"}'
```

## POST /api/publish

Veröffentlichung mit einem Klick. Ablauf: Content-Repository (**Validierung → add -A → commit → pull --rebase --autostash → push**; schlägt die Validierung fehl, wird dieses Repository blockiert) + Theme-Repository (commit → push, ohne lokale Validierung).

| Body-Feld | Typ | Pflicht | Beschreibung |
|-----------|-----|---------|--------------|
| `contentMessage` | `string` | nein | Commit-Nachricht des Content-Repositories; **leer lassen = automatisch erzeugen** (muss `type(scope): ≤30 Zeichen` genügen) |
| `themeMessage` | `string` | nein | Commit-Nachricht des Theme-Repositories; ebenso |

**Rückgabewert** `PublishResult`:

```json
{
  "ok": true,
  "content": { "ok": true, "hadChanges": true, "commitHash": "a1b2c3d", "pushed": true, "log": ["..."] },
  "theme":  { "ok": true, "hadChanges": false, "pushed": false, "log": ["无变更，跳过"] }
}
```

Das einzelne `RepoPublishResult`: `ok` (Gesamterfolg dieses Repositorys), `hadChanges`, `commitHash?`, `pushed`, `validationOutput?` (das vollständige Log, wenn die Validierung des Content-Repositories fehlschlug), `log[]` (Schritt-für-Schritt-Protokoll). Das oberste `ok = content.ok && theme.ok`.

```bash
curl -X POST http://127.0.0.1:5175/api/publish \
  -H "Content-Type: application/json" -d '{}'
```

> [!WARNING]
> Dies ist die Schnittstelle, die tatsächlich git-Commits und Pushes erzeugt. Empfehlung: vorher mit `preview` den Änderungsumfang prüfen; schlägt die Validierung des Content-Repositories fehl, entsteht kein einziger Commit.

## POST /api/validate

Führt die Validierung vor der Veröffentlichung einzeln aus: läuft im Theme-Repository `scripts/content/sync.mjs --dry-run` (Umgebung mit `CONTENT_DIR`, Zeitüberschreitung 180 Sekunden, Ausgabe auf die letzten 4000 Zeichen gekürzt). **Reine In-Memory-Vorabprüfung — nichts auf der Platte, keine Änderungen.**

**Rückgabewert** `{ ok: boolean, output: string }` — `output` ist die Ausgabe des Validators (Lokalisierung von YAML-Format-, Feldschreibweisen- und frontmatter-Schema-Problemen).

```bash
curl -X POST http://127.0.0.1:5175/api/validate
```
