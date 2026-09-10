---
title: 글
description: /api/posts 글 CRUD, /api/slug slug 제안, /api/taxonomy/rename 분류·태그 일괄 개작의 인터페이스 참조.
---

# 글

글 모듈은 콘텐츠 저장소 `content/posts/`를 직접 다룹니다. 모든 경로 매개변수는 이 디렉터리 기준 POSIX 스타일 상대 경로입니다. 목록은 **고정 우선, 게시일 내림차순**입니다.

## GET /api/posts

전체 글의 메타 정보 목록을 반환합니다(본문 제외).

**반환값** `PostMeta[]`, 각 항목의 핵심 필드:

| 필드 | 타입 | 설명 |
|------|------|------|
| `slug` | `string` | 디렉터리 이름(디렉터리 방식) 또는 파일명에서 `.md` 제거 |
| `path` | `string` | 상대 경로. 예: `hello/index.md` |
| `layout` | `"directory" \| "file"` | 디렉터리 방식 / 평면형 |
| `title` / `published` / `description` / `image` / `category` / `tags` | — | 메타 정보. `published`는 `YYYY-MM-DD` |
| `publishedAt` / `updated` / `updatedAt` | `string?` | 정확한 시각과 갱신 시각 |
| `pinned` / `draft` / `comment` / `encrypted` / `hideHomeContent` | `boolean` | 스위치 |
| `hasPassword` | `boolean` | 암호 설정 여부(**암호 자체는 절대 반환하지 않음**) |
| `passwordHint` | `string` | 암호 힌트 |
| `alias` / `permalink` | `string?` | 커스텀 접근 경로 |

```bash
curl http://127.0.0.1:5175/api/posts
```

## GET /api/posts/detail

글 한 편의 전체 내용을 읽습니다.

| Query 매개변수 | 필수 | 설명 |
|------------|------|------|
| `path` | 예 | 글 상대 경로 |

**반환값** `PostFile`: `{ meta: PostMeta, body: string }`. 경로가 없으면 `404`.

```bash
curl "http://127.0.0.1:5175/api/posts/detail?path=hello/index.md"
```

## POST /api/posts

글을 새로 만듭니다(**초안 상태**). 디렉터리 방식으로 `content/posts/<slug>/index.md`에 기록됩니다.

| Body 필드 | 타입 | 필수 | 기본값 | 설명 |
|-----------|------|------|------|------|
| `title` | `string` | 예 | — | 제목. 비워 둘 수 없습니다 |
| `slug` | `string` | 아니요 | 제목의 병음 전사 | 커스텀 디렉터리 이름. 유효하지 않은 문자는 자동 정리되고 중복은 제거됩니다 |

**반환값** `PostFile`(새로 만든 글). **부작용**: 콘텐츠 저장소에 디렉터리와 `index.md`를 생성합니다. `slug`를 넘기지 않으면 기존 글과 중복 제거합니다.

```bash
curl -X POST http://127.0.0.1:5175/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"我的第一篇文章"}'
```

## PUT /api/posts

글을 저장합니다. frontmatter는 **병합 기록**: `meta`에 나타난 키만 갱신하고 본문은 통째로 교체합니다. 직렬화 시 `published` 등 날짜 형식이 유지됩니다.

| Body 필드 | 타입 | 필수 | 기본값 | 설명 |
|-----------|------|------|------|------|
| `path` | `string` | 예 | — | 대상 글 경로 |
| `body` | `string` | 아니요 | `""` | 본문 전체(통째로 교체) |
| `meta` | `object` | 아니요 | `{}` | 갱신할 frontmatter 키-값. `alias`/`permalink`에 빈 문자열을 넘기면 해당 키가 삭제됩니다 |
| `password` | `string` | 아니요 | — | **암호 설정/수정할 때만 전달**. 넘기지 않으면 기존 값 유지 |
| `clearPassword` | `boolean` | 아니요 | — | `true`이면 암호를 삭제합니다(암호화 해제 등) |

**반환값** 저장된 `PostFile`.

```bash
curl -X PUT http://127.0.0.1:5175/api/posts \
  -H "Content-Type: application/json" \
  -d '{"path":"hello/index.md","meta":{"draft":false},"body":"# 你好\n\n正文。"}'
```

## DELETE /api/posts

글을 삭제합니다. 디렉터리 방식 글은 `slug` 최상위(디렉터리 전체와 첨부 이미지)까지 삭제하며, 평면형은 단일 파일을 삭제합니다.

| Query 매개변수 | 필수 | 설명 |
|------------|------|------|
| `path` | 예 | 글 상대 경로 |

**반환값** `{ "ok": true }`.

```bash
curl -X DELETE "http://127.0.0.1:5175/api/posts?path=hello/index.md"
```

## POST /api/slug

slug를 생성하거나 정리합니다(제목의 병음 전사, 유효하지 않은 문자 치환, 기존 글과의 중복 제거).

| Body 필드 | 타입 | 필수 | 설명 |
|-----------|------|------|------|
| `title` | `string` | 아니요(기본 `""`) | 제목. **`slug`를 넘기지 않았을 때만** 생성에 사용 |
| `slug` | `string` | 아니요 | 넘기면 생성하지 않고 정리만 합니다 |

**반환값** `SlugSuggestion`: `{ slug: string, adjusted: boolean, note?: string }` — `adjusted=true`는 치환 또는 중복 제거가 발생했다는 뜻이며, `note`에 이유가 담깁니다.

```bash
curl -X POST http://127.0.0.1:5175/api/slug \
  -H "Content-Type: application/json" \
  -d '{"title":"快速上手指南"}'
```

## POST /api/taxonomy/rename

분류/태그 일괄 이름 변경: **해당하는 모든 글**의 frontmatter를 다시 씁니다. 대상 이름이 이미 존재하면 병합이고, `to`에 빈 문자열을 넘기면 모든 글에서 제거합니다.

| Body 필드 | 타입 | 필수 | 설명 |
|-----------|------|------|------|
| `kind` | `"category" \| "tag"` | 예 | 분류인지 태그인지 |
| `from` | `string` | 예 | 원래 이름(비워 둘 수 없음) |
| `to` | `string` | 예 | 대상 이름. 빈 문자열 = 제거 |

**반환값** `{ changed, kind, from, to }` — `changed`는 다시 쓴 글 수입니다. **부작용**: 글마다 파일을 다시 씁니다(태그 시나리오에서는 자동 중복 제거). 날짜 필드 형식은 그대로 유지됩니다.

```bash
curl -X POST http://127.0.0.1:5175/api/taxonomy/rename \
  -H "Content-Type: application/json" \
  -d '{"kind":"tag","from":"JS","to":"JavaScript"}'
```
