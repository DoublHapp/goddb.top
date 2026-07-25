<script setup lang="ts">
import { ArrowLeft, ArrowRight } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DbverseFallbackMap from '@/components/dbverse/DbverseFallbackMap.vue'
import DbverseGalaxy from '@/components/dbverse/DbverseGalaxy.vue'
import { getDbverseEntriesByIp, getDbverseIp } from '@/content/dbverse'
import { useLocale } from '@/composables/useLocale'
import { useSeo } from '@/composables/useSeo'

const route = useRoute()
const router = useRouter()
const { locale, t } = useLocale()
const ip = computed(() => getDbverseIp(route.params.slug))
const entries = computed(() => ip.value ? getDbverseEntriesByIp(ip.value.slug) : [])
const fallback = ref(false)
const sceneEntries = computed(() => entries.value.map((entry) => ({ slug: entry.slug, label: `${t.value.dbverse.openSignal}：${entry.title[locale.value]}` })))
const openEntry = (slug: string) => router.push(`/dbverse/${slug}`)
useSeo(() => ip.value?.title[locale.value] ?? t.value.dbverse.cosmic404, () => ip.value?.description[locale.value] ?? t.value.notFound.title, () => route.path)
</script>

<template>
  <section v-if="ip" class="dbverse-stage dbverse-ip-stage" data-route-view="dbverse-ip" :style="{ '--ip-accent': ip.accent }">
    <DbverseGalaxy v-if="!fallback" mode="ip" :active-ip="ip.slug" :interactive="false" :entries="sceneEntries" @entry="openEntry" @fallback="fallback = true" />
    <DbverseFallbackMap v-else :active-ip="ip.slug" compact />
    <div class="dbverse-ip-panel"><RouterLink to="/dbverse" class="dbverse-inline-link"><ArrowLeft :size="16" />{{ t.dbverse.backGalaxy }}</RouterLink><p class="eyebrow">{{ t.dbverse.system }}</p><h1>{{ ip.name[locale] }}</h1><h2>{{ ip.title[locale] }}</h2><p>{{ ip.description[locale] }}</p><div class="dbverse-entry-list"><RouterLink v-for="entry in entries" :key="entry.slug" :to="`/dbverse/${entry.slug}`" class="dbverse-entry-card"><span>{{ t.dbverse.signal }}</span><strong>{{ entry.title[locale] }}</strong><p>{{ entry.excerpt[locale] }}</p><small>{{ entry.publishedAt }} · {{ t.dbverse.statuses[entry.status] }}</small><ArrowRight :size="18" /></RouterLink></div></div>
  </section>
  <section v-else class="dbverse-cosmic-404"><p class="eyebrow">404 / DBVERSE</p><h1>{{ t.dbverse.cosmic404 }}</h1><RouterLink to="/dbverse" class="dbverse-action-primary">{{ t.dbverse.backGalaxy }}</RouterLink></section>
</template>
