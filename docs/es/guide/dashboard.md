---
title: Panel de control y vista previa
description: Conoce la página inicial del panel de administración de Shirone-Admin — cuatro tarjetas de estadísticas, la lista de contenido reciente y el panel de vista previa con el sitio real del blog embebido.
---

# Panel de control y vista previa

La primera página que ves al abrir `http://localhost:5173/` es el **panel de control**. Es el resumen de todo el backend: cuántos cambios pendientes de publicar hay, cuántos artículos y momentos, y una ventana de vista previa que renderiza en vivo el aspecto real de tu blog.

![Panel de control](/assets/guide/dashboard.png)

## Las cuatro tarjetas de estadísticas

| Tarjeta | Qué significa el número | Botón de acceso rápido |
|------|----------|----------|
| **Cambios pendientes de publicar** | Total de archivos con cambios git (staged + modificados + sin seguimiento) en el repositorio de contenido | «Ir a publicar» → salta a [Commit y publicación](./publish.md) |
| **Total de artículos** | Todos los artículos del repositorio de contenido (incluidos borradores) | «Gestionar artículos» → salta a [Gestión de artículos](./posts.md) |
| **Total de momentos** | Todos los momentos (incluidos borradores) | «Gestionar momentos» → salta a [Momentos](./moments.md) |
| **Total de borradores** | Suma de artículos y momentos marcados como borrador | «Seguir creando» → salta a la gestión de artículos |

«Cambios pendientes de publicar» resume todos los cambios aún sin confirmar que has hecho en el panel — tras escribir artículos y publicar momentos, si este número no es cero es que aún no se ha publicado.

## Contenido reciente

Bajo las tarjetas, dos listas muestran los **6 artículos más recientes** y los **6 momentos más recientes**:

- Cada fila de artículo muestra título y fecha de publicación; los borradores llevan una etiqueta amarilla
- Cada fila de momento muestra la hora, y etiquetas de fijado/borrador/etiquetas; el texto se recorta a las tres primeras líneas y hay hasta 3 miniaturas (clic para ampliar la vista previa)
- El botón «Más» de la esquina superior derecha salta a la página de gestión correspondiente

## Vista previa del sitio real

La tarjeta «Vista previa del sitio real», al pie de la página, embebe un iframe que carga directamente `http://localhost:4321/` — es decir, el **sitio real** que renderiza el servidor de desarrollo Astro del repositorio del tema. No es una captura ni una simulación simplificada: lo que ves en la vista previa coincide exactamente con el sitio que se publicará.

### Indicadores de estado y acciones

En la barra de herramientas superior del panel de vista previa, de izquierda a derecha:

- **Etiqueta de estado** (sondeada cada 3 segundos):
  - Sitio listo `:4321` — vista previa disponible
  - Detectado dev server ya en ejecución `:4321` — vista previa disponible (el proceso no lo arrancó este panel)
  - Iniciando, la primera vez hay que compilar… — Astro está en arranque en frío, espera un momento
  - No está en ejecución — hay que pulsar «Iniciar vista previa»
- **Iniciar vista previa / Detener** — arranca o termina desde el panel los procesos `content:watch` + `astro dev` del repositorio del tema
- **Abrir en nueva ventana** — abre una pestaña del navegador accediendo directamente a `:4321`

El panel de vista previa del panel de control no arranca procesos automáticamente (para no molestar); hay que pulsar «Iniciar vista previa» a mano. Si arrancaste con el comando único `node workspace/content-watch.mjs`, el dev server ya está corriendo y el panel mostrará directamente el estado listo.

### Por qué la vista previa es «real»

En el [Espacio de trabajo de tres repositorios](./workspace.md) se presentó el flujo de datos: guardado en el panel → escritura en el repositorio de contenido → `content:watch` materializa en el repositorio del tema → Astro recompila. Por eso, al cambiar un texto en el panel y guardar, unos segundos después el blog de la vista previa se actualiza — **lo que ves es el sitio real que estás a punto de publicar**.

## Barra superior y accesos globales

La barra superior, compartida por todas las páginas:

- **Título de la página** — nombre de la página funcional en la que estás
- **Etiqueta de estado de conexión** — «Conectado / No conectado» del repositorio de contenido (detalles en [Espacio de trabajo de tres repositorios · Cómo consultar el estado de conexión](./workspace.md#como-consultar-el-estado-de-conexion))
- **Botón ✨** — abre la [Consola de IA](./ai.md#consola-de-ia) global
- **Botón de engranaje** — abre el diálogo «Ajustes» ([configuración de proveedores de IA](./ai.md#configurar-proveedores) y página Acerca de)

## Próximos pasos

- [Escribe tu primer artículo](./posts.md)
- [Publica un momento](./moments.md)
