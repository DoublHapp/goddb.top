<script setup lang="ts">
defineProps<{ index: string; title: string; action?: string; to?: string }>()
</script>

<template>
  <div class="section-heading">
    <h2><span>{{ index }}</span>{{ title }}</h2>
    <RouterLink v-if="action && to" :to="to">{{ action }} <span>→</span></RouterLink>
  </div>
</template>
