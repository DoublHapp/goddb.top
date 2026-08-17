<script setup lang="ts">
import { ArrowRight, RotateCcw } from 'lucide-vue-next'
import { profile } from '@/content'
import { useLocale } from '@/composables/useLocale'

const emit = defineEmits<{ explore: []; replay: []; event: [] }>()
const { locale } = useLocale()

/** 滚动到频道选择区并通知父组件。 */
const explore = () => {
  emit('explore')
  document.querySelector('#channels')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
}
</script>

<template>
  <section class="phantom-hero">
    <div class="phantom-rays" aria-hidden="true"></div>
    <div class="phantom-paper" aria-hidden="true"></div>
    <div class="phantom-hero-copy">
      <p class="phantom-eyebrow">{{ locale === 'zh-CN' ? 'DB SAMA / 思考停止区 / ACT 00' : 'DB-SAMA / THINKING-FREE ZONE / ACT 00' }}</p>
      <h1 v-if="locale === 'zh-CN'" class="phantom-title">认真不是<br><span>访问本站的</span><br>前置条件。</h1>
      <h1 v-else class="phantom-title">Serious thinking<br><span>is not required</span><br>for entry.</h1>
      <p class="phantom-intro-copy">{{ profile.intro[locale] }}</p>
      <button class="phantom-cta" type="button" @click="explore">
        {{ locale === 'zh-CN' ? '打破版面，开始探索' : 'Break the layout. Start exploring.' }}
        <ArrowRight :size="18" />
      </button>
    </div>
    <aside class="phantom-hero-console">
      <small>CONTROL PANEL / BRAND LOCKED</small>
      <h2>DB EYES ONLINE.</h2>
      <p>{{ locale === 'zh-CN' ? '原创漫画双眼已收束为 DB 徽记。选择频道，或重播这次凝视。' : 'The original comic eyes are locked into the DB mark. Choose a channel or replay the gaze.' }}</p>
      <div>
        <button type="button" @click="emit('replay')"><RotateCcw :size="15" />{{ locale === 'zh-CN' ? '重播凝视' : 'Replay gaze' }}</button>
        <button type="button" @click="emit('event')">{{ locale === 'zh-CN' ? '打开事件频道' : 'Open event channel' }}</button>
      </div>
    </aside>
    <strong class="phantom-hero-break" aria-hidden="true">BREAK!</strong>
  </section>
</template>
