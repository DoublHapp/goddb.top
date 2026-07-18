<script setup lang="ts">
import { Palette, PanelTop, Sparkles, Waypoints } from 'lucide-vue-next'
import type { Component } from 'vue'

const props = defineProps<{ name: string; size?: number }>()
const icons: Record<string, Component> = { Palette, PanelTop, Sparkles, Waypoints }
</script>

<template>
  <component :is="icons[props.name] ?? icons.Waypoints" :size="props.size ?? 24" />
</template>
