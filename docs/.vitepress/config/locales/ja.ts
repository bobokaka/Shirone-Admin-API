import type { LocaleSpecificConfig } from "vitepress";

type LocaleConfig = LocaleSpecificConfig & { label: string };

export const ja: LocaleConfig = {
  lang: "ja-JP",
  label: "日本語",
  title: "Shirone Admin Docs",
  description: "Shirone ブログ用ビジュアルコンテンツ管理ツール「Shirone-Admin」の公式ドキュメント — インストール、使い方、設定、API リファレンス",
  themeConfig: {
    nav: [
      { text: "ホーム", link: "/ja/" },
      { text: "ガイド", link: "/ja/guide/" },
      { text: "API リファレンス", link: "/ja/api/" },
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
      message: `<div style="display:flex;flex-direction:row;flex-wrap:wrap;justify-content:center;width:100%">
    <div style="display:inline-block;margin-bottom:4px;margin-right:8px">版权所有 ©2025-present  湖南衍宇科技有限公司 </div>
    <div style="margin-right:8px;display:inline-block;margin-bottom:4px">
      <a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank">湘ICP备2025108289号-1 </a>
    </div>
    <div style="margin-right:8px;display:inline-block;margin-bottom:4px">
      <div style="display:flex;align-items:center;justify-content:center">
        <img style="width:18px;height:18px;margin-right:12px" src="/shironeadmin/assets/image/home/police-icon.png"/>
        <a style="height:auto" href="https://beian.mps.gov.cn/#/query/webSearch?code=43010402002123" rel="noreferrer" target="_blank">湘公网安备43010402002123号</a>
      </div>
    </div>
  </div>`,
    },
    search: { provider: "local" },
  },
};
