---
title: Ajustes del sitio
description: Configura todo el sitio sin escribir una línea de YAML — cinco secciones (información básica, navegación, pie de página, apariencia del tema y fondos del banner) con la vista previa del sitio real aplicándose en vivo a la derecha.
---

# Ajustes del sitio

La página «Ajustes del sitio» convierte en formularios toda la configuración del tema: formularios por secciones a la izquierda y, a la derecha, la [vista previa del sitio real](./dashboard.md#vista-previa-del-sitio-real) embebida; guardas, la vista previa se refresca, y lo que ves es lo que obtienes.

La página se organiza en cinco pestañas: **Información básica**, **Navegación**, **Pie de página**, **Apariencia del tema** y **Fondos del banner**.

![Ajustes del sitio · Información básica](/assets/guide/settings.png)

## Información básica

Siete secciones, cada una con guardado independiente:

| Sección | Qué se configura |
|------|----------|
| Información del sitio | Nombre del sitio, subtítulo (el subtítulo lleva generación de una frase con IA ✨) |
| Perfil personal | Avatar (URL en línea o subida local, renombrado y archivado automáticamente), apodo, firma (también con IA ✨) |
| Enlaces sociales | Lista de enlaces externos tipo GitHub / Bilibili: nombre, icono Iconify, dirección |
| Favicon del sitio | Dos huecos, claro / oscuro; sin personalizar, muestra el aviso del icono del tema vigente por defecto; la subida se nombra automáticamente `favicon-light/dark.<ext>` y sustituye en el mismo sitio, aunque también puede rellenarse una dirección en línea |
| Ajustes generales | Dirección del sitio (el dominio final tras desplegar), subruta (`/` para despliegue en la raíz), zona horaria (desplegable con zonas habituales, admite escritura manual) |
| Panel de visualización del visitante | Interruptores que controlan lo que la interfaz del blog ofrece al visitante: selector de paleta, cambio de norma de color, modo de fondo, diseño de listas, reducir animaciones, textura de fondo |
| Internacionalización | Si se abre el sitio a varios idiomas: marca el conjunto de idiomas habilitados; el idioma principal del sitio debe estar en el conjunto; desactivado, todo el sitio queda fijado al chino simplificado |

## Navegación

Un editor visual del menú de navegación:

- **Preset del tema** — elige entre 15 presets integrados (inicio, archivo, enlaces de amigos, etc.) y conéctalos con un clic
- **Enlace personalizado** — nombre + icono + dirección, con opción «abrir en ventana nueva»
- **Grupo desplegable** — arrastra para crear menús de segundo nivel y agrupar entradas afines

La configuración de navegación se guarda como bloque; los arrays tienen semántica de **sustitución completa**.

## Pie de página

- **Interruptor de activación** — controla si el contenido personalizado del pie se inyecta encima de la línea de copyright del tema
- **Editor HTML** — editor de código CodeMirror con botón de **formateo Prettier**; el HTML del pie se guarda tal cual en `config/footer.html` del repositorio de contenido
- **Biblioteca de imágenes del pie** — sube imágenes o pega enlaces directos en línea (el servidor los descarga por ti; los webp se convierten automáticamente a png/jpg) y se archivan en `public/images/footer/`; pulsa «Copiar ruta» para pegarla en el HTML
- **Vista previa en vivo** — un iframe reproduce de forma aproximada el render del pie del tema: línea de copyright + tu contenido personalizado

## Apariencia del tema

![Ajustes del sitio · Apariencia del tema](/assets/guide/settings-appearance.png)

Dos secciones:

### Paleta del tema

- **Deslizador de tono** (0–360) — muestra en vivo la vista previa de una paleta de 5 niveles generada con ese tono
- **Fijar** — al marcarlo, el tono del sitio no cambia con el contenido ni con las preferencias del visitante
- **Estilo de color** — los 9 estilos de color dinámico de Material 3: tonalSpot (clásico suave), vibrant (vivo), content (tomado del contenido), expressive, rainbow, fruitSalad, monochrome, neutral, fidelity
- **Norma de color** — las dos generaciones de norma de Material 3: 2021 / 2025

### Fondo y textura

- **Modo de fondo predeterminado** — banner / none, a elegir; decide el aspecto por defecto de la interfaz cuando no hay fondo seleccionado
- **Textura de fondo** — seis presets: none, starlight (estrellas), cyber-dots (punteado cyber), topography (curvas de nivel), geometric (geométrica), sakura (cerezo); opacidad 0.05–0.25; interruptor de animación

## Fondos del banner

Control completo del banner de la página de inicio:

- **Dos listas, fondo de escritorio / móvil** — subida local, importación de enlace directo en línea (el servidor lo descarga), botón de **fondos recomendados por IA** (obtiene del origen safebooru un lote filtrado por tamaño: escritorio ≥1920 horizontal, móvil ≥1920 vertical; marca y descarga al repositorio)
- **Control de visualización** — posición (top/center/bottom), velo (interruptor + opacidad)
- **Textos de la portada** — título, varios subtítulos, efecto máquina de escribir (velocidad/velocidad de borrado/pausa/bucle); en los subtítulos puedes pulsar **Generar con IA** para crear de una vez 4–6 frases rotativas a partir del nombre y la firma del sitio
- **Carrusel** — se activa con varios fondos; intervalo de cambio, duración del fundido y seis animaciones de transición (ken-burns con travelling lento, zoom-in/out, pan-left/right, none)
- **Decoración de olas** — interruptor de la animación de olas al pie del banner

> [!TIP]
> Al guardar el banner, los archivos de fondos locales que ya no use ni el escritorio ni el móvil se **limpian automáticamente**; no hace falta borrar archivos a mano.

## Dónde cae la configuración

Todos los ajustes se escriben en `config/*.yaml` del repositorio de contenido siguiendo el principio de **sobrescritura mínima**: solo se escriben las claves que has cambiado y los campos no declarados heredan los valores por defecto del tema — cuando una actualización del tema añada opciones, tu sitio las adopta solo, sin quedarse clavado en una versión antigua por culpa de una «instantánea completa». Las claves de diccionario se fusionan recursivamente; los arrays se sustituyen por completo.

## Próximos pasos

- Usa los [Datos estructurados](./data.md) para dar contenido a la página «Sobre mí»
- Al terminar la configuración, comprueba el resultado en la [vista previa del sitio real](./dashboard.md#vista-previa-del-sitio-real) y, satisfecho, [publica](./publish.md)
