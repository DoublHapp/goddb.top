<script setup lang="ts">
import { Search, X } from 'lucide-vue-next'
defineProps<{ search: string; placeholder: string; filterLabel: string; options: readonly { value: string; label: string }[]; active: string; clearLabel?: string }>()
const emit = defineEmits<{ 'update:search': [value: string]; select: [value: string]; clear: [] }>()
</script>

<template>
  <section class="phantom-filter-bar" data-reveal>
    <label class="phantom-filter-bar__search"><Search :size="16" /><span class="sr-only">{{ placeholder }}</span><input :value="search" type="search" :placeholder="placeholder" @input="emit('update:search', ($event.target as HTMLInputElement).value)" /></label>
    <div class="phantom-filter-bar__options" :aria-label="filterLabel"><button v-for="option in options" :key="option.value" type="button" :data-filter-value="option.value" :aria-pressed="active === option.value" :class="{ active: active === option.value }" @click="emit('select', option.value)">{{ option.label }}</button></div>
    <button v-if="clearLabel && (search || active !== options[0]?.value)" class="phantom-filter-bar__clear" type="button" @click="emit('clear')"><X :size="14" />{{ clearLabel }}</button>
  </section>
</template>
