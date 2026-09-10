---
title: Artículos
description: "Referencia de la API de artículos: CRUD en /api/posts, sugerencia de slug en /api/slug y reescritura por lotes de categorías y etiquetas en /api/taxonomy/rename."
---

# Artículos

El módulo de artículos opera directamente sobre `content/posts/` del repositorio de contenido. Todos los parámetros de ruta son rutas estilo POSIX relativas a ese directorio. La lista va **con fijados primero y por fecha de publicación descendente**.

## GET /api/posts

Devuelve la lista completa de metadatos de artículos (sin el cuerpo).

**Valor de retorno** `PostMeta[]`; campos clave de cada elemento:

| Campo | Tipo | Nota |
|------|------|------|
| `slug` | `string` | Nombre del directorio (artículos con directorio) o nombre de archivo sin `.md` |
| `path` | `string` | Ruta relativa, p. ej. `hello/index.md` |
| `layout` | `"directory" \| "file"` | Con directorio / plano |
| `title` / `published` / `description` / `image` / `category` / `tags` | — | Metadatos; `published` en formato `YYYY-MM-DD` |
| `publishedAt` / `updated` / `updatedAt` | `string?` | Hora exacta y hora de actualización |
| `pinned` / `draft` / `comment` / `encrypted` / `hideHomeContent` | `boolean` | Interruptores |
| `hasPassword` | `boolean` | Si tiene contraseña establecida (**la contraseña en sí nunca se devuelve**) |
| `passwordHint` | `string` | Pista de la contraseña |
| `alias` / `permalink` | `string?` | Rutas de acceso personalizadas |

```bash
curl http://127.0.0.1:5175/api/posts
```

## GET /api/posts/detail

Lee el contenido completo de un artículo.

| Parámetro Query | Obligatorio | Nota |
|------------|------|------|
| `path` | Sí | Ruta relativa del artículo |

**Valor de retorno** `PostFile`: `{ meta: PostMeta, body: string }`. Si la ruta no existe, `404`.

```bash
curl "http://127.0.0.1:5175/api/posts/detail?path=hello/index.md"
```

## POST /api/posts

Crea un artículo (en **estado de borrador**). Con directorio, se escribe en disco como `content/posts/<slug>/index.md`.

| Campo Body | Tipo | Obligatorio | Por defecto | Nota |
|-----------|------|------|------|------|
| `title` | `string` | Sí | — | Título; no puede quedar vacío |
| `slug` | `string` | No | transcrito del título a pinyin | Nombre de directorio personalizado; los caracteres ilegales se limpian solos y los duplicados se resuelven |

**Valor de retorno** `PostFile` (el artículo recién creado). **Efectos secundarios**: crea el directorio y el `index.md` en el repositorio de contenido; si no se pasa `slug`, se deduplica contra los artículos existentes.

```bash
curl -X POST http://127.0.0.1:5175/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Mi primer artículo"}'
```

## PUT /api/posts

Guarda un artículo. El frontmatter se **reescribe por fusión**: solo se actualizan las claves presentes en `meta`, el cuerpo se sustituye entero; la serialización garantiza que formatos de fecha como `published` no cambien.

| Campo Body | Tipo | Obligatorio | Por defecto | Nota |
|-----------|------|------|------|------|
| `path` | `string` | Sí | — | Ruta del artículo destino |
| `body` | `string` | No | `""` | Cuerpo completo (sustitución íntegra) |
| `meta` | `object` | No | `{}` | Claves de frontmatter a actualizar; `alias`/`permalink` con cadena vacía eliminan la clave |
| `password` | `string` | No | — | **Solo se pasa al establecer/cambiar la contraseña**; sin él, se conserva el valor previo |
| `clearPassword` | `boolean` | No | — | `true` elimina la contraseña (p. ej. al desactivar el cifrado) |

**Valor de retorno** el `PostFile` guardado.

```bash
curl -X PUT http://127.0.0.1:5175/api/posts \
  -H "Content-Type: application/json" \
  -d '{"path":"hello/index.md","meta":{"draft":false},"body":"# Hola\n\nCuerpo del artículo."}'
```

## DELETE /api/posts

Elimina un artículo. En los artículos con directorio solo se puede borrar el nivel superior del `slug` (el directorio entero con sus imágenes); en los planos, el archivo único.

| Parámetro Query | Obligatorio | Nota |
|------------|------|------|
| `path` | Sí | Ruta relativa del artículo |

**Valor de retorno** `{ "ok": true }`.

```bash
curl -X DELETE "http://127.0.0.1:5175/api/posts?path=hello/index.md"
```

## POST /api/slug

Genera o limpia un slug (transcripción del título a pinyin, sustitución de caracteres ilegales y deduplicación contra artículos existentes).

| Campo Body | Tipo | Obligatorio | Nota |
|-----------|------|------|------|
| `title` | `string` | No (por defecto `""`) | Título; solo se usa para generar **si no se pasa `slug`** |
| `slug` | `string` | No | Si se pasa, solo se limpia; no se genera |

**Valor de retorno** `SlugSuggestion`: `{ slug: string, adjusted: boolean, note?: string }` — `adjusted=true` indica que hubo sustitución o deduplicación; `note` explica el motivo.

```bash
curl -X POST http://127.0.0.1:5175/api/slug \
  -H "Content-Type: application/json" \
  -d '{"title":"快速上手指南"}'
```

## POST /api/taxonomy/rename

Renombrado por lotes de categorías/etiquetas: reescribe el frontmatter de **todos los artículos afectados**. Si el nombre destino ya existe, equivale a fusionar; `to` con cadena vacía = eliminar de todos los artículos.

| Campo Body | Tipo | Obligatorio | Nota |
|-----------|------|------|------|
| `kind` | `"category" \| "tag"` | Sí | Si se cambia una categoría o una etiqueta |
| `from` | `string` | Sí | Nombre original (no puede quedar vacío) |
| `to` | `string` | Sí | Nombre destino; cadena vacía = eliminar |

**Valor de retorno** `{ changed, kind, from, to }` — `changed` es el número de artículos reescritos. **Efectos secundarios**: reescritura archivo por archivo (en el caso de etiquetas, deduplicación automática), manteniendo intacto el formato de los campos de fecha.

```bash
curl -X POST http://127.0.0.1:5175/api/taxonomy/rename \
  -H "Content-Type: application/json" \
  -d '{"kind":"tag","from":"JS","to":"JavaScript"}'
```
