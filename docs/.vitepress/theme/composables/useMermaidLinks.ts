import { onMounted, onUnmounted } from "vue";

const handleClick = (e: MouseEvent) => {
  const target = e.target as Element;
  const anchor = target.closest("a");
  if (anchor && anchor.closest(".mermaid")) {
    const href =
      anchor.getAttribute("href") ||
      anchor.getAttribute("xlink:href") ||
      "";
    if (href) {
      e.preventDefault();
      e.stopPropagation();
      window.open(href, "_blank");
    }
  }
};

export const useMermaidLinks = () => {
  onMounted(() => {
    document.addEventListener("click", handleClick, true);
  });
  onUnmounted(() => {
    document.removeEventListener("click", handleClick, true);
  });
};
