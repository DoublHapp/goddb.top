<script setup lang="ts">
import { ArrowLeft, Check, ExternalLink, Link2 } from 'lucide-vue-next'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import DbverseFallbackMap from '@/components/dbverse/DbverseFallbackMap.vue'
import DbverseGalaxy from '@/components/dbverse/DbverseGalaxy.vue'
import { dbverseEntries, getDbverseIp } from '@/content'
import { useLocale } from '@/composables/useLocale'
import { useSeo } from '@/composables/useSeo'
import { copyText } from '@/lib/clipboard'
import { renderMarkdown } from '@/lib/markdown'

const route = useRoute()
const { locale, t } = useLocale()
const entry = computed(() => dbverseEntries.find((item) => item.slug === route.params.slug))
const ip = computed(() => getDbverseIp(entry.value?.ip))
const fallback = computed(() => locale.value === 'en' && !entry.value?.content.en)
const body = computed(() => entry.value ? renderMarkdown(entry.value.content[locale.value] ?? entry.value.content['zh-CN']) : '')
const copied = ref(false)
const copyFailed = ref(false)
const webglFallback = ref(false)
const mediaNear = ref(false)
const mediaBlock = ref<HTMLElement>()
let mediaObserver: IntersectionObserver | undefined
let copyFeedbackTimer = 0
const mediaUrl = computed(() => {
  const media = entry.value?.media
  if (!media?.videoId || !/^[\w-]+$/.test(media.videoId)) return ''
  if (media.platform === 'bilibili') {
    if (!/^BV[\w]+$/.test(media.videoId) || media.sourceUrl !== `https://www.bilibili.com/video/${media.videoId}/`) return ''
    return `https://player.bilibili.com/player.html?bvid=${media.videoId}`
  }
  if (media.platform === 'youtube' && media.sourceUrl === `https://www.youtube.com/watch?v=${media.videoId}`) return `https://www.youtube-nocookie.com/embed/${media.videoId}`
  return ''
})
const resources = computed(() => entry.value?.resources?.filter((resource) => resource.url && resource.source && resource.license && /^https:\/\//.test(resource.url)) ?? [])
const copyLink = async () => {
  const success = await copyText(window.location.href)
  copied.value = success
  copyFailed.value = !success
  window.clearTimeout(copyFeedbackTimer)
  copyFeedbackTimer = window.setTimeout(() => { copied.value = false; copyFailed.value = false }, 1600)
}
onMounted(() => {
  if (!mediaBlock.value || !('IntersectionObserver' in window)) { mediaNear.value = true; return }
  mediaObserver = new IntersectionObserver(([item]) => { if (item?.isIntersecting) { mediaNear.value = true; mediaObserver?.disconnect() } }, { rootMargin: '500px' })
  mediaObserver.observe(mediaBlock.value)
})
onBeforeUnmount(() => { mediaObserver?.disconnect(); window.clearTimeout(copyFeedbackTimer) })
useSeo(() => entry.value?.title[locale.value] ?? '404', () => entry.value?.excerpt[locale.value] ?? t.value.notFound.title, () => route.path)
</script>

<template>
  <section v-if="entry && ip" class="dbverse-detail" data-route-view="dbverse-detail" :style="{ '--entry-accent': entry.accent }">
    <div class="dbverse-detail-background"><DbverseGalaxy v-if="!webglFallback" mode="detail" :active-ip="ip.slug" :interactive="false" @fallback="webglFallback = true" /><DbverseFallbackMap v-else :active-ip="ip.slug" compact /></div>
    <div class="dbverse-hologram shell">
      <nav class="dbverse-detail-nav"><RouterLink :to="`/dbverse/ip/${entry.ip}`" class="back-link"><ArrowLeft :size="16" />{{ t.dbverse.backSystem }}</RouterLink><RouterLink to="/dbverse" class="dbverse-inline-link">{{ t.dbverse.backGalaxy }}</RouterLink></nav>
      <header class="dbverse-detail-header"><div><p class="eyebrow">{{ ip.name[locale] }} / {{ t.dbverse.statuses[entry.status] }}<time v-if="entry.publishedAt" :datetime="entry.publishedAt"> / {{ entry.publishedAt }}</time></p><h1>{{ entry.title[locale] }}</h1><p>{{ entry.excerpt[locale] }}</p><div class="mood-list"><span v-for="mood in entry.moods" :key="mood" class="mood-chip">{{ t.dbverse.moods[mood] }}</span></div></div><button class="copy-link" type="button" @click="copyLink"><Check v-if="copied" :size="15" /><Link2 v-else :size="15" />{{ copyFailed ? t.common.copyFailed : copied ? t.common.linkCopied : t.common.copyLink }}</button></header>
      <div v-if="entry.status === 'awaiting-content'" class="awaiting-panel"><strong>{{ t.dbverse.awaitingTitle }}</strong><span>{{ t.dbverse.awaitingDescription }}</span></div>
      <p v-if="fallback" class="language-fallback">{{ t.dbverse.chineseFallback }}</p>
      <div v-if="mediaUrl" ref="mediaBlock" class="media-block"><div class="media-frame"><iframe v-if="mediaNear" :src="mediaUrl" :title="entry.media?.title?.[locale] ?? entry.title[locale]" loading="lazy" allow="fullscreen; picture-in-picture" allowfullscreen></iframe><span v-else>{{ t.dbverse.mediaLoading }}</span></div><div class="media-credit"><span>{{ t.dbverse.creator }}：{{ entry.media?.creator[locale] }}</span><a :href="entry.media?.sourceUrl" target="_blank" rel="noreferrer noopener">{{ t.dbverse.watchOriginal }} <ExternalLink :size="15" /></a></div></div>
      <div v-else class="media-placeholder">{{ t.dbverse.mediaPending }}</div>
      <article class="markdown-body" v-html="body"></article>
      <section v-if="resources.length" class="resource-section"><h2>{{ t.dbverse.resourcesTitle }}</h2><a v-for="resource in resources" :key="resource.url" :href="resource.url" target="_blank" rel="noreferrer"><span><strong>{{ resource.label[locale] }}</strong><small>{{ t.dbverse.source }}: {{ resource.source }} · {{ t.dbverse.license }}: {{ resource.license }}</small></span><ExternalLink :size="16" /></a></section>
    </div>
  </section>
  <section v-else class="dbverse-cosmic-404"><p class="eyebrow">{{ t.notFound.code }}</p><h1>{{ t.dbverse.cosmic404 }}</h1><RouterLink to="/dbverse" class="dbverse-action-primary">{{ t.dbverse.backGalaxy }}</RouterLink></section>
</template>
