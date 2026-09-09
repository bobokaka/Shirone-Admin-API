import type { LocaleSpecificConfig } from "vitepress";

type LocaleConfig = LocaleSpecificConfig & { label: string };

export const ja: LocaleConfig = {
  lang: "ja-JP",
  label: "日本語",
  title: "Shirone Admin API",
  description: "VitePress 2.0 で構築された多言語ドキュメントサイトテンプレート。Mermaid ダイアグラム、数式、全文検索、ダークモードを内蔵",
  themeConfig: {
    nav: [
      { text: "ホーム", link: "/ja/" },
    ],
    sidebar: {} as any,
    outline: { label: "このページの目次", level: [2, 3] },
    docFooter: { prev: "前のページ", next: "次のページ" },
    lastUpdated: { text: "最終更新" },
    returnToTopLabel: "トップに戻る",
    sidebarMenuLabel: "メニュー",
    darkModeSwitchLabel: "外観",
    lightModeSwitchTitle: "ライトテーマに切り替え",
    darkModeSwitchTitle: "ダークテーマに切り替え",
    footer: {
      message: `Copyright © 2026-present bobokaka · Powered by <a href="https://vitepress.dev/" target="_blank">VitePress</a>`,
    },
    search: { provider: "local" },
  },
};
