<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next'
import type { Project } from '@/types/content'
import { useLocale } from '@/composables/useLocale'

defineProps<{ project: Project }>()
const { locale, t } = useLocale()
</script>

<template>
  <article class="project-card">
    <div class="card-topline"><span>{{ project.sequence }}</span><span :class="['status-badge', project.status]">{{ project.status }}</span></div>
    <h3>{{ project.title }}</h3>
    <p>{{ project.summary[locale] }}</p>
    <ul class="tag-list"><li v-for="item in project.stack" :key="item">{{ item }}</li></ul>
    <RouterLink :to="`/projects/${project.slug}`" class="card-link">{{ t.common.open }} <ArrowUpRight :size="16" /></RouterLink>
  </article>
</template>
