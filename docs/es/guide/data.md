---
title: Datos estructurados
description: Edita visualmente las ocho categorías de datos estructurados del blog — proyectos, habilidades, línea de tiempo, dispositivos, animes, brújula, lista de reproducción y enlaces de amigos, incluida la importación de animes por búsqueda, la importación de música y el borrador de línea de tiempo con IA.
---

# Datos estructurados

Los proyectos, la lista de habilidades y de dispositivos de la página «Sobre mí» del blog, la lista de animes en seguimiento de la barra lateral, los enlaces de amigos, la lista de música de fondo — todo eso son **datos estructurados**: cada categoría es un array de TypeScript en `data/*.ts` del repositorio de contenido. La página «Gestión de datos» los convierte todos en edición visual con tablas + formularios, y cada cambio **cae en el repositorio al instante**.

![Gestión de datos](/assets/guide/data.png)

## Las ocho categorías de datos

| Pestaña | Elementos | Campos representativos |
|------|------|----------|
| Proyectos | Proyectos | nombre, resumen, categoría, fase (publicado/en desarrollo/exploración), stack tecnológico, destacado |
| Habilidades | Habilidades | nombre, categoría (frontend/backend/herramientas/desarrollo de videojuegos), nivel (iniciado→experto), icono |
| Línea de tiempo | Eventos | título, fecha, categoría (hito/proyecto/experiencia/vida), puntos clave, enlaces relacionados |
| Dispositivos | Dispositivos | nombre, marca, categoría, estado (en uso/reserva/retirado/en lista de deseos), especificaciones |
| Animes | Animes | título, estado (viendo/visto/planificado/en pausa/abandonado), nota, progreso, género, portada |
| Brújula | Estanterías | nombre, icono, entradas de navegación (nombre + enlace + nota) |
| Lista de reproducción | Pistas | título, artista, portada, dirección del audio, duración |
| Enlaces de amigos | Enlaces de amigos | nombre del sitio, avatar, descripción, dirección, etiquetas |

## Operaciones comunes

- **Añadir** — abre un diálogo de edición para rellenar campo a campo; si falta un campo obligatorio, se bloquea con aviso
- **Conmutadores directos en la tabla** — campos booleanos como «Destacado» o «Habilitado» son interruptores en la propia tabla; al moverlos se guardan
- **Ordenar** — los botones ↑↓ a la derecha de cada fila ajustan el orden (el orden del array es el orden de visualización en la interfaz), con escritura inmediata en el repositorio
- **Editar / Eliminar** — Editar abre el diálogo con todos los campos rellenados; Eliminar exige doble confirmación

Varios detalles que ahorran trabajo:

- **Identificadores automáticos** — las columnas identificadoras como key de proyecto, id de dispositivo o id de pista no se rellenan a mano: al crear, el título se convierte automáticamente a slug en pinyin (con número de serie si coincide) y el id de enlaces de amigos toma el máximo +1
- **Campos de icono** — escribe un nombre de icono Iconify (p. ej. `simple-icons:typescript`) y se previsualiza al instante; todos los iconos están incluidos localmente, sin peticiones de red
- **Campos de imagen** — las portadas admiten subida local (archivada automáticamente en el directorio de recursos según el tipo de dato) o pegar una ruta; animes y lista de reproducción tienen su importación de un clic, ver más abajo
- **Listas de entradas en brújula y línea de tiempo** — los arrays anidados tipo «entradas de navegación» o «enlaces relacionados» se editan con tarjetas visuales: nombre/icono/dirección de cada subelemento en una fila, con validación de obligatorios

Todos los cambios se escriben de vuelta en `data/*.ts` mediante una **cola de guardado en serie** — las definiciones interface, los comentarios y las sentencias export del archivo se conservan letra por letra; solo se sustituye la parte del literal del array, de modo que el código mantenido a mano no se toca.

## Animes: importación por búsqueda

El botón «**Importar por búsqueda**», exclusivo de la pestaña de animes, toma datos de la API pública de [Bangumi](https://bgm.tv/):

![Importación de animes por búsqueda](/assets/guide/data-anime.png)

1. **Buscar** — introduce un título en chino/japonés/inglés y obtén la lista de candidatos (con año, episodios, nota y portada)
2. **Elegir entrada** — se obtienen automáticamente los detalles: estudio, periodo de emisión, etiquetas de género más frecuentes
3. **Confirmar** — se genera un borrador de anime nuevo con título/año/género/resumen/portada/estudio ya rellenados; **el estado y la nota los pones tú**; la imagen de portada se descarga del CDN oficial de Bangumi y se archiva en `public/assets/anime/`

Registrar lo que ves deja de exigir rellenar metadatos a mano: terminas una serie, la buscas y listo.

## Lista de reproducción: importar música

El botón «**Importar música**» de la pestaña de lista de reproducción ofrece tres vías de entrada:

- **Búsqueda con IA** — describe la canción que buscas (título/estilo); la IA busca en la red e incluye la **información de copyright** (si es de uso comercial gratuito, con enlace de referencia); tras confirmar, el audio y la portada se archivan automáticamente
- **Importación por enlace directo** — pega el enlace directo del audio y el servidor lo descarga por ti (incluso lo que el navegador no puede obtener por CORS)
- **Subida local** — sube directamente el archivo de audio

Tras importar, pulsa **▶ Escuchar** en la tabla; la barra de reproducción inferior reproduce al vuelo lo que elijas, y solo cuando suena bien, guardas.

## Línea de tiempo: borrador con IA

El botón «**Borrador con IA**» de la pestaña de línea de tiempo (visible con la IA activada) genera borradores de eventos por lotes en dos modos:

- **Modo git** — escanea el historial de commits de los tres repositorios (hasta 30 por repositorio, con estadísticas de altas y bajas de archivos) y la IA lo condensa en eventos de línea de tiempo: ideal para repasar «qué hice este mes»
- **Modo descripción** — escribes una frase descriptiva y la IA redacta eventos bien formados (título/fecha/categoría/puntos clave/etiquetas)

La lista de borradores generados se repasa **marcando uno a uno**; los eventos ya recogidos se deduplican automáticamente (comparando título + fecha). Al confirmar la inserción, cada uno entra en la posición correcta por fecha y se escribe en el repositorio, con la fecha convertida automáticamente al estilo con puntos que usa el sitio (`2025.06.01`).

## IA a nivel de campo

Los campos de texto largo tipo resumen o descripción (resumen de proyecto, descripción de habilidad, descripción de anime, descripción de enlace de amigos, descripción de línea de tiempo, descripción de dispositivo) tienen un **botón ✨** en la esquina superior derecha del diálogo de edición: con el título de la entrada ya rellenado, un clic hace que la IA genere o reescriba ese campo en 1–3 frases; el resultado va creciendo en streaming dentro de la caja, puede detenerse y retocarse a mano.

## Próximos pasos

- Con la fachada del sitio a punto, mira los [Ajustes del sitio](./settings.md)
- Con los datos completados, pasa a [Commit y publicación](./publish.md) para publicarlos
