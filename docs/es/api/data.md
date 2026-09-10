---
title: Datos estructurados
description: Referencia de la API de lectura y escritura de los ocho tipos de datos estructurados en /api/data/:kind, y de la búsqueda de entradas de animes e importación de portadas en /api/bangumi/*.
---

# Datos estructurados

El módulo de datos estructurados lee y escribe `data/*.ts` del repositorio de contenido — las `interface`, los comentarios y las sentencias export del archivo se **conservan letra por letra**; solo se sustituye íntegramente el literal del array exportado. La lectura pasa por import dinámico con tsx (con query de mtime para esquivar la caché); los campos de enumerado se validan antes de guardar.

## Correspondencia kind-archivo

El parámetro de ruta `kind` admite ocho valores:

| `kind` | Archivo | Array exportado | Elementos |
|--------|------|----------|------|
| `projects` | `data/projects.ts` | `projectsData` | Proyectos |
| `skills` | `data/skills.ts` | `skillsData` | Habilidades |
| `timeline` | `data/timeline.ts` | `timelineData` | Eventos de línea de tiempo |
| `devices` | `data/devices.ts` | `devicesData` | Dispositivos |
| `anime` | `data/anime.ts` | `animeData` | Animes |
| `compass` | `data/compass.ts` | `compassData` | Estanterías de la brújula |
| `music` | `data/music.ts` | `musicTracks` | Pistas de la lista de reproducción |
| `friends` | `data/friends.ts` | `friendsData` | Enlaces de amigos |

## GET /api/data/:kind

**Valor de retorno** `{ kind, items: DataItem[] }` — `DataItem` es un objeto de tipado débil (la estructura de campos está en la interface de cada archivo, o en la tabla de campos de la [Guía · Datos estructurados](../guide/data.md#las-ocho-categorias-de-datos)).

```bash
curl http://127.0.0.1:5175/api/data/friends
```

## PUT /api/data/:kind

**Sustituye por completo** todos los elementos de ese tipo de dato.

| Campo Body | Tipo | Obligatorio | Nota |
|-----------|------|------|------|
| `items` | `object[]` | Sí | Elementos completos (haz GET, modifica y luego PUT; no envíes solo el incremento) |

**Valor de retorno** `{ ok: true, changed }`. **Efectos secundarios**: reescribe el tramo del array en `data/*.ts`; el resto del archivo queda intacto.

```bash
curl -X PUT http://127.0.0.1:5175/api/data/skills \
  -H "Content-Type: application/json" \
  -d '{"items":[{"name":"TypeScript","category":"frontend","level":"advanced","enable":true}]}'
```

---

# Búsqueda de animes en Bangumi

El trío de la importación de animes, con datos de la API pública de Bangumi, para autocompletar entradas de animes.

## GET /api/bangumi/search

| Parámetro Query | Obligatorio | Nota |
|------------|------|------|
| `keyword` | Sí | Palabra clave, 1–100 caracteres (busca siempre entradas del tipo animación) |

**Valor de retorno** `{ candidates: BangumiCandidate[] }` — cada elemento incluye `id` (subject id de Bangumi), `title` / `originalTitle`, `year`, `cover?`, `summary`, `eps`, `bangumiScore?`, `link`.

```bash
curl "http://127.0.0.1:5175/api/bangumi/search?keyword=葬送的芙莉莲"
```

## GET /api/bangumi/subject

| Parámetro Query | Obligatorio | Nota |
|------------|------|------|
| `id` | Sí | Subject id de Bangumi (entero positivo; también vale como cadena) |

**Valor de retorno** `BangumiDetail`: completa el Candidate con `studio?` (estudio), `period?` (periodo de emisión `{ start, end? }`), `genres[]` (etiquetas de género más frecuentes, ≤4).

```bash
curl "http://127.0.0.1:5175/api/bangumi/subject?id=463652"
```

## POST /api/bangumi/cover-import

Importación de la imagen de portada: el servidor la descarga del CDN de Bangumi y la archiva en `public/assets/anime/` con el título de la entrada como nombre.

| Campo Body | Tipo | Obligatorio | Nota |
|-----------|------|------|------|
| `url` | `string` | Sí | Enlace directo de la portada. **Validación de lista blanca**: solo acepta `lain.bgm.tv` / `api.bgm.tv` / `bgm.tv` / `bangumi.tv` / `ei.hdslb.com`; el resto, 400 |
| `title` | `string` | Sí | Título de la entrada (1–200 caracteres, usado para nombrar) |
| `currentPath` | `string` | No | Si coincide con el mismo directorio, sustituye en el sitio |

**Valor de retorno** `MediaUploadResult`.

```bash
curl -X POST http://127.0.0.1:5175/api/bangumi/cover-import \
  -H "Content-Type: application/json" \
  -d '{"url":"https://lain.bgm.tv/pic/cover/l/xx.jpg","title":"葬送的芙莉莲"}'
```
