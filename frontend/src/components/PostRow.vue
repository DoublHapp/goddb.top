<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
import type { Post } from '@/types/content'
import { useLocale } from '@/composables/useLocale'

defineProps<{ post: Post }>()
const { locale, t } = useLocale()
</script>

<template>
  <article class="post-row" @click="$router.push(`/blog/${post.slug}`)">
    <div class="post-date"><span>{{ post.publishedAt.slice(5) }}</span><small>{{ post.publishedAt.slice(0, 4) }}</small></div>
    <div class="post-content">
      <div class="post-meta"><span>{{ post.category }}</span><span>{{ post.readingTime }} {{ t.common.min }}</span></div>
      <h3><RouterLink :to="`/blog/${post.slug}`" @click.stop>{{ post.title[locale] }}</RouterLink></h3>
      <p>{{ post.excerpt[locale] }}</p>
      <div class="post-tags"><span v-for="tag in post.tags" :key="tag">#{{ tag }}</span></div>
    </div>
    <RouterLink :to="`/blog/${post.slug}`" class="row-arrow" :aria-label="t.common.read" @click.stop><ArrowRight :size="21" /></RouterLink>
  </article>
</template>
