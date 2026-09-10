---
title: 미디어 업로드
description: /api/media/* 전체 업로드 인터페이스 참조 — 글 첨부 이미지, 모먼트 이미지, 사이트 이미지, 데이터 표지와 음악 오디오. 각 target/kind의 저장 디렉터리 매핑 포함.
---

# 미디어 업로드

미디어 모듈은 모든 바이너리 파일의 저장소 반영을 처리합니다. 업로드 인터페이스 전부가 **multipart 폼**이며, 한 번에 한 파일, 파일 하나당 ≤30MB입니다. 이미지 확장자 화이트리스트는 `webp / png / jpg / jpeg / gif / avif`(favicon은 `ico / svg` 추가 허용).

각 인터페이스의 저장 디렉터리(모두 콘텐츠 저장소 안):

| 상황 | 디렉터리 |
|------|------|
| 글 첨부 이미지 | `content/posts/<slug>/images/` |
| 모먼트 이미지 | `public/images/moments/<배치>/` |
| 배너(데스크톱/모바일) | `assets/images/banner/desktop/`, `assets/images/banner/mobile/` |
| 아바타 | `assets/images/avatar/` |
| 푸터 이미지 | `public/images/footer/` |
| favicon | `public/favicon/` |
| 데이터 표지 | kind별 [아래 표](#post-api-media-data-cover) 참고 |
| 곡 오디오 | `public/assets/music/url/` |

## POST /api/media/post-image

글 첨부 이미지 업로드. 지정한 글 디렉터리의 `images/`에 저장합니다.

| 폼 필드 | 필수 | 설명 |
|----------|------|------|
| `file` | 예 | 이미지 파일 |
| `slug` | 예 | 글 slug(저장 디렉터리를 결정) |

**반환값** `MediaUploadResult`: `{ src, fileName }` — `src`는 frontmatter / 본문 참조 경로(상대 경로 `./images/<name>`). Markdown에 바로 붙여 넣으면 됩니다.

```bash
curl -X POST http://127.0.0.1:5175/api/media/post-image \
  -F "slug=hello" -F "file=@cover.webp"
```

## POST /api/media/moment-image

모먼트 이미지 업로드. `public/images/moments/<배치>/`에 저장합니다. 배치 디렉터리 규칙은 테마 썸네일 파이프라인이 정하며 **우회할 수 없습니다**.

| 폼 필드 | 필수 | 설명 |
|----------|------|------|
| `file` | 예 | 이미지 파일 |
| `batchId` | 아니요 | 배치 디렉터리 이름(`[\w-]+`, 예: `20260910-103000`). 생략 시 서버가 현재 시각으로 생성 |

**반환값** `MediaUploadResult`: `{ src, fileName, batchId? }` — `src`는 사이트 절대 경로(`/images/moments/<배치>/<name>`). 반환된 `batchId`는 같은 배치로 묶을 때 계속 재사용합니다.

```bash
curl -X POST http://127.0.0.1:5175/api/media/moment-image \
  -F "batchId=20260910-103000" -F "file=@photo.webp"
```

## GET /api/media/site-images

사이트 이미지 호스팅 디렉터리 목록(푸터 이미지 라이브러리 등의 상황).

| Query 매개변수 | 필수 | 설명 |
|------------|------|------|
| `target` | 예 | 디렉터리 식별자. 1–40자(예: `footer`) |

**반환값** `SiteMediaResult[]`: 각 항목 `{ src, previewUrl, fileName }`.

```bash
curl "http://127.0.0.1:5175/api/media/site-images?target=footer"
```

## POST /api/media/site-image

사이트 이미지 업로드(multipart).

| 폼 필드 | 필수 | 설명 |
|----------|------|------|
| `file` | 예 | 이미지 파일 |
| `target` | 예 | `banner-desktop` / `banner-mobile` / `avatar` / `footer` / `favicon` |
| `name` | 아니요 | 고정 파일명(favicon 슬롯 교체용. 예: `favicon-light`) |
| `currentSrc` | 아니요 | 해당 필드의 현재 값. 같은 대상 호스팅 디렉터리를 가리키면 옛 파일을 **그 자리에서 교체**합니다(아바타 갱신이 이에 해당) |

**반환값** `SiteMediaResult`: `src`는 YAML에 기록되는 경로, `previewUrl`은 관리 화면 미리보기 직접 링크.

```bash
curl -X POST http://127.0.0.1:5175/api/media/site-image \
  -F "target=avatar" -F "currentSrc=assets/images/avatar/old.webp" -F "file=@me.webp"
```

## POST /api/media/site-image-import

사이트 이미지 **원격 직접 링크 가져오기**: 서버가 대신 내려받아(브라우저 크로스 오리진 제한 우회) site-image 절차로 저장소에 반영합니다. webp는 자동으로 png/jpg로 변환합니다(테마 호환성).

| Body 필드 | 타입 | 필수 | 설명 |
|-----------|------|------|------|
| `target` | `string` | 예 | site-image와 동일 |
| `url` | `string` | 예 | 공인 http(s) 직접 링크. ≤2000자 |
| `name` | `string` | 아니요 | 파일명 지정 |
| `currentSrc` | `string` | 아니요 | 그 자리 교체 대상 |

**반환값** `SiteMediaResult`와 동일.

```bash
curl -X POST http://127.0.0.1:5175/api/media/site-image-import \
  -H "Content-Type: application/json" \
  -d '{"target":"footer","url":"https://example.com/badge.png"}'
```

## POST /api/media/data-cover

구조화 데이터 표지 업로드(multipart). kind가 저장 디렉터리를 결정합니다:

| `kind` | 디렉터리 |
|--------|------|
| `anime` | `public/assets/anime/` |
| `projects` | `public/assets/projects/` |
| `devices` | `public/images/devices/` |
| `friends` | `public/images/friends/` |
| `music` | `assets/images/music/` |

| 폼 필드 | 필수 | 설명 |
|----------|------|------|
| `file` | 예 | 이미지 파일 |
| `kind` | 예 | 위 표에서 다섯 중 하나 |
| `path` | 아니요 | 현재 항목의 표지 경로. 같은 디렉터리에 해당하면 **그 자리에서 덮어씁니다**(이미지 교체 시 옛 파일이 남지 않음) |

**반환값** `MediaUploadResult`.

```bash
curl -X POST http://127.0.0.1:5175/api/media/data-cover \
  -F "kind=anime" -F "file=@cover.webp"
```

## POST /api/media/data-cover-import

데이터 표지 원격 직접 링크 가져오기(AI 검색으로 나온 CDN 표지 등의 상황). kind와 디렉터리는 위와 동일합니다.

| Body 필드 | 타입 | 필수 | 설명 |
|-----------|------|------|------|
| `kind` | `string` | 예 | 다섯 중 하나의 열거값 |
| `url` | `string` | 예 | 직접 링크. ≤2000자 |
| `title` | `string` | 아니요 | 읽기 쉬운 파일명 생성에 사용 |
| `currentPath` | `string` | 아니요 | 그 자리 덮어쓰기 대상 |

```bash
curl -X POST http://127.0.0.1:5175/api/media/data-cover-import \
  -H "Content-Type: application/json" \
  -d '{"kind":"music","url":"https://cdn.example.com/track-cover.jpg","title":"晴天"}'
```

## POST /api/media/music-audio

곡 오디오 로컬 업로드(multipart) → `public/assets/music/url/`.

| 폼 필드 | 필수 | 설명 |
|----------|------|------|
| `file` | 예 | 오디오 파일 |
| `currentSrc` | 아니요 | 그 자리 교체 대상 |

```bash
curl -X POST http://127.0.0.1:5175/api/media/music-audio \
  -F "file=@song.mp3"
```

## POST /api/media/music-download

곡 오디오 **원격 직접 링크**를 서버가 내려받아 저장소에 반영합니다(브라우저의 크로스 오리진으로 받을 수 없는 것도 받습니다).

| Body 필드 | 타입 | 필수 | 설명 |
|-----------|------|------|------|
| `url` | `string` | 예 | 오디오 직접 링크. ≤2000자 |
| `filename` | `string` | 아니요 | 파일명 지정 |
| `currentPath` | `string` | 아니요 | 그 자리 교체 대상 |

```bash
curl -X POST http://127.0.0.1:5175/api/media/music-download \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com/song.mp3"}'
```
