<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { posts } from '@/content'
import { useLocale } from '@/composables/useLocale'
import { useSeo } from '@/composables/useSeo'
import { renderMarkdown } from '@/lib/markdown'

const route = useRoute()
const { locale, t } = useLocale()
const post = computed(() => posts.find((item) => item.slug === route.params.slug))
const body = computed(() => post.value ? renderMarkdown(post.value.content[locale.value]) : '')
useSeo(() => post.value?.title[locale.value] ?? '404', () => post.value?.excerpt[locale.value] ?? t.value.notFound.title, () => route.path)
</script>

<template>
  <section v-if="post" class="page shell article-page">
    <RouterLink to="/blog" class="back-link"><ArrowLeft :size="16" />{{ t.common.back }}</RouterLink>
    <header class="article-header"><div class="post-meta"><span>{{ post.category }}</span><span>{{ post.readingTime }} {{ t.common.min }}</span></div><h1>{{ post.title[locale] }}</h1><p>{{ post.excerpt[locale] }}</p><div class="post-tags"><span v-for="tag in post.tags" :key="tag">#{{ tag }}</span></div></header>
    <article class="markdown-body" v-html="body"></article>
  </section>
  <section v-else class="page shell not-found"><p class="eyebrow">{{ t.notFound.code }}</p><h1>{{ t.notFound.title }}</h1><RouterLink to="/blog" class="primary-button">{{ t.common.back }}</RouterLink></section>
</template>
