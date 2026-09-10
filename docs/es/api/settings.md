---
title: Ajustes del sitio
description: Referencia de la API de lectura y escritura de los cuatro dominios de configuración (site/profile/navbar/footer) en /api/settings/:domain, con semántica de sobrescritura mínima de YAML.
---

# Ajustes del sitio

El módulo de ajustes del sitio lee y escribe `config/*.yaml` del repositorio de contenido. El parámetro de ruta `domain` admite cuatro valores: `site` / `profile` / `navbar` / `footer`.

**Semántica de escritura — sobrescritura mínima de YAML**: PUT escribe solo las claves declaradas en el cuerpo de la petición (parche recursivo); los campos no declarados no aparecen en el YAML y heredan en tiempo de ejecución los valores por defecto del tema. Los arrays se sustituyen por completo. Esto significa que puedes enviar tranquilamente un solo campo sin romper el resto de la configuración.

## GET /api/settings/:domain

Lee el valor actual del dominio (es decir, las anulaciones declaradas en el YAML; las claves no declaradas no figuran en la respuesta).

```bash
curl http://127.0.0.1:5175/api/settings/site
```

Lo esencial de la respuesta por dominio:

| Dominio | Archivo correspondiente | Estructura devuelta |
|----|----------|----------|
| `site` | `config/site.yaml` | `SiteSettings`, más el campo de solo lectura `themeFavicon[]` (favicons por defecto del tema, el icono vigente cuando el repositorio de contenido no lo anula; **no** se reescribe) |
| `profile` | `config/profile.yaml` | `{ avatar?, name?, bio?, links?: { name, icon, url }[] }` |
| `navbar` | `config/nav-bar.yaml` | `{ links?: NavBarLink[] }` |
| `footer` | `config/footer.yaml` + `config/footer.html` | `{ enable: boolean, html: string }` — html es siempre una cadena (`""` si falta el archivo) |

## PUT /api/settings/site

Escribe `site.yaml`. Todos los campos del cuerpo son opcionales; zod valida estrictamente enumerados y rangos:

| Campo | Tipo | Restricción |
|------|------|------|
| `site` / `base` / `title` | `string` | No vacío |
| `subtitle` | `string` | — |
| `lang` | enumerado | `en / zh_CN / zh_TW / ja / ko / es / th / vi / tr / id` |
| `i18n` | `{ enable?, locales? }` | `locales` con al menos un elemento, todos del enumerado lang |
| `timeZone` | `string` | ≥2 caracteres (p. ej. `Asia/Shanghai`) |
| `displaySettings` | `Record<string, boolean>` | Claves limitadas a `colorStyle / colorSpec / wallpaperMode / layoutMode / reduceMotion / texture` |
| `themeColor` | `{ hue?, fixed?, style?, spec? }` | `hue` entero 0–360; `style` uno de 9 (tonalSpot/vibrant/content/expressive/rainbow/fruitSalad/monochrome/neutral/fidelity); `spec` 2021 o 2025 |
| `wallpaperMode` | `{ defaultMode? }` | `banner / none` |
| `texture` | `{ enable?, defaultPreset?, defaultOpacity?, allowMotion? }` | preset uno de seis (none/starlight/cyber-dots/topography/geometric/sakura); opacity 0.05–0.25 |
| `banner` | ver abajo | Estructura completa del banner |
| `favicon` | `{ src, theme }[]` | `theme` es `light / dark` |

Subestructura de `banner`: `src.desktop[] / src.mobile[]` (arrays de rutas de fondos), `position` (top/center/bottom), `dim`, `homeText` (título + array de subtítulos + grupo de velocidades `typewriter`), `carousel` (interval ≥3000ms, fadeDuration, seis animaciones), `waves`.

**Efectos secundarios**: tras guardar el banner, los archivos locales de fondo **que ninguna de las dos puntas vuelva a referenciar se eliminan automáticamente**. **Valor de retorno**: la totalidad de `site.yaml` actualizado.

```bash
curl -X PUT http://127.0.0.1:5175/api/settings/site \
  -H "Content-Type: application/json" \
  -d '{"title":"Mi blog","themeColor":{"hue":260}}'
```

## PUT /api/settings/profile

Escribe `profile.yaml`; campos: `avatar` / `name` / `bio` / `links[]` (en cada elemento, `name` y `url` obligatorios, `icon` opcional).

```bash
curl -X PUT http://127.0.0.1:5175/api/settings/profile \
  -H "Content-Type: application/json" \
  -d '{"name":"Shirone","bio":"Escribo código y también historias"}'
```

## PUT /api/settings/navbar

Escribe `nav-bar.yaml`. Body: `{ links?: NavBarLink[] }` — sin `links`, no hace nada y devuelve el valor actual. Cada `NavBarLink`: `preset` (nombre del preset del tema, p. ej. `home`) / `name` / `icon` / `url` / `external` / `children[]` (recursivo, para grupos desplegables). **El array se sustituye por completo**.

```bash
curl -X PUT http://127.0.0.1:5175/api/settings/navbar \
  -H "Content-Type: application/json" \
  -d '{"links":[{"name":"Acerca de","url":"/about/"}]}'
```

## PUT /api/settings/footer

Escribe el pie de página: `enable` (a `footer.yaml`) y `html` (escrito **tal cual** en `footer.html`, solo se recortan los blancos finales). Ambos campos pueden omitirse y surten efecto por separado. **Valor de retorno** `{ enable, html }`.

```bash
curl -X PUT http://127.0.0.1:5175/api/settings/footer \
  -H "Content-Type: application/json" \
  -d '{"enable":true,"html":"<p>Contenido personalizado del pie</p>"}'
```
