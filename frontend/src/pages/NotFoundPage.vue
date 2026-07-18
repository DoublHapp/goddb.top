<script setup lang="ts">
import { Terminal } from 'lucide-vue-next'
import { useLocale } from '@/composables/useLocale'
import { useSeo } from '@/composables/useSeo'

const { t } = useLocale()
useSeo('404', () => t.value.notFound.title, '/404')
</script>

<template>
  <section class="page shell not-found"><Terminal :size="44" /><p class="eyebrow">{{ t.notFound.code }}</p><h1>404</h1><p>{{ t.notFound.title }}</p><RouterLink to="/" class="primary-button">{{ t.notFound.action }}</RouterLink></section>
</template>
