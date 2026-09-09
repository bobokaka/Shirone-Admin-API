---
layout: home

hero:
  name: Shirone Admin API
  text: VitePress 2.0 기반 다국어 문서 사이트 템플릿
  tagline: 9개 언어 · Mermaid 다이어그램 · 수식 · 전문 검색 · 다크 모드 · RSS 피드
  image:
    src: /assets/image/home/layout.svg
    alt: Shirone Admin API
  actions:
    - theme: brand
      text: GitHub 저장소
      link: https://github.com/bobokaka/Shirone-Admin-API
    - theme: alt
      text: VitePress 문서
      link: https://vitepress.dev/

features:
  - title: 다국어 아키텍처
    icon: '<i class="fa-solid fa-language"></i>'
    details: 중국어(간체·번체), 영어, 일본어, 한국어, 프랑스어, 독일어, 스페인어, 러시아어 등 9개 로케일 구성과 현지화된 UI 문구, 언어별 디렉터리 내장
  - title: Mermaid 다이어그램
    icon: '<i class="fa-solid fa-diagram-project"></i>'
    details: vitepress-plugin-mermaid 기반 순서도, 시퀀스 다이어그램, 클래스 다이어그램 등 지원. 다크 모드 대응
  - title: 수식
    icon: '<i class="fa-solid fa-square-root-variable"></i>'
    details: MathJax 3 기반 인라인 및 블록 수식 렌더링
  - title: 전문 검색
    icon: '<i class="fa-solid fa-magnifying-glass"></i>'
    details: VitePress 로컬 검색, 언어별 UI 사용자 정의 지원
  - title: Markdown 확장
    icon: '<i class="fa-solid fa-markdown"></i>'
    details: 하이라이트, 위첨자·아래첨자, 각주 등 확장 문법 내장
  - title: 댓글과 피드
    icon: '<i class="fa-solid fa-comments"></i>'
    details: Giscus 댓글(GitHub Discussions)과 RSS 피드 바로 사용 가능

highlights:
  - header: 빠른 시작
    image: /assets/image/home/box.svg
    bgImage: /assets/image/home/bg/1-light.svg
    bgImageDark: /assets/image/home/bg/1-dark.svg
    highlights:
      - 저장소를 클론한 후 pnpm install 실행
      - pnpm run dev로 개발 서버를 시작하고 http://localhost:5173 접속
      - docs/ko/ 디렉터리에 Markdown 문서 추가
      - sidebar-generated.ts에 사이드바 설정 등록
      - config/locales/ko.ts에서 내비게이션과 푸터 사용자 정의
      - pnpm run build로 프로덕션 빌드 후 원하는 정적 호스팅에 배포
---
