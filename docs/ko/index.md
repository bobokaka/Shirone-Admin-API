---
layout: home

hero:
  name: Shirone-Admin
  text: Shirone 블로그를 위한 시각화 콘텐츠 관리 도구
  tagline: 로컬 실행 · AI 글쓰기 지원 · 원클릭 이중 저장소 게시 — 설치부터 API 참조까지, 여기서 시작하세요
  image:
    src: /assets/image/home/blog.svg
    alt: Shirone-Admin
  actions:
    - theme: brand
      text: 시작하기
      link: /ko/guide/
    - theme: alt
      text: GitHub
      link: https://github.com/bobokaka/Shirone-Admin

features:
  - title: 글 편집
    icon: '<i class="fa-solid fa-file-pen"></i>'
    details: Markdown 소스 모드 에디터. Shirone 테마 전용 확장 스니펫(삼중 콜론 컨테이너, file-tree, 코드 탭 등) 내장, 이미지도 본문과 함께 관리
  - title: 모먼트
    icon: '<i class="fa-solid fa-comment-dots"></i>'
    details: 짧은 게시물 발행과 관리. 이미지는 테마 썸네일 파이프라인 디렉터리에 자동 보관
  - title: 구조화 데이터
    icon: '<i class="fa-solid fa-table-list"></i>'
    details: 프로젝트, 스킬, 타임라인, 장치, 애니메이션, 내비게이션 등 data/*.ts 시각화 편집
  - title: AI 어시스턴트
    icon: '<i class="fa-solid fa-robot"></i>'
    details: 여러 프로바이더 전환 지원 — 가져온 콘텐츠 다시 쓰기, 커밋 메시지 생성, 타임라인 초안 작성 보조
  - title: 콘텐츠 가져오기
    icon: '<i class="fa-solid fa-file-import"></i>'
    details: 젠수(简书) 내보내기, 애니메이션(Bangumi API), 음악 원스톱 가져오기
  - title: 원클릭 게시
    icon: '<i class="fa-solid fa-rocket"></i>'
    details: 두 저장소에 git 커밋과 푸시, 게시 전 테마 검증 자동 실행

highlights:
  - header: Shirone-Admin을 선택하는 이유
    image: /assets/image/home/diamond.svg
    bgImage: /assets/image/home/bg/1-light.svg
    bgImageDark: /assets/image/home/bg/1-dark.svg
    features:
      - title: 로컬 우선
        icon: fa-house-laptop
        details: 모든 데이터는 자신의 콘텐츠 저장소에 저장 — 서버 배포 없이 단일 도구로 실행
      - title: 실제 사이트 미리보기
        icon: fa-eye
        details: 테마 저장소의 astro dev를 내장 — 보이는 그대로가 곧 게시될 실제 사이트
      - title: 3저장소 협업
        icon: fa-cubes
        details: Shirone 테마 저장소, Shirone-Content 콘텐츠 저장소와 역할을 분담하여 변경 이력을 명확하게 추적
      - title: 안전한 게시
        icon: fa-shield-halved
        details: 게시 전 테마 검증 자동 실행, 실패 시 게시 차단

  - header: 3분 만에 시작하기
    image: /assets/image/home/box.svg
    bgImage: /assets/image/home/bg/2-light.svg
    bgImageDark: /assets/image/home/bg/2-dark.svg
    highlights:
      - Shirone, Shirone-Content, Shirone-Admin 세 저장소를 같은 상위 디렉터리에 클론
      - Shirone-Admin과 Shirone 저장소에서 각각 pnpm install 실행
      - node workspace/content-watch.mjs로 모든 서비스 한 번에 시작
      - 브라우저에서 http://localhost:5173 접속해 관리 화면 진입
      - 자세한 단계와 활용법은 가이드 참조
---
