---
title: Servicios de IA
description: Referencia de la API /api/ai/* — configuración de proveedores, diálogo y reescritura en streaming (SSE), generación de mensajes de commit, borrador de línea de tiempo, búsqueda de música y captura de fondos.
---

# Servicios de IA

El módulo de IA cubre la gestión de configuración y todos los flujos de trabajo con IA. Salvo la captura de fondos, **todos los endpoints exigen la IA activada** (interruptor general encendido + configuración completa del proveedor activo); en caso contrario devuelven `400` «AI 助手未启用…».

La configuración se persiste localmente en `server/data/ai-settings.json` (en gitignore), totalmente aislada del repositorio de contenido.

## GET /api/ai/settings

**Valor de retorno** `AiSettings`:

```json
{
  "enable": true,
  "providers": [
    {
      "id": "uuid", "name": "Anthropic 官方",
      "protocol": "anthropic", "baseUrl": "https://api.anthropic.com",
      "apiKey": "sk-…", "model": "claude-sonnet-5", "modelFast": "",
      "webSearch": true, "temperature": 0.7, "timeoutSeconds": 30
    }
  ],
  "activeId": "uuid"
}
```

`protocol`, uno de dos: `anthropic` (v1/messages, por defecto) / `openai` (chat/completions). `modelFast` vacío significa que las tareas ligeras usan el modelo principal.

```bash
curl http://127.0.0.1:5175/api/ai/settings
```

## PUT /api/ai/settings

Guarda la configuración. El Body es un `AiSettings` completo: `enable` (boolean), `providers` (1–20 configuraciones; restricciones de campos: `temperature` 0–2 por defecto 0.7, `timeoutSeconds` 5–86400 por defecto 30, `webSearch` por defecto true), `activeId` (debe apuntar a un elemento de providers). **Con el servicio activado**, el proveedor activo debe estar completo (dirección con inicio http(s), Key, nombre de modelo); si no, 400.

**Valor de retorno** el `AiSettings` normalizado y guardado (compatible con la antigua estructura plana; migra automáticamente al leer).

```bash
curl -X PUT http://127.0.0.1:5175/api/ai/settings \
  -H "Content-Type: application/json" \
  -d '{"enable":true,"providers":[{"id":"p1","name":"Oficial","protocol":"anthropic","baseUrl":"https://api.anthropic.com","apiKey":"sk-…","model":"claude-sonnet-5","modelFast":"","webSearch":true,"temperature":0.7,"timeoutSeconds":30}],"activeId":"p1"}'
```

## POST /api/ai/test

Prueba de conexión. **Prioriza la configuración del formulario en el cuerpo** (puede probarse sin guardar); si el análisis falla, recurre a la configuración guardada. La petición de prueba va fija con `maxTokens: 16`, `temperature: 0`, sin pensamiento ni búsqueda web, y con tiempo de espera igual al menor entre la configuración del proveedor y 30 segundos.

**Valor de retorno** `AiTestResult`: `{ ok, latencyMs, reply?, error? }` — con `ok=true`, `reply` es un fragmento de la respuesta del modelo (≤120 caracteres).

```bash
curl -X POST http://127.0.0.1:5175/api/ai/test \
  -H "Content-Type: application/json" \
  -d '{"enable":true,"providers":[{"id":"p1","name":"t","protocol":"anthropic","baseUrl":"https://api.anthropic.com","apiKey":"sk-…","model":"claude-sonnet-5","modelFast":"","webSearch":false,"temperature":0.7,"timeoutSeconds":30}],"activeId":"p1"}'
```

## POST /api/ai/chat

Entrada de diálogo no streaming (usa siempre la configuración guardada).

| Campo Body | Tipo | Obligatorio | Nota |
|-----------|------|------|------|
| `messages` | `{ role: system/user/assistant, content }[]` | Sí | Lista completa de mensajes; cada uno ≤200k caracteres |
| `maxTokens` | `number` | No | 16–16384 |
| `fast` | `boolean` | No | `true` va al modelo ligero (si no está configurado, recurre al principal) y apaga el pensamiento |

**Valor de retorno** `AiChatResult`: `{ content, model, promptTokens?, completionTokens?, searchUsed? }`.

```bash
curl -X POST http://127.0.0.1:5175/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Presenta Markdown en una frase"}],"fast":true}'
```

## POST /api/ai/edit

Reescritura de instrucción única: el servidor fija el system (asistente de escritura Markdown que solo devuelve el resultado); no expone personalización del system.

| Campo Body | Tipo | Obligatorio | Nota |
|-----------|------|------|------|
| `instruction` | `string` | Sí | Instrucción de reescritura, ≤2000 caracteres |
| `text` | `string` | Sí | Texto a reescribir, ≤100k caracteres |
| `maxTokens` | `number` | No | Por defecto 4096 |

**Valor de retorno** igual que `AiChatResult`.

```bash
curl -X POST http://127.0.0.1:5175/api/ai/edit \
  -H "Content-Type: application/json" \
  -d '{"instruction":"Pule: conserva el sentido original, devuelve solo el resultado","text":"Esto es un texto de prueba"}'
```

## Interfaces en streaming (SSE) {#interfaces-en-streaming}

`edit-stream` y `chat-stream` comparten el mismo protocolo de reenvío en streaming:

- La respuesta usa `Content-Type: text/event-stream`; cada trama es una línea `data: <JSON>` (no los eventos multilínea del SSE estándar)
- Tipos de trama: `{ "type": "thinking", "text": "…" }` (incremento de pensamiento), `{ "type": "text", "text": "…" }` (incremento del cuerpo), `{ "type": "done", "content": "texto completo", "model": "…", "completionTokens": n }`, `{ "type": "error", "message": "…" }`
- **El cliente corta la conexión para abortar la petición al proveedor** (es el único medio de parada)
- El tiempo de espera cuenta por «inactividad sin salida» (duración = `timeoutSeconds` del proveedor activo); la generación de textos largos no está limitada por duración total

### POST /api/ai/edit-stream

Reescritura en streaming; el cuerpo de la petición es idéntico al de `edit` (`maxTokens` por defecto 4096).

```bash
curl -N -X POST http://127.0.0.1:5175/api/ai/edit-stream \
  -H "Content-Type: application/json" \
  -d '{"instruction":"Continúa este artículo","text":"Cuerpo del texto…"}'
```

### POST /api/ai/chat-stream

Diálogo multironda en streaming.

| Campo Body | Tipo | Obligatorio | Nota |
|-----------|------|------|------|
| `messages` | `{ role: user/assistant, content }[]` | Sí | 1–40 mensajes (system no cuenta aquí) |
| `system` | `string` | No | Prompt de sistema, transmitido aparte, ≤10k caracteres |
| `maxTokens` | `number` | No | Por defecto 8192 |

## POST /api/ai/commit-message

Generación de mensajes de commit con IA. **Nunca lanza errores que bloqueen**: con la IA desactivada recurre a la heurística y lo marca en `source`.

| Campo Body | Tipo | Obligatorio | Por defecto | Nota |
|-----------|------|------|------|------|
| `repo` | `"content" \| "theme"` | No | `content` | Según los cambios de qué repositorio generar |

**Valor de retorno** `{ message, source: "ai" \| "heuristic" }` — la salida de la IA debe pasar la validación de formato `type(scope): ≤30 caracteres` para adoptarse; si no, retrocede automáticamente a la generación según los cambios.

```bash
curl -X POST http://127.0.0.1:5175/api/ai/commit-message \
  -H "Content-Type: application/json" -d '{"repo":"content"}'
```

## POST /api/ai/timeline-draft

Redacción de borradores de eventos de línea de tiempo.

| Campo Body | Tipo | Obligatorio | Nota |
|-----------|------|------|------|
| `mode` | `"note" \| "git"` | Sí | `note` redacta a partir de una descripción; `git` escanea el historial de commits de los tres repositorios y lo condensa |
| `note` | `string` | Obligatorio con mode=note | Descripción del evento, ≤500 caracteres |
| `limit` | `number` | No | 1–5, tope de borradores generados |
| `existing` | `{ title, date }[]` | No | Eventos ya recogidos (≤300), para deduplicar |

**Valor de retorno** array de borradores (JSON strict + filtrado zod; las entradas ilegales ya descartadas).

```bash
curl -X POST http://127.0.0.1:5175/api/ai/timeline-draft \
  -H "Content-Type: application/json" \
  -d '{"mode":"note","note":"En junio de 2025 lancé mi blog personal","limit":3}'
```

## POST /api/ai/music-search

Búsqueda de música con información de copyright (prioriza la búsqueda web; si el servicio no la soporta, degrada automáticamente a petición normal y lo marca).

| Campo Body | Tipo | Obligatorio | Nota |
|-----------|------|------|------|
| `query` | `string` | Sí | Término de búsqueda, ≤200 caracteres |

**Valor de retorno** array de candidatos; cada elemento incluye `title` / `artist?` / `license` (`freeCommercial`, `summary`, `evidence?`, `sourceUrl?`) / `audioUrl?` / `coverUrl?`.

```bash
curl -X POST http://127.0.0.1:5175/api/ai/music-search \
  -H "Content-Type: application/json" -d '{"query":"pieza de piano tranquila, uso comercial gratuito"}'
```

## POST /api/ai/wallpaper-search

Captura de fondos (toma directa del origen safebooru). **No pasa por la IA ni tiene requisito de activación**; puede llamarse en cualquier momento.

| Campo Body | Tipo | Obligatorio | Nota |
|-----------|------|------|------|
| `query` | `string` | No | Término de búsqueda; por defecto vacío (aleatorio) |
| `target` | `"desktop" \| "mobile"` | Sí | Objetivo de tamaño: escritorio toma horizontales ≥1920, móvil verticales ≥1920 |

**Valor de retorno** `WallpaperCandidate[]` (hasta completar un lote): `{ imageUrl, previewUrl?, width?, height? }`.

```bash
curl -X POST http://127.0.0.1:5175/api/ai/wallpaper-search \
  -H "Content-Type: application/json" -d '{"query":"cielo estrellado","target":"desktop"}'
```
