---
title: 모먼트
description: /api/moments 모먼트 CRUD의 인터페이스 참조 — 모먼트 게시, 갱신, 삭제.
---

# 모먼트

모먼트 모듈은 콘텐츠 저장소 `content/moments/`를 다룹니다. 모먼트마다 Markdown 파일 하나이며 파일명이 곧 id입니다: `<yyyymmdd-HHmmss>.md`. 목록은 시간 내림차순입니다.

## MomentMeta 구조

목록과 상세가 공유하는 메타 정보:

| 필드 | 타입 | 설명 |
|------|------|------|
| `id` | `string` | 파일명에서 `.md` 제거. 예: `20260906-183000` |
| `path` | `string` | 상대 경로 |
| `published` | `string` | `YYYY-MM-DD HH:mm:ss` |
| `pinned` / `draft` | `boolean` | 고정 / 초안 |
| `location` | `string` | 장소 |
| `mood` | `string` | 기분 Iconify 아이콘 이름(빈 문자열은 미선택) |
| `tags` | `string[]` | 태그 |
| `images` | `{ src, alt }[]` | 첨부 이미지. `src`는 사이트 경로 |
| `body` | `string` | 본문 텍스트(목록에도 포함) |

## GET /api/moments

전체 목록. 매개변수 없음.

```bash
curl http://127.0.0.1:5175/api/moments
```

## GET /api/moments/detail

| Query 매개변수 | 필수 | 설명 |
|------------|------|------|
| `path` | 예 | 모먼트 상대 경로 |

**반환값** `MomentFile`: `{ meta: MomentMeta, body: string }`.

```bash
curl "http://127.0.0.1:5175/api/moments/detail?path=20260906-183000.md"
```

## POST /api/moments

모먼트를 새로 만듭니다. **부작용**: `content/moments/<게시 타임스탬프>.md`에 기록합니다. `images`가 참조하는 파일은 미리 [모먼트 이미지 업로드](./media.md#post-api-media-moment-image)로 저장소에 있어야 합니다.

| Body 필드 | 타입 | 필수 | 기본값 | 설명 |
|-----------|------|------|------|------|
| `published` | `string` | 예 | — | `YYYY-MM-DD HH:mm:ss`. 파일명을 결정합니다 |
| `body` | `string` | 아니요 | `""` | 본문 |
| `location` | `string` | 아니요 | — | 장소 |
| `mood` | `string` | 아니요 | — | 기분 아이콘 이름 |
| `tags` | `string[]` | 아니요 | — | 태그 |
| `images` | `{ src, alt? }[]` | 아니요 | — | 첨부 이미지 목록 |
| `draft` / `pinned` | `boolean` | 아니요 | `false` | 초안 / 고정 |

**반환값** 생성된 `MomentMeta`.

```bash
curl -X POST http://127.0.0.1:5175/api/moments \
  -H "Content-Type: application/json" \
  -d '{"published":"2026-09-10 10:30:00","body":"第一条说说！","mood":"material-symbols:celebration","tags":["开始"]}'
```

## PUT /api/moments

모먼트를 갱신합니다. 필드는 위와 같고, 추가로:

| Body 필드 | 타입 | 필수 | 설명 |
|-----------|------|------|------|
| `path` | `string` | 예 | 대상 모먼트 경로 |

넘기지 않은 선택 필드는 기본값으로 되돌아갑니다(전체 덮어쓰기 의미). 호출 전에 detail을 읽어 수정하는 것이 가장 안전한 패턴입니다(관리 인터페이스가 그렇게 합니다).

```bash
curl -X PUT http://127.0.0.1:5175/api/moments \
  -H "Content-Type: application/json" \
  -d '{"path":"20260906-183000.md","published":"2026-09-06 18:30:00","body":"改过了","pinned":true}'
```

## DELETE /api/moments

모먼트를 삭제합니다(`.md` 파일). **첨부 이미지 파일은 함께 삭제되지 않습니다**. 필요할 때 `public/images/moments/` 아래의 해당 배치 디렉터리를 수동으로 정리하세요.

| Query 매개변수 | 필수 | 설명 |
|------------|------|------|
| `path` | 예 | 모먼트 상대 경로 |

**반환값** `{ "ok": true }`.

```bash
curl -X DELETE "http://127.0.0.1:5175/api/moments?path=20260906-183000.md"
```
