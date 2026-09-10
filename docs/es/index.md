---
layout: home

hero:
  name: Shirone-Admin
  text: La herramienta de gestión visual de contenidos para tu blog Shirone
  tagline: Funciona en local · Escritura asistida por IA · Publicación en dos repositorios con un clic — desde la instalación hasta la referencia de API, empieza aquí
  image:
    src: /assets/image/home/blog.svg
    alt: Shirone-Admin
  actions:
    - theme: brand
      text: Comenzar
      link: /es/guide/
    - theme: alt
      text: GitHub
      link: https://github.com/bobokaka/Shirone-Admin

features:
  - title: Panel de control y vista previa
    icon: '<i class="fa-solid fa-gauge-high"></i>'
    details: Cambios pendientes y estadísticas de contenido de un vistazo, con vista previa integrada de tu blog real
    link: /es/guide/dashboard
  - title: Edición de artículos
    icon: '<i class="fa-solid fa-pen-nib"></i>'
    details: Editor Markdown en modo fuente con fragmentos propios del tema Shirone (contenedores de triple dos puntos, file-tree, pestañas de código, etc.), imágenes gestionadas junto al texto
    link: /es/guide/post-editor
  - title: Momentos
    icon: '<i class="fa-solid fa-messages"></i>'
    details: Ánimo, ubicación, etiquetas y cuadrícula de nueve fotos, con imágenes archivadas automáticamente en el pipeline de miniaturas del tema
    link: /es/guide/moments
  - title: Ajustes del sitio
    icon: '<i class="fa-solid fa-palette"></i>'
    details: Información básica, navegación, pie de página, apariencia del tema y fondos de banner — todo se edita visualmente
    link: /es/guide/settings
  - title: Datos estructurados
    icon: '<i class="fa-solid fa-diagram-project"></i>'
    details: Proyectos, habilidades, línea de tiempo, dispositivos, animes, brújula, playlists y enlaces de data/*.ts, con edición visual e importación por búsqueda
    link: /es/guide/data
  - title: Asistente de IA
    icon: '<i class="fa-solid fa-wand-magic-sparkles"></i>'
    details: Cambia entre proveedores para reescribir contenido, generar mensajes de commit y redactar líneas de tiempo — disponible en cada página
    link: /es/guide/ai
  - title: Importación desde plataformas
    icon: '<i class="fa-solid fa-cloud-arrow-down"></i>'
    details: Migra por lotes exportaciones de Jianshu, convierte al instante artículos pegados, importa animes y música en un solo lugar
    link: /es/guide/import
  - title: Publicación con un clic
    icon: '<i class="fa-solid fa-rocket-launch"></i>'
    details: Commit y push de git a ambos repositorios, con validación automática del tema antes de publicar
    link: /es/guide/publish

highlights:
  - header: Por qué Shirone-Admin
    image: /assets/image/home/diamond.svg
    bgImage: /assets/image/home/bg/1-light.svg
    bgImageDark: /assets/image/home/bg/1-dark.svg
    features:
      - title: Primero local
        icon: fa-hard-drive
        details: Todos los datos viven en tu propio repositorio de contenido — una herramienta local, sin servidores que desplegar
      - title: Vista previa del sitio real
        icon: fa-window-maximize
        details: astro dev del repositorio del tema integrado — lo que ves es el sitio real que estás a punto de publicar
      - title: Flujo de tres repositorios
        icon: fa-cubes
        details: Colabora con el repositorio del tema Shirone y el de Shirone-Content, con trazabilidad clara de cada cambio
      - title: Publicación segura
        icon: fa-clipboard-check
        details: La validación del tema se ejecuta automáticamente antes de publicar y bloquea la salida si falla

  - header: Listo en tres minutos
    image: /assets/image/home/box.svg
    bgImage: /assets/image/home/bg/2-light.svg
    bgImageDark: /assets/image/home/bg/2-dark.svg
    highlights:
      - Clona Shirone, Shirone-Content y Shirone-Admin en el mismo directorio padre
      - Ejecuta pnpm install en los repositorios Shirone-Admin y Shirone
      - Arranca todo a la vez con node workspace/content-watch.mjs
      - Abre http://localhost:5173 en el navegador para entrar al panel de administración
      - Consulta la guía para los pasos detallados y el uso avanzado
---
