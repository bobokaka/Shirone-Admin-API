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
  - title: 대시보드와 실제 사이트 미리보기
    icon: '<i class="fa-solid fa-gauge-high"></i>'
    details: 게시 대기 변경 사항과 콘텐츠 통계를 한눈에, 실제 블로그를 내장한 실시간 미리보기
    link: /ko/guide/dashboard
  - title: 글 편집
    icon: '<i class="fa-solid fa-pen-nib"></i>'
    details: Markdown 소스 모드 에디터. 삼중 콜론 컨테이너, file-tree 등 테마 전용 확장 스니펫 내장, 이미지도 본문과 함께 관리
    link: /ko/guide/post-editor
  - title: 모먼트
    icon: '<i class="fa-solid fa-messages"></i>'
    details: 기분, 위치, 태그, 9장 그리드 사진. 이미지는 테마 썸네일 파이프라인에 자동 보관
    link: /ko/guide/moments
  - title: 사이트 설정
    icon: '<i class="fa-solid fa-palette"></i>'
    details: 기본 정보, 내비게이션, 푸터, 테마 외형, 배너 배경화면을 모두 시각적으로 편집
    link: /ko/guide/settings
  - title: 구조화 데이터
    icon: '<i class="fa-solid fa-diagram-project"></i>'
    details: 프로젝트, 스킬, 타임라인, 장치, 애니메이션, 나침반, 재생목록, 링크 등 data/*.ts 시각화 편집, 검색 가져오기 지원
    link: /ko/guide/data
  - title: AI 어시스턴트
    icon: '<i class="fa-solid fa-wand-magic-sparkles"></i>'
    details: 여러 프로바이더 자유 전환 — 콘텐츠 다시 쓰기, 커밋 메시지 생성, 타임라인 초안을 모든 페이지에서 활용
    link: /ko/guide/ai
  - title: 콘텐츠 가져오기
    icon: '<i class="fa-solid fa-cloud-arrow-down"></i>'
    details: 젠수(简书) 내보내기 일괄 이전, 단일 글 붙여넣기 즉시 변환, 애니메이션과 음악 원스톱 가져오기
    link: /ko/guide/import
  - title: 원클릭 게시
    icon: '<i class="fa-solid fa-rocket-launch"></i>'
    details: 두 저장소에 git 커밋과 푸시. 게시 전 테마 검증 자동 실행, 실패 시 차단
    link: /ko/guide/publish

highlights:
  - header: Shirone-Admin을 선택하는 이유
    image: /assets/image/home/diamond.svg
    bgImage: /assets/image/home/bg/1-light.svg
    bgImageDark: /assets/image/home/bg/1-dark.svg
    features:
      - title: 로컬 우선
        icon: fa-hard-drive
        details: 모든 데이터는 자신의 콘텐츠 저장소에 저장 — 서버 배포 없이 단일 도구로 실행
      - title: 실제 사이트 미리보기
        icon: fa-window-maximize
        details: 테마 저장소의 astro dev를 내장 — 보이는 그대로가 곧 게시될 실제 사이트
      - title: 3저장소 협업
        icon: fa-cubes
        details: Shirone 테마 저장소, Shirone-Content 콘텐츠 저장소와 역할을 분담하여 변경 이력을 명확하게 추적
      - title: 안전한 게시
        icon: fa-clipboard-check
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
