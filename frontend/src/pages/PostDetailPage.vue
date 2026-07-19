<script setup lang="ts">
import { ArrowLeft, ArrowUp, Check, Copy, Link2 } from 'lucide-vue-next'
import { computed, createApp, h, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { posts } from '@/content'
import { useLocale } from '@/composables/useLocale'
import { useSeo } from '@/composables/useSeo'
import { renderMarkdownDocument } from '@/lib/markdown'

const route = useRoute()
const { locale, t } = useLocale()
const post = computed(() => posts.find((item) => item.slug === route.params.slug))
const fallback = computed(() => locale.value === 'en' && !post.value?.content.en)
const markdownDocument = computed(() => post.value ? renderMarkdownDocument(post.value.content[locale.value] ?? post.value.content['zh-CN']) : { html: '', headings: [] })
const body = computed(() => markdownDocument.value.html)
const headings = computed(() => markdownDocument.value.headings)
const article = ref<HTMLElement>()
const progress = ref(0)
const activeHeading = ref('')
const showBackToTop = ref(false)
const linkCopied = ref(false)
const linkCopyFailed = ref(false)
const copyApps: ReturnType<typeof createApp>[] = []
let headingObserver: IntersectionObserver | undefined

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
  showBackToTop.value = window.scrollY > window.innerHeight
}

const bindHeadingObserver = async () => {
  await nextTick()
  headingObserver?.disconnect()
  const nodes = article.value?.querySelectorAll<HTMLElement>('.markdown-body h2[id], .markdown-body h3[id]') ?? []
  if (!nodes.length) return
  headingObserver = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
    if (visible[0]?.target.id) activeHeading.value = visible[0].target.id
  }, { rootMargin: '-90px 0px -72% 0px', threshold: [0, 1] })
  nodes.forEach((node) => headingObserver?.observe(node))
}

const backToTop = () => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })

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

watch(body, () => { bindCopyButtons(); bindHeadingObserver() })
onMounted(() => {
  window.addEventListener('scroll', updateProgress, { passive: true })
  window.addEventListener('resize', updateProgress)
  bindCopyButtons()
  bindHeadingObserver()
  updateProgress()
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateProgress)
  window.removeEventListener('resize', updateProgress)
  copyApps.forEach((app) => app.unmount())
  headingObserver?.disconnect()
})
useSeo(() => post.value?.title[locale.value] ?? '404', () => post.value?.excerpt[locale.value] ?? t.value.notFound.title, () => route.path)
</script>

<template>
  <section v-if="post" ref="article" class="page shell article-page">
    <div class="reading-progress" aria-hidden="true"><span :style="{ transform: `scaleX(${progress / 100})` }"></span></div>
    <RouterLink to="/essays" class="back-link"><ArrowLeft :size="16" />{{ t.common.back }}</RouterLink>
    <header class="article-header"><div class="post-meta"><span>{{ t.blog.kinds[post.kind] }}</span><span>{{ post.category }}</span><time :datetime="post.publishedAt">{{ post.publishedAt }}</time><span>{{ post.readingTime }} {{ t.common.min }}</span></div><h1>{{ post.title[locale] }}</h1><p>{{ post.excerpt[locale] }}</p><div class="article-footer"><div class="post-tags"><span v-for="tag in post.tags" :key="tag">#{{ tag }}</span></div><button class="copy-link" type="button" @click="copyLink"><Check v-if="linkCopied" :size="15" /><Link2 v-else :size="15" />{{ linkCopyFailed ? t.common.copyFailed : linkCopied ? t.common.linkCopied : t.common.copyLink }}</button></div></header>
    <aside v-if="post.learningArchive" class="learning-archive-notice"><strong>{{ t.blog.archiveTitle }}</strong><span>{{ t.blog.archiveNotice }}</span></aside>
    <p v-if="fallback" class="language-fallback">{{ t.blog.chineseFallback }}</p>
    <details v-if="headings.length" class="article-toc mobile-toc"><summary>{{ t.blog.toc }}</summary><a v-for="heading in headings" :key="heading.id" :class="[`level-${heading.level}`, { active: activeHeading === heading.id }]" :href="`#${heading.id}`">{{ heading.text }}</a></details>
    <div class="article-layout">
      <article class="markdown-body" v-html="body"></article>
      <nav v-if="headings.length" class="article-toc desktop-toc" :aria-label="t.blog.toc"><strong>{{ t.blog.toc }}</strong><a v-for="heading in headings" :key="heading.id" :class="[`level-${heading.level}`, { active: activeHeading === heading.id }]" :href="`#${heading.id}`">{{ heading.text }}</a></nav>
    </div>
    <button v-if="showBackToTop" class="back-to-top" type="button" :aria-label="t.blog.backToTop" @click="backToTop"><ArrowUp :size="18" /></button>
  </section>
  <section v-else class="page shell not-found"><p class="eyebrow">{{ t.notFound.code }}</p><h1>{{ t.notFound.title }}</h1><RouterLink to="/essays" class="primary-button">{{ t.common.back }}</RouterLink></section>
</template>
