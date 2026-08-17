<script setup lang="ts">
import { computed } from 'vue'
import ChannelCard from '@/components/ChannelCard.vue'
import { dbverseEntries, posts, projects, tools } from '@/content'
import { useLocale } from '@/composables/useLocale'

const emit = defineEmits<{ select: [channel: 'essays' | 'dbverse' | 'projects'] }>()
const { locale } = useLocale()

/** 使用真实内容数量与当前语言生成首页频道卡。 */
const channels = computed(() => locale.value === 'zh-CN' ? [
  { channel: 'essays' as const, eyebrow: '主频道 / 随笔', count: `${posts.length} 篇`, title: '没想明白的随笔', description: '技术、迁移、学习存档，以及写下来以后才慢慢成形的答案。', variant: 'primary' as const },
  { channel: 'dbverse' as const, eyebrow: '事件 / DB宇宙', count: `${dbverseEntries.length} 条信号`, title: '热血仍在轨道上。', description: '游戏、动漫与旧日记忆。', variant: 'intel' as const },
  { channel: 'projects' as const, eyebrow: '作品 / 工具', count: `${projects.length} + ${tools.length || '建设中'}`, title: '怪东西陈列柜', description: '先看做过的；尚未上线的绝不装作存在。', status: '工具正在搓', variant: 'action' as const },
] : [
  { channel: 'essays' as const, eyebrow: 'MAIN PANEL / ESSAYS', count: `${posts.length} FILES`, title: 'Essays written too early', description: 'Technical work, migrations, learning archives, and answers that took shape after publishing.', variant: 'primary' as const },
  { channel: 'dbverse' as const, eyebrow: 'EVENT / DBVERSE', count: `${dbverseEntries.length} SIGNALS`, title: 'The fire is still in orbit.', description: 'Games, anime, and memories that refuse to cool down.', variant: 'intel' as const },
  { channel: 'projects' as const, eyebrow: 'PROJECTS / TOOLS', count: `${projects.length} + BUILDING`, title: 'Cabinet of oddities', description: 'See what exists. Nothing unfinished pretends to be live.', status: 'TOOLS STILL COOKING', variant: 'action' as const },
])
</script>

<template>
  <section id="channels" class="phantom-section" :aria-labelledby="'channel-grid-title'">
    <header class="phantom-section-heading">
      <b class="phantom-section-index">01</b>
      <h2 id="channel-grid-title">{{ locale === 'zh-CN' ? '选择一格，撞进去。' : 'Pick a panel. Dive in.' }}</h2>
      <small>{{ locale === 'zh-CN' ? '面板选择 / 打开一个任务 ↘' : 'PANEL SELECT / OPEN A MISSION ↘' }}</small>
    </header>
    <div class="phantom-channels">
      <ChannelCard v-for="channel in channels" :key="channel.channel" v-bind="channel" @select="emit('select', $event)" />
    </div>
  </section>
</template>
