---
title: 사이트 설정
description: /api/settings/:domain 네 가지 설정 도메인(site/profile/navbar/footer)의 읽기·쓰기 인터페이스 참조. YAML 최소 덮어쓰기 의미론.
---

# 사이트 설정

사이트 설정 모듈은 콘텐츠 저장소 `config/*.yaml`을 읽고 씁니다. 경로 매개변수 `domain`은 넷 중 하나: `site` / `profile` / `navbar` / `footer`.

**쓰기 의미론 — YAML 최소 덮어쓰기**: PUT은 요청 본문에 선언된 키만 씁니다(재귀 패치). 선언하지 않은 필드는 YAML에 나타나지 않고 실행 시 테마 기본값을 상속합니다. 배열은 통째로 교체됩니다. 따라서 필드 하나만 안심하고 보내도 나머지 설정을 깨뜨리지 않습니다.

## GET /api/settings/:domain

설정 도메인의 현재 값을 읽습니다(즉 YAML에 선언된 덮어쓰기 항목. 선언되지 않은 키는 반환에 없음).

```bash
curl http://127.0.0.1:5175/api/settings/site
```

각 도메인의 반환 요점:

| 도메인 | 대응 파일 | 반환 구조 |
|----|----------|----------|
| `site` | `config/site.yaml` | `SiteSettings`. 읽기 전용 `themeFavicon[]` 추가 동반(테마 기본 favicon. 콘텐츠 저장소가 덮어쓰지 않았을 때 실제 적용되는 아이콘. 다시 기록되지 **않음**) |
| `profile` | `config/profile.yaml` | `{ avatar?, name?, bio?, links?: { name, icon, url }[] }` |
| `navbar` | `config/nav-bar.yaml` | `{ links?: NavBarLink[] }` |
| `footer` | `config/footer.yaml` + `config/footer.html` | `{ enable: boolean, html: string }` — html은 항상 문자열(파일이 없으면 `""`) |

## PUT /api/settings/site

`site.yaml`에 기록합니다. 요청 본문의 모든 필드는 선택이며 zod가 열거값과 범위를 엄격 검증합니다:

| 필드 | 타입 | 제약 |
|------|------|------|
| `site` / `base` / `title` | `string` | 비어 있으면 안 됨 |
| `subtitle` | `string` | — |
| `lang` | 열거형 | `en / zh_CN / zh_TW / ja / ko / es / th / vi / tr / id` |
| `i18n` | `{ enable?, locales? }` | `locales`는 최소 한 항목이며 모두 lang 열거형 |
| `timeZone` | `string` | ≥2자(예: `Asia/Shanghai`) |
| `displaySettings` | `Record<string, boolean>` | 키는 `colorStyle / colorSpec / wallpaperMode / layoutMode / reduceMotion / texture`로 제한 |
| `themeColor` | `{ hue?, fixed?, style?, spec? }` | `hue`는 0–360 정수. `style`은 9 중 하나(tonalSpot/vibrant/content/expressive/rainbow/fruitSalad/monochrome/neutral/fidelity). `spec`은 2021 또는 2025 |
| `wallpaperMode` | `{ defaultMode? }` | `banner / none` |
| `texture` | `{ enable?, defaultPreset?, defaultOpacity?, allowMotion? }` | preset은 여섯 중 하나(none/starlight/cyber-dots/topography/geometric/sakura). opacity 0.05–0.25 |
| `banner` | 아래 참고 | 배너 전체 구조 |
| `favicon` | `{ src, theme }[]` | `theme`은 `light / dark` |

`banner` 하위 구조: `src.desktop[] / src.mobile[]`(배경화면 경로 배열), `position`(top/center/bottom), `dim`, `homeText`(제목 + 부제 배열 + `typewriter` 속도 묶음), `carousel`(interval ≥3000ms, fadeDuration, 여섯 가지 애니메이션), `waves`.

**부작용**: 배너 저장 후 어느 쪽에서도 더 이상 참조되지 않는 로컬 배경화면 파일이 자동 삭제됩니다. **반환값**: 갱신된 `site.yaml` 전체.

```bash
curl -X PUT http://127.0.0.1:5175/api/settings/site \
  -H "Content-Type: application/json" \
  -d '{"title":"我的博客","themeColor":{"hue":260}}'
```

## PUT /api/settings/profile

`profile.yaml`에 기록합니다. 필드: `avatar` / `name` / `bio` / `links[]`(각 항목에서 `name`과 `url`은 필수, `icon`은 생략 가능).

```bash
curl -X PUT http://127.0.0.1:5175/api/settings/profile \
  -H "Content-Type: application/json" \
  -d '{"name":"Shirone","bio":"写代码也写故事"}'
```

## PUT /api/settings/navbar

`nav-bar.yaml`에 기록합니다. Body: `{ links?: NavBarLink[] }` — `links`를 넘기지 않으면 아무 작업 없이 현재 값을 반환합니다. `NavBarLink` 각 항목: `preset`(테마 프리셋 이름, 예: `home`)/ `name` / `icon` / `url` / `external` / `children[]`(재귀적 동일 구조, 드롭다운 그룹용). **배열은 통째로 교체**됩니다.

```bash
curl -X PUT http://127.0.0.1:5175/api/settings/navbar \
  -H "Content-Type: application/json" \
  -d '{"links":[{"name":"关于","url":"/about/"}]}'
```

## PUT /api/settings/footer

푸터를 기록합니다: `enable`(`footer.yaml`에 기록)과 `html`(**원문 그대로** `footer.html`에 기록, 끝 여백만 제거). 두 필드 모두 생략 가능하며 각자 독립적으로 적용됩니다. **반환값** `{ enable, html }`.

```bash
curl -X PUT http://127.0.0.1:5175/api/settings/footer \
  -H "Content-Type: application/json" \
  -d '{"enable":true,"html":"<p>自定义页脚内容</p>"}'
```
