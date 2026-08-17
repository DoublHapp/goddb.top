<script setup lang="ts">
import { Radio } from 'lucide-vue-next'
defineProps<{ code: string; title: string; description?: string; action?: string; to?: string }>()
const emit = defineEmits<{ action: [] }>()
</script>

<template>
  <section class="phantom-empty-state" data-reveal><Radio :size="28" /><span class="phantom-empty-state__code">{{ code }}</span><h2>{{ title }}</h2><p v-if="description">{{ description }}</p><RouterLink v-if="to && action" :to="to" class="primary-button">{{ action }}</RouterLink><button v-else-if="action" type="button" class="primary-button" @click="emit('action')">{{ action }}</button></section>
</template>
