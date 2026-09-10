---
title: Настройки сайта
description: Справочник по чтению и записи /api/settings/:domain для четырёх доменов конфигурации (site/profile/navbar/footer) с семантикой минимального переопределения YAML.
---

# Настройки сайта

Модуль настроек читает и пишет `config/*.yaml` контент-репозитория. Параметр пути `domain` — один из четырёх: `site` / `profile` / `navbar` / `footer`.

**Семантика записи — минимальное переопределение YAML**: PUT записывает только ключи, объявленные в теле запроса (рекурсивная заплатка); необъявленные поля в YAML не появляются и в рантайме наследуют значения темы по умолчанию. Массивы заменяются целиком. Значит, можно спокойно отправить одно поле, не разрушив остальную конфигурацию.

## GET /api/settings/:domain

Читает текущее значение домена конфигурации (то есть переопределения, объявленные в YAML; необъявленные ключи в ответ не входят).

```bash
curl http://127.0.0.1:5175/api/settings/site
```

Главное в ответах по доменам:

| Домен | Файл | Структура ответа |
|----|----------|----------|
| `site` | `config/site.yaml` | `SiteSettings`, плюс доступный только для чтения `themeFavicon[]` (favicon темы по умолчанию — фактически действующие значки, пока контент-репозиторий их не переопределил; **не** записывается обратно) |
| `profile` | `config/profile.yaml` | `{ avatar?, name?, bio?, links?: { name, icon, url }[] }` |
| `navbar` | `config/nav-bar.yaml` | `{ links?: NavBarLink[] }` |
| `footer` | `config/footer.yaml` + `config/footer.html` | `{ enable: boolean, html: string }` — html всегда строка (`""` при отсутствии файла) |

## PUT /api/settings/site

Пишет `site.yaml`. Все поля тела необязательны; перечисления и диапазоны строго проверяются zod:

| Поле | Тип | Ограничения |
|------|------|------|
| `site` / `base` / `title` | `string` | Непустые |
| `subtitle` | `string` | — |
| `lang` | перечисление | `en / zh_CN / zh_TW / ja / ko / es / th / vi / tr / id` |
| `i18n` | `{ enable?, locales? }` | `locales` минимум один, все из перечисления lang |
| `timeZone` | `string` | ≥2 символов (например `Asia/Shanghai`) |
| `displaySettings` | `Record<string, boolean>` | Ключи только `colorStyle / colorSpec / wallpaperMode / layoutMode / reduceMotion / texture` |
| `themeColor` | `{ hue?, fixed?, style?, spec? }` | `hue` целое 0–360; `style` один из 9 (tonalSpot/vibrant/content/expressive/rainbow/fruitSalad/monochrome/neutral/fidelity); `spec` 2021 или 2025 |
| `wallpaperMode` | `{ defaultMode? }` | `banner / none` |
| `texture` | `{ enable?, defaultPreset?, defaultOpacity?, allowMotion? }` | Пресет один из 6 (none/starlight/cyber-dots/topography/geometric/sakura); opacity 0.05–0.25 |
| `banner` | см. ниже | Полная структура баннера |
| `favicon` | `{ src, theme }[]` | `theme` — `light / dark` |

Подструктура `banner`: `src.desktop[] / src.mobile[]` (массивы путей обоев), `position` (top/center/bottom), `dim`, `homeText` (заголовок + массив подзаголовков + группа скоростей `typewriter`), `carousel` (interval ≥3000 мс, fadeDuration, шесть анимаций), `waves`.

**Побочные эффекты**: после сохранения баннера локальные файлы обоев, **на которые больше не ссылается ни одна из сторон, удаляются автоматически**. **Возвращаемое значение**: полный обновлённый `site.yaml`.

```bash
curl -X PUT http://127.0.0.1:5175/api/settings/site \
  -H "Content-Type: application/json" \
  -d '{"title":"我的博客","themeColor":{"hue":260}}'
```

## PUT /api/settings/profile

Пишет `profile.yaml`, поля: `avatar` / `name` / `bio` / `links[]` (в каждой записи обязательны `name` и `url`, `icon` может быть пустым).

```bash
curl -X PUT http://127.0.0.1:5175/api/settings/profile \
  -H "Content-Type: application/json" \
  -d '{"name":"Shirone","bio":"写代码也写故事"}'
```

## PUT /api/settings/navbar

Пишет `nav-bar.yaml`. Body: `{ links?: NavBarLink[] }` — если `links` не передан, операция не выполняется и возвращается текущее значение. Каждая запись `NavBarLink`: `preset` (имя пресета темы, например `home`) / `name` / `icon` / `url` / `external` / `children[]` (рекурсивно та же структура, для раскрывающихся групп). **Массив заменяется целиком**.

```bash
curl -X PUT http://127.0.0.1:5175/api/settings/navbar \
  -H "Content-Type: application/json" \
  -d '{"links":[{"name":"关于","url":"/about/"}]}'
```

## PUT /api/settings/footer

Пишет подвал: `enable` (уходит в `footer.yaml`) и `html` (в `footer.html` **как есть**, убирается лишь хвостовая пустота). Оба поля можно опустить, действуют независимо. **Возвращаемое значение** `{ enable, html }`.

```bash
curl -X PUT http://127.0.0.1:5175/api/settings/footer \
  -H "Content-Type: application/json" \
  -d '{"enable":true,"html":"<p>自定义页脚内容</p>"}'
```
