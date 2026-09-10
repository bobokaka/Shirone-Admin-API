---
title: 젠수(简书) 가져오기
description: /api/import/jianshu/* 내보내기 패키지 세션, 백그라운드 가져오기 작업, 단일 글 붙여넣기 변환과 AI 메타 정보 제안의 인터페이스 참조.
---

# 젠수(简书) 가져오기

젠수 이전의 두 인터페이스 묶음: **내보내기 패키지 흐름**(세션 방식: 업로드 → 목록 → 미리보기 → 백그라운드 작업)과 **단일 글 붙여넣기 흐름**(세션 없음, 붙이는 즉시 변환).

세션과 작업은 모두 **서버 메모리**에 보관됩니다. 세션 유효 기간 24시간, 최대 3개(LRU 퇴출), 작업 결과는 1시간 유지되며 서버 재시작 시 비워집니다 — 이미 가져온 글은 영향 없습니다(이미 저장소에 반영되어 있음).

## POST /api/import/jianshu/archive

젠수 내보내기 패키지 업로드(multipart).

| 폼 필드 | 필수 | 설명 |
|----------|------|------|
| `file` | 예 | rar / zip 압축 파일. ≤30MB |

**부작용**: 메모리에서 압축 해제 후 파싱(디스크에 기록하지 않음). **반환값** `JianshuArchiveSummary`:

```json
{
  "sessionId": "s-xxxx",
  "notebooks": [{ "name": "技术随笔", "articles": [{ "id": "技术随笔/a.md", "title": "标题", "bytes": 8213 }] }],
  "total": 42,
  "importedIds": ["技术随笔/a.md"]
}
```

`id`는 세션 내 고유 식별자입니다(패키지 내 경로 정규화). 루트 레벨의 산문은 「미분류」로 묶입니다.

```bash
curl -X POST http://127.0.0.1:5175/api/import/jianshu/archive \
  -F "file=@jianshu-export.zip"
```

## GET /api/import/jianshu/preview

단일 글 변환 미리보기. **디스크에 기록하지 않으며** 이미지는 원격 링크를 유지합니다.

| Query 매개변수 | 필수 | 설명 |
|------------|------|------|
| `sessionId` | 예 | 이전 단계에서 반환된 세션 id |
| `id` | 예 | 글 id |

**반환값** `JianshuPreview`: `{ title, markdown, imageCount, wordCount }` — `wordCount`는 본문 일반 텍스트 글자 수입니다(너무 적으면 빈 껍데기 내용만 남았을 가능성).

```bash
curl "http://127.0.0.1:5175/api/import/jianshu/preview?sessionId=s-xxxx&id=技术随笔/a.md"
```

## POST /api/import/jianshu/run

**백그라운드 가져오기 작업**을 시작하고 즉시 반환합니다. 이후 진행 상황을 폴링합니다.

| Body 필드 | 타입 | 필수 | 설명 |
|-----------|------|------|------|
| `sessionId` | `string` | 예 | 세션 id |
| `ids` | `string[]` | 예 | 가져올 글 id. 1–2000건 |
| `options.published` | `string` | 예 | 통일 게시 날짜 `YYYY-MM-DD`(내보내기 패키지에 날짜 없음) |
| `options.categoryFromNotebook` | `boolean` | 예 | 문집 이름을 분류로 사용 |
| `options.category` | `string` | 아니요 | 문집 기준을 쓰지 않을 때의 통일 분류(≤40자) |
| `options.tags` | `string[]` | 예 | 통일 태그(≤12개, 개별 ≤30자) |
| `options.localizeImages` | `boolean` | 예 | 이미지 다운로드하여 저장소 반영(실패한 것은 원격 링크 유지) |
| `options.draft` | `boolean` | 예 | 초안으로 가져오기 |

**반환값** `{ jobId }`. **부작용**: 글마다 `content/posts/<slug>/index.md`를 쓰고 이미지를 내려받습니다.

```bash
curl -X POST http://127.0.0.1:5175/api/import/jianshu/run \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"s-xxxx","ids":["技术随笔/a.md"],"options":{"published":"2026-09-10","categoryFromNotebook":true,"tags":["简书迁移"],"localizeImages":true,"draft":true}}'
```

## GET /api/import/jianshu/job

작업 진행 상황 폴링(2초 간격 권장).

| Query 매개변수 | 필수 | 설명 |
|------------|------|------|
| `id` | 예 | 작업 id |

**반환값** `JianshuImportJob`: `{ id, sessionId, status: "running" | "done", total, done, current, results, log }`. `results` 각 항목은 `{ id, title, ok, path?, error?, images }`이며, `log`는 끝에서 200건을 유지합니다.

```bash
curl "http://127.0.0.1:5175/api/import/jianshu/job?id=job-xxxx"
```

## DELETE /api/import/jianshu/session

세션을 버립니다(패키지 내 캐시 비움). 작업 실행 중에는 거부됩니다.

| Query 매개변수 | 필수 | 설명 |
|------------|------|------|
| `id` | 예 | 세션 id |

**반환값** `{ ok: boolean }`.

```bash
curl -X DELETE "http://127.0.0.1:5175/api/import/jianshu/session?id=s-xxxx"
```

## POST /api/import/jianshu/paste-preview

단일 글 붙여넣기 **변환 미리보기**(디스크에 기록하지 않음). 세 가지 페이로드 중 최소 하나는 비어 있지 않아야 하며 각각 ≤2MB입니다. 파싱 우선순위: **markdown(에디터 확정본) > html(리치 텍스트) > text(일반 텍스트는 Markdown으로 대체 처리)**.

| Body 필드 | 타입 | 필수 | 설명 |
|-----------|------|------|------|
| `markdown` | `string` | 셋 중 하나 | 에디터 확정본. 우선 채택 |
| `html` | `string` | 셋 중 하나 | 리치 텍스트(웹 복사). Markdown으로 변환 |
| `text` | `string` | 셋 중 하나 | 일반 텍스트 대체 처리 |

**반환값** `JianshuPreview`와 동일.

```bash
curl -X POST http://127.0.0.1:5175/api/import/jianshu/paste-preview \
  -H "Content-Type: application/json" \
  -d '{"html":"<h1>标题</h1><p>段落</p>"}'
```

## POST /api/import/jianshu/paste-run

단일 글 붙여넣기 **저장소 반영**: 이미지가 글 디렉터리로 자동 다운로드됩니다(실패한 것은 원격 링크 유지).

Body = 붙여넣기 페이로드(위와 동일) + `options`:

| 필드 | 제약 |
|------|------|
| `title` | 필수. 1–100자 |
| `published` | 필수. `YYYY-MM-DD` |
| `category` | 선택. ≤40자 |
| `tags` | ≤12개, 개별 ≤30자 |
| `draft` | boolean |

**반환값** `JianshuPasteResult`: `{ title, path, slug, images, failedImages[] }` — `images`는 로컬화 성공 수, `failedImages`는 원격 링크로 남은 이미지입니다.

```bash
curl -X POST http://127.0.0.1:5175/api/import/jianshu/paste-run \
  -H "Content-Type: application/json" \
  -d '{"markdown":"# 标题\n正文","options":{"title":"标题","published":"2026-09-10","tags":[],"draft":true}}'
```

## POST /api/import/jianshu/suggest-meta

AI가 본문을 분석해 메타 정보를 보완합니다(비활성/실패 시 본문 요약으로 자동 대체, `aiUsed=false`).

| Body 필드 | 타입 | 필수 | 설명 |
|-----------|------|------|------|
| `title` | `string` | 아니요 | 비워 두면 AI가 제목도 함께 짓습니다. ≤100자 |
| `markdown` | `string` | 예 | 본문. 1–2MB |

**반환값** `JianshuMetaSuggestion`: `{ title?, description, category, tags[], aiUsed }`.

```bash
curl -X POST http://127.0.0.1:5175/api/import/jianshu/suggest-meta \
  -H "Content-Type: application/json" \
  -d '{"title":"","markdown":"# 我的博客搭建记\n…"}'
```
