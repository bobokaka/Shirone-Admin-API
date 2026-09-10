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
    icon: '<i class="fa-solid fa-comments"></i>'
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
    icon: '<i class="fa-solid fa-rocket"></i>'
    details: 두 저장소에 git 커밋과 푸시. 게시 전 테마 검증 자동 실행, 실패 시 차단
    link: /ko/guide/publish

highlights:
  - header: Shirone-Admin을 선택하는 이유
    image: /assets/image/home/diamond.svg
    bgImage: /assets/image/home/bg/1-light.svg
    bgImageDark: /assets/image/home/bg/1-dark.svg
    features:
      - title: 추적 가능한 이력
        icon: fa-clock-rotate-left
        details: 게시할 때마다 git 커밋이 남는다 — 언제 무엇을 바꿨는지 한눈에 확인하고 문제가 생기면 언제든 롤백
      - title: 3저장소 역할 분담
        icon: fa-cubes
        details: 도구·테마·콘텐츠가 저마다의 저장소에서 명확히 분리 — 업그레이드는 서로 간섭하지 않고 테마를 바꿔도 콘텐츠는 그대로
      - title: 데이터 주권은 당신에게
        icon: fa-user-shield
        details: 글·설정·미디어는 늘 당신의 저장소에 저장 — 도구는 조작대일 뿐, 전체 데이터를 가지고 언제든 이동할 수 있다
      - title: 운영 비용 제로
        icon: fa-house-laptop
        details: 서버도 데이터베이스도 일상 운영도 필요 없다 — 컴퓨터 한 대가 전체 인프라

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
