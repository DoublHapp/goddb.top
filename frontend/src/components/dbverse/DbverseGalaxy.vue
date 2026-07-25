<script setup lang="ts">
import { Pause, Play } from 'lucide-vue-next'
import { computed, nextTick, onBeforeUnmount, onMounted, onUnmounted, ref, watch } from 'vue'
import { dbverseIps } from '@/content/dbverse'
import { useLocale } from '@/composables/useLocale'
import { createDbverseScene, type DbverseSceneController, type DbverseSceneMode } from '@/lib/dbverse/scene'
import type { DbverseIpSlug } from '@/types/content'

const props = withDefaults(defineProps<{ mode: DbverseSceneMode; activeIp?: DbverseIpSlug; interactive?: boolean; entries?: { slug: string; label: string }[] }>(), { activeIp: undefined, interactive: true, entries: () => [] })
const emit = defineEmits<{ select: [slug: DbverseIpSlug]; confirm: [slug: DbverseIpSlug]; entry: [slug: string]; ready: []; fallback: []; state: [state: 'loading' | 'ready' | 'focusing' | 'focused' | 'fallback'] }>()
const { locale, t } = useLocale()
const canvas = ref<HTMLCanvasElement>()
const ready = ref(false)
const failed = ref(false)
const pausedByUser = ref(false)
const reducedMotion = ref(false)
const quality = ref('standard')
const selected = ref<DbverseIpSlug | undefined>(props.activeIp)
let controller: DbverseSceneController | undefined
let frame = 0
let contextRestoreTimer = 0
let focusTimer = 0
const interactionState = ref<'loading' | 'ready' | 'focusing' | 'focused' | 'fallback'>('loading')
const availableIps = computed(() => props.mode === 'overview' ? dbverseIps : dbverseIps.filter((ip) => ip.slug === props.activeIp))

const animate = (time: number) => { controller?.tick(time); frame = requestAnimationFrame(animate) }
const setState = (state: typeof interactionState.value) => { interactionState.value = state; emit('state', state) }
const fail = () => { failed.value = true; setState('fallback'); controller?.dispose(); controller = undefined; cancelAnimationFrame(frame); emit('fallback') }
const initialize = async () => {
  await nextTick()
  if (!canvas.value) return
  try {
    reducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    controller = createDbverseScene({
      canvas: canvas.value, mode: props.mode, activeIp: props.activeIp, reducedMotion: reducedMotion.value,
      onContextLost: () => { contextRestoreTimer = window.setTimeout(fail, 1800) },
      onContextRestored: () => { window.clearTimeout(contextRestoreTimer) },
      onQualityChange: (value) => { quality.value = value },
    })
    ready.value = true
    setState('ready')
    emit('ready')
    frame = requestAnimationFrame(animate)
  } catch { fail() }
}
const select = (slug: DbverseIpSlug) => {
  if (!props.interactive || interactionState.value === 'focusing') return
  if (selected.value === slug && interactionState.value === 'focused') emit('confirm', slug)
  else {
    selected.value = slug
    setState('focusing')
    controller?.focusIp(slug)
    emit('select', slug)
    window.clearTimeout(focusTimer)
    focusTimer = window.setTimeout(() => setState('focused'), reducedMotion.value ? 180 : 720)
  }
}
const pointerMove = (event: PointerEvent) => {
  const bounds = canvas.value?.getBoundingClientRect()
  if (!bounds) return
  controller?.setPointerTarget((event.clientX - bounds.left) / bounds.width * 2 - 1, -((event.clientY - bounds.top) / bounds.height * 2 - 1))
}
const canvasClick = (event: MouseEvent) => {
  const bounds = canvas.value?.getBoundingClientRect()
  if (!bounds) return
  const result = controller?.pick((event.clientX - bounds.left) / bounds.width * 2 - 1, -((event.clientY - bounds.top) / bounds.height * 2 - 1))
  if (result?.type === 'ip') select(result.slug)
  else if (result?.type === 'entry') emit('entry', result.slug)
  else if (props.mode === 'overview' && selected.value) { selected.value = undefined; controller?.reset() }
}
const togglePause = () => { pausedByUser.value = !pausedByUser.value; controller?.pause(pausedByUser.value) }
const visibility = () => controller?.pause(document.hidden || pausedByUser.value)
const resize = () => controller?.resize()
const reset = () => { window.clearTimeout(focusTimer); selected.value = props.activeIp; controller?.reset(); setState('ready') }
defineExpose({ reset, focusIp: (slug: DbverseIpSlug) => { selected.value = slug; controller?.focusIp(slug) } })
onMounted(() => { initialize(); window.addEventListener('resize', resize); document.addEventListener('visibilitychange', visibility) })
onBeforeUnmount(() => { window.clearTimeout(contextRestoreTimer); window.clearTimeout(focusTimer); cancelAnimationFrame(frame); controller?.pause(true); window.removeEventListener('resize', resize); document.removeEventListener('visibilitychange', visibility) })
onUnmounted(() => { const retiredController = controller; controller = undefined; window.setTimeout(() => retiredController?.dispose(), 0) })
watch(() => props.activeIp, (value) => { selected.value = value; if (value) controller?.focusIp(value) })
</script>

<template>
  <div class="dbverse-galaxy" :class="[`dbverse-galaxy--${mode}`, { 'is-ready': ready }]" :data-motion="reducedMotion ? 'reduced' : 'full'" :data-quality="quality" :data-state="interactionState">
    <canvas v-if="!failed" ref="canvas" class="dbverse-canvas" :aria-label="t.dbverse.canvasLabel" @pointermove="pointerMove" @click="canvasClick"></canvas>
    <div v-if="!ready && !failed" class="dbverse-loading" role="status">{{ t.dbverse.loading }}</div>
    <div v-if="interactive" class="dbverse-accessible-targets">
      <button v-for="ip in availableIps" :key="ip.slug" type="button" :class="`dbverse-target dbverse-target--${ip.slug}`" :aria-label="`${t.dbverse.focus} ${ip.name[locale]}`" :aria-pressed="selected === ip.slug" @click="select(ip.slug)">{{ ip.name[locale] }}</button>
    </div>
    <div v-if="mode === 'ip' && entries.length" class="dbverse-entry-targets">
      <button v-for="(entry, index) in entries" :key="entry.slug" type="button" class="dbverse-entry-target" :style="{ '--entry-index': index }" :aria-label="entry.label" @click="emit('entry', entry.slug)">{{ entry.label }}</button>
    </div>
    <button v-if="!failed" class="dbverse-pause" type="button" :aria-label="pausedByUser ? t.dbverse.resume : t.dbverse.pause" @click="togglePause"><Play v-if="pausedByUser" :size="15" /><Pause v-else :size="15" />{{ pausedByUser ? t.dbverse.resume : t.dbverse.pause }}</button>
    <span class="dbverse-motion-state">{{ reducedMotion ? t.dbverse.reducedMotion : t.dbverse.motionActive }}</span>
  </div>
</template>
