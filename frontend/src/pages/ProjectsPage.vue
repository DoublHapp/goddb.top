<script setup lang="ts">
import ProjectCard from '@/components/ProjectCard.vue'
import { projects } from '@/content'
import { useLocale } from '@/composables/useLocale'
import { useSeo } from '@/composables/useSeo'

const { t } = useLocale()
useSeo(() => t.value.nav.projects, () => t.value.projects.subtitle, '/projects')
</script>

<template>
  <section class="page shell">
    <p class="eyebrow">{{ t.projects.eyebrow }}</p>
    <div class="page-lead"><h1>{{ t.projects.title }}<span class="accent">.</span></h1><p>{{ t.projects.subtitle }}</p></div>
    <div class="project-grid archive-grid"><ProjectCard v-for="project in projects" :key="project.slug" :project="project" /></div>
  </section>
</template>
