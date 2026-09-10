---
title: 시스템과 미리보기
description: /api/status 연결 상태 탐지와 /api/preview/* 실제 사이트 미리보기 프로세스 관리의 인터페이스 참조.
---

# 시스템과 미리보기

시스템 모듈은 두 질문에 답합니다. **작업 공간 연결이 정상인가**, **블로그 프론트 dev server가 돌고 있는가**. 관리 화면 상단 바의 연결 배지와 각 페이지의 실제 사이트 미리보기 패널이 이 인터페이스 묶음으로 동작합니다.

## GET /api/status

작업 공간 상태를 탐지합니다. 매개변수 없음, 절대 실패하지 않습니다(내부에 실패한 필드는 `null`/`false` 반환).

**반환값** `SystemStatus`:

| 필드 | 타입 | 설명 |
|------|------|------|
| `contentDir` / `themeDir` | `string` | 해석된 콘텐츠 저장소 / 테마 저장소 절대 경로(출처: `.env` 또는 기본 상대 위치) |
| `contentConnected` | `boolean` | 콘텐츠 저장소 디렉터리에 `content/`가 있으면 `true` |
| `themeConnected` | `boolean` | 테마 저장소에 `scripts/content/sync.mjs`가 있으면 `true` |
| `themeDepsInstalled` | `boolean` | 테마 저장소의 `node_modules` 존재 여부(로컬 검증 가능 여부를 결정) |
| `git` | `GitStatus \| null` | 콘텐츠 저장소 git 요약. git 저장소가 아니면 `null` |

`GitStatus`: `branch`, `ahead`, `behind`, `staged[]`, `modified[]`, `untracked[]`(파일 상대 경로 목록).

```bash
curl http://127.0.0.1:5175/api/status
```

```json
{
  "contentDir": "D:\\blogs\\Shirone-Content",
  "themeDir": "D:\\blogs\\Shirone",
  "contentConnected": true,
  "themeConnected": true,
  "themeDepsInstalled": true,
  "git": { "branch": "main", "ahead": 0, "behind": 0, "staged": [], "modified": [], "untracked": [] }
}
```

## POST /api/preview/start

실제 사이트 미리보기 프로세스를 띄웁니다. 테마 저장소에서 `content:watch`(콘텐츠 감시 동기화)와 `astro dev`(:4321)를 시작합니다. 이미 실행 중이면 「이미 실행 중」을 바로 반환합니다. **부작용**: 백그라운드 프로세스 트리 두 개를 생성합니다. Windows에서는 `cmd /c`로 시작하며, 서비스 종료 시 `taskkill`로 트리째 회수합니다.

```bash
curl -X POST http://127.0.0.1:5175/api/preview/start
```

```json
{ "started": true, "message": "真站预览已启动，首次启动需等待依赖编译" }
```

`ready` 여부는 `/api/preview/status` 폴링 결과를 기준으로 하세요(처음에는 컴파일이 필요해 시작보다 준비가 늦습니다).

## POST /api/preview/stop

미리보기 프로세스 트리를 종료합니다. **부작용**: start가 시작한 모든 자식 프로세스를 죽입니다. dev server가 다른 출처(원클릭 시작 스크립트 등)라면 회수 범위에 들어가지 않습니다.

```bash
curl -X POST http://127.0.0.1:5175/api/preview/stop
```

`{ "stopped": true }`를 반환합니다.

## GET /api/preview/status

미리보기 상태 조회. 프론트엔드가 3초마다 폴링합니다.

```bash
curl http://127.0.0.1:5175/api/preview/status
```

```json
{ "running": true, "ready": true, "procs": ["node content-watch.mjs", "astro dev"] }
```

| 필드 | 설명 |
|------|------|
| `running` | 이 서비스가 관리하는 미리보기 프로세스가 실행 중 |
| `ready` | `http://localhost:4321/`에 실제로 접근 가능(출처를 불문한 dev server 모두 해당) |
| `procs` | 프로세스 설명 목록 |
