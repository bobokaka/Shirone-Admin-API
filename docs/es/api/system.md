---
title: Sistema y vista previa
description: Referencia de la API de sondeo de estado /api/status y de la gestión del proceso de vista previa del sitio real en /api/preview/*.
---

# Sistema y vista previa

El módulo de sistema responde a dos preguntas: **¿está bien conectado el espacio de trabajo?** y **¿está corriendo el dev server del blog?** La etiqueta de conexión de la barra superior del panel y los paneles de vista previa del sitio real de cada página se alimentan de este grupo de endpoints.

## GET /api/status

Sondea el estado del espacio de trabajo. Sin parámetros; nunca falla (los campos cuyo sondeo interno falla devuelven `null`/`false`).

**Valor de retorno** `SystemStatus`:

| Campo | Tipo | Nota |
|------|------|------|
| `contentDir` / `themeDir` | `string` | Rutas absolutas resueltas de los repositorios de contenido / tema (origen: `.env` o la posición relativa por defecto) |
| `contentConnected` | `boolean` | `true` si el directorio del repositorio de contenido contiene `content/` |
| `themeConnected` | `boolean` | `true` si el repositorio del tema contiene `scripts/content/sync.mjs` |
| `themeDepsInstalled` | `boolean` | `node_modules` presente en el repositorio del tema (determina si la validación local es posible) |
| `git` | `GitStatus \| null` | Resumen git del repositorio de contenido; `null` si no es un repositorio git |

`GitStatus`: `branch`, `ahead`, `behind`, `staged[]`, `modified[]`, `untracked[]` (listas de rutas relativas de archivos).

```bash
curl http://127.0.0.1:5175/api/status
```

```json
{
  "contentDir": "D:\\blogs\\Shirone-Content",
  "themeDir": "D:\\blogs\\Shirone",
  "contentConnected": true,
  "themeConnected": true,
  "themeDepsInstalled": true,
  "git": { "branch": "main", "ahead": 0, "behind": 0, "staged": [], "modified": [], "untracked": [] }
}
```

## POST /api/preview/start

Levanta el proceso de vista previa del sitio real: arranca en el repositorio del tema `content:watch` (escucha y sincronización de contenido) y `astro dev` (:4321). Si ya está en ejecución, devuelve directamente «ya en ejecución». **Efectos secundarios**: crea dos árboles de procesos en segundo plano; en Windows se arrancan vía `cmd /c` y, al salir el servicio, se recogen con `taskkill` sobre el árbol entero.

```bash
curl -X POST http://127.0.0.1:5175/api/preview/start
```

```json
{ "started": true, "message": "真站预览已启动，首次启动需等待依赖编译" }
```

Para saber si está `ready`, fíate del sondeo de `/api/preview/status` (la primera vez hay compilación y la disponibilidad llega más tarde que el arranque).

## POST /api/preview/stop

Termina el árbol de procesos de la vista previa. **Efectos secundarios**: mata todos los subprocesos arrancados por start; si el dev server procede de otra fuente (p. ej. el script de arranque único), queda fuera del alcance de la recogida.

```bash
curl -X POST http://127.0.0.1:5175/api/preview/stop
```

Devuelve `{ "stopped": true }`.

## GET /api/preview/status

Consulta el estado de la vista previa; el frontend lo sondea cada 3 segundos.

```bash
curl http://127.0.0.1:5175/api/preview/status
```

```json
{ "running": true, "ready": true, "procs": ["node content-watch.mjs", "astro dev"] }
```

| Campo | Nota |
|------|------|
| `running` | El proceso de vista previa gestionado por este servicio está corriendo |
| `ready` | `http://localhost:4321/` es realmente alcanzable (vale un dev server de cualquier origen) |
| `procs` | Lista de descripciones de procesos |
