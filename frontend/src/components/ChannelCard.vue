<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'

interface ChannelCardProps {
  channel: 'essays' | 'dbverse' | 'projects'
  eyebrow: string
  count: string
  title: string
  description: string
  status?: string
  variant?: 'primary' | 'intel' | 'action'
}

defineProps<ChannelCardProps>()
defineEmits<{ select: [channel: ChannelCardProps['channel']] }>()
</script>

<template>
  <button :class="['phantom-channel', variant && `phantom-channel--${variant}`]" type="button" :data-channel="channel" @click="$emit('select', channel)">
    <span class="phantom-channel-meta"><span>{{ eyebrow }}</span><span>{{ count }}</span></span>
    <span v-if="status" class="phantom-channel-status" data-status="building">{{ status }}</span>
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
    <ArrowRight class="phantom-channel-arrow" :size="24" aria-hidden="true" />
  </button>
</template>
