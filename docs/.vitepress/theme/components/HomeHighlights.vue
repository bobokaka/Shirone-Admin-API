<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from "vue";
import { useData } from "vitepress";
// 直接导入 VitePress 内置组件，保留其 scoped 样式
import VPHero from "vitepress/dist/client/theme-default/components/VPHero.vue";
import VPFeatures from "vitepress/dist/client/theme-default/components/VPFeatures.vue";

interface HeroAction {
  theme?: "brand" | "alt";
  text: string;
  link: string;
}

interface HeroConfig {
  name: string;
  text?: string;
  tagline?: string;
  image?: { src: string; alt?: string };
  actions?: HeroAction[];
}

interface FeatureItem {
  title: string;
  icon?: string;
  details?: string;
  link?: string;
}

interface HighlightSection {
  header: string;
  image?: string;
  bgImage?: string;
  bgImageDark?: string;
  highlights?: string[];
  features?: FeatureItem[];
}

const { frontmatter: fm } = useData();

const hero = computed<HeroConfig | undefined>(() => fm.value.hero as HeroConfig | undefined);
const features = computed<FeatureItem[]>(() => (fm.value.features as FeatureItem[]) || []);
const sections = computed<HighlightSection[]>(() => (fm.value.highlights as HighlightSection[]) || []);
const footerHtml = computed<string | undefined>(() => fm.value.footer as string | undefined);

const rootEl = ref<HTMLElement | null>(null);
const sectionEls = ref<HTMLElement[]>([]);

let sectionObserver: IntersectionObserver | null = null;
let featureObserver: IntersectionObserver | null = null;

function observeSections() {
  sectionObserver?.disconnect();
  sectionEls.value.forEach((el) => {
    if (el) sectionObserver?.observe(el);
  });
}

function observeFeatures() {
  featureObserver?.disconnect();
  // VPFeatures 是 VitePress 组件，内部 .VPFeature 无法通过 ref 获取
  // 改用 DOM 查询，从根容器内查找所有 .VPFeature 元素
  if (rootEl.value) {
    rootEl.value.querySelectorAll(".VPFeature").forEach((el) => {
      featureObserver?.observe(el as HTMLElement);
    });
  }
}

onMounted(() => {
  sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("eco-visible");
          sectionObserver?.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.05, rootMargin: "0px 0px -40px 0px" }
  );

  featureObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in-view");
          featureObserver?.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
  );

  observeSections();
  observeFeatures();
});

watch(sections, () => {
  nextTick(() => observeSections());
});

watch(features, () => {
  nextTick(() => observeFeatures());
});

onBeforeUnmount(() => {
  sectionObserver?.disconnect();
  featureObserver?.disconnect();
});
</script>

<template>
  <div ref="rootEl" class="home eco-home">
    <!-- ===== HERO: 使用 VitePress 内置组件，保留完整 scoped 样式 ===== -->
    <VPHero
      v-if="hero"
      class="VPHomeHero"
      :name="hero.name"
      :text="hero.text"
      :tagline="hero.tagline"
      :image="hero.image"
      :actions="hero.actions"
    />

    <!-- ===== FEATURES: 使用 VitePress 内置组件，保留完整 scoped 样式 ===== -->
    <VPFeatures
      v-if="features.length"
      class="VPHomeFeatures"
      :features="features"
    />

    <!-- ===== HIGHLIGHTS SECTIONS ===== -->
    <div class="eco-highlights">
      <section
        v-for="(section, idx) in sections"
        :key="idx"
        :ref="(el: any) => { if (el) sectionEls[idx] = el; }"
        class="eco-section"
        :class="[
          idx % 2 === 1 ? 'eco-section--alt' : '',
          section.highlights ? 'eco-section--highlights' : '',
          section.features ? 'eco-section--features' : '',
        ]"
        :style="[
          section.bgImage
            ? {
                '--eco-section-bg-light': `url(${section.bgImage})`,
                '--eco-section-bg-dark': section.bgImageDark
                  ? `url(${section.bgImageDark})`
                  : `url(${section.bgImage})`,
              }
            : {},
        ]"
      >
        <div class="eco-section__container">
          <div class="eco-section__header">
            <div v-if="section.image" class="eco-section__icon">
              <img :src="section.image" :alt="section.header" loading="lazy" />
            </div>
            <h2 class="eco-section__title">{{ section.header }}</h2>
            <div class="eco-section__title-line"></div>
          </div>

          <div v-if="section.highlights?.length" class="eco-highlights-list">
            <div
              v-for="(item, i) in section.highlights"
              :key="i"
              class="eco-highlight-item"
              :class="{
                'eco-highlight-item--tagline':
                  i === section.highlights!.length - 1,
              }"
            >
              <div class="eco-highlight-item__indicator">
                <div class="eco-highlight-item__dot"></div>
                <div class="eco-highlight-item__line"></div>
              </div>
              <div class="eco-highlight-item__content">
                <span class="eco-highlight-item__text">{{ item }}</span>
              </div>
            </div>
          </div>

          <div v-if="section.features?.length" class="eco-features-grid">
            <div
              v-for="(feat, i) in section.features"
              :key="i"
              class="eco-feature-card"
            >
              <div v-if="feat.icon" class="eco-feature-card__icon">
                <i
                  :class="
                    feat.icon.startsWith('fa-')
                      ? feat.icon
                      : 'fa-solid fa-' + feat.icon
                  "
                ></i>
              </div>
              <h3 class="eco-feature-card__title">{{ feat.title }}</h3>
              <p v-if="feat.details" class="eco-feature-card__details">
                {{ feat.details }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer v-if="footerHtml" class="eco-footer" v-html="footerHtml" />
    </div>
  </div>
</template>
