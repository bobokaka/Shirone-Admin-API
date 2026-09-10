---
title: Website-Einstellungen
description: Schnittstellenreferenz für das Lesen und Schreiben der vier Konfigurationsbereiche (site/profile/navbar/footer) unter /api/settings/:domain mit der YAML-Semantik der minimalen Überschreibung.
---

# Website-Einstellungen

Das Einstellungsmodul liest und schreibt `config/*.yaml` im Content-Repository. Der Pfadparameter `domain` ist einer von vier Werten: `site` / `profile` / `navbar` / `footer`.

**Schreibsemantik — YAML-minimale Überschreibung**: PUT schreibt ausschließlich die im Request-Body deklarierten Schlüssel (rekursiver Patch); nicht deklarierte Felder tauchen im YAML nicht auf und erben zur Laufzeit die Theme-Defaults. Arrays werden vollständig ersetzt. Du kannst also unbesorgt einen einzelnen Feldwert senden, ohne die übrige Konfiguration zu beschädigen.

## GET /api/settings/:domain

Liest den aktuellen Wert des Konfigurationsbereichs (genauer: die im YAML deklarierten Überschreibungen; nicht deklarierte Schlüssel erscheinen nicht in der Rückgabe).

```bash
curl http://127.0.0.1:5175/api/settings/site
```

Wesentliche Rückgaben je Bereich:

| Bereich | Datei | Rückgabestruktur |
|----------|--------|------------------|
| `site` | `config/site.yaml` | `SiteSettings`, zusätzlich das schreibgeschützte `themeFavicon[]` (die Theme-Standard-favicons — die tatsächlich wirksamen Symbole, solange das Content-Repository nichts überschreibt; wird **nie** zurückschreiben) |
| `profile` | `config/profile.yaml` | `{ avatar?, name?, bio?, links?: { name, icon, url }[] }` |
| `navbar` | `config/nav-bar.yaml` | `{ links?: NavBarLink[] }` |
| `footer` | `config/footer.yaml` + `config/footer.html` | `{ enable: boolean, html: string }` — `html` ist immer ein String (`""`, falls die Datei fehlt) |

## PUT /api/settings/site

Schreibt `site.yaml`. Alle Felder des Request-Bodys sind optional; zod prüft Enumerationen und Wertebereiche strikt:

| Feld | Typ | Einschränkung |
|------|-----|---------------|
| `site` / `base` / `title` | `string` | nicht leer |
| `subtitle` | `string` | — |
| `lang` | Enumeration | `en / zh_CN / zh_TW / ja / ko / es / th / vi / tr / id` |
| `i18n` | `{ enable?, locales? }` | `locales` mit mindestens einem Eintrag, alle aus der lang-Enumeration |
| `timeZone` | `string` | ≥2 Zeichen (z. B. `Asia/Shanghai`) |
| `displaySettings` | `Record<string, boolean>` | Schlüssel beschränkt auf `colorStyle / colorSpec / wallpaperMode / layoutMode / reduceMotion / texture` |
| `themeColor` | `{ hue?, fixed?, style?, spec? }` | `hue` Ganzzahl 0–360; `style` einer von 9 (tonalSpot/vibrant/content/expressive/rainbow/fruitSalad/monochrome/neutral/fidelity); `spec` 2021 oder 2025 |
| `wallpaperMode` | `{ defaultMode? }` | `banner / none` |
| `texture` | `{ enable?, defaultPreset?, defaultOpacity?, allowMotion? }` | preset einer von 6 (none/starlight/cyber-dots/topography/geometric/sakura); opacity 0.05–0.25 |
| `banner` | siehe unten | die vollständige Banner-Struktur |
| `favicon` | `{ src, theme }[]` | `theme` ist `light / dark` |

Die Unterstruktur von `banner`: `src.desktop[] / src.mobile[]` (Arrays der Wallpaper-Pfade), `position` (top/center/bottom), `dim`, `homeText` (Titel + Untertitel-Array + `typewriter`-Geschwindigkeitsgruppe), `carousel` (interval ≥3000ms, fadeDuration, sechs Animationen), `waves`.

**Nebenwirkung**: nach dem Speichern des Banners werden lokale Wallpaper-Dateien, auf die keine der beiden Seiten mehr verweist, **automatisch gelöscht**. **Rückgabewert**: das vollständige aktualisierte `site.yaml`.

```bash
curl -X PUT http://127.0.0.1:5175/api/settings/site \
  -H "Content-Type: application/json" \
  -d '{"title":"我的博客","themeColor":{"hue":260}}'
```

## PUT /api/settings/profile

Schreibt `profile.yaml`; Felder: `avatar` / `name` / `bio` / `links[]` (je Eintrag sind `name` und `url` Pflicht, `icon` darf leer bleiben).

```bash
curl -X PUT http://127.0.0.1:5175/api/settings/profile \
  -H "Content-Type: application/json" \
  -d '{"name":"Shirone","bio":"写代码也写故事"}'
```

## PUT /api/settings/navbar

Schreibt `nav-bar.yaml`. Body: `{ links?: NavBarLink[] }` — ohne `links` ist die Anfrage eine Nulloperation und gibt einfach den aktuellen Wert zurück. Je `NavBarLink`: `preset` (Theme-Vorgabename, z. B. `home`) / `name` / `icon` / `url` / `external` / `children[]` (rekursiv gleich aufgebaut, für Dropdown-Gruppen). **Arrays werden vollständig ersetzt**.

```bash
curl -X PUT http://127.0.0.1:5175/api/settings/navbar \
  -H "Content-Type: application/json" \
  -d '{"links":[{"name":"关于","url":"/about/"}]}'
```

## PUT /api/settings/footer

Schreibt die Fußzeile: `enable` (nach `footer.yaml`) und `html` (**rohwörtlich** nach `footer.html`, nur ohne nachgestellte Leerzeichen). Beide Felder lassen sich weglassen und wirken jeweils unabhängig. **Rückgabewert** `{ enable, html }`.

```bash
curl -X PUT http://127.0.0.1:5175/api/settings/footer \
  -H "Content-Type: application/json" \
  -d '{"enable":true,"html":"<p>自定义页脚内容</p>"}'
```
