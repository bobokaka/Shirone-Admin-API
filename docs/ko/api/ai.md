---
title: AI 서비스
description: /api/ai/* 프로바이더 설정, 대화와 스트리밍 개작(SSE), 커밋 메시지 생성, 타임라인 초안 작성, 음악 검색과 배경화면 수집의 인터페이스 참조.
---

# AI 서비스

AI 모듈은 설정 관리와 모든 AI 워크플로를 포괄합니다. 배경화면 수집을 제외한 **전체 인터페이스는 AI가 활성화되어 있어야** 합니다(마스터 스위치 on + 현재 프로바이더 설정 완전). 아니면 `400` 「AI 助手未启用…」를 반환합니다.

설정은 본기의 `server/data/ai-settings.json`에 유지되며(gitignore), 콘텐츠 저장소와 완전히 분리되어 있습니다.

## GET /api/ai/settings

**반환값** `AiSettings`:

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

`protocol`은 둘 중 하나: `anthropic`(v1/messages, 기본)/ `openai`(chat/completions). `modelFast`가 비어 있으면 경량 작업도 주 모델을 씁니다.

```bash
curl http://127.0.0.1:5175/api/ai/settings
```

## PUT /api/ai/settings

설정을 저장합니다. Body는 완전한 `AiSettings`: `enable`(boolean), `providers`(1–20벌. 필드 제약: `temperature` 0–2 기본 0.7, `timeoutSeconds` 5–86400 기본 30, `webSearch` 기본 true), `activeId`(providers 중 하나를 가리켜야 함). **활성 상태에서는** 현재 프로바이더가 완전히 채워져 있어야 합니다(주소 http(s) 시작, Key, 모델명). 아니면 400.

**반환값** 정규화되어 저장된 `AiSettings`(구버전 평면 구조와 호환, 읽을 때 자동 마이그레이션).

```bash
curl -X PUT http://127.0.0.1:5175/api/ai/settings \
  -H "Content-Type: application/json" \
  -d '{"enable":true,"providers":[{"id":"p1","name":"官方","protocol":"anthropic","baseUrl":"https://api.anthropic.com","apiKey":"sk-…","model":"claude-sonnet-5","modelFast":"","webSearch":true,"temperature":0.7,"timeoutSeconds":30}],"activeId":"p1"}'
```

## POST /api/ai/test

연결 테스트. **요청 본문의 폼 설정을 우선 사용**합니다(저장 전에도 테스트 가능). 파싱 실패 시 저장된 설정으로 대체합니다. 테스트 요청은 `maxTokens: 16`, `temperature: 0`, 사고·검색 off로 고정되며, 시간 초과는 해당 프로바이더 설정과 30초 중 작은 값을 씁니다.

**반환값** `AiTestResult`: `{ ok, latencyMs, reply?, error? }` — `ok=true`이면 `reply`에 모델 응답 조각(≤120자)이 담깁니다.

```bash
curl -X POST http://127.0.0.1:5175/api/ai/test \
  -H "Content-Type: application/json" \
  -d '{"enable":true,"providers":[{"id":"p1","name":"t","protocol":"anthropic","baseUrl":"https://api.anthropic.com","apiKey":"sk-…","model":"claude-sonnet-5","modelFast":"","webSearch":false,"temperature":0.7,"timeoutSeconds":30}],"activeId":"p1"}'
```

## POST /api/ai/chat

비스트리밍 대화 진입점(항상 저장된 설정 사용).

| Body 필드 | 타입 | 필수 | 설명 |
|-----------|------|------|------|
| `messages` | `{ role: system/user/assistant, content }[]` | 예 | 전체 메시지 목록. 한 건당 ≤200k자 |
| `maxTokens` | `number` | 아니요 | 16–16384 |
| `fast` | `boolean` | 아니요 | `true`이면 경량 모델 사용(미설정 시 주 모델로 대체)과 사고 off |

**반환값** `AiChatResult`: `{ content, model, promptTokens?, completionTokens?, searchUsed? }`.

```bash
curl -X POST http://127.0.0.1:5175/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"用一句话介绍 Markdown"}],"fast":true}'
```

## POST /api/ai/edit

단일 지시문 개작: 서버가 system을 고정합니다(Markdown 집필 조수, 결과만 출력). system 커스터마이징은 노출하지 않습니다.

| Body 필드 | 타입 | 필수 | 설명 |
|-----------|------|------|------|
| `instruction` | `string` | 예 | 개작 지시문. ≤2000자 |
| `text` | `string` | 예 | 개작할 텍스트. ≤100k자 |
| `maxTokens` | `number` | 아니요 | 기본 4096 |

**반환값** `AiChatResult`와 동일.

```bash
curl -X POST http://127.0.0.1:5175/api/ai/edit \
  -H "Content-Type: application/json" \
  -d '{"instruction":"润色：保留原意，只输出结果","text":"这算一个测试文本"}'
```

## 스트리밍 인터페이스(SSE) {#스트리밍-인터페이스}

`edit-stream`과 `chat-stream`은 같은 스트리밍 전달 프로토콜을 공유합니다:

- 응답 `Content-Type: text/event-stream`, 프레임마다 한 줄 `data: <JSON>`(표준 SSE의 여러 줄 event가 아님)
- 프레임 유형: `{ "type": "thinking", "text": "…" }`(사고 증분), `{ "type": "text", "text": "…" }`(본문 증분), `{ "type": "done", "content": "<전문>", "model": "…", "completionTokens": n }`, `{ "type": "error", "message": "…" }`
- **클라이언트 연결 끊김이 곧 상위 요청 중단**입니다(유일한 정지 수단)
- 시간 초과는 「출력 없는 유휴」 기준입니다(길이 = 현재 프로바이더 `timeoutSeconds`). 긴 글 생성은 총 시간 제한을 받지 않습니다

### POST /api/ai/edit-stream

스트리밍 개작. 요청 본문은 `edit`와 완전히 동일합니다(`maxTokens` 기본 4096).

```bash
curl -N -X POST http://127.0.0.1:5175/api/ai/edit-stream \
  -H "Content-Type: application/json" \
  -d '{"instruction":"续写这篇文章","text":"正文…"}'
```

### POST /api/ai/chat-stream

스트리밍 다중 턴 대화.

| Body 필드 | 타입 | 필수 | 설명 |
|-----------|------|------|------|
| `messages` | `{ role: user/assistant, content }[]` | 예 | 1–40건(system은 여기 제외) |
| `system` | `string` | 아니요 | 시스템 프롬프트. 별도 전송. ≤10k자 |
| `maxTokens` | `number` | 아니요 | 기본 8192 |

## POST /api/ai/commit-message

AI 커밋 메시지 생성. **절대 오류로 차단하지 않습니다**: AI 비활성 시 휴리스틱으로 대체하며 `source`로 표시합니다.

| Body 필드 | 타입 | 필수 | 기본값 | 설명 |
|-----------|------|------|------|------|
| `repo` | `"content" \| "theme"` | 아니요 | `content` | 어느 저장소의 변경으로 생성할지 |

**반환값** `{ message, source: "ai" \| "heuristic" }` — AI 출력은 `type(scope): ≤30자` 형식 검증을 통과해야 채택되며, 실패 시 변경 내용 기반 생성으로 자동 대체됩니다.

```bash
curl -X POST http://127.0.0.1:5175/api/ai/commit-message \
  -H "Content-Type: application/json" -d '{"repo":"content"}'
```

## POST /api/ai/timeline-draft

타임라인 이벤트 초안 작성.

| Body 필드 | 타입 | 필수 | 설명 |
|-----------|------|------|------|
| `mode` | `"note" \| "git"` | 예 | `note`는 설명으로 초안 작성, `git`은 세 저장소의 커밋 기록을 스캔해 종합 |
| `note` | `string` | mode=note일 때 필수 | 이벤트 설명. ≤500자 |
| `limit` | `number` | 아니요 | 1–5, 생성 건수 상한 |
| `existing` | `{ title, date }[]` | 아니요 | 이미 수록된 이벤트(≤300건). 중복 제거에 사용 |

**반환값** 초안 배열(strict JSON + zod 필터링으로 유효하지 않은 항목은 이미 제거됨).

```bash
curl -X POST http://127.0.0.1:5175/api/ai/timeline-draft \
  -H "Content-Type: application/json" \
  -d '{"mode":"note","note":"2025年6月上线了个人博客","limit":3}'
```

## POST /api/ai/music-search

음악 저작권 검색(웹 검색 우선. 서비스가 웹 검색을 지원하지 않으면 일반 요청으로 자동 강등하고 표시합니다).

| Body 필드 | 타입 | 필수 | 설명 |
|-----------|------|------|------|
| `query` | `string` | 예 | 검색어. ≤200자 |

**반환값** 후보 배열. 각 항목은 `title` / `artist?` / `license`(`freeCommercial`, `summary`, `evidence?`, `sourceUrl?`)/ `audioUrl?` / `coverUrl?` 포함.

```bash
curl -X POST http://127.0.0.1:5175/api/ai/music-search \
  -H "Content-Type: application/json" -d '{"query":"安静的钢琴曲 免费商用"}'
```

## POST /api/ai/wallpaper-search

배경화면 수집(safebooru 이미지 소스 직접 취득). **AI를 거치지 않고 활성 조건도 없어** 언제든 호출할 수 있습니다.

| Body 필드 | 타입 | 필수 | 설명 |
|-----------|------|------|------|
| `query` | `string` | 아니요 | 검색어. 기본 빈 값(무작위) |
| `target` | `"desktop" \| "mobile"` | 예 | 크기 목표: 데스크톱은 ≥1920 가로 이미지, 모바일은 ≥1920 세로 이미지 |

**반환값** `WallpaperCandidate[]`(한 배치를 채울 만큼): `{ imageUrl, previewUrl?, width?, height? }`.

```bash
curl -X POST http://127.0.0.1:5175/api/ai/wallpaper-search \
  -H "Content-Type: application/json" -d '{"query":"星空","target":"desktop"}'
```
