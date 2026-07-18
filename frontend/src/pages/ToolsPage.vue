<script setup lang="ts">
import { Search, X } from 'lucide-vue-next'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ToolCard from '@/components/ToolCard.vue'
import { useLocale } from '@/composables/useLocale'
import { useSeo } from '@/composables/useSeo'
import { useToolLibrary } from '@/composables/useToolLibrary'

const { locale, t } = useLocale()
const { tools, categories, favorites, recent, clearRecent } = useToolLibrary()
const route = useRoute(); const router = useRouter()
const query = ref(typeof route.query.q === 'string' ? route.query.q : '')
const category = ref(typeof route.query.category === 'string' ? route.query.category : 'all')
const filter = ref(typeof route.query.filter === 'string' ? route.query.filter : 'all')
const filteredTools = computed(() => tools.filter((tool) => (!query.value || [tool.name[locale.value], tool.summary[locale.value], ...tool.tags].join(' ').toLocaleLowerCase().includes(query.value.trim().toLocaleLowerCase())) && (category.value === 'all' || tool.category === category.value) && (filter.value === 'all' || filter.value === 'favorites' && favorites.value.includes(tool.slug) || filter.value === 'recent' && recent.value.includes(tool.slug))))
const recentTools = computed(() => recent.value.map((slug) => tools.find((tool) => tool.slug === slug)).filter((tool): tool is typeof tools[number] => Boolean(tool)))
const hasFilters = computed(() => Boolean(query.value.trim()) || category.value !== 'all' || filter.value !== 'all')
const clearFilters = () => {
  query.value = ''
  category.value = 'all'
  filter.value = 'all'
}
watch([query, category, filter], () => router.replace({ query: { ...(query.value ? { q: query.value } : {}), ...(category.value !== 'all' ? { category: category.value } : {}), ...(filter.value !== 'all' ? { filter: filter.value } : {}) } }))
useSeo(() => t.value.nav.tools, () => t.value.tools.subtitle, '/tools')
</script>

<template>
  <section class="page shell">
    <p class="eyebrow">{{ t.tools.eyebrow }}</p>
    <div class="page-lead"><h1>{{ t.tools.title }}<span class="accent">.</span></h1><p>{{ t.tools.subtitle }}</p></div>
    <label class="search-field tool-search"><Search :size="17" /><span class="sr-only">{{ t.tools.search }}</span><input v-model="query" type="search" :placeholder="t.tools.search"></label>
    <div class="filter-workbench tool-filters"><div class="filter-chips"><button v-for="item in categories" :key="item" type="button" :class="{ active: category === item }" @click="category = item">{{ t.tools.categories[item] }}</button></div><div class="filter-chips"><button v-for="item in ['all', 'favorites', 'recent'] as const" :key="item" type="button" :class="{ active: filter === item }" @click="filter = item">{{ t.tools.filters[item] }}</button></div><button v-if="hasFilters" class="clear-filter" type="button" @click="clearFilters"><X :size="15" />{{ t.common.clear }}</button></div>
    <section v-if="!hasFilters && recentTools.length" class="recent-tools">
      <div class="tool-section-heading"><h2>{{ t.tools.recentTitle }}</h2><button type="button" @click="clearRecent"><X :size="14" />{{ t.tools.clearRecent }}</button></div>
      <div class="tool-grid"><ToolCard v-for="tool in recentTools" :key="tool.slug" :tool="tool" /></div>
    </section>
    <div class="log-count">{{ t.tools.resultsLabel }} <span>{{ String(filteredTools.length).padStart(2, '0') }} {{ t.tools.results }}</span></div>
    <div v-if="filteredTools.length" class="tool-grid"><ToolCard v-for="tool in filteredTools" :key="tool.slug" :tool="tool" /></div>
    <div v-else class="empty-state"><Search :size="24" /><p>{{ t.tools.empty }}</p><button v-if="hasFilters" type="button" @click="clearFilters">{{ t.common.clear }}</button></div>
  </section>
</template>
