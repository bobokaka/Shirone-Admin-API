---
title: Импорт из Цзяньшу
description: Справочник по /api/import/jianshu/* — сессии архивов экспорта, фоновые задачи импорта, преобразование вставки отдельной статьи и ИИ-подсказки метаданных.
---

# Импорт из Цзяньшу

Две группы интерфейсов миграции из Цзяньшу (Jianshu): **поток архива экспорта** (сессионный: загрузка → список → предпросмотр → фоновая задача) и **поток вставки отдельной статьи** (без сессии, вставил — и готово).

Сессии и задачи живут в **памяти сервера**: сессия действует 24 часа, максимум 3 (вытеснение LRU), результат задачи хранится 1 час, перезапуск службы всё очищает — на импортированные статьи это не влияет (они уже в репозитории).

## POST /api/import/jianshu/archive

Загрузка архива экспорта Цзяньшу (multipart).

| Поле формы | Обязателен | Описание |
|----------|------|------|
| `file` | да | Архив rar / zip, ≤30 МБ |

**Побочные эффекты**: распаковка и разбор в памяти (без записи на диск). **Возвращаемое значение** `JianshuArchiveSummary`:

```json
{
  "sessionId": "s-xxxx",
  "notebooks": [{ "name": "技术随笔", "articles": [{ "id": "技术随笔/a.md", "title": "标题", "bytes": 8213 }] }],
  "total": 42,
  "importedIds": ["技术随笔/a.md"]
}
```

`id` — уникальный внутри сессии идентификатор (нормализованный путь в архиве); корневые статьи вне сборников попадают в группу «未分组».

```bash
curl -X POST http://127.0.0.1:5175/api/import/jianshu/archive \
  -F "file=@jianshu-export.zip"
```

## GET /api/import/jianshu/preview

Предпросмотр преобразования одной статьи, **без записи на диск**; изображения остаются удалёнными ссылками.

| Query-параметр | Обязателен | Описание |
|------------|------|------|
| `sessionId` | да | id сессии из предыдущего шага |
| `id` | да | id статьи |

**Возвращаемое значение** `JianshuPreview`: `{ title, markdown, imageCount, wordCount }` — `wordCount` это число знаков чистого текста (слишком малое может означать, что остался только текст-заглушка).

```bash
curl "http://127.0.0.1:5175/api/import/jianshu/preview?sessionId=s-xxxx&id=技术随笔/a.md"
```

## POST /api/import/jianshu/run

Запускает **фоновую задачу импорта**; сразу возвращается, дальше прогресс опрашивается.

| Поле body | Тип | Обязателен | Описание |
|-----------|------|------|------|
| `sessionId` | `string` | да | id сессии |
| `ids` | `string[]` | да | id импортируемых статей, 1–2000 штук |
| `options.published` | `string` | да | Единая дата публикации `YYYY-MM-DD` (архив экспорта не содержит дат) |
| `options.categoryFromNotebook` | `boolean` | да | Имя сборника как категория |
| `options.category` | `string` | нет | Общая категория, когда не по сборникам (≤40 символов) |
| `options.tags` | `string[]` | да | Единые теги (≤12 штук, каждый ≤30 символов) |
| `options.localizeImages` | `boolean` | да | Скачивание изображений в репозиторий (при сбое сохраняется удалённая ссылка) |
| `options.draft` | `boolean` | да | Импортировать черновиками |

**Возвращаемое значение** `{ jobId }`. **Побочные эффекты**: пофайловая запись `content/posts/<slug>/index.md`, скачивание изображений.

```bash
curl -X POST http://127.0.0.1:5175/api/import/jianshu/run \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"s-xxxx","ids":["技术随笔/a.md"],"options":{"published":"2026-09-10","categoryFromNotebook":true,"tags":["简书迁移"],"localizeImages":true,"draft":true}}'
```

## GET /api/import/jianshu/job

Опрос прогресса задачи (рекомендуемый интервал 2 секунды).

| Query-параметр | Обязателен | Описание |
|------------|------|------|
| `id` | да | id задачи |

**Возвращаемое значение** `JianshuImportJob`: `{ id, sessionId, status: "running" | "done", total, done, current, results, log }`. Каждая запись `results` — `{ id, title, ok, path?, error?, images }`; `log` хранит последние 200 строк.

```bash
curl "http://127.0.0.1:5175/api/import/jianshu/job?id=job-xxxx"
```

## DELETE /api/import/jianshu/session

Отбрасывает сессию (очищает кэш архива). Отказывает, если задача выполняется.

| Query-параметр | Обязателен | Описание |
|------------|------|------|
| `id` | да | id сессии |

**Возвращаемое значение** `{ ok: boolean }`.

```bash
curl -X DELETE "http://127.0.0.1:5175/api/import/jianshu/session?id=s-xxxx"
```

## POST /api/import/jianshu/paste-preview

**Предпросмотр преобразования** вставки отдельной статьи (без записи на диск). Хотя бы одна из трёх полезных нагрузок непуста, каждая ≤2 МБ; приоритет разбора: **markdown (финал из редактора) > html (форматированный текст) > text (чистый текст как запасной вариант Markdown)**.

| Поле body | Тип | Обязателен | Описание |
|-----------|------|------|------|
| `markdown` | `string` | один из трёх | Финал из редактора, приоритетнее всех |
| `html` | `string` | один из трёх | Форматированный текст (копия с веб-страницы), конвертируется в Markdown |
| `text` | `string` | один из трёх | Чистый текст как запасной вариант |

**Возвращаемое значение** то же, что у `JianshuPreview`.

```bash
curl -X POST http://127.0.0.1:5175/api/import/jianshu/paste-preview \
  -H "Content-Type: application/json" \
  -d '{"html":"<h1>标题</h1><p>段落</p>"}'
```

## POST /api/import/jianshu/paste-run

**Запись в репозиторий** вставки отдельной статьи: изображения автоматически скачиваются в каталог статьи (при сбое сохраняется удалённая ссылка).

Body = полезная нагрузка вставки (как выше) + `options`:

| Поле | Ограничения |
|------|------|
| `title` | Обязательно, 1–100 символов |
| `published` | Обязательно, `YYYY-MM-DD` |
| `category` | Необязательно, ≤40 символов |
| `tags` | ≤12 штук, каждый ≤30 символов |
| `draft` | boolean |

**Возвращаемое значение** `JianshuPasteResult`: `{ title, path, slug, images, failedImages[] }` — `images` это число успешно локализованных, `failedImages` — изображения, оставшиеся удалёнными ссылками.

```bash
curl -X POST http://127.0.0.1:5175/api/import/jianshu/paste-run \
  -H "Content-Type: application/json" \
  -d '{"markdown":"# 标题\n正文","options":{"title":"标题","published":"2026-09-10","tags":[],"draft":true}}'
```

## POST /api/import/jianshu/suggest-meta

ИИ анализирует текст и дополняет метаданные (при выключенном ИИ или сбое автоматический откат к началу текста, `aiUsed=false`).

| Поле body | Тип | Обязателен | Описание |
|-----------|------|------|------|
| `title` | `string` | нет | Пусто = пусть ИИ заодно предложит и заголовок, ≤100 символов |
| `markdown` | `string` | да | Текст статьи, 1–2 МБ |

**Возвращаемое значение** `JianshuMetaSuggestion`: `{ title?, description, category, tags[], aiUsed }`.

```bash
curl -X POST http://127.0.0.1:5175/api/import/jianshu/suggest-meta \
  -H "Content-Type: application/json" \
  -d '{"title":"","markdown":"# 我的博客搭建记\n…"}'
```
