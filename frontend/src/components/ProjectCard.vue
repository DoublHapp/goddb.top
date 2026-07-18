<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next'
import { ref } from 'vue'
import type { Project } from '@/types/content'
import { useLocale } from '@/composables/useLocale'

defineProps<{ project: Project }>()
const { locale, t } = useLocale()
const card = ref<HTMLElement>()

const updateTilt = (event: MouseEvent) => {
  if (!card.value || window.matchMedia('(pointer: coarse)').matches) return
  const bounds = card.value.getBoundingClientRect()
  const rotateX = ((event.clientY - bounds.top) / bounds.height - .5) * -4
  const rotateY = ((event.clientX - bounds.left) / bounds.width - .5) * 4
  card.value.style.setProperty('--rotate-x', `${rotateX}deg`)
  card.value.style.setProperty('--rotate-y', `${rotateY}deg`)
  card.value.style.setProperty('--glow-x', `${event.clientX - bounds.left}px`)
  card.value.style.setProperty('--glow-y', `${event.clientY - bounds.top}px`)
}

const resetTilt = () => {
  card.value?.style.setProperty('--rotate-x', '0deg')
  card.value?.style.setProperty('--rotate-y', '0deg')
}
</script>

<template>
  <article ref="card" class="project-card" @mousemove="updateTilt" @mouseleave="resetTilt">
    <div class="card-topline"><span>{{ project.sequence }}</span><span :class="['status-badge', project.status]">{{ project.status }}</span></div>
    <h3>{{ project.title }}</h3>
    <p>{{ project.summary[locale] }}</p>
    <ul class="tag-list"><li v-for="item in project.stack" :key="item">{{ item }}</li></ul>
    <RouterLink :to="`/projects/${project.slug}`" class="card-link">{{ t.common.open }} <ArrowUpRight :size="16" /></RouterLink>
  </article>
</template>
