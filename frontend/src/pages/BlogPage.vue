<script setup lang="ts">
import { Search, X } from 'lucide-vue-next'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PostRow from '@/components/PostRow.vue'
import { posts } from '@/content'
import { useLocale } from '@/composables/useLocale'
import { useSeo } from '@/composables/useSeo'

const { locale, t } = useLocale()
const categories = computed(() => ['all', ...new Set(posts.map((post) => post.category))])
const route = useRoute()
const router = useRouter()
const readCategory = (value: unknown) => typeof value === 'string' && categories.value.includes(value) ? value : 'all'
const query = ref(typeof route.query.q === 'string' ? route.query.q : '')
const category = ref(readCategory(route.query.category))
const filteredPosts = computed(() => {
  const keyword = query.value.trim().toLocaleLowerCase()
  return posts.filter((post) => {
    const matchesCategory = category.value === 'all' || post.category === category.value
    const searchable = [post.title[locale.value], post.excerpt[locale.value], post.category, ...post.tags].join(' ').toLocaleLowerCase()
    return matchesCategory && (!keyword || searchable.includes(keyword))
  })
})
const clearFilters = () => {
  query.value = ''
  category.value = 'all'
}
watch([query, category], ([nextQuery, nextCategory]) => {
  const next = { ...route.query }
  if (nextQuery.trim()) next.q = nextQuery.trim()
  else delete next.q
  if (nextCategory !== 'all') next.category = nextCategory
  else delete next.category
  router.replace({ query: next })
})
watch(() => route.query, (next) => {
  query.value = typeof next.q === 'string' ? next.q : ''
  category.value = readCategory(next.category)
})
useSeo(() => t.value.nav.blog, () => t.value.blog.subtitle, '/blog')
</script>

<template>
  <section class="page shell">
    <p class="eyebrow">{{ t.blog.eyebrow }}</p>
    <div class="page-lead"><h1>{{ t.blog.title }}<span class="accent">.</span></h1><p>{{ t.blog.subtitle }}</p></div>
    <div class="filter-workbench">
      <label class="search-field"><Search :size="17" /><span class="sr-only">{{ t.blog.search }}</span><input v-model="query" type="search" :placeholder="t.blog.search"></label>
      <div class="filter-chips" :aria-label="t.blog.filter"><button v-for="item in categories" :key="item" type="button" :class="{ active: category === item }" @click="category = item">{{ item === 'all' ? t.blog.all : item }}</button></div>
      <button v-if="query || category !== 'all'" class="clear-filter" type="button" @click="clearFilters"><X :size="15" />{{ t.common.clear }}</button>
    </div>
    <div class="log-count">{{ t.blog.all }} <span>{{ String(filteredPosts.length).padStart(2, '0') }} {{ t.blog.results }}</span></div>
    <TransitionGroup v-if="filteredPosts.length" name="row-list" tag="div" class="post-list"><PostRow v-for="post in filteredPosts" :key="post.slug" :post="post" /></TransitionGroup>
    <div v-else class="empty-state"><Search :size="24" /><p>{{ t.projects.empty }}</p><button type="button" @click="clearFilters">{{ t.common.clear }}</button></div>
  </section>
</template>
