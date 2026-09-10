---
title: 구조화 데이터
description: /api/data/:kind 여덟 종류 구조화 데이터의 읽기·쓰기와 /api/bangumi/* 애니메이션 항목 검색 및 표지 가져오기의 인터페이스 참조.
---

# 구조화 데이터

구조화 데이터 모듈은 콘텐츠 저장소 `data/*.ts`를 읽고 씁니다 — 파일의 `interface`, 주석, export 문은 **글자 그대로 보존**되고 내보내는 배열 리터럴만 통째로 교체합니다. 읽기는 tsx 동적 import로 진행합니다(mtime query로 캐시 우회). 열거 필드는 저장 전에 검증합니다.

## kind와 파일 매핑

경로 매개변수 `kind`는 여덟 중 하나:

| `kind` | 파일 | 내보내는 배열 | 항목 |
|--------|------|----------|------|
| `projects` | `data/projects.ts` | `projectsData` | 프로젝트 |
| `skills` | `data/skills.ts` | `skillsData` | 스킬 |
| `timeline` | `data/timeline.ts` | `timelineData` | 타임라인 이벤트 |
| `devices` | `data/devices.ts` | `devicesData` | 장치 |
| `anime` | `data/anime.ts` | `animeData` | 애니메이션 |
| `compass` | `data/compass.ts` | `compassData` | 나침반 책장 |
| `music` | `data/music.ts` | `musicTracks` | 재생목록 곡 |
| `friends` | `data/friends.ts` | `friendsData` | 링크 |

## GET /api/data/:kind

**반환값** `{ kind, items: DataItem[] }` — `DataItem`은 느슨한 타입의 객체입니다(필드 구조는 각 파일의 interface 또는 [가이드 · 구조화 데이터](../guide/data.md#여덟-가지-데이터-유형)의 필드 표 참고).

```bash
curl http://127.0.0.1:5175/api/data/friends
```

## PUT /api/data/:kind

해당 종류 데이터의 전체 항목을 **통째로 교체**합니다.

| Body 필드 | 타입 | 필수 | 설명 |
|-----------|------|------|------|
| `items` | `object[]` | 예 | 전체 항목(먼저 GET 후 수정해 PUT. 증분만 보내지 마세요) |

**반환값** `{ ok: true, changed }`. **부작용**: `data/*.ts`의 배열 구간을 다시 씁니다. 파일의 나머지 부분은 건드리지 않습니다.

```bash
curl -X PUT http://127.0.0.1:5175/api/data/skills \
  -H "Content-Type: application/json" \
  -d '{"items":[{"name":"TypeScript","category":"frontend","level":"advanced","enable":true}]}'
```

---

# Bangumi 애니메이션 검색

애니메이션 가져오기 3종 세트. 데이터는 Bangumi 공개 API에서 오며, 애니메이션 항목의 검색 보완에 사용합니다.

## GET /api/bangumi/search

| Query 매개변수 | 필수 | 설명 |
|------------|------|------|
| `keyword` | 예 | 키워드. 1–100자(애니메이션 유형 항목으로 고정 검색) |

**반환값** `{ candidates: BangumiCandidate[] }` — 각 항목은 `id`(Bangumi subject id), `title` / `originalTitle`, `year`, `cover?`, `summary`, `eps`, `bangumiScore?`, `link` 포함.

```bash
curl "http://127.0.0.1:5175/api/bangumi/search?keyword=葬送的芙莉莲"
```

## GET /api/bangumi/subject

| Query 매개변수 | 필수 | 설명 |
|------------|------|------|
| `id` | 예 | Bangumi subject id(양의 정수, 문자열도 가능) |

**반환값** `BangumiDetail`: Candidate에 더해 `studio?`(제작사), `period?`(방영 시기 `{ start, end? }`), `genres[]`(빈도 높은 장르 태그 ≤4개)를 보완합니다.

```bash
curl "http://127.0.0.1:5175/api/bangumi/subject?id=463652"
```

## POST /api/bangumi/cover-import

표지 이미지 가져오기: 서버가 Bangumi 이미지 서버에서 내려받아 항목 제목으로 명명해 `public/assets/anime/`에 반영합니다.

| Body 필드 | 타입 | 필수 | 설명 |
|-----------|------|------|------|
| `url` | `string` | 예 | 표지 직접 링크. **화이트리스트 검증**: `lain.bgm.tv` / `api.bgm.tv` / `bgm.tv` / `bangumi.tv` / `ei.hdslb.com`만 허용하며 나머지는 400 |
| `title` | `string` | 예 | 항목 제목(1–200자, 명명에 사용) |
| `currentPath` | `string` | 아니요 | 같은 디렉터리에 해당하면 그 자리에서 교체 |

**반환값** `MediaUploadResult`.

```bash
curl -X POST http://127.0.0.1:5175/api/bangumi/cover-import \
  -H "Content-Type: application/json" \
  -d '{"url":"https://lain.bgm.tv/pic/cover/l/xx.jpg","title":"葬送的芙莉莲"}'
```
