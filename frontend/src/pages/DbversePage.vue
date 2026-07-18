<script setup lang="ts">
import { Dices, Search, X } from 'lucide-vue-next'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DbverseCard from '@/components/DbverseCard.vue'
import { dbverseEntries } from '@/content'
import { useLocale } from '@/composables/useLocale'
import { useSeo } from '@/composables/useSeo'
import type { DbverseMood, DbverseSection } from '@/types/content'

const route = useRoute()
const router = useRouter()
const { locale, t } = useLocale()
const sections: DbverseSection[] = ['games', 'books', 'anime', 'screening', 'resources', 'rants']
const moods: DbverseMood[] = ['obsessed', 'broken', 'hilarious', 'melancholy', 'chaotic']
const validSection = (value: unknown): value is DbverseSection => typeof value === 'string' && sections.includes(value as DbverseSection)
const validMood = (value: unknown): value is DbverseMood => typeof value === 'string' && moods.includes(value as DbverseMood)
const queryText = ref(typeof route.query.q === 'string' ? route.query.q : '')
const section = ref<DbverseSection | 'all'>(validSection(route.query.section) ? route.query.section : 'all')
const mood = ref<DbverseMood | 'all'>(validMood(route.query.mood) ? route.query.mood : 'all')
const filteredEntries = computed(() => {
  const keyword = queryText.value.trim().toLocaleLowerCase()
  return dbverseEntries.filter((entry) => {
    const haystack = [entry.title[locale.value], entry.excerpt[locale.value], ...entry.tags].join(' ').toLocaleLowerCase()
    return (!keyword || haystack.includes(keyword)) && (section.value === 'all' || entry.section === section.value) && (mood.value === 'all' || entry.moods.includes(mood.value))
  })
})
const syncQuery = () => router.replace({ query: { ...(queryText.value.trim() && { q: queryText.value.trim() }), ...(section.value !== 'all' && { section: section.value }), ...(mood.value !== 'all' && { mood: mood.value }) } })
watch([queryText, section, mood], syncQuery)
watch(() => route.query, (query) => {
  queryText.value = typeof query.q === 'string' ? query.q : ''
  section.value = validSection(query.section) ? query.section : 'all'
  mood.value = validMood(query.mood) ? query.mood : 'all'
})
const clearFilters = () => { queryText.value = ''; section.value = 'all'; mood.value = 'all' }
const teleport = () => {
  if (!filteredEntries.value.length) return
  const entry = filteredEntries.value[Math.floor(Math.random() * filteredEntries.value.length)]
  if (entry) router.push(`/dbverse/${entry.slug}`)
}
useSeo(() => t.value.dbverse.title, () => t.value.dbverse.subtitle, '/dbverse')
</script>

<template>
  <section class="page shell dbverse-page">
    <header class="page-lead dbverse-hero"><p class="eyebrow">{{ t.dbverse.eyebrow }}</p><h1>{{ t.dbverse.title }}</h1><p>{{ t.dbverse.subtitle }}</p><div class="dbverse-signal" aria-hidden="true"><span>P5R</span><span>JOJO</span><span>红楼梦</span></div></header>
    <div class="filter-workbench dbverse-filters">
      <label class="search-field"><Search :size="16" /><input v-model="queryText" type="search" :placeholder="t.dbverse.search"></label>
      <div class="filter-chips"><button :class="{ active: section === 'all' }" @click="section = 'all'">{{ t.dbverse.all }}</button><button v-for="item in sections" :key="item" :class="{ active: section === item }" @click="section = item">{{ t.dbverse.sections[item] }}</button></div>
      <div class="filter-chips mood-filters"><button :class="{ active: mood === 'all' }" @click="mood = 'all'">{{ t.dbverse.allMoods }}</button><button v-for="item in moods" :key="item" :class="{ active: mood === item }" @click="mood = item">{{ t.dbverse.moods[item] }}</button></div>
      <button class="clear-filter" type="button" @click="clearFilters"><X :size="14" />{{ t.common.clear }}</button>
    </div>
    <div class="dbverse-result-bar"><span>{{ filteredEntries.length }} {{ t.dbverse.results }}</span><button type="button" :disabled="!filteredEntries.length" @click="teleport"><Dices :size="16" />{{ t.dbverse.random }}</button></div>
    <TransitionGroup v-if="filteredEntries.length" name="list" tag="div" class="dbverse-grid"><DbverseCard v-for="(entry, index) in filteredEntries" :key="entry.slug" :entry="entry" :index="index" /></TransitionGroup>
    <div v-else class="empty-state"><p>{{ t.dbverse.empty }}</p><button type="button" @click="clearFilters">{{ t.common.clear }}</button></div>
  </section>
</template>
