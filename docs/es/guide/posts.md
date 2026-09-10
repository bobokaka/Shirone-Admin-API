---
title: Gestión de artículos
description: Explora, filtra, previsualiza y organiza todos tus artículos — un diseño de dos columnas con lista y filtros a la izquierda y vista previa a la derecha, más renombrado y fusión por lotes de categorías y etiquetas.
---

# Gestión de artículos

La página «Gestión de artículos» es tu punto de entrada principal para trabajar con artículos: explorarlos todos, filtrarlos por categoría y etiqueta, previsualizar el texto rápidamente y reorganizar por lotes el sistema de categorías.

![Gestión de artículos](/assets/guide/posts.png)

La página se divide en dos columnas: **a la izquierda, la lista de artículos** (filtros + selección); **a la derecha, la vista previa del contenido** (lectura o edición en el sitio). Al hacer clic en cualquier artículo de la izquierda, la derecha renderiza al instante su Markdown.

## Crear un artículo

Pulsa «**Nuevo artículo**» en la barra de herramientas, escribe el título en el diálogo (podrás cambiarlo en cualquier momento después) y confirma:

1. El backend crea en `content/posts/` del repositorio de contenido un artículo en **estado de borrador**
2. Se salta automáticamente a la página de [Edición de artículos](./post-editor.md) para empezar a escribir

El título se transcribe a pinyin para generar un nombre de directorio apto para URL (slug); por ejemplo, 《快速上手指南》→ `kuai-su-shang-shou-zhi-nan/index.md`. Si coincide con uno existente, se añade un número de serie automáticamente.

## Explorar y filtrar

La barra de herramientas ofrece tres filtros combinables:

| Filtro | Comportamiento |
|--------|------|
| Caja de búsqueda | Coincide a la vez con **título, categoría y etiquetas** (sin distinguir mayúsculas) |
| Desplegable de categorías | Muestra solo los artículos de esa categoría; entre paréntesis de cada opción figura el número de artículos |
| Desplegable de etiquetas | Muestra solo los artículos que llevan esa etiqueta |

La cabecera de la lista muestra en tiempo real «Artículos (tras filtrar / total)». Cada fila muestra título, fecha de publicación, categoría y etiquetas de estado: «Borrador» en amarillo, «Fijado» y «Cifrado» en rojo.

## Vista previa y edición en el sitio

Al seleccionar un artículo, la columna derecha muestra:

- **Título y metadatos**: fecha, categoría, etiquetas, y etiquetas de borrador/fijado/cifrado
- **Renderizado del texto**: Markdown renderizado en vivo; las imágenes del directorio del artículo (referencias relativas `./images/…`) se muestran directamente
- Botón **Editar**: la columna derecha se convierte en el sitio en un editor completo (la misma interfaz de la página de [Edición de artículos](./post-editor.md), solo que sin vista previa en columnas). El icono «Edición en columnas» de la esquina superior derecha del editor salta a la página de edición completa con vista previa izquierda/derecha; al volver, se recupera automáticamente el estado de edición de este artículo
- Botón **Eliminar**: en los artículos con directorio se avisa de que «se eliminará el artículo y todas las imágenes de su directorio»; lo ya confirmado en git puede recuperarse del historial

> [!TIP]
> Si cambias de artículo en la izquierda mientras estás en edición en el sitio y hay cambios sin guardar, primero se produce un **autoguardado silencioso** antes de cambiar: no se pierde nada (detalles en [Edición de artículos · Autoguardado](./post-editor.md#autoguardado)).

## Gestión de categorías / etiquetas

El botón «**Gestión de categorías**», a la derecha de la barra de herramientas, abre el diálogo de reorganización por lotes; es el único sitio que requiere mantenimiento en todo el sistema de categorías del sitio:

- Dos pestañas arriba, categorías / etiquetas; las listas se ordenan por **número de artículos que las usan, en descendente**
- **Renombrar / fusionar**: cambia el nombre de una categoría (o etiqueta) por uno nuevo; si el nuevo nombre ya existe, equivale a **fusionar** ambas. El backend reescribe el frontmatter artículo por artículo manteniendo intacto el formato de fechas
- **Eliminar**: quita esa categoría/etiqueta de todos los artículos (los artículos en sí no se ven afectados)

Por ejemplo, para unificar las dispersas «JS» y «JavaScript» en «JavaScript»: renombra «JS», escribe `JavaScript`, confirma y todos los artículos afectados se reescriben solos.

## Cómo son los artículos en el disco

Entender la forma de almacenamiento facilita las copias de seguridad y el diagnóstico:

```
content/posts/
├── hello/                  # Con directorio (predeterminado al crear): imágenes junto al texto
│   ├── index.md
│   └── images/
│       └── cover.webp
└── old-post.md             # Plano (artículos antiguos o importados de fuera): archivo único
```

- Los artículos nuevos siempre son **con directorio**; las imágenes subidas desde el editor entran automáticamente en el subdirectorio `images/` de ese directorio
- La lista se ordena con **fijados primero y, después, por fecha de publicación descendente**

## Próximos pasos

- Entra en la página de [Edición de artículos](./post-editor.md) para conocer el editor, los metadatos y la escritura asistida por IA
- Con los artículos listos, pasa a [Commit y publicación](./publish.md) para publicarlos
