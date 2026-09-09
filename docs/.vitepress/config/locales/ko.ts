import type { LocaleSpecificConfig } from "vitepress";

type LocaleConfig = LocaleSpecificConfig & { label: string };

export const ko: LocaleConfig = {
  lang: "ko-KR",
  label: "한국어",
  title: "Shirone Admin API",
  description: "VitePress 2.0 기반 다국어 문서 사이트 템플릿. Mermaid 다이어그램, 수식, 전문 검색, 다크 모드 내장",
  themeConfig: {
    nav: [
      { text: "홈", link: "/ko/" },
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
      message: `Copyright © 2026-present bobokaka · Powered by <a href="https://vitepress.dev/" target="_blank">VitePress</a>`,
    },
    search: { provider: "local" },
  },
};
