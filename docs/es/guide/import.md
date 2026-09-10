---
title: Importación desde plataformas
description: Trae tus artículos de Jianshu al blog — dos vías (importación por lotes del paquete exportado y pegado de artículos individuales), un asistente de cinco pasos y metadatos autocompletados por IA.
---

# Importación desde plataformas

¿Escribes en otra plataforma? La página «Importación desde plataformas» ofrece el canal de migración; hoy admite **Jianshu**, con pestañas por plataforma arriba de la página y más plataformas por venir.

Hay dos vías de importación; al entrar, eliges una:

| Vía | Ideal para | Entrada |
|------|------|------|
| **Importar paquete exportado** | Migrar todo el sitio, decenas o cientos de artículos | El rar / zip obtenido con el «descargar todos los artículos en paquete» oficial de Jianshu |
| **Pegado individual** | Artículos seleccionados, pegas y conviertes al momento | El contenido copiado íntegro de la página web de un artículo |

![Importación desde plataformas](/assets/guide/import.png)

## Importar paquete exportado

Asistente de cinco pasos: **elegir vía → subir paquete → elegir artículos → conversión → importación completa**.

### Paso 1: subir el paquete exportado

Solicita la exportación en Jianshu en «Ajustes → Gestión de cuenta → Descargar todos los artículos en paquete» (Jianshu envía por correo el enlace de descarga) y arrastra el comprimido a la zona de subida. Límites: formato zip / rar, ≤30MB por paquete.

Tras subirlo, el servidor lo descomprime y analiza en memoria, y lista todos los artículos agrupados por **colección**.

### Paso 2: elegir artículos

- Tras un análisis correcto, quedan **marcados por defecto** los artículos no importados antes
- Admite marcar colecciones enteras, y seleccionar o despejar todo
- Los artículos ya importados se marcan «Importado» y se deshabilitan, para evitar duplicados
- Cada artículo puede **previsualizarse** antes — sin escribir en disco, viendo el Markdown resultante de la conversión

A la derecha, opciones de importación:

| Opción | Nota |
|------|------|
| Fecha de publicación común | El paquete de Jianshu no incluye fechas; todos los artículos reciben la misma (luego puedes cambiarla uno a uno) |
| Colección como categoría | Al marcarlo, cada nombre de colección pasa a ser la categoría del artículo; sin marcar, asignas a mano una categoría común |
| Etiquetas | Añade las mismas etiquetas a todo el lote |
| Localizar imágenes | Descarga las imágenes del CDN de Jianshu al directorio `images/` de cada artículo; las que fallen conservan el enlace remoto |
| Importar como borrador | **Recomendado mantenerlo marcado** — revisa primero en [Gestión de artículos](./posts.md) y publica después |

### Paso 3: conversión

Al pulsar empezar, el servidor crea una **tarea en segundo plano** que convierte artículo por artículo; la página sondea el progreso cada 2 segundos: total, completados y título en curso. Puedes salir de la página; la tarea sigue corriendo.

### Paso 4: finalización

Al terminar, la tarea muestra el informe de resultados: éxito de cada artículo, ruta en el repositorio y número de imágenes localizadas. Los fallidos explican el motivo (un fallo puntual no afecta a los demás). Puedes «Importar otro paquete» o saltar a la gestión de artículos para revisar el resultado.

## Pegado individual

Asistente de cinco pasos: **elegir vía → pegar contenido → conversión → información del artículo → importación completa**.

1. **Pegar** — abre el artículo en la web de Jianshu, selecciona todo, copia y pega con `Ctrl+V` directamente en el editor: el texto enriquecido se convierte solo a Markdown (títulos, negritas, enlaces e imágenes se conservan íntegros), con el código a la izquierda y la vista previa a la derecha para seguir corrigiendo a mano
2. **Conversión** — al confirmar, el servidor lo archiva: las imágenes se descargan automáticamente al directorio del artículo (las que fallen conservan el enlace remoto) y se genera un artículo con directorio
3. **Información del artículo** — la IA analiza el texto y **autocompleta**: título (si lo dejas vacío, lo propone la IA), resumen, sugerencias de categoría y etiquetas, todo editable; sin IA disponible, recurre a extraer el inicio del texto y lo indica con `aiUsed=false`
4. **Remate** — los metadatos se escriben en el artículo y listo. Puedes saltar en un clic a [Edición de artículos](./post-editor.md) para el retoque final

> [!TIP]
> La caja del título también tiene red de seguridad al pegar: si el portapapeles solo trae texto enriquecido (lo habitual al copiar de la web), se extrae el texto plano y se comprime en una sola línea.

## Sesiones y tareas: detalles

- Cada paquete subido forma una **sesión** (el análisis se cachea en memoria del servidor), válida 24 horas, con un máximo de 3 simultáneas; al superarse por tiempo o cantidad, se descarta automáticamente la más antigua — «Cambiar de paquete» descarta al instante la sesión actual
- Los resultados de las tareas de importación en segundo plano se conservan 1 hora
- Al reiniciar el servicio, sesiones y tareas en memoria se vacían; basta con volver a subir el paquete, y **los artículos ya importados no se ven afectados** (ya están escritos en el repositorio de contenido)

## Próximos pasos

- Revisa los artículos importados uno a uno en [Gestión de artículos](./posts.md) y quítales la marca de borrador
- Para cambiar categorías en lote, usa [Gestión de artículos · Gestión de categorías](./posts.md#gestion-de-categorias-etiquetas)
