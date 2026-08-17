<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import SiteFooter from '@/components/SiteFooter.vue'
import SiteHeader from '@/components/SiteHeader.vue'
import PhantomIntro from '@/components/PhantomIntro.vue'

const route = useRoute()
const isDbverseRoute = computed(() => route.path.startsWith('/dbverse'))
const cursorGlow = ref<HTMLElement>()
let observer: IntersectionObserver | undefined
let cursorFrame = 0

const moveCursorGlow = (event: PointerEvent) => {
  if (!cursorGlow.value || event.pointerType !== 'mouse') return
  cancelAnimationFrame(cursorFrame)
  cursorFrame = requestAnimationFrame(() => {
    cursorGlow.value?.style.setProperty('--cursor-x', `${event.clientX}px`)
    cursorGlow.value?.style.setProperty('--cursor-y', `${event.clientY}px`)
    cursorGlow.value?.classList.add('is-active')
  })
}

const hideCursorGlow = () => cursorGlow.value?.classList.remove('is-active')

const bindReveals = async () => {
  await nextTick()
  observer?.disconnect()
  const elements = document.querySelectorAll<HTMLElement>('[data-reveal], .page-lead, .section-heading, .project-card, .post-row, .signal-panel, .about-grid > *, .detail-grid > *, .article-header, .markdown-body > *')
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach((element) => element.classList.add('is-visible'))
    return
  }
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      entry.target.classList.add('is-visible')
      observer?.unobserve(entry.target)
    })
  }, { threshold: 0.08, rootMargin: '0px 0px -48px' })
  elements.forEach((element, index) => {
    element.classList.add('reveal-item')
    element.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 70}ms`)
    observer?.observe(element)
  })
}

watch(() => route.fullPath, bindReveals, { immediate: true })
onMounted(() => {
  window.addEventListener('pointermove', moveCursorGlow, { passive: true })
  document.documentElement.addEventListener('mouseleave', hideCursorGlow)
})
onBeforeUnmount(() => {
  observer?.disconnect()
  cancelAnimationFrame(cursorFrame)
  window.removeEventListener('pointermove', moveCursorGlow)
  document.documentElement.removeEventListener('mouseleave', hideCursorGlow)
})
</script>

<template>
  <div class="site-frame" :class="{ 'site-frame--dbverse': isDbverseRoute }">
    <PhantomIntro v-if="!isDbverseRoute" />
    <div v-if="!isDbverseRoute" ref="cursorGlow" class="cursor-glow" aria-hidden="true"></div>
    <SiteHeader />
    <main>
      <RouterView v-slot="{ Component, route: viewRoute }">
        <component :is="Component" v-if="isDbverseRoute" :key="viewRoute.fullPath" />
        <Transition v-else name="page-shift" mode="out-in" appear>
          <component :is="Component" :key="viewRoute.fullPath" />
        </Transition>
      </RouterView>
    </main>
    <SiteFooter v-if="!isDbverseRoute" />
  </div>
</template>
