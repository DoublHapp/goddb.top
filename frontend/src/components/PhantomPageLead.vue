<script setup lang="ts">
withDefaults(defineProps<{ index?: string; eyebrow: string; title: string; description: string; count?: string }>(), { index: '00', count: '' })
</script>

<template>
  <header class="phantom-page-lead" data-reveal>
    <div class="phantom-page-lead__rail"><b>{{ index }}</b><span>{{ eyebrow }}</span><em v-if="count">{{ count }}</em></div>
    <div class="phantom-page-lead__body"><h1>{{ title }}<i aria-hidden="true">.</i></h1><p>{{ description }}</p></div>
  </header>
</template>
