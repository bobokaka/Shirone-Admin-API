---
title: Paramètres du site
description: Référence des interfaces /api/settings/:domain — lecture/écriture des quatre domaines de réglages (site/profile/navbar/footer), sémantique de recouvrement minimal YAML.
---

# Paramètres du site

Le module de paramètres lit et écrit `config/*.yaml` du dépôt de contenu. Le paramètre de chemin `domain` prend une de quatre valeurs : `site` / `profile` / `navbar` / `footer`.

**Sémantique d'écriture — recouvrement minimal YAML** : PUT n'écrit que les clés déclarées dans le corps de requête (patch récursif) ; les champs non déclarés n'apparaissent pas dans le YAML et héritent à l'exécution des valeurs par défaut du thème. Les tableaux sont remplacés intégralement. Vous pouvez donc envoyer sereinement un seul champ sans casser le reste de la configuration.

## GET /api/settings/:domain

Lit la valeur courante du domaine (les remplacements déclarés dans le YAML ; les clés non déclarées ne figurent pas dans le retour).

```bash
curl http://127.0.0.1:5175/api/settings/site
```

L'essentiel du retour par domaine :

| Domaine | Fichier correspondant | Structure renvoyée |
|----|----------|----------|
| `site` | `config/site.yaml` | `SiteSettings`, plus la lecture seule `themeFavicon[]` (favicon par défaut du thème, effectivement appliqué tant que le dépôt de contenu ne l'a pas remplacé ; **jamais** réécrit) |
| `profile` | `config/profile.yaml` | `{ avatar?, name?, bio?, links?: { name, icon, url }[] }` |
| `navbar` | `config/nav-bar.yaml` | `{ links?: NavBarLink[] }` |
| `footer` | `config/footer.yaml` + `config/footer.html` | `{ enable: boolean, html: string }` — `html` toujours une chaîne (`""` si le fichier est absent) |

## PUT /api/settings/site

Écrit `site.yaml`. Tous les champs du corps sont facultatifs, zod valide strictement énumérations et plages :

| Champ | Type | Contrainte |
|------|------|------|
| `site` / `base` / `title` | `string` | non vide |
| `subtitle` | `string` | — |
| `lang` | énumération | `en / zh_CN / zh_TW / ja / ko / es / th / vi / tr / id` |
| `i18n` | `{ enable?, locales? }` | `locales` au moins un élément, tous dans l'énumération lang |
| `timeZone` | `string` | ≥ 2 caractères (ex. `Asia/Shanghai`) |
| `displaySettings` | `Record<string, boolean>` | clés limitées à `colorStyle / colorSpec / wallpaperMode / layoutMode / reduceMotion / texture` |
| `themeColor` | `{ hue?, fixed?, style?, spec? }` | `hue` entier 0–360 ; `style` un des 9 (tonalSpot/vibrant/content/expressive/rainbow/fruitSalad/monochrome/neutral/fidelity) ; `spec` 2021 ou 2025 |
| `wallpaperMode` | `{ defaultMode? }` | `banner / none` |
| `texture` | `{ enable?, defaultPreset?, defaultOpacity?, allowMotion? }` | preset un des six (none/starlight/cyber-dots/topography/geometric/sakura) ; opacity 0.05–0.25 |
| `banner` | voir ci-dessous | structure complète de la bannière |
| `favicon` | `{ src, theme }[]` | `theme` vaut `light / dark` |

Sous-structure `banner` : `src.desktop[] / src.mobile[]` (tableaux de chemins de fonds), `position` (top/center/bottom), `dim`, `homeText` (titre + tableau de sous-titres + groupe de vitesses `typewriter`), `carousel` (interval ≥ 3000 ms, fadeDuration, six animations), `waves`.

**Effets de bord** : après l'enregistrement de la bannière, les fichiers locaux de fonds **plus référencés par aucun des deux côtés sont supprimés automatiquement**. **Valeur de retour** : l'intégralité de `site.yaml` mise à jour.

```bash
curl -X PUT http://127.0.0.1:5175/api/settings/site \
  -H "Content-Type: application/json" \
  -d '{"title":"我的博客","themeColor":{"hue":260}}'
```

## PUT /api/settings/profile

Écrit `profile.yaml`, champs : `avatar` / `name` / `bio` / `links[]` (`name` et `url` requis par élément, `icon` facultatif).

```bash
curl -X PUT http://127.0.0.1:5175/api/settings/profile \
  -H "Content-Type: application/json" \
  -d '{"name":"Shirone","bio":"写代码也写故事"}'
```

## PUT /api/settings/navbar

Écrit `nav-bar.yaml`. Corps : `{ links?: NavBarLink[] }` — sans `links`, aucune action, renvoie simplement la valeur courante. Chaque `NavBarLink` : `preset` (nom de préréglage du thème, ex. `home`) / `name` / `icon` / `url` / `external` / `children[]` (structure récursive identique, pour les groupes déroulants). **Remplacement intégral du tableau**.

```bash
curl -X PUT http://127.0.0.1:5175/api/settings/navbar \
  -H "Content-Type: application/json" \
  -d '{"links":[{"name":"关于","url":"/about/"}]}'
```

## PUT /api/settings/footer

Écrit le pied de page : `enable` (dans `footer.yaml`) et `html` (écrit **tel quel** dans `footer.html`, seul l'espace de fin est retiré). Les deux champs sont facultatifs et indépendants. **Valeur de retour** `{ enable, html }`.

```bash
curl -X PUT http://127.0.0.1:5175/api/settings/footer \
  -H "Content-Type: application/json" \
  -d '{"enable":true,"html":"<p>自定义页脚内容</p>"}'
```
