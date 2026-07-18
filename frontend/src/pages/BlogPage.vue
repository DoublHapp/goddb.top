<script setup lang="ts">
import PostRow from '@/components/PostRow.vue'
import { posts } from '@/content'
import { useLocale } from '@/composables/useLocale'
import { useSeo } from '@/composables/useSeo'

const { t } = useLocale()
useSeo(() => t.value.nav.blog, () => t.value.blog.subtitle, '/blog')
</script>

<template>
  <section class="page shell">
    <p class="eyebrow">{{ t.blog.eyebrow }}</p>
    <div class="page-lead"><h1>{{ t.blog.title }}<span class="accent">.</span></h1><p>{{ t.blog.subtitle }}</p></div>
    <div class="log-count">{{ t.blog.all }} <span>{{ String(posts.length).padStart(2, '0') }}</span></div>
    <div class="post-list"><PostRow v-for="post in posts" :key="post.slug" :post="post" /></div>
  </section>
</template>
