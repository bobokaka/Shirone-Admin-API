---
layout: home

hero:
  name: Shirone Admin API
  text: Una plantilla de sitio de documentación multilingüe basada en VitePress 2.0
  tagline: 9 idiomas · Diagramas Mermaid · Fórmulas matemáticas · Búsqueda de texto completo · Modo oscuro · Canal RSS
  image:
    src: /assets/image/home/layout.svg
    alt: Shirone Admin API
  actions:
    - theme: brand
      text: Repositorio GitHub
      link: https://github.com/bobokaka/Shirone-Admin-API
    - theme: alt
      text: Documentación de VitePress
      link: https://vitepress.dev/

features:
  - title: Arquitectura multilingüe
    icon: '<i class="fa-solid fa-language"></i>'
    details: 9 configuraciones de idioma integradas (chino simplificado/tradicional, inglés, japonés, coreano, francés, alemán, español, ruso) con textos de interfaz localizados y directorios por idioma
  - title: Diagramas Mermaid
    icon: '<i class="fa-solid fa-diagram-project"></i>'
    details: Con vitepress-plugin-mermaid — diagramas de flujo, secuencia, clases y más, con soporte de modo oscuro
  - title: Fórmulas matemáticas
    icon: '<i class="fa-solid fa-square-root-variable"></i>'
    details: Fórmulas matemáticas en línea y en bloque renderizadas con MathJax 3
  - title: Búsqueda de texto completo
    icon: '<i class="fa-solid fa-magnifying-glass"></i>'
    details: Búsqueda local de VitePress con interfaz personalizable por idioma
  - title: Extensiones de Markdown
    icon: '<i class="fa-solid fa-markdown"></i>'
    details: Resaltado de texto, superíndices, subíndices y notas al pie incluidos
  - title: Comentarios y canal
    icon: '<i class="fa-solid fa-comments"></i>'
    details: Comentarios de Giscus (GitHub Discussions) y canal RSS listos para usar

highlights:
  - header: Inicio rápido
    image: /assets/image/home/box.svg
    bgImage: /assets/image/home/bg/1-light.svg
    bgImageDark: /assets/image/home/bg/1-dark.svg
    highlights:
      - Clona el repositorio y ejecuta pnpm install
      - Inicia el servidor de desarrollo con pnpm run dev y abre http://localhost:5173
      - Añade páginas Markdown en docs/es/
      - Regístralas en la configuración sidebar-generated.ts
      - Personaliza la navegación y el pie de página en config/locales/es.ts
      - Compila con pnpm run build y despliega en cualquier alojamiento estático
---
