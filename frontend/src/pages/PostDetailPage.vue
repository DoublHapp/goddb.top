<script setup lang="ts">
import { ArrowLeft, Check, Copy, Link2 } from 'lucide-vue-next'
import { computed, createApp, h, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { posts } from '@/content'
import { useLocale } from '@/composables/useLocale'
import { useSeo } from '@/composables/useSeo'
import { renderMarkdown } from '@/lib/markdown'

const route = useRoute()
const { locale, t } = useLocale()
const post = computed(() => posts.find((item) => item.slug === route.params.slug))
const body = computed(() => post.value ? renderMarkdown(post.value.content[locale.value]) : '')
const article = ref<HTMLElement>()
const progress = ref(0)
const linkCopied = ref(false)
const linkCopyFailed = ref(false)
const copyApps: ReturnType<typeof createApp>[] = []

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    linkCopied.value = true
    linkCopyFailed.value = false
  } catch {
    linkCopied.value = false
    linkCopyFailed.value = true
  }
  window.setTimeout(() => {
    linkCopied.value = false
    linkCopyFailed.value = false
  }, 1600)
}

const updateProgress = () => {
  if (!article.value) return
  const rect = article.value.getBoundingClientRect()
  const distance = Math.max(article.value.offsetHeight - window.innerHeight, 1)
  progress.value = Math.min(100, Math.max(0, (-rect.top + 80) / distance * 100))
}

const bindCopyButtons = async () => {
  await nextTick()
  copyApps.splice(0).forEach((app) => app.unmount())
  article.value?.querySelectorAll('pre').forEach((pre) => {
    const mount = document.createElement('span')
    mount.className = 'copy-mount'
    pre.appendChild(mount)
    const copied = ref(false)
    const copyFailed = ref(false)
    const copy = async () => {
      try {
        await navigator.clipboard.writeText(pre.querySelector('code')?.textContent ?? '')
        copied.value = true
        copyFailed.value = false
      } catch {
        copied.value = false
        copyFailed.value = true
      }
      window.setTimeout(() => {
        copied.value = false
        copyFailed.value = false
      }, 1600)
    }
    const app = createApp({
      setup: () => () => h('button', { class: 'copy-button', type: 'button', title: copyFailed.value ? t.value.common.copyFailed : copied.value ? t.value.common.copied : t.value.common.copy, onClick: copy }, [h(copied.value ? Check : Copy, { size: 14 }), h('span', copyFailed.value ? t.value.common.copyFailed : copied.value ? t.value.common.copied : t.value.common.copy)]),
    })
    app.mount(mount)
    copyApps.push(app)
  })
}

watch(body, bindCopyButtons)
onMounted(() => {
  window.addEventListener('scroll', updateProgress, { passive: true })
  window.addEventListener('resize', updateProgress)
  bindCopyButtons()
  updateProgress()
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateProgress)
  window.removeEventListener('resize', updateProgress)
  copyApps.forEach((app) => app.unmount())
})
useSeo(() => post.value?.title[locale.value] ?? '404', () => post.value?.excerpt[locale.value] ?? t.value.notFound.title, () => route.path)
</script>

<template>
  <section v-if="post" ref="article" class="page shell article-page">
    <div class="reading-progress" aria-hidden="true"><span :style="{ transform: `scaleX(${progress / 100})` }"></span></div>
    <RouterLink to="/essays" class="back-link"><ArrowLeft :size="16" />{{ t.common.back }}</RouterLink>
    <header class="article-header"><div class="post-meta"><span>{{ t.blog.kinds[post.kind] }}</span><span>{{ post.category }}</span><span>{{ post.readingTime }} {{ t.common.min }}</span></div><h1>{{ post.title[locale] }}</h1><p>{{ post.excerpt[locale] }}</p><div class="article-footer"><div class="post-tags"><span v-for="tag in post.tags" :key="tag">#{{ tag }}</span></div><button class="copy-link" type="button" @click="copyLink"><Check v-if="linkCopied" :size="15" /><Link2 v-else :size="15" />{{ linkCopyFailed ? t.common.copyFailed : linkCopied ? t.common.linkCopied : t.common.copyLink }}</button></div></header>
    <article class="markdown-body" v-html="body"></article>
  </section>
  <section v-else class="page shell not-found"><p class="eyebrow">{{ t.notFound.code }}</p><h1>{{ t.notFound.title }}</h1><RouterLink to="/essays" class="primary-button">{{ t.common.back }}</RouterLink></section>
</template>
