<script setup lang="ts">
import { ArrowLeft, ArrowRight } from 'lucide-vue-next'
import { computed } from 'vue'
import { getDbverseEntriesByIp, getDbverseIp } from '@/content/dbverse'
import { useLocale } from '@/composables/useLocale'
import type { DbverseIpSlug } from '@/types/content'

const props = defineProps<{ focusedIp?: DbverseIpSlug; busy?: boolean; status?: string; showBack?: boolean }>()
const emit = defineEmits<{ enter: []; reset: [] }>()
const { locale, t } = useLocale()
const ip = computed(() => getDbverseIp(props.focusedIp))
</script>

<template>
  <div class="dbverse-hud">
    <div class="dbverse-hud-copy" aria-live="polite">
      <p class="eyebrow">{{ t.dbverse.eyebrow }}</p>
      <template v-if="ip"><h1>{{ ip.name[locale] }}</h1><h2>{{ ip.title[locale] }}</h2><p>{{ ip.description[locale] }}</p><span>{{ getDbverseEntriesByIp(ip.slug).length }} {{ t.dbverse.contentCount }}</span></template>
      <template v-else><h1>{{ t.dbverse.title }}</h1><p>{{ t.dbverse.subtitle }}</p></template>
      <small v-if="status">{{ status }}</small>
    </div>
    <div class="dbverse-hud-actions">
      <button v-if="ip" type="button" :disabled="busy" class="dbverse-action-primary" @click="emit('enter')">{{ t.dbverse.enterSystem }} <ArrowRight :size="16" /></button>
      <button v-if="ip || showBack" type="button" :disabled="busy" class="dbverse-action-secondary" @click="emit('reset')"><ArrowLeft :size="16" />{{ t.dbverse.backGalaxy }}</button>
    </div>
  </div>
</template>
