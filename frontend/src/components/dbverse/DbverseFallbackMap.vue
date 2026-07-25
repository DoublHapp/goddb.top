<script setup lang="ts">
import { computed, ref } from 'vue'
import { dbverseIps, getDbverseEntriesByIp } from '@/content/dbverse'
import { useLocale } from '@/composables/useLocale'
import type { DbverseIpSlug } from '@/types/content'

const props = defineProps<{ activeIp?: DbverseIpSlug; compact?: boolean }>()
const emit = defineEmits<{ select: [slug: DbverseIpSlug]; confirm: [slug: DbverseIpSlug] }>()
const { locale, t } = useLocale()
const selected = ref<DbverseIpSlug | undefined>(props.activeIp)
const ips = computed(() => props.activeIp ? dbverseIps.filter((ip) => ip.slug === props.activeIp) : dbverseIps)
const choose = (slug: DbverseIpSlug) => {
  if (selected.value === slug) emit('confirm', slug)
  else { selected.value = slug; emit('select', slug) }
}
</script>

<template>
  <section class="dbverse-fallback" :class="{ 'dbverse-fallback--compact': compact }" data-testid="fallback-map">
    <p class="dbverse-fallback-status">{{ t.dbverse.compatibilityMap }}</p>
    <div class="dbverse-fallback-grid">
      <button v-for="ip in ips" :key="ip.slug" type="button" :class="['fallback-ip-card', `fallback-ip-card--${ip.slug}`, { active: selected === ip.slug }]" :aria-pressed="selected === ip.slug" @click="choose(ip.slug)">
        <span class="fallback-orbit" aria-hidden="true"></span><strong>{{ ip.name[locale] }}</strong><small>{{ ip.title[locale] }}</small><span>{{ getDbverseEntriesByIp(ip.slug).length }} {{ t.dbverse.contentCount }}</span>
      </button>
    </div>
  </section>
</template>
