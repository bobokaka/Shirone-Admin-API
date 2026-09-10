---
title: Asistente de IA
description: Configura y usa las capacidades de IA de Shirone-Admin — cambio entre varios proveedores, compatibilidad con dos protocolos, consola global en streaming y el mapa de entradas de IA repartidas por las páginas.
---

# Asistente de IA

Las capacidades de IA de Shirone-Admin son una **mejora opcional**: sin configurarlas, todo funciona igual; al configurarlas, la escritura, la importación y la publicación ganan una serie de asistencias inteligentes. Este capítulo explica primero la configuración y después el uso.

## Configurar proveedores

Pulsa el **engranaje** de la barra superior para abrir el diálogo «Ajustes» y elige «Asistente de IA» en el menú de la izquierda.

![Configuración de proveedores de IA](/assets/guide/app-settings.png)

### Conceptos básicos

- **Varios proveedores** — puedes guardar varias configuraciones de conexión (hasta 20) y cambiar en cualquier momento la activa. Ideal si tienes a la vez la API oficial y un proxy intermedio, o si alternas modelos según necesidad
- **Dos protocolos** — cada configuración elige uno:
  - `anthropic` — protocolo compatible con Anthropic (`v1/messages`); encaja con la API oficial y con los intermedios «compatibles con Anthropic»
  - `openai` — protocolo compatible con OpenAI (`chat/completions`); encaja con OpenAI y con la gran mayoría de APIs de modelos nacionales
- **Interruptor general** — con «Activar» apagado, todas las entradas de IA se ocultan y la API lo rechaza todo

### Campos de cada configuración

| Campo | Nota |
|------|------|
| Nombre | Nombre visible, p. ej. `Anthropic oficial` / `proxy GLM` |
| Protocolo | anthropic / openai |
| Dirección de la API | basta la raíz (`https://api.anthropic.com` o `https://api.openai.com/v1`); tolera raíz desnuda, con `/v1`, subrutas de proxy, etc. |
| API Key | solo se guarda localmente en `server/data/ai-settings.json`; **jamás se escribe en el repositorio de contenido** ni se filtra al publicar |
| Modelo principal | para tareas cotidianas, p. ej. `claude-sonnet-5` / `gpt-4o-mini` / `glm-5.3` |
| Modelo ligero | para tareas simples como resúmenes o sugerencias de etiquetas; **vacío = mismo que el principal** (te ahorras una configuración) |
| Búsqueda web | añade la herramienta de búsqueda web a los servicios que la admiten; si el servidor no la soporta, degrada automáticamente a petición normal |
| Temperatura | temperatura de muestreo 0–2, por defecto 0.7 |
| Tiempo de espera | segundos de espera por petición, 5–86400, por defecto 30 |

### Flujo de operación

1. Pulsa + para **añadir proveedor** (nombre por defecto «Configuración N»; basta escribir encima para renombrarlo)
2. Rellena los campos, o usa la **importación por pegado**: pega entero el bloque env del `settings.json` de Claude Code, sentencias `export` de shell o contenido dotenv; reconoce automáticamente 10 claves como `ANTHROPIC_*` / `OPENAI_*` y rellena el formulario
3. **Probar conexión** — puede probarse sin guardar y devuelve latencia y respuesta del modelo; cuando pase, **guarda**

> [!WARNING]
> `server/data/ai-settings.json` contiene las API Key en texto claro. El archivo está en gitignore, pero evita copiarlo a cualquier ubicación que se vaya a confirmar o compartir.

## Consola de IA

La ventana flotante global que abre el **botón ✨** de la barra superior es el escenario de ejecución de todas las tareas de IA:

![Consola de IA](/assets/guide/ai-console.png)

Dos formas:

- **Forma tarea** — las acciones de IA disparadas desde las páginas (pulir, continuar, redactar…) se ejecutan aquí: entrada de instrucción con el distintivo «tarea», **proceso de pensamiento** del modelo (plegable), texto principal subiendo en streaming, y anotaciones de tiempo y modelo usado
- **Forma conversación** — terminada la tarea, sigue preguntando en la misma caja (llevando el contexto para seguir retocando) o simplemente conversa; Enter envía, Shift+Enter salta de línea

Capacidades comunes: **detener en cualquier momento** (al detener, lo ya generado se conserva o se recupera según el caso), clic en la barra de título para **plegar** sin ocupar pantalla, y **Nueva conversación** para vaciar y empezar de cero. El historial de una conversación larga descarta automáticamente desde lo más antiguo al superar los 60 000 caracteres; el flujo de pensamiento conserva los últimos 8000.

## Entradas de IA en cada página

Al activar, en estos puntos aparecen funciones de IA (organizadas por página):

| Página | Entrada | Capacidades |
|------|------|------|
| [Edición de artículos](./post-editor.md#escritura-asistida-por-ia) | Menú desplegable de IA en la barra | Mejorar contenido / optimizar formato / pulir (selección con prioridad) / continuar / generar resumen / instrucción personalizada; la reescritura completa con vista previa diff |
| [Momentos](./moments.md#asistencia-de-ia-opcional) | Botones del compositor | Pulido del texto (relleno en streaming), sugerencias de etiquetas y estado de ánimo |
| [Gestión de datos](./data.md#ia-a-nivel-de-campo) | ✨ en el diálogo de edición | Generación y reescritura de campos descriptivos de proyectos/habilidades/animes, etc. |
| [Gestión de datos · Línea de tiempo](./data.md#linea-de-tiempo-borrador-con-ia) | Botón Borrador con IA | Eventos por historial git / por descripción, para insertar tras marcar |
| [Gestión de datos · Lista de reproducción](./data.md#lista-de-reproduccion-importar-musica) | Importar música | Búsqueda de pistas en la red con información de copyright |
| [Ajustes del sitio](./settings.md#informacion-basica) | ✨ en las cajas de entrada | Generación de una frase para subtítulo y firma |
| [Ajustes del sitio · Banner](./settings.md#fondos-del-banner) | Generar textos con IA | Generación del conjunto completo de frases rotativas de la máquina de escribir |
| [Importación desde plataformas](./import.md#pegado-individual) | Disparo automático | Completar título/resumen/categoría/etiquetas del artículo pegado |
| [Commit y publicación](./publish.md#mensajes-de-commit) | Botón Generar con IA | Mensajes de commit para ambos repositorios (retroceso automático si no cumple la norma) |

Además, el menú de IA de la barra del editor muestra animación de carga durante la generación y bloquea el disparo repetido; todas las tareas en streaming comparten una única consola y solo corre una a la vez.

## Filosofía de diseño

- **La IA nunca bloquea el flujo principal** — si falla la generación del mensaje de commit, retrocede a la heurística; si fallan los metadatos de importación, retrocede al resumen del texto; al detener un pulido se recupera el original
- **Primero vista previa, luego aplicación** — las reescrituras completas pasan siempre por confirmación diff; nunca pisan tu texto directamente
- **Tareas ligeras con modelo ligero** — los trabajos pequeños como sugerencias de etiquetas o resúmenes van al `modelFast` con el pensamiento apagado; ahorro de dinero y tiempo

## Próximos pasos

- Vuelve a [Edición de artículos](./post-editor.md) y usa una vez el pulido con IA
- Mira la generación de mensajes de commit con IA en [Commit y publicación](./publish.md)
