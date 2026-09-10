---
title: Momentos
description: Referencia de la API de CRUD de momentos en /api/moments — publicar, actualizar y eliminar momentos.
---

# Momentos

El módulo de momentos opera sobre `content/moments/` del repositorio de contenido: un archivo Markdown por momento, cuyo nombre de archivo es el id: `<yyyymmdd-HHmmss>.md`. La lista va por orden temporal descendente.

## Estructura MomentMeta

Metadatos compartidos por lista y detalle:

| Campo | Tipo | Nota |
|------|------|------|
| `id` | `string` | Nombre de archivo sin `.md`, p. ej. `20260906-183000` |
| `path` | `string` | Ruta relativa |
| `published` | `string` | `YYYY-MM-DD HH:mm:ss` |
| `pinned` / `draft` | `boolean` | Fijado / borrador |
| `location` | `string` | Lugar |
| `mood` | `string` | Nombre de icono Iconify del estado de ánimo (cadena vacía = sin elegir) |
| `tags` | `string[]` | Etiquetas |
| `images` | `{ src, alt }[]` | Imágenes; `src` es la ruta del sitio |
| `body` | `string` | Texto del cuerpo (la lista ya lo incluye) |

## GET /api/moments

Lista completa, sin parámetros.

```bash
curl http://127.0.0.1:5175/api/moments
```

## GET /api/moments/detail

| Parámetro Query | Obligatorio | Nota |
|------------|------|------|
| `path` | Sí | Ruta relativa del momento |

**Valor de retorno** `MomentFile`: `{ meta: MomentMeta, body: string }`.

```bash
curl "http://127.0.0.1:5175/api/moments/detail?path=20260906-183000.md"
```

## POST /api/moments

Crea un momento. **Efectos secundarios**: escribe `content/moments/<marca-de-tiempo-de-publicación>.md`; los archivos referenciados en `images` deben haberse archivado antes con la [subida de imágenes de momentos](./media.md#post-api-media-moment-image).

| Campo Body | Tipo | Obligatorio | Por defecto | Nota |
|-----------|------|------|------|------|
| `published` | `string` | Sí | — | `YYYY-MM-DD HH:mm:ss`; determina el nombre del archivo |
| `body` | `string` | No | `""` | Cuerpo del texto |
| `location` | `string` | No | — | Lugar |
| `mood` | `string` | No | — | Nombre del icono de estado de ánimo |
| `tags` | `string[]` | No | — | Etiquetas |
| `images` | `{ src, alt? }[]` | No | — | Lista de imágenes |
| `draft` / `pinned` | `boolean` | No | `false` | Borrador / fijado |

**Valor de retorno** el `MomentMeta` creado.

```bash
curl -X POST http://127.0.0.1:5175/api/moments \
  -H "Content-Type: application/json" \
  -d '{"published":"2026-09-10 10:30:00","body":"¡Mi primer momento!","mood":"material-symbols:celebration","tags":["comienzo"]}'
```

## PUT /api/moments

Actualiza un momento; campos como arriba, más:

| Campo Body | Tipo | Obligatorio | Nota |
|-----------|------|------|------|
| `path` | `string` | Sí | Ruta del momento destino |

Los campos opcionales no enviados caen a sus valores por defecto (semántica de sobrescritura completa); leer detail antes de modificar es el patrón más seguro (así lo hace la interfaz de administración).

```bash
curl -X PUT http://127.0.0.1:5175/api/moments \
  -H "Content-Type: application/json" \
  -d '{"path":"20260906-183000.md","published":"2026-09-06 18:30:00","body":"Editado","pinned":true}'
```

## DELETE /api/moments

Elimina un momento (el archivo `.md`). **Las imágenes no se borran con él**; cuando toque limpiar, hazlo a mano en el directorio del lote correspondiente bajo `public/images/moments/`.

| Parámetro Query | Obligatorio | Nota |
|------------|------|------|
| `path` | Sí | Ruta relativa del momento |

**Valor de retorno** `{ "ok": true }`.

```bash
curl -X DELETE "http://127.0.0.1:5175/api/moments?path=20260906-183000.md"
```
