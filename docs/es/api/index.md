---
title: Referencia de API
description: Panorámica de la API local de Shirone-Admin — convenciones base, formato de errores, montaje de recursos estáticos e índice de todos los grupos de endpoints.
---

# Referencia de API

El backend de Shirone-Admin es un servicio Fastify local, y la propia interfaz de administración funciona íntegramente a través de este conjunto de APIs. También puedes llamarlas directamente y usar Admin como **pasarela programable** de tu repositorio de contenido — scripts por lotes, integración con editores externos y canalizaciones de automatización son viables.

Esta sección va dirigida a lectores familiarizados con HTTP y con la estructura del repositorio de contenido; está organizada por módulos del backend y cada endpoint documenta propósito, parámetros, valores de retorno y un ejemplo mínimo ejecutable.

## Convenciones base

| Elemento | Valor |
|----|----|
| Dirección base | `http://127.0.0.1:5175` (modificable con `ADMIN_PORT`; solo se enlaza al retorno local) |
| Prefijo de ruta | `/api` |
| Autenticación | **Ninguna**. Herramienta local monousuario, no expuesta a la red local; no la publiques detrás de un proxy inverso en Internet |
| Cuerpo de petición | JSON (`bodyLimit` de **2MB**); la subida de archivos va por multipart (≤**30MB** por archivo, un archivo por vez) |
| CORS | Totalmente abierto (`origin: true`), para depurar cómodamente desde cualquier página local |

## Formato de errores

Todos los errores devuelven un JSON con el único campo `message` (en chino), junto con el código HTTP adecuado:

```json
{ "message": "文件不存在" }
```

| Código | Origen |
|--------|------|
| `400` | Validación de negocio fallida (`ApiError`) o **validación zod de la petición** — `message` tiene la forma `body.title: 标题不能为空`, concatenado como «campo: motivo» |
| `404` | Ruta inexistente, o ausencia del objetivo solicitado (artículo/archivo, etc.; `ENOENT`) |
| `413` | Archivo subido superior a 30MB |
| `500` | Error inesperado; `message` contiene el mensaje de error original |

## Montaje de recursos estáticos

Tres rutas estáticas de solo lectura sirven directamente archivos de los repositorios (si el archivo está en el repositorio de contenido se usa ese; si no, se recurre a la ruta homónima del repositorio del tema); así se implementa la vista previa de imágenes del panel:

| Prefijo | Directorio servido | Uso |
|------|----------|------|
| `/content-assets/*` | `assets/` del repositorio de contenido (recurre a `src/assets/` del tema) | Vista previa de recursos de construcción como avatar y banner |
| `/content-public/*` | `public/` del repositorio de contenido (recurre a `public/` del tema) | Vista previa de imágenes de momentos, música, portadas de animes |
| `/content-posts/*` | `content/posts/` del repositorio de contenido | Imágenes de artículos (convertir las referencias relativas `./images/…` en enlaces directos) |

Todas las rutas pasan por validación resolve y **no pueden salir del directorio raíz** (protección contra directory traversal).

## Índice de endpoints

| Grupo | Contenido |
|------|------|
| [Sistema y vista previa](./system.md) | Sondeo del estado de conexión, arranque/parada y estado del proceso de vista previa del sitio real |
| [Artículos](./posts.md) | CRUD de artículos, sugerencia de slug, renombrado por lotes de categorías/etiquetas |
| [Momentos](./moments.md) | CRUD de momentos |
| [Subida de medios](./media.md) | Imágenes de artículos, imágenes de momentos, imágenes del sitio, portadas de datos, audio de música |
| [Ajustes del sitio](./settings.md) | Lectura y escritura de los cuatro dominios de configuración (site/profile/navbar/footer) |
| [Datos estructurados](./data.md) | Lectura y escritura de los ocho tipos de `data/*.ts`; búsqueda de entradas de animes e importación de portadas |
| [Publicación y validación](./publish.md) | Vista previa de publicación, sondeo del remoto, publicación con un clic, validación dry-run |
| [Servicios de IA](./ai.md) | Configuración de proveedores, diálogo/reescritura (incluye SSE en streaming) y los distintos flujos de trabajo de IA |
| [Importación de Jianshu](./import.md) | Sesiones de paquetes exportados, tareas de importación en segundo plano, pegado individual |

## Comportamiento general

- **Destino de escritura**: salvo los ajustes de IA (`server/data/ai-settings.json`), toda escritura ocurre en el repositorio de contenido apuntado por `CONTENT_DIR`
- **Parámetros de ruta**: los parámetros de rutas de artículos/momentos son rutas estilo POSIX relativas al repositorio de contenido (p. ej. `hello/index.md`), con separador `/` uniforme
- **Formatos de fecha**: en artículos, `published` es `YYYY-MM-DD`; `publishedAt` es `YYYY-MM-DDTHH:mm:ss+08:00`; en momentos, `published` es `YYYY-MM-DD HH:mm:ss`

## Verificación rápida

Con el servicio corriendo, un comando confirma la conectividad:

```bash
curl http://127.0.0.1:5175/api/status
```

Si devuelve las rutas de los repositorios de contenido y del tema, el estado de conexión y el resumen git, la API está lista.
