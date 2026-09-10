---
layout: home

hero:
  name: Shirone-Admin
  text: Визуальный инструмент управления контентом для блога Shirone
  tagline: Локальная работа · Письмо с помощью ИИ · Публикация в два репозитория в один клик — от установки до справочника API начните здесь
  image:
    src: /assets/image/home/blog.svg
    alt: Shirone-Admin
  actions:
    - theme: brand
      text: Начать
      link: /ru/guide/
    - theme: alt
      text: GitHub
      link: https://github.com/bobokaka/Shirone-Admin

features:
  - title: Дашборд и предпросмотр
    icon: '<i class="fa-solid fa-gauge-high"></i>'
    details: Незапущенные изменения и статистика контента одним взглядом, со встроенным предпросмотром настоящего блога
    link: /ru/guide/dashboard
  - title: Редактирование статей
    icon: '<i class="fa-solid fa-pen-nib"></i>'
    details: Редактор Markdown в режиме исходного кода со встроенными сниппетами темы Shirone (контейнеры из трёх двоеточий, file-tree, вкладки кода и др.), изображения управляются вместе с текстом
    link: /ru/guide/post-editor
  - title: Моменты
    icon: '<i class="fa-solid fa-comments"></i>'
    details: Настроение, место, теги и сетка из девяти фото; изображения автоматически попадают в конвейер миниатюр темы
    link: /ru/guide/moments
  - title: Настройки сайта
    icon: '<i class="fa-solid fa-palette"></i>'
    details: Основная информация, навигация, подвал, внешний вид темы и обои баннера — всё редактируется визуально
    link: /ru/guide/settings
  - title: Структурированные данные
    icon: '<i class="fa-solid fa-diagram-project"></i>'
    details: Проекты, навыки, таймлайн, устройства, аниме, компас, плейлисты и ссылки из data/*.ts — визуальное редактирование и импорт через поиск
    link: /ru/guide/data
  - title: ИИ-ассистент
    icon: '<i class="fa-solid fa-wand-magic-sparkles"></i>'
    details: Переключайтесь между провайдерами — переписывание контента, генерация сообщений коммитов и черновики таймлайна доступны на каждой странице
    link: /ru/guide/ai
  - title: Импорт с платформ
    icon: '<i class="fa-solid fa-cloud-arrow-down"></i>'
    details: Массовая миграция экспортов Цзяньшу, мгновенное преобразование вставленной статьи, импорт аниме и музыки в одном месте
    link: /ru/guide/import
  - title: Публикация в один клик
    icon: '<i class="fa-solid fa-rocket"></i>'
    details: Коммит и push в оба репозитория с автоматической проверкой темы перед релизом
    link: /ru/guide/publish

highlights:
  - header: Почему Shirone-Admin
    image: /assets/image/home/diamond.svg
    bgImage: /assets/image/home/bg/1-light.svg
    bgImageDark: /assets/image/home/bg/1-dark.svg
    features:
      - title: Прозрачная история
        icon: fa-clock-rotate-left
        details: Каждая публикация — это git-коммит — видно, что и когда изменилось, и в любой момент можно откатить
      - title: Три репозитория, ясные роли
        icon: fa-cubes
        details: Инструмент, тема и контент живут в отдельных репозиториях — обновления не конфликтуют, смена темы не теряет контент
      - title: Данные принадлежат вам
        icon: fa-user-shield
        details: Статьи, настройки и медиа всегда лежат в ваших собственных репозиториях — инструмент лишь пульт, с которым можно уйти, забрав всё
      - title: Ноль обслуживания
        icon: fa-house-laptop
        details: Ни сервера, ни базы данных, ни повседневной настройки — один компьютер и есть вся инфраструктура

  - header: Запуск за три минуты
    image: /assets/image/home/box.svg
    bgImage: /assets/image/home/bg/2-light.svg
    bgImageDark: /assets/image/home/bg/2-dark.svg
    highlights:
      - Склонируйте Shirone, Shirone-Content и Shirone-Admin в одну родительскую директорию
      - Выполните pnpm install в репозиториях Shirone-Admin и Shirone
      - Запустите всё сразу командой node workspace/content-watch.mjs
      - Откройте http://localhost:5173 в браузере и войдите в панель управления
      - Подробные шаги и расширенное использование — в руководстве
---
