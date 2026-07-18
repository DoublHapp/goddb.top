<script setup lang="ts">
import { Search, X } from 'lucide-vue-next'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProjectCard from '@/components/ProjectCard.vue'
import { projects } from '@/content'
import { useLocale } from '@/composables/useLocale'
import { useSeo } from '@/composables/useSeo'

const { locale, t } = useLocale()
const statuses = ['all', 'online', 'building', 'archived'] as const
type Status = typeof statuses[number]
const route = useRoute()
const router = useRouter()
const readStatus = (value: unknown): Status => statuses.includes(value as Status) ? value as Status : 'all'
const query = ref(typeof route.query.q === 'string' ? route.query.q : '')
const status = ref<Status>(readStatus(route.query.status))
const filteredProjects = computed(() => {
  const keyword = query.value.trim().toLocaleLowerCase()
  return projects.filter((project) => {
    const matchesStatus = status.value === 'all' || project.status === status.value
    const searchable = [project.title, project.summary[locale.value], ...project.stack].join(' ').toLocaleLowerCase()
    return matchesStatus && (!keyword || searchable.includes(keyword))
  })
})
const clearFilters = () => {
  query.value = ''
  status.value = 'all'
}
watch([query, status], ([nextQuery, nextStatus]) => {
  const next = { ...route.query }
  if (nextQuery.trim()) next.q = nextQuery.trim()
  else delete next.q
  if (nextStatus !== 'all') next.status = nextStatus
  else delete next.status
  router.replace({ query: next })
})
watch(() => route.query, (next) => {
  query.value = typeof next.q === 'string' ? next.q : ''
  status.value = readStatus(next.status)
})
useSeo(() => t.value.nav.projects, () => t.value.projects.subtitle, '/projects')
</script>

<template>
  <section class="page shell">
    <p class="eyebrow">{{ t.projects.eyebrow }}</p>
    <div class="page-lead"><h1>{{ t.projects.title }}<span class="accent">.</span></h1><p>{{ t.projects.subtitle }}</p></div>
    <div class="filter-workbench">
      <label class="search-field"><Search :size="17" /><span class="sr-only">{{ t.projects.search }}</span><input v-model="query" type="search" :placeholder="t.projects.search"></label>
      <div class="filter-chips" :aria-label="t.projects.filter">
        <button v-for="item in statuses" :key="item" type="button" :class="{ active: status === item }" @click="status = item">{{ t.projects[item] }}</button>
      </div>
      <button v-if="query || status !== 'all'" class="clear-filter" type="button" @click="clearFilters"><X :size="15" />{{ t.common.clear }}</button>
    </div>
    <TransitionGroup v-if="filteredProjects.length" name="card-list" tag="div" class="project-grid archive-grid"><ProjectCard v-for="project in filteredProjects" :key="project.slug" :project="project" /></TransitionGroup>
    <div v-else class="empty-state"><Search :size="24" /><p>{{ t.projects.empty }}</p><button type="button" @click="clearFilters">{{ t.common.clear }}</button></div>
  </section>
</template>
