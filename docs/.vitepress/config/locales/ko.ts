import type { LocaleSpecificConfig } from "vitepress";

type LocaleConfig = LocaleSpecificConfig & { label: string };

export const ko: LocaleConfig = {
  lang: "ko-KR",
  label: "한국어",
  title: "Shirone Admin Docs",
  description: "Shirone 블로그용 시각화 콘텐츠 관리 도구 Shirone-Admin 공식 문서 — 설치, 사용법, 설정 및 API 참조",
  themeConfig: {
    nav: [
      { text: "홈", link: "/ko/" },
      { text: "가이드", link: "/ko/guide/" },
      { text: "API 참조", link: "/ko/api/" },
    ],
    sidebar: {} as any,
    outline: { label: "이 페이지에서", level: [2, 3] },
    docFooter: { prev: "이전", next: "다음" },
    lastUpdated: { text: "최근 업데이트" },
    returnToTopLabel: "맨 위로",
    sidebarMenuLabel: "메뉴",
    darkModeSwitchLabel: "테마",
    lightModeSwitchTitle: "라이트 모드로 전환",
    darkModeSwitchTitle: "다크 모드로 전환",
    footer: {
      message: `<div style="display:flex;flex-direction:row;flex-wrap:wrap;justify-content:center;width:100%">
    <div style="display:inline-block;margin-bottom:4px;margin-right:8px">版权所有 ©2025-present  湖南衍宇科技有限公司 </div>
    <div style="margin-right:8px;display:inline-block;margin-bottom:4px">
      <a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank">湘ICP备2025108289号-1 </a>
    </div>
    <div style="margin-right:8px;display:inline-block;margin-bottom:4px">
      <div style="display:flex;align-items:center;justify-content:center">
        <img style="width:18px;height:18px;margin-right:12px" src="/assets/image/home/police-icon.png"/>
        <a style="height:auto" href="https://beian.mps.gov.cn/#/query/webSearch?code=43010402002123" rel="noreferrer" target="_blank">湘公网安备43010402002123号</a>
      </div>
    </div>
  </div>`,
    },
    search: { provider: "local" },
  },
};
