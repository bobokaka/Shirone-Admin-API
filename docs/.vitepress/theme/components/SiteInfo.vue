<script setup lang="ts">
defineProps<{
  name?: string
  desc?: string
  logo?: string
  url?: string
  repo?: string
  preview?: string
}>()
</script>

<template>
  <div class="site-info-card">
    <a
      v-if="preview"
      :href="url || '#'"
      class="site-info-preview"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img :src="preview" :alt="name" loading="lazy" />
    </a>
    <div class="site-info-body">
      <div class="site-info-header">
        <img v-if="logo" :src="logo" :alt="name" class="site-info-logo" />
        <span class="site-info-name">{{ name }}</span>
      </div>
      <p v-if="desc" class="site-info-desc">{{ desc }}</p>
      <div class="site-info-links">
        <a
          v-if="url && url !== '#'"
          :href="url"
          target="_blank"
          rel="noopener noreferrer"
          class="site-info-link"
        >{{ $frontmatter?.linkText || '访问' }}</a>
        <a
          v-if="repo && repo !== '#'"
          :href="repo"
          target="_blank"
          rel="noopener noreferrer"
          class="site-info-link"
        >源码</a>
      </div>
    </div>
  </div>
</template>

<style>
.site-info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}
@media (max-width: 640px) {
  .site-info-grid {
    grid-template-columns: 1fr;
  }
}
.site-info-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
  transition: border-color 0.25s, box-shadow 0.25s;
  background: var(--vp-c-bg-soft);
}
.site-info-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}
.site-info-preview {
  display: block;
  overflow: hidden;
}
.site-info-preview img {
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  display: block;
  transition: transform 0.3s;
}
.site-info-card:hover .site-info-preview img {
  transform: scale(1.02);
}
.site-info-body {
  padding: 16px;
}
.site-info-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}
.site-info-logo {
  width: 28px;
  height: 28px;
  border-radius: 4px;
  object-fit: contain;
}
.site-info-name {
  font-weight: 600;
  font-size: 1rem;
  color: var(--vp-c-text-1);
}
.site-info-desc {
  margin: 0 0 10px;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}
.site-info-links {
  display: flex;
  gap: 12px;
}
.site-info-link {
  font-size: 0.875rem;
  color: var(--vp-c-brand-1);
  text-decoration: none;
}
.site-info-link:hover {
  text-decoration: underline;
}
</style>
