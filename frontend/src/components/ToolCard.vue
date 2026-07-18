<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next'
import { Star } from 'lucide-vue-next'
import ToolIcon from '@/components/ToolIcon.vue'
import { useLocale } from '@/composables/useLocale'
import type { Tool } from '@/types/content'
import { useToolLibrary } from '@/composables/useToolLibrary'

defineProps<{ tool: Tool }>()
const { locale, t } = useLocale()
const { toggleFavorite, isFavorite } = useToolLibrary()
</script>

<template>
  <article class="tool-card" :style="{ '--tool-accent': tool.accent }">
    <div class="tool-icon"><ToolIcon :name="tool.icon" :size="26" /></div>
    <div class="card-topline"><span>{{ t.tools.categories[tool.category] }}</span><button class="tool-favorite" type="button" :aria-label="isFavorite(tool.slug) ? t.tools.unfavorite : t.tools.favorite" :title="isFavorite(tool.slug) ? t.tools.unfavorite : t.tools.favorite" @click="toggleFavorite(tool.slug)"><Star :size="15" :fill="isFavorite(tool.slug) ? 'currentColor' : 'none'" /></button></div>
    <h3>{{ tool.name[locale] }}</h3>
    <p>{{ tool.summary[locale] }}</p>
    <ul class="tag-list"><li v-for="tag in tool.tags" :key="tag">{{ tag }}</li></ul>
    <footer class="tool-card-footer">
      <span class="tool-status">{{ t.tools.statuses[tool.status] }}</span>
      <RouterLink :to="tool.route" class="card-link">{{ t.common.open }}<ArrowUpRight :size="15" /></RouterLink>
    </footer>
  </article>
</template>
