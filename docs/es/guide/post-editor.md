---
title: Edición de artículos
description: Uso completo del editor de código fuente Markdown — barra de herramientas, subida de imágenes, panel lateral de metadatos (fecha/categoría/cifrado/ruta de acceso), escritura asistida por IA y mecanismo de autoguardado.
---

# Edición de artículos

El editor de artículos es la página más densa en funciones del panel. Se entra creando un artículo o pulsando «Editar» desde [Gestión de artículos](./posts.md); la página de edición completa incorpora **vista previa en vivo en dos columnas**, mientras que la edición en el sitio de la página de gestión es el mismo editor en su forma de columna única.

![Edición de artículos](/assets/guide/post-editor.png)

## Acciones de la barra superior

De izquierda a derecha:

| Botón | Función |
|------|------|
| Volver | Autoguarda y regresa a la página anterior |
| Caja de título | Caja grande siempre visible, para renombrar en cualquier momento |
| Información del artículo | Abre el panel lateral de metadatos (ver más abajo) |
| Eliminar | Borra el artículo y todas las imágenes de su directorio; requiere doble confirmación |
| Guardar | Escribe inmediatamente en el repositorio de contenido |
| Guardar e ir a publicar | Tras guardar, salta directamente a [Commit y publicación](./publish.md) |

La barra superior también muestra «Autoguardado HH:mm:ss» con la hora del último autoguardado.

## El editor

El editor funciona en **modo de código fuente Markdown** (basado en md-editor-v3 + CodeMirror): escribes directamente Markdown y la columna derecha renderiza la vista previa en vivo. La barra de herramientas ofrece el formato habitual: negrita, cursiva, tachado, títulos, citas, listas, tareas, código en línea, bloques de código, enlaces, imágenes, tablas, deshacer/rehacer, y el cambio de vista previa/índice.

**Imágenes sin fricción**: pega una captura en el editor o súbela con el botón de imagen; el archivo se guarda automáticamente en el subdirectorio `images/` del directorio del artículo actual y el texto recibe automáticamente la referencia relativa (`./images/xxx.webp`). El artículo queda así autocontenido — copiar el directorio entero es llevarse el artículo completo.

Con la IA activada, al final de la barra de herramientas aparece además un **menú desplegable de IA**; detalles más abajo en [Escritura asistida por IA](#escritura-asistida-por-ia).

## Panel lateral de información del artículo

El panel «Información del artículo» reúne todos los metadatos (corresponden al frontmatter del artículo):

### Campos básicos

- **Fecha de publicación** (`YYYY-MM-DD`) y **hora exacta** — sirve para ordenar cuando publicas varios artículos el mismo día; la zona horaria se normaliza automáticamente a `+08:00`
- **Categoría** — desplegable con las categorías existentes (con contador de uso); escribe un nombre nuevo y pulsa Enter para crearla
- **Etiquetas** — selección múltiple, también con creación al escribir
- **Resumen** — si se deja vacío, el tema extrae automáticamente el inicio del texto; la portada admite subida local o enlace externo
- **Interruptores** — Borrador / Fijado / Comentarios / Cifrado

### Artículos cifrados

Al marcar «Cifrado» se despliegan tres campos:

- **Contraseña de acceso** — en artículos que ya tenían una, escribirla la cambia y dejarla vacía la mantiene; desmarcar «Cifrado» elimina la contraseña
- **Pista de la contraseña** — texto que el visitante ve antes de introducirla
- **Ocultar vista previa en las tarjetas de inicio** — evita que el contenido cifrado se filtre como resumen en la página principal

### Ruta de acceso

Tres modos deciden la URL final del artículo; abajo hay una vista previa de la dirección en tiempo real:

| Modo | Forma de la dirección | Caso de uso |
|------|----------|----------|
| Predeterminado | `/posts/<nombre-del-artículo>/` | Artículos normales |
| Alias personalizado | `/posts/<alias>/` | Cuando quieres una URL más corta y semántica |
| Enlace permanente en la raíz | `/<ruta-personalizada>/` | Páginas insignia cuidados al detalle, como `/about-me/` |

## Escritura asistida por IA

> [!NOTE]
> Estas funciones exigen activar antes el asistente de IA ([cómo configurarlo](./ai.md#configurar-proveedores)). Sin activar, el menú de IA no aparece en la barra de herramientas y la escritura funciona con normalidad.

El menú desplegable de IA incluye 5 acciones + instrucciones personalizadas. Todas **conservan intactos el código y la sintaxis privada del tema Shirone** (contenedores de triple dos puntos, file-tree, etc.):

| Acción | Ámbito | Cómo se aplica el resultado |
|------|----------|--------------|
| Mejorar contenido con IA | Texto completo | Rellena lagunas argumentales y refuerza la coherencia — primero vista previa, luego aplicar |
| Optimizar formato con IA | Texto completo | Normaliza la jerarquía de títulos, unifica puntuación, completa el lenguaje de los bloques de código — primero vista previa, luego aplicar |
| Pulir con IA | **Selección con prioridad** | Si hay texto seleccionado lo sustituye directamente; sin selección, vista previa diff del texto completo |
| Continuar con IA | Final del texto | Continúa de forma natural desde el final; el resultado se añade al final del texto |
| Generar resumen con IA | Texto completo | Genera un resumen de 80–160 caracteres y lo vuelca en «Información del artículo» (si ya había uno, pide confirmación antes) |
| Instrucción personalizada | Selección o texto completo | Ejecuta cualquier instrucción que escribas (p. ej. «pásalo a un estilo más coloquial») |

La **vista previa diff** es la red de seguridad de las acciones que reescriben todo el texto (mejorar/optimizar formato/pulir sin selección/instrucción personalizada): el resultado de la IA se va refrescando en streaming en una vista de diferencias lado a lado, los tramos largos sin cambios se pliegan automáticamente y puedes saltar bloque a bloque con «Anterior/Siguiente». Solo al revisarlo y pulsar «Aplicar sustitución» se reescribe realmente el texto; el contenido generado tras una detención está incompleto y no se permite aplicarlo. Si la longitud del texto cambia más de un 20 %, la caja de vista previa avisa en rojo para que revises con cuidado.

Todas las acciones de IA se ejecutan en la [Consola de IA](./ai.md#consola-de-ia) global: el proceso de pensamiento es visible y puede detenerse en cualquier momento.

## Autoguardado

El editor tiene un mecanismo de autoguardado que no estorba:

- Revisa cada **10 segundos** y solo escribe en disco silenciosamente si el título o el texto han cambiado
- También autoguarda en el instante de **cambiar de artículo, pulsar Volver o salir de la página de edición**
- El único caso que te detiene: título vacío (no puede escribirse en disco); en ese caso se te pide rellenar el título primero

El autoguardado cubre solo título y texto; los metadatos del panel «Información del artículo» se guardan con el botón «Guardar».

## Próximos pasos

- Conoce los [Momentos](./moments.md) — un formato más ligero que los artículos
- Con el contenido listo, pasa a [Commit y publicación](./publish.md)
