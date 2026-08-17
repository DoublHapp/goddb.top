<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next'
import { computed } from 'vue'
import { posts } from '@/content'
import { useLocale } from '@/composables/useLocale'

const { locale, t } = useLocale()

/** 选择发布日期最新的三篇真实随笔。 */
const latestPosts = computed(() => [...posts].sort((left, right) => right.publishedAt.localeCompare(left.publishedAt)).slice(0, 3))

/** 将 ISO 日期拆分为首页刊物式日期。 */
const formatDate = (publishedAt: string) => ({ day: publishedAt.slice(5).replace('-', '.'), year: publishedAt.slice(0, 4) })
</script>

<template>
  <section class="phantom-section phantom-latest" :aria-labelledby="'latest-dispatches-title'">
    <header class="phantom-section-heading">
      <b class="phantom-section-index">02</b>
      <h2 id="latest-dispatches-title">{{ locale === 'zh-CN' ? '本期截获信号' : 'Latest intercepted signals' }}</h2>
      <small>LATEST DISPATCHES / REAL CONTENT</small>
    </header>
    <div class="phantom-story-list">
      <RouterLink v-for="post in latestPosts" :key="post.slug" :to="`/essays/${post.slug}`" class="phantom-story">
        <time :datetime="post.publishedAt"><span>{{ formatDate(post.publishedAt).day }}</span><small>{{ formatDate(post.publishedAt).year }}</small></time>
        <span><small>{{ post.category }} · {{ post.readingTime }} {{ t.common.min }}</small><strong>{{ post.title[locale] }}</strong></span>
        <ArrowUpRight :size="22" aria-hidden="true" />
      </RouterLink>
    </div>
  </section>
</template>
