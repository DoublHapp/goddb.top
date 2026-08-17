<script setup lang="ts">
import { Star } from 'lucide-vue-next'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useLocale } from '@/composables/useLocale'
import { useSeo } from '@/composables/useSeo'
import { useToolLibrary } from '@/composables/useToolLibrary'
import PhantomDetailHeader from '@/components/PhantomDetailHeader.vue'
import PhantomEmptyState from '@/components/PhantomEmptyState.vue'

const route = useRoute()
const { locale, t } = useLocale()
const { findTool, toggleFavorite, isFavorite, markRecent } = useToolLibrary()
const tool = computed(() => findTool(String(route.params.slug)))
if (tool.value) markRecent(tool.value.slug)
useSeo(() => tool.value?.name[locale.value] ?? t.value.notFound.title, () => tool.value?.description[locale.value] ?? t.value.notFound.title, () => route.path)
</script>

<template>
  <section v-if="tool" class="page shell tool-detail-page" :style="{ '--tool-accent': tool.accent }">
    <PhantomDetailHeader back-to="/tools" :back-label="t.common.back" :eyebrow="`${t.tools.categories[tool.category]} · ${t.tools.statuses[tool.status]}`" :title="tool.name[locale]"><template #actions><button type="button" :aria-label="isFavorite(tool.slug) ? t.tools.unfavorite : t.tools.favorite" @click="toggleFavorite(tool.slug)"><Star :size="15" :fill="isFavorite(tool.slug) ? 'currentColor' : 'none'" />{{ isFavorite(tool.slug) ? t.tools.unfavorite : t.tools.favorite }}</button></template></PhantomDetailHeader>
    <div class="tool-workbench"><p class="detail-description">{{ tool.teaser[locale] }}</p><p>{{ tool.description[locale] }}</p><p class="tool-subdomain">{{ tool.subdomain }}</p><ul class="tool-features"><li v-for="feature in tool.features" :key="feature[locale]">{{ feature[locale] }}</li></ul></div>
  </section>
  <section v-else class="page shell not-found"><PhantomEmptyState :code="t.notFound.code" :title="t.notFound.title" :action="t.common.back" to="/tools" /></section>
</template>
