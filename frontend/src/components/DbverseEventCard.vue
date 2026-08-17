<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next'
import { computed } from 'vue'
import { dbverseEntries, dbverseIps } from '@/content'
import { useLocale } from '@/composables/useLocale'

const { locale } = useLocale()

/** 使用真实星域名称拼接事件卡描述。 */
const description = computed(() => {
  const names = dbverseIps.map((ip) => ip.name[locale.value]).join(locale.value === 'zh-CN' ? '与' : ' and ')
  return locale.value === 'zh-CN' ? `${names}星域已接入，${dbverseEntries.length} 条真实信号等待观测。` : `${names} systems are online with ${dbverseEntries.length} real signals ready to explore.`
})
</script>

<template>
  <RouterLink to="/dbverse" class="phantom-universe">
    <span class="phantom-universe-copy">
      <small>03 / DBVERSE · LIVE EVENT</small>
      <strong>{{ locale === 'zh-CN' ? '重播一次热血沸腾。' : 'Replay the rush.' }}</strong>
      <span>{{ description }}</span>
    </span>
    <span class="phantom-universe-orbit" aria-hidden="true"></span>
    <ArrowUpRight :size="24" aria-hidden="true" />
  </RouterLink>
</template>
