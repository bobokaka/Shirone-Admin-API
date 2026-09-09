---
layout: home

hero:
  name: Shirone Admin API
  text: Многоязычный шаблон сайта документации на VitePress 2.0
  tagline: 9 языков · Диаграммы Mermaid · Формулы · Полнотекстовый поиск · Тёмная тема · RSS-лента
  image:
    src: /assets/image/home/layout.svg
    alt: Shirone Admin API
  actions:
    - theme: brand
      text: Репозиторий GitHub
      link: https://github.com/bobokaka/Shirone-Admin-API
    - theme: alt
      text: Документация VitePress
      link: https://vitepress.dev/

features:
  - title: Многоязычная архитектура
    icon: '<i class="fa-solid fa-language"></i>'
    details: 9 встроенных конфигураций языков (китайский упрощённый/традиционный, английский, японский, корейский, французский, немецкий, испанский, русский) с локализованным интерфейсом и отдельными каталогами
  - title: Диаграммы Mermaid
    icon: '<i class="fa-solid fa-diagram-project"></i>'
    details: На базе vitepress-plugin-mermaid — блок-схемы, диаграммы последовательности, классов и другие, с поддержкой тёмной темы
  - title: Математические формулы
    icon: '<i class="fa-solid fa-square-root-variable"></i>'
    details: Строчные и блочные формулы, отображаемые MathJax 3
  - title: Полнотекстовый поиск
    icon: '<i class="fa-solid fa-magnifying-glass"></i>'
    details: Локальный поиск VitePress с настройкой интерфейса для каждого языка
  - title: Расширения Markdown
    icon: '<i class="fa-solid fa-markdown"></i>'
    details: Выделение текста, верхний и нижний индексы, сноски из коробки
  - title: Комментарии и лента
    icon: '<i class="fa-solid fa-comments"></i>'
    details: Комментарии Giscus (GitHub Discussions) и RSS-лента, готовые к использованию

highlights:
  - header: Быстрый старт
    image: /assets/image/home/box.svg
    bgImage: /assets/image/home/bg/1-light.svg
    bgImageDark: /assets/image/home/bg/1-dark.svg
    highlights:
      - Клонируйте репозиторий и выполните pnpm install
      - Запустите сервер разработки командой pnpm run dev и откройте http://localhost:5173
      - Добавляйте Markdown-страницы в каталог docs/ru/
      - Зарегистрируйте их в конфигурации sidebar-generated.ts
      - Настройте навигацию и подвал в config/locales/ru.ts
      - Соберите проект командой pnpm run build и разверните на любом статическом хостинге
---
