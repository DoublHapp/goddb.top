<script setup lang="ts">
import { useLocale } from '@/composables/useLocale'
import { useSeo } from '@/composables/useSeo'
import PhantomEmptyState from '@/components/PhantomEmptyState.vue'

const { t } = useLocale()
useSeo('404', () => t.value.notFound.title, '/404')
</script>

<template>
  <section class="page shell not-found"><PhantomEmptyState :code="t.notFound.code" :title="t.notFound.title" :action="t.notFound.action" to="/" /></section>
</template>
