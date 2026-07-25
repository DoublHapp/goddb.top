<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import DbverseFallbackMap from '@/components/dbverse/DbverseFallbackMap.vue'
import DbverseGalaxy from '@/components/dbverse/DbverseGalaxy.vue'
import DbverseHud from '@/components/dbverse/DbverseHud.vue'
import { useLocale } from '@/composables/useLocale'
import { useSeo } from '@/composables/useSeo'
import type { DbverseIpSlug } from '@/types/content'

const router = useRouter()
const { t } = useLocale()
const galaxy = ref<InstanceType<typeof DbverseGalaxy>>()
const focusedIp = ref<DbverseIpSlug>()
const fallback = ref(false)
const state = ref<'loading' | 'overview' | 'focusing' | 'focused' | 'leaving' | 'fallback'>('loading')
const busy = computed(() => state.value === 'loading' || state.value === 'focusing' || state.value === 'leaving')
const select = (slug: DbverseIpSlug) => { if (state.value === 'overview' || state.value === 'focused') focusedIp.value = slug }
const enter = async (slug = focusedIp.value) => { if (!slug || state.value !== 'focused' && state.value !== 'fallback') return; state.value = 'leaving'; await new Promise((resolve) => window.setTimeout(resolve, 260)); await router.push(`/dbverse/ip/${slug}`) }
const reset = () => { if (state.value === 'focusing' || state.value === 'leaving') return; focusedIp.value = undefined; state.value = fallback.value ? 'fallback' : 'overview'; galaxy.value?.reset() }
const sceneState = (value: 'loading' | 'ready' | 'focusing' | 'focused' | 'fallback') => { state.value = value === 'ready' ? 'overview' : value }
const useFallback = () => { fallback.value = true; state.value = 'fallback' }
const keydown = (event: KeyboardEvent) => { if (event.key === 'Escape') reset() }
onMounted(() => window.addEventListener('keydown', keydown))
onBeforeUnmount(() => window.removeEventListener('keydown', keydown))
useSeo(() => t.value.dbverse.title, () => t.value.dbverse.subtitle, '/dbverse')
</script>

<template>
  <section class="dbverse-stage dbverse-overview">
    <DbverseGalaxy v-if="!fallback" ref="galaxy" mode="overview" :interactive="!busy" @select="select" @confirm="enter" @fallback="useFallback" @state="sceneState" />
    <DbverseFallbackMap v-else @select="select" @confirm="enter" />
    <DbverseHud :focused-ip="focusedIp" :busy="busy" :status="state === 'loading' ? t.dbverse.loading : state === 'focusing' ? t.dbverse.focusing : state === 'leaving' ? t.dbverse.leaving : focusedIp ? t.dbverse.focused : t.dbverse.hint" @enter="enter()" @reset="reset" />
  </section>
</template>
