<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'
defineProps<{ backTo: string; backLabel: string; eyebrow: string; title: string; meta?: string }>()
</script>

<template>
  <header class="phantom-detail-header" data-reveal><RouterLink :to="backTo" class="back-link"><ArrowLeft :size="16" />{{ backLabel }}</RouterLink><div class="phantom-detail-header__main"><div><p class="phantom-detail-header__eyebrow">{{ eyebrow }}</p><h1>{{ title }}</h1></div><span v-if="meta" class="phantom-detail-header__meta">{{ meta }}</span><div class="phantom-detail-header__actions"><slot name="actions" /></div></div></header>
</template>
