---
title: Importación de Jianshu
description: Referencia de la API /api/import/jianshu/* — sesiones de paquetes exportados, tareas de importación en segundo plano, conversión de pegado individual y sugerencias de metadatos con IA.
---

# Importación de Jianshu

Dos grupos de endpoints para la migración desde Jianshu: el **flujo de paquete exportado** (basado en sesiones: subir → inventario → vista previa → tarea en segundo plano) y el **flujo de pegado individual** (sin sesión; pegas y conviertes al momento).

Sesiones y tareas viven en **memoria del servidor**: las sesiones son válidas 24 horas con un máximo de 3 (expulsión LRU) y los resultados de tareas se conservan 1 hora; al reiniciar el servicio se vacían — los artículos ya importados no se ven afectados (llevan mucho tiempo en el repositorio).

## POST /api/import/jianshu/archive

Sube el paquete exportado de Jianshu (multipart).

| Campo del formulario | Obligatorio | Nota |
|----------|------|------|
| `file` | Sí | Comprimido rar / zip, ≤30MB |

**Efectos secundarios**: descomprime y analiza en memoria (sin escribir a disco). **Valor de retorno** `JianshuArchiveSummary`:

```json
{
  "sessionId": "s-xxxx",
  "notebooks": [{ "name": "技术随笔", "articles": [{ "id": "技术随笔/a.md", "title": "标题", "bytes": 8213 }] }],
  "total": 42,
  "importedIds": ["技术随笔/a.md"]
}
```

`id` es el identificador único dentro de la sesión (ruta normalizada dentro del paquete); los ensayos sueltos en la raíz van a «未分组» (sin grupo).

```bash
curl -X POST http://127.0.0.1:5175/api/import/jianshu/archive \
  -F "file=@jianshu-export.zip"
```

## GET /api/import/jianshu/preview

Vista previa de la conversión de un artículo; **no escribe en disco** y las imágenes conservan el enlace remoto.

| Parámetro Query | Obligatorio | Nota |
|------------|------|------|
| `sessionId` | Sí | Id de sesión devuelto por el paso anterior |
| `id` | Sí | Id del artículo |

**Valor de retorno** `JianshuPreview`: `{ title, markdown, imageCount, wordCount }` — `wordCount` es el número de caracteres del texto plano del cuerpo (una cifra baja sugiere que quizá solo quedó contenido de relleno).

```bash
curl "http://127.0.0.1:5175/api/import/jianshu/preview?sessionId=s-xxxx&id=技术随笔/a.md"
```

## POST /api/import/jianshu/run

Arranca la **tarea de importación en segundo plano**; devuelve de inmediato y el progreso se consulta por sondeo.

| Campo Body | Tipo | Obligatorio | Nota |
|-----------|------|------|------|
| `sessionId` | `string` | Sí | Id de sesión |
| `ids` | `string[]` | Sí | Ids de artículos a importar, 1–2000 |
| `options.published` | `string` | Sí | Fecha de publicación común `YYYY-MM-DD` (el paquete exportado no trae fechas) |
| `options.categoryFromNotebook` | `boolean` | Sí | El nombre de la colección como categoría |
| `options.category` | `string` | No | Categoría común cuando no se usa la colección (≤40 caracteres) |
| `options.tags` | `string[]` | Sí | Etiquetas comunes (≤12, cada una ≤30 caracteres) |
| `options.localizeImages` | `boolean` | Sí | Descargar imágenes al repositorio (las que fallen conservan el enlace remoto) |
| `options.draft` | `boolean` | Sí | Importar como borrador |

**Valor de retorno** `{ jobId }`. **Efectos secundarios**: escribe uno a uno los `content/posts/<slug>/index.md` y descarga las imágenes.

```bash
curl -X POST http://127.0.0.1:5175/api/import/jianshu/run \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"s-xxxx","ids":["技术随笔/a.md"],"options":{"published":"2026-09-10","categoryFromNotebook":true,"tags":["migración-jianshu"],"localizeImages":true,"draft":true}}'
```

## GET /api/import/jianshu/job

Sondea el progreso de la tarea (se recomienda un intervalo de 2 segundos).

| Parámetro Query | Obligatorio | Nota |
|------------|------|------|
| `id` | Sí | Id de la tarea |

**Valor de retorno** `JianshuImportJob`: `{ id, sessionId, status: "running" | "done", total, done, current, results, log }`. Cada elemento de `results`: `{ id, title, ok, path?, error?, images }`; `log` conserva las últimas 200 líneas.

```bash
curl "http://127.0.0.1:5175/api/import/jianshu/job?id=job-xxxx"
```

## DELETE /api/import/jianshu/session

Descarta la sesión (vacía la caché del paquete). Se rechaza si hay una tarea en marcha.

| Parámetro Query | Obligatorio | Nota |
|------------|------|------|
| `id` | Sí | Id de sesión |

**Valor de retorno** `{ ok: boolean }`.

```bash
curl -X DELETE "http://127.0.0.1:5175/api/import/jianshu/session?id=s-xxxx"
```

## POST /api/import/jianshu/paste-preview

**Vista previa de conversión** del pegado individual (sin escribir a disco). Al menos una de las tres cargas debe ir no vacía, cada una ≤2MB; prioridad de análisis: **markdown (versión final del editor) > html (texto enriquecido) > text (el texto plano se procesa como Markdown de rescate)**.

| Campo Body | Tipo | Obligatorio | Nota |
|-----------|------|------|------|
| `markdown` | `string` | Uno de tres | Versión final del editor; prioridad de uso |
| `html` | `string` | Uno de tres | Texto enriquecido (copiado de la web), convertido a Markdown |
| `text` | `string` | Uno de tres | Rescate con texto plano |

**Valor de retorno** igual que `JianshuPreview`.

```bash
curl -X POST http://127.0.0.1:5175/api/import/jianshu/paste-preview \
  -H "Content-Type: application/json" \
  -d '{"html":"<h1>Título</h1><p>Párrafo</p>"}'
```

## POST /api/import/jianshu/paste-run

**Archiva en el repositorio** el pegado individual: las imágenes se descargan automáticamente al directorio del artículo (las que fallen conservan el enlace remoto).

Body = carga pegada (como arriba) + `options`:

| Campo | Restricción |
|------|------|
| `title` | Obligatorio, 1–100 caracteres |
| `published` | Obligatorio, `YYYY-MM-DD` |
| `category` | Opcional, ≤40 caracteres |
| `tags` | ≤12, cada una ≤30 caracteres |
| `draft` | boolean |

**Valor de retorno** `JianshuPasteResult`: `{ title, path, slug, images, failedImages[] }` — `images` es el número de imágenes localizadas con éxito y `failedImages` las que conservaron el enlace remoto.

```bash
curl -X POST http://127.0.0.1:5175/api/import/jianshu/paste-run \
  -H "Content-Type: application/json" \
  -d '{"markdown":"# Título\nCuerpo","options":{"title":"Título","published":"2026-09-10","tags":[],"draft":true}}'
```

## POST /api/import/jianshu/suggest-meta

La IA analiza el cuerpo y completa los metadatos (si no está activada o falla, recurre al resumen del texto con `aiUsed=false`).

| Campo Body | Tipo | Obligatorio | Nota |
|-----------|------|------|------|
| `title` | `string` | No | Vacío = dejar que la IA proponga también el título, ≤100 caracteres |
| `markdown` | `string` | Sí | Cuerpo del texto, 1–2MB |

**Valor de retorno** `JianshuMetaSuggestion`: `{ title?, description, category, tags[], aiUsed }`.

```bash
curl -X POST http://127.0.0.1:5175/api/import/jianshu/suggest-meta \
  -H "Content-Type: application/json" \
  -d '{"title":"","markdown":"# La crónica de cómo monté mi blog\n…"}'
```
