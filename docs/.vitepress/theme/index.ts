import DefaultTheme from "vitepress/theme";
import SiteInfo from "./components/SiteInfo.vue";
import HomeHighlights from "./components/HomeHighlights.vue";
import CustomLayout from "./Layout.vue";
import "./styles/index.css";
import "./styles/mermaid-dark.css";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component("SiteInfo", SiteInfo);
    app.component("HomeHighlights", HomeHighlights);
  },
  Layout: CustomLayout,
};
