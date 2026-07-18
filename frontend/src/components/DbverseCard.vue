<script setup lang="ts">
import { ArrowUpRight, BookOpen, Clapperboard, Gamepad2, Library, MessageCircleMore, PackageOpen } from 'lucide-vue-next'
import { computed } from 'vue'
import type { Component } from 'vue'
import type { DbverseEntry, DbverseSection } from '@/types/content'
import { useLocale } from '@/composables/useLocale'

const props = defineProps<{ entry: DbverseEntry; index: number }>()
const { locale, t } = useLocale()
const icons: Record<DbverseSection, Component> = { games: Gamepad2, books: BookOpen, anime: Clapperboard, screening: Clapperboard, resources: PackageOpen, rants: MessageCircleMore }
const icon = computed(() => icons[props.entry.section] ?? Library)
</script>

<template>
  <article class="dbverse-card" :style="{ '--entry-accent': entry.accent, '--card-tilt': `${index % 2 ? 0.7 : -0.7}deg` }">
    <div class="dbverse-card-top"><component :is="icon" :size="19" /><span>{{ t.dbverse.sections[entry.section] }}</span><span>{{ t.dbverse.statuses[entry.status] }}</span></div>
    <h2><RouterLink :to="`/dbverse/${entry.slug}`">{{ entry.title[locale] }}</RouterLink></h2>
    <p>{{ entry.excerpt[locale] }}</p>
    <div class="mood-list"><span v-for="mood in entry.moods" :key="mood" class="mood-chip">{{ t.dbverse.moods[mood] }}</span></div>
    <div class="dbverse-card-footer"><div class="post-tags"><span v-for="tag in entry.tags" :key="tag">#{{ tag }}</span></div><RouterLink :to="`/dbverse/${entry.slug}`" :aria-label="`${t.common.open}: ${entry.title[locale]}`"><ArrowUpRight :size="18" /></RouterLink></div>
  </article>
</template>
