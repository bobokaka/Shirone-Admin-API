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
  - title: Edición de artículos
    icon: '<i class="fa-solid fa-file-pen"></i>'
    details: Editor Markdown en modo fuente con fragmentos propios del tema Shirone (contenedores de triple dos puntos, file-tree, pestañas de código, etc.), imágenes gestionadas junto al texto
  - title: Momentos
    icon: '<i class="fa-solid fa-comment-dots"></i>'
    details: Publica y gestiona publicaciones cortas, con imágenes archivadas automáticamente en el directorio del pipeline de miniaturas del tema
  - title: Datos estructurados
    icon: '<i class="fa-solid fa-table-list"></i>'
    details: Edición visual de proyectos, habilidades, línea de tiempo, dispositivos, animes, navegación y demás data/*.ts
  - title: Asistente de IA
    icon: '<i class="fa-solid fa-robot"></i>'
    details: Cambio entre varios proveedores — reescritura de importaciones, generación de mensajes de commit, borradores de línea de tiempo
  - title: Importación de contenido
    icon: '<i class="fa-solid fa-file-import"></i>'
    details: Importación en un solo lugar — exportaciones de Jianshu, animes (API de Bangumi) y música
  - title: Publicación con un clic
    icon: '<i class="fa-solid fa-rocket"></i>'
    details: Commit y push de git a ambos repositorios, con validación automática del tema antes de publicar

highlights:
  - header: Por qué Shirone-Admin
    image: /assets/image/home/diamond.svg
    bgImage: /assets/image/home/bg/1-light.svg
    bgImageDark: /assets/image/home/bg/1-dark.svg
    features:
      - title: Primero local
        icon: fa-house-laptop
        details: Todos los datos viven en tu propio repositorio de contenido — una herramienta local, sin servidores que desplegar
      - title: Vista previa del sitio real
        icon: fa-eye
        details: astro dev del repositorio del tema integrado — lo que ves es el sitio real que estás a punto de publicar
      - title: Flujo de tres repositorios
        icon: fa-cubes
        details: Colabora con el repositorio del tema Shirone y el de Shirone-Content, con trazabilidad clara de cada cambio
      - title: Publicación segura
        icon: fa-shield-halved
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
