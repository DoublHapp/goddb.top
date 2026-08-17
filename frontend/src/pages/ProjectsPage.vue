<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProjectCard from '@/components/ProjectCard.vue'
import { projects } from '@/content'
import { useLocale } from '@/composables/useLocale'
import { useSeo } from '@/composables/useSeo'
import PhantomPageLead from '@/components/PhantomPageLead.vue'
import PhantomFilterBar from '@/components/PhantomFilterBar.vue'
import PhantomEmptyState from '@/components/PhantomEmptyState.vue'

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
    <PhantomPageLead index="02" :eyebrow="t.projects.eyebrow" :title="t.projects.title" :description="t.projects.subtitle" :count="`${projects.length} FILES`" />
    <PhantomFilterBar :search="query" :placeholder="t.projects.search" :filter-label="t.projects.filter" :options="statuses.map((item) => ({ value: item, label: t.projects[item] }))" :active="status" :clear-label="t.common.clear" @update:search="query = $event" @select="status = $event as Status" @clear="clearFilters" />
    <TransitionGroup v-if="filteredProjects.length" name="card-list" tag="div" class="project-grid archive-grid"><ProjectCard v-for="project in filteredProjects" :key="project.slug" :project="project" /></TransitionGroup>
    <PhantomEmptyState v-else code="NO FILE MATCH" :title="t.projects.empty" :action="t.common.clear" @action="clearFilters" />
  </section>
</template>
