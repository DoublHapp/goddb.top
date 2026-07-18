<script setup lang="ts">
import { ArrowLeft, ExternalLink, Github } from 'lucide-vue-next'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { projects } from '@/content'
import { useLocale } from '@/composables/useLocale'
import { useSeo } from '@/composables/useSeo'

const route = useRoute()
const { locale, t } = useLocale()
const project = computed(() => projects.find((item) => item.slug === route.params.slug))
useSeo(() => project.value?.title ?? '404', () => project.value?.summary[locale.value] ?? t.value.notFound.title, () => route.path)
</script>

<template>
  <section v-if="project" class="page shell detail-page">
    <RouterLink to="/projects" class="back-link"><ArrowLeft :size="16" />{{ t.common.back }}</RouterLink>
    <div class="detail-header"><div><p class="eyebrow">{{ project.sequence }} / {{ project.status }}</p><h1>{{ project.title }}</h1></div><div class="detail-actions"><a v-if="project.repository" :href="project.repository" target="_blank" rel="noreferrer"><Github :size="17" />{{ t.common.repo }}</a><a v-if="project.demo" :href="project.demo" target="_blank" rel="noreferrer"><ExternalLink :size="17" />{{ t.common.demo }}</a></div></div>
    <div class="detail-grid"><article><span class="panel-label">// {{ t.projects.overview }}</span><p class="detail-description">{{ project.description[locale] }}</p></article><aside><span class="panel-label">// {{ t.projects.stack }}</span><ul class="protocol-list"><li v-for="(item, index) in project.stack" :key="item"><span>0{{ index + 1 }}</span>{{ item }}</li></ul></aside></div>
  </section>
  <section v-else class="page shell not-found"><p class="eyebrow">{{ t.notFound.code }}</p><h1>{{ t.notFound.title }}</h1><RouterLink to="/projects" class="primary-button">{{ t.common.back }}</RouterLink></section>
</template>
