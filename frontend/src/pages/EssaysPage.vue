<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PostRow from '@/components/PostRow.vue'
import { posts } from '@/content'
import { useLocale } from '@/composables/useLocale'
import { useSeo } from '@/composables/useSeo'
import type { PostKind } from '@/types/content'
import PhantomPageLead from '@/components/PhantomPageLead.vue'
import PhantomFilterBar from '@/components/PhantomFilterBar.vue'
import PhantomEmptyState from '@/components/PhantomEmptyState.vue'

const { locale, t } = useLocale()
const kinds = ['all', 'daily', 'inspiration', 'technical'] as const
type Kind = typeof kinds[number]
const route = useRoute()
const router = useRouter()
const readKind = (value: unknown): Kind => kinds.includes(value as Kind) ? value as Kind : 'all'
const query = ref(typeof route.query.q === 'string' ? route.query.q : '')
const kind = ref<Kind>(readKind(route.query.kind))
const filteredPosts = computed(() => {
  const keyword = query.value.trim().toLocaleLowerCase()
  return posts.filter((post) => {
    const matchesKind = kind.value === 'all' || post.kind === kind.value
    const searchable = [post.title[locale.value], post.excerpt[locale.value], post.kind, post.category, ...post.tags].join(' ').toLocaleLowerCase()
    return matchesKind && (!keyword || searchable.includes(keyword))
  })
})
const clearFilters = () => {
  query.value = ''
  kind.value = 'all'
}
watch([query, kind], ([nextQuery, nextKind]) => {
  const next = { ...route.query }
  if (nextQuery.trim()) next.q = nextQuery.trim()
  else delete next.q
  if (nextKind !== 'all') next.kind = nextKind
  else delete next.kind
  delete next.category
  router.replace({ query: next })
})
watch(() => route.query, (next) => {
  query.value = typeof next.q === 'string' ? next.q : ''
  kind.value = readKind(next.kind)
})
const kindLabel = (value: Kind) => value === 'all' ? t.value.blog.all : t.value.blog.kinds[value as PostKind]
useSeo(() => t.value.nav.blog, () => t.value.blog.subtitle, '/essays')
</script>

<template>
  <section class="page shell">
    <PhantomPageLead index="01" :eyebrow="t.blog.eyebrow" :title="t.blog.title" :description="t.blog.subtitle" :count="`${posts.length} FILES`" />
    <PhantomFilterBar :search="query" :placeholder="t.blog.search" :filter-label="t.blog.filter" :options="kinds.map((item) => ({ value: item, label: kindLabel(item) }))" :active="kind" :clear-label="t.common.clear" @update:search="query = $event" @select="kind = $event as Kind" @clear="clearFilters" />
    <div class="log-count">{{ t.blog.all }} <span>{{ String(filteredPosts.length).padStart(2, '0') }} {{ t.blog.results }}</span></div>
    <TransitionGroup v-if="filteredPosts.length" name="row-list" tag="div" class="post-list"><PostRow v-for="post in filteredPosts" :key="post.slug" :post="post" /></TransitionGroup>
    <PhantomEmptyState v-else code="NO DISPATCH FOUND" :title="t.blog.empty" :action="t.common.clear" @action="clearFilters" />
  </section>
</template>
