---
title: Структурированные данные
description: Справочник по чтению и записи восьми типов структурированных данных /api/data/:kind и по поиску записей аниме с импортом обложек /api/bangumi/*.
---

# Структурированные данные

Модуль структурированных данных читает и пишет `data/*.ts` контент-репозитория — `interface`, комментарии и операторы экспорта в файле **сохраняются буква в букву**, целиком заменяется только экспортируемый литерал массива. Чтение идёт через динамический import в tsx (с mtime-query против кэша), поля-перечисления проверяются перед сохранением.

## Соответствие kind и файлов

Параметр пути `kind` — один из восьми:

| `kind` | Файл | Экспортируемый массив | Записи |
|--------|------|----------|------|
| `projects` | `data/projects.ts` | `projectsData` | Проекты |
| `skills` | `data/skills.ts` | `skillsData` | Навыки |
| `timeline` | `data/timeline.ts` | `timelineData` | События таймлайна |
| `devices` | `data/devices.ts` | `devicesData` | Устройства |
| `anime` | `data/anime.ts` | `animeData` | Аниме |
| `compass` | `data/compass.ts` | `compassData` | Полки компаса |
| `music` | `data/music.ts` | `musicTracks` | Треки плейлиста |
| `friends` | `data/friends.ts` | `friendsData` | Друзья сайта |

## GET /api/data/:kind

**Возвращаемое значение** `{ kind, items: DataItem[] }` — `DataItem` это слабо типизированный объект (структура полей — в interface соответствующего файла или в таблице полей [Руководство · Структурированные данные](../guide/data.md#восемь-типов-данных)).

```bash
curl http://127.0.0.1:5175/api/data/friends
```

## PUT /api/data/:kind

**Полная замена** всех записей данного типа данных.

| Поле body | Тип | Обязателен | Описание |
|-----------|------|------|------|
| `items` | `object[]` | да | Все записи целиком (сначала GET, правка, затем PUT — не отправляйте только дельту) |

**Возвращаемое значение** `{ ok: true, changed }`. **Побочные эффекты**: перезаписывает интервал массива в `data/*.ts`; остальная часть файла не трогается.

```bash
curl -X PUT http://127.0.0.1:5175/api/data/skills \
  -H "Content-Type: application/json" \
  -d '{"items":[{"name":"TypeScript","category":"frontend","level":"advanced","enable":true}]}'
```

---

# Поиск аниме Bangumi

Тройка интерфейсов импорта аниме; данные берутся из открытого API Bangumi и служат для автодополнения записей аниме.

## GET /api/bangumi/search

| Query-параметр | Обязателен | Описание |
|------------|------|------|
| `keyword` | да | Ключевое слово, 1–100 символов (поиск всегда идёт по записям типа «анимация») |

**Возвращаемое значение** `{ candidates: BangumiCandidate[] }` — каждая запись содержит `id` (subject id Bangumi), `title` / `originalTitle`, `year`, `cover?`, `summary`, `eps`, `bangumiScore?`, `link`.

```bash
curl "http://127.0.0.1:5175/api/bangumi/search?keyword=葬送的芙莉莲"
```

## GET /api/bangumi/subject

| Query-параметр | Обязателен | Описание |
|------------|------|------|
| `id` | да | Subject id Bangumi (положительное целое; строка тоже подходит) |

**Возвращаемое значение** `BangumiDetail`: расширяет Candidate полями `studio?` (студия), `period?` (эфирный период `{ start, end? }`), `genres[]` (частотные теги типов, ≤4).

```bash
curl "http://127.0.0.1:5175/api/bangumi/subject?id=463652"
```

## POST /api/bangumi/cover-import

Импорт изображения обложки: сервер скачивает его с хостинга Bangumi и записывает в `public/assets/anime/` с именем по заголовку записи.

| Поле body | Тип | Обязателен | Описание |
|-----------|------|------|------|
| `url` | `string` | да | Прямая ссылка на обложку. **Проверка по белому списку**: принимаются только `lain.bgm.tv` / `api.bgm.tv` / `bgm.tv` / `bangumi.tv` / `ei.hdslb.com`, остальное 400 |
| `title` | `string` | да | Заголовок записи (1–200 символов, используется для имени) |
| `currentPath` | `string` | нет | При попадании в тот же каталог — замена на месте |

**Возвращаемое значение** `MediaUploadResult`.

```bash
curl -X POST http://127.0.0.1:5175/api/bangumi/cover-import \
  -H "Content-Type: application/json" \
  -d '{"url":"https://lain.bgm.tv/pic/cover/l/xx.jpg","title":"葬送的芙莉莲"}'
```
