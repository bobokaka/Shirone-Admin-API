---
title: Publicación y validación
description: Referencia de la API de vista previa de publicación, sondeo del remoto y publicación con un clic en /api/publish/*, y de la validación dry-run en /api/validate.
---

# Publicación y validación

El módulo de publicación encapsula las operaciones git de ambos repositorios (contenido + tema). Los dos repositorios **no se bloquean entre sí** y cada uno devuelve su `RepoPublishResult` independiente.

## GET /api/publish/preview

Datos de primera pantalla de la página de publicación: detalle de cambios de ambos repositorios, mensajes de commit autogenerados, commits recientes y estado. Sin parámetros.

**Valor de retorno** `PublishPreview`; campos clave:

| Campo | Nota |
|------|------|
| `branch` / `ahead` / `behind` | Rama del repositorio de contenido y ahead/behind (valores de caché local) |
| `changes` / `files` | Detalle de cambios del repositorio de contenido `{ path, state: "new" \| "modified" }[]` y lista de archivos |
| `message` | Mensaje de commit automático del repositorio de contenido |
| `themeChanges` / `themeFiles` / `themeMessage` / `themeStatus` / `themeRecent` | Información correspondiente del repositorio del tema (`themeStatus` es `null` si no está conectado) |
| `themeDepsInstalled` | Si las dependencias del tema están instaladas (determina si la validación local es posible) |
| `recent` | Los últimos 20 commits del repositorio de contenido `{ hash, date, subject }` |

```bash
curl http://127.0.0.1:5175/api/publish/preview
```

## POST /api/publish/probe

Comparación ligera con el remoto: `git ls-remote` contra el tip de la rama, **sin bajar código/objeto alguno**.

| Campo Body | Tipo | Obligatorio | Nota |
|-----------|------|------|------|
| `repo` | `"content" \| "theme"` | Sí | Qué repositorio sondear |

**Valor de retorno** `RemoteProbe`: `{ behind: number | null }` — `0`, en línea con el remoto; `>0`, número exacto de commits por detrás; `null`, el remoto ha avanzado pero la cifra se desconoce (habrá que tirar para determinarla).

```bash
curl -X POST http://127.0.0.1:5175/api/publish/probe \
  -H "Content-Type: application/json" -d '{"repo":"content"}'
```

## POST /api/publish

Publicación con un clic. Flujo: repositorio de contenido (**validación → add -A → commit → pull --rebase --autostash → push**; la validación fallida bloquea ese repositorio) + repositorio del tema (commit → push, sin validación local).

| Campo Body | Tipo | Obligatorio | Nota |
|-----------|------|------|------|
| `contentMessage` | `string` | No | Mensaje de commit del repositorio de contenido; **vacío, se autogenera** (debe cumplir `type(scope): ≤30 caracteres`) |
| `themeMessage` | `string` | No | Mensaje de commit del repositorio del tema; igual que el anterior |

**Valor de retorno** `PublishResult`:

```json
{
  "ok": true,
  "content": { "ok": true, "hadChanges": true, "commitHash": "a1b2c3d", "pushed": true, "log": ["..."] },
  "theme":  { "ok": true, "hadChanges": false, "pushed": false, "log": ["无变更，跳过"] }
}
```

`RepoPublishResult` por repositorio: `ok` (éxito global de ese repositorio), `hadChanges`, `commitHash?`, `pushed`, `validationOutput?` (registro completo cuando falla la validación del repositorio de contenido), `log[]` (registro paso a paso). El `ok` de nivel superior = `content.ok && theme.ok`.

```bash
curl -X POST http://127.0.0.1:5175/api/publish \
  -H "Content-Type: application/json" -d '{}'
```

> [!WARNING]
> Este es el endpoint que realmente produce commits y pushes de git. Antes de llamarlo conviene pasar por `preview` para confirmar el alcance de los cambios; si la validación del repositorio de contenido falla, no se produce commit alguno.

## POST /api/validate

Ejecuta suelta la validación previa a publicar: corre en el repositorio del tema `scripts/content/sync.mjs --dry-run` (entorno con `CONTENT_DIR`, 180 segundos de espera, salida recortada a 4000 caracteres). **Prechequeo puro en memoria: no escribe en disco ni produce cambio alguno**.

**Valor de retorno** `{ ok: boolean, output: string }` — `output` es la salida del validador (formato YAML, ortografía de campos, localización de problemas de esquema de frontmatter).

```bash
curl -X POST http://127.0.0.1:5175/api/validate
```
