---
title: Subida de medios
description: Referencia de todos los endpoints de subida en /api/media/* — imágenes de artículos, imágenes de momentos, imágenes del sitio, portadas de datos y audio de música, con el mapeo de directorios de destino por target/kind.
---

# Subida de medios

El módulo de medios gestiona todo archivo binario que cae al repositorio. Todos los endpoints de subida son **formulario multipart**, un archivo por vez, ≤30MB por archivo; lista blanca de extensiones de imagen `webp / png / jpg / jpeg / gif / avif` (el favicon admite además `ico / svg`).

Directorios de destino de cada endpoint (todos dentro del repositorio de contenido):

| Escenario | Directorio |
|------|------|
| Imágenes de artículos | `content/posts/<slug>/images/` |
| Imágenes de momentos | `public/images/moments/<lote>/` |
| Banner (escritorio/móvil) | `assets/images/banner/desktop/`, `assets/images/banner/mobile/` |
| Avatar | `assets/images/avatar/` |
| Imágenes del pie de página | `public/images/footer/` |
| favicon | `public/favicon/` |
| Portadas de datos | según kind, ver la [tabla de abajo](#post-api-media-data-cover) |
| Audio de canciones | `public/assets/music/url/` |

## POST /api/media/post-image

Subida de imágenes de artículos; se guardan en el `images/` del directorio del artículo indicado.

| Campo del formulario | Obligatorio | Nota |
|----------|------|------|
| `file` | Sí | Archivo de imagen |
| `slug` | Sí | Slug del artículo (determina el directorio de destino) |

**Valor de retorno** `MediaUploadResult`: `{ src, fileName }` — `src` es la ruta de referencia para frontmatter / cuerpo (ruta relativa `./images/<name>`), lista para insertar directamente en el Markdown.

```bash
curl -X POST http://127.0.0.1:5175/api/media/post-image \
  -F "slug=hello" -F "file=@cover.webp"
```

## POST /api/media/moment-image

Subida de imágenes de momentos; se guardan en `public/images/moments/<lote>/`. La regla del directorio de lote la dicta el pipeline de miniaturas del tema y **no puede soslayarse**.

| Campo del formulario | Obligatorio | Nota |
|----------|------|------|
| `file` | Sí | Archivo de imagen |
| `batchId` | No | Nombre del directorio de lote (`[\w-]+`, p. ej. `20260910-103000`); si falta, el servidor lo genera con la hora actual |

**Valor de retorno** `MediaUploadResult`: `{ src, fileName, batchId? }` — `src` es la ruta absoluta del sitio (`/images/moments/<lote>/<name>`); reutiliza el `batchId` devuelto para agrupar en el mismo lote.

```bash
curl -X POST http://127.0.0.1:5175/api/media/moment-image \
  -F "batchId=20260910-103000" -F "file=@photo.webp"
```

## GET /api/media/site-images

Listado del directorio de imágenes hospedadas del sitio (escenarios como la biblioteca de imágenes del pie).

| Parámetro Query | Obligatorio | Nota |
|------------|------|------|
| `target` | Sí | Identificador de directorio, 1–40 caracteres (p. ej. `footer`) |

**Valor de retorno** `SiteMediaResult[]`: cada elemento `{ src, previewUrl, fileName }`.

```bash
curl "http://127.0.0.1:5175/api/media/site-images?target=footer"
```

## POST /api/media/site-image

Subida de imágenes del sitio (multipart).

| Campo del formulario | Obligatorio | Nota |
|----------|------|------|
| `file` | Sí | Archivo de imagen |
| `target` | Sí | `banner-desktop` / `banner-mobile` / `avatar` / `footer` / `favicon` |
| `name` | No | Nombre de archivo fijo (para sustituir el hueco del favicon, p. ej. `favicon-light`) |
| `currentSrc` | No | Valor actual del campo; si apunta al mismo directorio hospedado del target, **sustituye en el sitio** el archivo antiguo (así funciona actualizar el avatar) |

**Valor de retorno** `SiteMediaResult`: `src` es la ruta escrita en el YAML, `previewUrl` el enlace directo de vista previa del panel.

```bash
curl -X POST http://127.0.0.1:5175/api/media/site-image \
  -F "target=avatar" -F "currentSrc=assets/images/avatar/old.webp" -F "file=@me.webp"
```

## POST /api/media/site-image-import

**Importación por enlace directo remoto** de imágenes del sitio: el servidor lo descarga por ti (esquivando las restricciones de origen cruzado del navegador) y lo archiva vía site-image; los webp se convierten automáticamente a png/jpg (compatibilidad del tema).

| Campo Body | Tipo | Obligatorio | Nota |
|-----------|------|------|------|
| `target` | `string` | Sí | Igual que site-image |
| `url` | `string` | Sí | Enlace directo http(s) público, ≤2000 caracteres |
| `name` | `string` | No | Nombre de archivo impuesto |
| `currentSrc` | `string` | No | Destino de la sustitución en el sitio |

**Valor de retorno** igual que `SiteMediaResult`.

```bash
curl -X POST http://127.0.0.1:5175/api/media/site-image-import \
  -H "Content-Type: application/json" \
  -d '{"target":"footer","url":"https://example.com/badge.png"}'
```

## POST /api/media/data-cover

Subida de portadas de datos estructurados (multipart). El kind determina el directorio de destino:

| `kind` | Directorio |
|--------|------|
| `anime` | `public/assets/anime/` |
| `projects` | `public/assets/projects/` |
| `devices` | `public/images/devices/` |
| `friends` | `public/images/friends/` |
| `music` | `assets/images/music/` |

| Campo del formulario | Obligatorio | Nota |
|----------|------|------|
| `file` | Sí | Archivo de imagen |
| `kind` | Sí | Uno de los cinco de la tabla |
| `path` | No | Ruta de la portada del elemento actual; si coincide con el mismo directorio, **sobrescribe en el sitio** (sustituir la imagen no deja archivos viejos) |

**Valor de retorno** `MediaUploadResult`.

```bash
curl -X POST http://127.0.0.1:5175/api/media/data-cover \
  -F "kind=anime" -F "file=@cover.webp"
```

## POST /api/media/data-cover-import

Importación por enlace directo remoto de portadas de datos (escenarios como portadas de CDN halladas por la IA); kind y directorios como arriba.

| Campo Body | Tipo | Obligatorio | Nota |
|-----------|------|------|------|
| `kind` | `string` | Sí | Una de las cinco opciones del enumerado |
| `url` | `string` | Sí | Enlace directo, ≤2000 caracteres |
| `title` | `string` | No | Para generar un nombre de archivo legible |
| `currentPath` | `string` | No | Destino de la sobrescritura en el sitio |

```bash
curl -X POST http://127.0.0.1:5175/api/media/data-cover-import \
  -H "Content-Type: application/json" \
  -d '{"kind":"music","url":"https://cdn.example.com/track-cover.jpg","title":"Soleado"}'
```

## POST /api/media/music-audio

Subida local de audio de canciones (multipart) → `public/assets/music/url/`.

| Campo del formulario | Obligatorio | Nota |
|----------|------|------|
| `file` | Sí | Archivo de audio |
| `currentSrc` | No | Destino de la sustitución en el sitio |

```bash
curl -X POST http://127.0.0.1:5175/api/media/music-audio \
  -F "file=@song.mp3"
```

## POST /api/media/music-download

Descarga desde el servidor por **enlace directo remoto** de audio de canciones y archivo en el repositorio (descarga incluso lo inaccesible para el navegador por origen cruzado).

| Campo Body | Tipo | Obligatorio | Nota |
|-----------|------|------|------|
| `url` | `string` | Sí | Enlace directo del audio, ≤2000 caracteres |
| `filename` | `string` | No | Nombre de archivo impuesto |
| `currentPath` | `string` | No | Destino de la sustitución en el sitio |

```bash
curl -X POST http://127.0.0.1:5175/api/media/music-download \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com/song.mp3"}'
```
