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
  - title: Редактирование статей
    icon: '<i class="fa-solid fa-file-pen"></i>'
    details: Редактор Markdown в режиме исходного кода со встроенными сниппетами темы Shirone (контейнеры из трёх двоеточий, file-tree, вкладки кода и др.), изображения управляются вместе с текстом
  - title: Моменты
    icon: '<i class="fa-solid fa-comment-dots"></i>'
    details: Публикация и управление короткими записями, изображения автоматически попадают в каталог конвейера миниатюр темы
  - title: Структурированные данные
    icon: '<i class="fa-solid fa-table-list"></i>'
    details: Визуальное редактирование проектов, навыков, таймлайна, устройств, аниме, навигации и остальных data/*.ts
  - title: ИИ-ассистент
    icon: '<i class="fa-solid fa-robot"></i>'
    details: Переключение между несколькими провайдерами — переписывание импортированного, генерация сообщений коммитов, черновики таймлайна
  - title: Импорт контента
    icon: '<i class="fa-solid fa-file-import"></i>'
    details: Импорт в одном месте — экспорты Jianshu, аниме (Bangumi API) и музыка
  - title: Публикация в один клик
    icon: '<i class="fa-solid fa-rocket"></i>'
    details: Коммит и push в оба репозитория с автоматической проверкой темы перед релизом

highlights:
  - header: Почему Shirone-Admin
    image: /assets/image/home/diamond.svg
    bgImage: /assets/image/home/bg/1-light.svg
    bgImageDark: /assets/image/home/bg/1-dark.svg
    features:
      - title: Локальность прежде всего
        icon: fa-house-laptop
        details: Все данные хранятся в вашем собственном контент-репозитории — локальный инструмент без развёртывания сервера
      - title: Предпросмотр реального сайта
        icon: fa-eye
        details: Встроенный astro dev из репозитория темы — вы видите тот самый сайт, который скоро опубликуете
      - title: Работа трёх репозиториев
        icon: fa-cubes
        details: Действует сообща с репозиторием темы Shirone и репозиторием Shirone-Content, каждое изменение отслеживается
      - title: Безопасная публикация
        icon: fa-shield-halved
        details: Проверка темы запускается автоматически перед публикацией и блокирует релиз при ошибке

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
