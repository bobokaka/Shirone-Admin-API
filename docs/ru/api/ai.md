---
title: ИИ-службы
description: Справочник по интерфейсам /api/ai/* — настройка провайдеров, диалог и потоковая перезапись (SSE), генерация сообщений коммита, черновики таймлайна, поиск музыки и подбор обоев.
---

# ИИ-службы

ИИ-модуль охватывает управление конфигурацией и все ИИ-рабочие процессы. Кроме подбора обоев, **все интерфейсы требуют включённого ИИ** (главный переключатель включен + конфигурация активного провайдера полна), иначе возвращается `400` «AI 助手未启用…».

Конфигурация хранится локально в `server/data/ai-settings.json` (gitignore) и полностью изолирована от контент-репозитория.

## GET /api/ai/settings

**Возвращаемое значение** `AiSettings`:

```json
{
  "enable": true,
  "providers": [
    {
      "id": "uuid", "name": "Anthropic 官方",
      "protocol": "anthropic", "baseUrl": "https://api.anthropic.com",
      "apiKey": "sk-…", "model": "claude-sonnet-5", "modelFast": "",
      "webSearch": true, "temperature": 0.7, "timeoutSeconds": 30
    }
  ],
  "activeId": "uuid"
}
```

`protocol` — один из двух: `anthropic` (v1/messages, по умолчанию) / `openai` (chat/completions). Пустой `modelFast` означает, что лёгкие задачи идут на основную модель.

```bash
curl http://127.0.0.1:5175/api/ai/settings
```

## PUT /api/ai/settings

Сохраняет конфигурацию. Body — полный `AiSettings`: `enable` (boolean), `providers` (1–20 комплектов; ограничения полей: `temperature` 0–2, по умолчанию 0.7; `timeoutSeconds` 5–86400, по умолчанию 30; `webSearch` по умолчанию true), `activeId` (обязательно указывает на один из providers). **Во включённом состоянии** конфигурация активного провайдера должна быть полной (адрес начинается с http(s), Key, имя модели), иначе 400.

**Возвращаемое значение** нормализованный и сохранённый `AiSettings` (совместим со старой плоской структурой, при чтении мигрирует автоматически).

```bash
curl -X PUT http://127.0.0.1:5175/api/ai/settings \
  -H "Content-Type: application/json" \
  -d '{"enable":true,"providers":[{"id":"p1","name":"官方","protocol":"anthropic","baseUrl":"https://api.anthropic.com","apiKey":"sk-…","model":"claude-sonnet-5","modelFast":"","webSearch":true,"temperature":0.7,"timeoutSeconds":30}],"activeId":"p1"}'
```

## POST /api/ai/test

Тест соединения. **Приоритет — конфигурация из тела запроса** (можно проверить ещё до сохранения); при неудаче разбора откат к сохранённой конфигурации. Тестовый запрос фиксированно использует `maxTokens: 16`, `temperature: 0`, с выключенными размышлением и поиском; таймаут — меньшее из настроек провайдера и 30 секунд.

**Возвращаемое значение** `AiTestResult`: `{ ok, latencyMs, reply?, error? }` — при `ok=true` поле `reply` содержит фрагмент ответа модели (≤120 символов).

```bash
curl -X POST http://127.0.0.1:5175/api/ai/test \
  -H "Content-Type: application/json" \
  -d '{"enable":true,"providers":[{"id":"p1","name":"t","protocol":"anthropic","baseUrl":"https://api.anthropic.com","apiKey":"sk-…","model":"claude-sonnet-5","modelFast":"","webSearch":false,"temperature":0.7,"timeoutSeconds":30}],"activeId":"p1"}'
```

## POST /api/ai/chat

Вход нестримингового диалога (всегда использует сохранённую конфигурацию).

| Поле body | Тип | Обязателен | Описание |
|-----------|------|------|------|
| `messages` | `{ role: system/user/assistant, content }[]` | да | Полный список сообщений, одно ≤200k символов |
| `maxTokens` | `number` | нет | 16–16384 |
| `fast` | `boolean` | нет | `true` — лёгкая модель (без настройки откат к основной) с выключенным размышлением |

**Возвращаемое значение** `AiChatResult`: `{ content, model, promptTokens?, completionTokens?, searchUsed? }`.

```bash
curl -X POST http://127.0.0.1:5175/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"用一句话介绍 Markdown"}],"fast":true}'
```

## POST /api/ai/edit

Перезапись одной инструкцией: сервер фиксирует system (помощник по письму в Markdown, выводит только результат), кастомизация system не открывается.

| Поле body | Тип | Обязателен | Описание |
|-----------|------|------|------|
| `instruction` | `string` | да | Инструкция перезаписи, ≤2000 символов |
| `text` | `string` | да | Переписываемый текст, ≤100k символов |
| `maxTokens` | `number` | нет | По умолчанию 4096 |

**Возвращаемое значение** то же, что у `AiChatResult`.

```bash
curl -X POST http://127.0.0.1:5175/api/ai/edit \
  -H "Content-Type: application/json" \
  -d '{"instruction":"润色：保留原意，只输出结果","text":"这算一个测试文本"}'
```

## Потоковые интерфейсы (SSE) {#потоковые-интерфейсы}

`edit-stream` и `chat-stream` используют один и тот же протокол потоковой пересылки:

- Ответ имеет `Content-Type: text/event-stream`, каждый кадр — строка `data: <JSON>` (а не многострочные event, как в стандартном SSE)
- Типы кадров: `{ "type": "thinking", "text": "…" }` (приращение размышления), `{ "type": "text", "text": "…" }` (приращение текста), `{ "type": "done", "content": "полный текст", "model": "…", "completionTokens": n }`, `{ "type": "error", "message": "…" }`
- **Отключение клиента немедленно прерывает upstream-запрос** (это единственный способ остановки)
- Таймаут считается по принципу «простоя без вывода» (длительность = `timeoutSeconds` текущего провайдера); генерация длинного текста не ограничена общим временем

### POST /api/ai/edit-stream

Потоковая перезапись; тело запроса полностью совпадает с `edit` (`maxTokens` по умолчанию 4096).

```bash
curl -N -X POST http://127.0.0.1:5175/api/ai/edit-stream \
  -H "Content-Type: application/json" \
  -d '{"instruction":"续写这篇文章","text":"正文…"}'
```

### POST /api/ai/chat-stream

Потоковый многокруговой диалог.

| Поле body | Тип | Обязателен | Описание |
|-----------|------|------|------|
| `messages` | `{ role: user/assistant, content }[]` | да | 1–40 сообщений (system в их число не входит) |
| `system` | `string` | нет | Системный промпт, передаётся отдельно, ≤10k символов |
| `maxTokens` | `number` | нет | По умолчанию 8192 |

## POST /api/ai/commit-message

ИИ-генерация сообщения коммита. **Никогда не падает с блокировкой**: при выключенном ИИ откат к эвристике с пометкой в `source`.

| Поле body | Тип | Обязателен | По умолчанию | Описание |
|-----------|------|------|------|------|
| `repo` | `"content" \| "theme"` | нет | `content` | По изменениям какого репозитория генерировать |

**Возвращаемое значение** `{ message, source: "ai" \| "heuristic" }` — вывод ИИ принимается только после прохождения форматной проверки `type(scope): ≤30 знаков`, иначе автоматический откат к генерации по содержимому изменений.

```bash
curl -X POST http://127.0.0.1:5175/api/ai/commit-message \
  -H "Content-Type: application/json" -d '{"repo":"content"}'
```

## POST /api/ai/timeline-draft

Черновики событий таймлайна.

| Поле body | Тип | Обязателен | Описание |
|-----------|------|------|------|
| `mode` | `"note" \| "git"` | да | `note` — черновик из описания; `git` — сводка истории коммитов трёх репозиториев |
| `note` | `string` | обязателен при mode=note | Описание события, ≤500 символов |
| `limit` | `number` | нет | 1–5, потолок числа сгенерированных записей |
| `existing` | `{ title, date }[]` | нет | Уже внесённые события (≤300), для дедупликации |

**Возвращаемое значение** массив черновиков (strict JSON + фильтрация zod, недопустимые записи уже отброшены).

```bash
curl -X POST http://127.0.0.1:5175/api/ai/timeline-draft \
  -H "Content-Type: application/json" \
  -d '{"mode":"note","note":"2025年6月上线了个人博客","limit":3}'
```

## POST /api/ai/music-search

Поиск музыки с проверкой лицензии (приоритетно в интернете; если сервис не поддерживает сеть, автоматически снижается до обычного запроса с пометкой).

| Поле body | Тип | Обязателен | Описание |
|-----------|------|------|------|
| `query` | `string` | да | Поисковый запрос, ≤200 символов |

**Возвращаемое значение** массив кандидатов; каждая запись содержит `title` / `artist?` / `license` (`freeCommercial`, `summary`, `evidence?`, `sourceUrl?`) / `audioUrl?` / `coverUrl?`.

```bash
curl -X POST http://127.0.0.1:5175/api/ai/music-search \
  -H "Content-Type: application/json" -d '{"query":"安静的钢琴曲 免费商用"}'
```

## POST /api/ai/wallpaper-search

Подбор обоев (прямой доступ к источнику safebooru). **ИИ не задействован, порога включения нет** — вызывать можно в любой момент.

| Поле body | Тип | Обязателен | Описание |
|-----------|------|------|------|
| `query` | `string` | нет | Поисковый запрос; по умолчанию пуст (случайно) |
| `target` | `"desktop" \| "mobile"` | да | Цель по размеру: десктоп — горизонтальные ≥1920, мобильные — вертикальные ≥1920 |

**Возвращаемое значение** `WallpaperCandidate[]` (набирается целая партия): `{ imageUrl, previewUrl?, width?, height? }`.

```bash
curl -X POST http://127.0.0.1:5175/api/ai/wallpaper-search \
  -H "Content-Type: application/json" -d '{"query":"星空","target":"desktop"}'
```
