<script setup lang="ts">
import { ArrowLeft, Star } from 'lucide-vue-next'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ToolIcon from '@/components/ToolIcon.vue'
import { useLocale } from '@/composables/useLocale'
import { useSeo } from '@/composables/useSeo'
import { useToolLibrary } from '@/composables/useToolLibrary'

const route = useRoute()
const { locale, t } = useLocale()
const { findTool, toggleFavorite, isFavorite, markRecent } = useToolLibrary()
const tool = computed(() => findTool(String(route.params.slug)))
if (tool.value) markRecent(tool.value.slug)
useSeo(() => tool.value?.name[locale.value] ?? t.value.notFound.title, () => tool.value?.description[locale.value] ?? t.value.notFound.title, () => route.path)
</script>

<template>
  <section v-if="tool" class="page shell tool-detail-page" :style="{ '--tool-accent': tool.accent }">
    <RouterLink to="/tools" class="back-link"><ArrowLeft :size="16" />{{ t.common.back }}</RouterLink>
    <header class="detail-header"><div><p class="eyebrow"><ToolIcon :name="tool.icon" :size="15" /> {{ t.tools.categories[tool.category] }} · {{ t.tools.statuses[tool.status] }}</p><h1>{{ tool.name[locale] }}<span class="accent">.</span></h1></div><button class="copy-link" type="button" :aria-label="isFavorite(tool.slug) ? t.tools.unfavorite : t.tools.favorite" @click="toggleFavorite(tool.slug)"><Star :size="15" :fill="isFavorite(tool.slug) ? 'currentColor' : 'none'" />{{ isFavorite(tool.slug) ? t.tools.unfavorite : t.tools.favorite }}</button></header>
    <div class="tool-workbench"><p class="detail-description">{{ tool.teaser[locale] }}</p><p>{{ tool.description[locale] }}</p><p class="tool-subdomain">{{ tool.subdomain }}</p><ul class="tool-features"><li v-for="feature in tool.features" :key="feature[locale]">{{ feature[locale] }}</li></ul></div>
  </section>
  <section v-else class="page shell not-found"><p class="eyebrow">{{ t.notFound.code }}</p><h1>{{ t.notFound.title }}</h1><RouterLink to="/tools" class="primary-button">{{ t.common.back }}</RouterLink></section>
</template>
