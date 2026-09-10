---
title: 게시와 검증
description: /api/publish/* 게시 미리보기, 원격 탐지, 원클릭 게시와 /api/validate dry-run 검증의 인터페이스 참조.
---

# 게시와 검증

게시 모듈은 이중 저장소(콘텐츠 저장소 + 테마 저장소)의 git 조작을 캡슐화합니다. 두 저장소는 **상호 비차단**이며 각자 독립적인 `RepoPublishResult`를 반환합니다.

## GET /api/publish/preview

게시 페이지 첫 화면 데이터: 두 저장소의 변경 상세, 자동 생성된 커밋 메시지, 최근 커밋과 상태. 매개변수 없음.

**반환값** `PublishPreview` 핵심 필드:

| 필드 | 설명 |
|------|------|
| `branch` / `ahead` / `behind` | 콘텐츠 저장소 브랜치와 앞섬/뒤처짐(로컬 캐시값) |
| `changes` / `files` | 콘텐츠 저장소 변경 상세 `{ path, state: "new" \| "modified" }[]`와 파일 목록 |
| `message` | 콘텐츠 저장소 자동 커밋 메시지 |
| `themeChanges` / `themeFiles` / `themeMessage` / `themeStatus` / `themeRecent` | 테마 저장소 대응 정보(연결 안 됨 시 `themeStatus`는 `null`) |
| `themeDepsInstalled` | 테마 의존성 설치 여부(로컬 검증 가능 여부를 결정) |
| `recent` | 콘텐츠 저장소 최근 20건 커밋 `{ hash, date, subject }` |

```bash
curl http://127.0.0.1:5175/api/publish/preview
```

## POST /api/publish/probe

가벼운 원격 비교: `git ls-remote`로 브랜치 tip을 비교합니다. **어떤 코드/객체도 가져오지 않습니다**.

| Body 필드 | 타입 | 필수 | 설명 |
|-----------|------|------|------|
| `repo` | `"content" \| "theme"` | 예 | 어느 저장소를 탐지할지 |

**반환값** `RemoteProbe`: `{ behind: number | null }` — `0`은 원격과 일치, `>0`은 정확한 뒤처짐 수, `null`은 원격이 앞서 있으나 수량 미확인(가져온 뒤에야 확정 가능).

```bash
curl -X POST http://127.0.0.1:5175/api/publish/probe \
  -H "Content-Type: application/json" -d '{"repo":"content"}'
```

## POST /api/publish

원클릭 게시. 흐름: 콘텐츠 저장소(**검증 → add -A → commit → pull --rebase --autostash → push**, 검증 실패 시 해당 저장소 차단) + 테마 저장소(commit → push, 로컬 검증 생략).

| Body 필드 | 타입 | 필수 | 설명 |
|-----------|------|------|------|
| `contentMessage` | `string` | 아니요 | 콘텐츠 저장소 커밋 메시지. **비워 두면 자동 생성**(`type(scope): ≤30자` 준수해야 함) |
| `themeMessage` | `string` | 아니요 | 테마 저장소 커밋 메시지. 위와 동일 |

**반환값** `PublishResult`:

```json
{
  "ok": true,
  "content": { "ok": true, "hadChanges": true, "commitHash": "a1b2c3d", "pushed": true, "log": ["..."] },
  "theme":  { "ok": true, "hadChanges": false, "pushed": false, "log": ["无变更，跳过"] }
}
```

저장소별 `RepoPublishResult`: `ok`(해당 저장소 전체 성공), `hadChanges`, `commitHash?`, `pushed`, `validationOutput?`(콘텐츠 저장소 검증 실패 시 전체 로그), `log[]`(단계별 실행 기록). 최상위 `ok = content.ok && theme.ok`.

```bash
curl -X POST http://127.0.0.1:5175/api/publish \
  -H "Content-Type: application/json" -d '{}'
```

> [!WARNING]
> 실제로 git 커밋과 푸시를 일으키는 인터페이스입니다. 호출 전에 `preview`로 변경 범위를 확인하는 것이 좋습니다. 콘텐츠 저장소 검증이 실패하면 어떤 커밋도 만들어지지 않습니다.

## POST /api/validate

게시 전 검증만 단독 실행: 테마 저장소에서 `scripts/content/sync.mjs --dry-run`을 돌립니다(환경에 `CONTENT_DIR` 포함, 180초 시간 초과, 출력 끝 4000자까지). **순수 메모리 사전 점검으로 디스크에 기록하거나 어떤 변경도 만들지 않습니다**.

**반환값** `{ ok: boolean, output: string }` — `output`은 검증기 출력입니다(YAML 형식, 필드 철자, frontmatter schema 문제의 위치 확인).

```bash
curl -X POST http://127.0.0.1:5175/api/validate
```
