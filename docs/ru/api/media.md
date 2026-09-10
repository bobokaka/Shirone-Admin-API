---
title: Загрузка медиа
description: Справочник по всем интерфейсам загрузки /api/media/* — иллюстрации статей, изображения моментов, изображения сайта, обложки данных и аудио музыки, включая карту целевых каталогов для каждого target/kind.
---

# Загрузка медиа

Медиамодуль обрабатывает запись в репозиторий всех двоичных файлов. Все интерфейсы загрузки — **multipart-форма**, один файл за раз, файл ≤30 МБ; белый список расширений изображений `webp / png / jpg / jpeg / gif / avif` (для favicon дополнительно `ico / svg`).

Каталоги записи интерфейсов (все внутри контент-репозитория):

| Сценарий | Каталог |
|------|------|
| Иллюстрации статей | `content/posts/<slug>/images/` |
| Изображения моментов | `public/images/moments/<партия>/` |
| Баннер (десктоп/мобильный) | `assets/images/banner/desktop/`, `assets/images/banner/mobile/` |
| Аватар | `assets/images/avatar/` |
| Изображения подвала | `public/images/footer/` |
| favicon | `public/favicon/` |
| Обложки данных | по kind — см. [таблицу ниже](#post-api-media-data-cover) |
| Аудио треков | `public/assets/music/url/` |

## POST /api/media/post-image

Загрузка иллюстрации статьи в `images/` указанного каталога статьи.

| Поле формы | Обязателен | Описание |
|----------|------|------|
| `file` | да | Файл изображения |
| `slug` | да | Slug статьи (определяет каталог записи) |

**Возвращаемое значение** `MediaUploadResult`: `{ src, fileName }` — `src` это путь для ссылки из frontmatter / текста (относительный путь `./images/<name>`), вставляется прямо в Markdown.

```bash
curl -X POST http://127.0.0.1:5175/api/media/post-image \
  -F "slug=hello" -F "file=@cover.webp"
```

## POST /api/media/moment-image

Загрузка изображения момента в `public/images/moments/<партия>/`. Правила каталога партии задаются конвейером миниатюр темы, **обойти их нельзя**.

| Поле формы | Обязателен | Описание |
|----------|------|------|
| `file` | да | Файл изображения |
| `batchId` | нет | Имя каталога партии (`[\w-]+`, например `20260910-103000`); если не задано, сервер генерирует его по текущему времени |

**Возвращаемое значение** `MediaUploadResult`: `{ src, fileName, batchId? }` — `src` это абсолютный путь на сайте (`/images/moments/<партия>/<name>`); возвращённый `batchId` переиспользуется при догрузке в ту же партию.

```bash
curl -X POST http://127.0.0.1:5175/api/media/moment-image \
  -F "batchId=20260910-103000" -F "file=@photo.webp"
```

## GET /api/media/site-images

Список каталогов хранения изображений сайта (для библиотеки изображений подвала и др.).

| Query-параметр | Обязателен | Описание |
|------------|------|------|
| `target` | да | Идентификатор каталога, 1–40 символов (например `footer`) |

**Возвращаемое значение** `SiteMediaResult[]`: каждая запись `{ src, previewUrl, fileName }`.

```bash
curl "http://127.0.0.1:5175/api/media/site-images?target=footer"
```

## POST /api/media/site-image

Загрузка изображения сайта (multipart).

| Поле формы | Обязателен | Описание |
|----------|------|------|
| `file` | да | Файл изображения |
| `target` | да | `banner-desktop` / `banner-mobile` / `avatar` / `footer` / `favicon` |
| `name` | нет | Фиксированное имя файла (для замены слота favicon, например `favicon-light`) |
| `currentSrc` | нет | Текущее значение поля; если указывает в каталог того же target, старый файл **заменяется на месте** (так работает обновление аватара) |

**Возвращаемое значение** `SiteMediaResult`: `src` — путь, записываемый в YAML, `previewUrl` — прямая ссылка предпросмотра в панели.

```bash
curl -X POST http://127.0.0.1:5175/api/media/site-image \
  -F "target=avatar" -F "currentSrc=assets/images/avatar/old.webp" -F "file=@me.webp"
```

## POST /api/media/site-image-import

**Импорт изображения сайта по удалённой прямой ссылке**: сервер скачивает сам (обходя ограничения CORS браузера) и далее пишет как site-image; webp автоматически конвертируется в png/jpg (совместимость темы).

| Поле body | Тип | Обязателен | Описание |
|-----------|------|------|------|
| `target` | `string` | да | Как у site-image |
| `url` | `string` | да | Прямая ссылка http(s), ≤2000 символов |
| `name` | `string` | нет | Заданное имя файла |
| `currentSrc` | `string` | нет | Цель замены на месте |

**Возвращаемое значение** то же `SiteMediaResult`.

```bash
curl -X POST http://127.0.0.1:5175/api/media/site-image-import \
  -H "Content-Type: application/json" \
  -d '{"target":"footer","url":"https://example.com/badge.png"}'
```

## POST /api/media/data-cover

Загрузка обложки структурированных данных (multipart). kind определяет каталог записи:

| `kind` | Каталог |
|--------|------|
| `anime` | `public/assets/anime/` |
| `projects` | `public/assets/projects/` |
| `devices` | `public/images/devices/` |
| `friends` | `public/images/friends/` |
| `music` | `assets/images/music/` |

| Поле формы | Обязателен | Описание |
|----------|------|------|
| `file` | да | Файл изображения |
| `kind` | да | Один из пяти в таблице выше |
| `path` | нет | Текущий путь обложки записи; при попадании в тот же каталог — **перезапись на месте** (замена картинки не оставляет старых файлов) |

**Возвращаемое значение** `MediaUploadResult`.

```bash
curl -X POST http://127.0.0.1:5175/api/media/data-cover \
  -F "kind=anime" -F "file=@cover.webp"
```

## POST /api/media/data-cover-import

Импорт обложки данных по удалённой прямой ссылке (сценарии вроде CDN-обложек, найденных ИИ); kind и каталогы — как выше.

| Поле body | Тип | Обязателен | Описание |
|-----------|------|------|------|
| `kind` | `string` | да | Одно из пяти значений перечисления |
| `url` | `string` | да | Прямая ссылка, ≤2000 символов |
| `title` | `string` | нет | Для генерации читаемого имени файла |
| `currentPath` | `string` | нет | Цель перезаписи на месте |

```bash
curl -X POST http://127.0.0.1:5175/api/media/data-cover-import \
  -H "Content-Type: application/json" \
  -d '{"kind":"music","url":"https://cdn.example.com/track-cover.jpg","title":"晴天"}'
```

## POST /api/media/music-audio

Локальная загрузка аудио трека (multipart) → `public/assets/music/url/`.

| Поле формы | Обязателен | Описание |
|----------|------|------|
| `file` | да | Аудиофайл |
| `currentSrc` | нет | Цель замены на месте |

```bash
curl -X POST http://127.0.0.1:5175/api/media/music-audio \
  -F "file=@song.mp3"
```

## POST /api/media/music-download

Скачивание аудио трека **по удалённой прямой ссылке** на стороне сервера с записью в репозиторий (скачается даже то, что браузеру недоступно из-за CORS).

| Поле body | Тип | Обязателен | Описание |
|-----------|------|------|------|
| `url` | `string` | да | Прямая ссылка на аудио, ≤2000 символов |
| `filename` | `string` | нет | Заданное имя файла |
| `currentPath` | `string` | нет | Цель замены на месте |

```bash
curl -X POST http://127.0.0.1:5175/api/media/music-download \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com/song.mp3"}'
```
