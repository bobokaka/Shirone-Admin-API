<script setup lang="ts">
import DefaultTheme from "vitepress/theme";
import HomeHighlights from "./components/HomeHighlights.vue";
import { useMermaidLinks } from "./composables/useMermaidLinks.js";

const { Layout } = DefaultTheme;

useMermaidLinks();
</script>

<template>
  <Layout>
    <!--
      在 home-hero-before 插槽渲染完整自定义首页（hero + features + highlights）。
      通过 CSS 隐藏 VitePress 默认的 VPHomeHero 和 VPHomeFeatures，
      避免它们重复渲染。
    -->
    <template #home-hero-before>
      <HomeHighlights />
    </template>
  </Layout>
</template>

<style>
/* 隐藏 VitePress 默认的 hero 和 features，由 HomeHighlights 统一渲染 */
.VPHome > .VPHomeHero,
.VPHome > .VPHomeFeatures {
  display: none !important;
}
</style>
