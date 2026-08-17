<script setup lang="ts">
import { ArrowUpRight, X } from 'lucide-vue-next'
import { computed, nextTick, ref, watch } from 'vue'
import { dbverseEntries, posts, profile, projects, tools } from '@/content'
import { useLocale } from '@/composables/useLocale'

type Channel = 'essays' | 'dbverse' | 'projects' | 'about'

interface MissionPanelProps {
  channel: string
  open: boolean
}

const props = defineProps<MissionPanelProps>()
const emit = defineEmits<{ close: [] }>()
const { locale, t } = useLocale()
const closeButton = ref<HTMLButtonElement>()
const surface = ref<HTMLElement>()

/** 将外部频道值收敛为任务面板支持的频道。 */
const activeChannel = computed<Channel>(() => ['essays', 'dbverse', 'projects', 'about'].includes(props.channel) ? props.channel as Channel : 'essays')

/** 根据当前语言和真实内容源组装任务面板。 */
const mission = computed(() => {
  const copy = locale.value === 'zh-CN'
  if (activeChannel.value === 'dbverse') {
    return {
      label: copy ? `事件 / DB宇宙 · ${dbverseEntries.length} 条信号` : `EVENT / DBVERSE · ${dbverseEntries.length} SIGNALS`,
      title: copy ? '热血仍在轨道上' : 'The fire is still in orbit',
      description: t.value.dbverse.bannerDescription,
      items: dbverseEntries.map((entry) => ({
        meta: `${entry.ip.toUpperCase()} / ${t.value.dbverse.statuses[entry.status]}`,
        title: entry.title[locale.value],
        description: entry.excerpt[locale.value],
        to: `/dbverse/${entry.slug}`,
        status: entry.status,
      })),
    }
  }
  if (activeChannel.value === 'projects') {
    return {
      label: copy ? `任务 / 作品 · ${projects.length} 个档案` : `MISSION / PROJECTS · ${projects.length} FILES`,
      title: t.value.projects.title,
      description: copy ? '做过的，和还没做完的。工具频道仍在建设中，不伪造上线状态。' : 'Made, making, and unfinished. The tools channel stays honestly under construction.',
      items: [
        ...projects.slice(0, 2).map((project) => ({ meta: `${project.sequence} / ${t.value.projects[project.status]}`, title: project.title, description: project.summary[locale.value], to: `/projects/${project.slug}`, status: project.status })),
        { meta: `TOOLS / ${tools.length || 'BUILDING'}`, title: copy ? '工具正在搓' : 'Tools are still cooking', description: copy ? '尚未上线的工具不会被伪装成可用内容。' : 'Tools that are not live will never be presented as available.', to: '/tools', status: 'building' },
      ],
    }
  }
  if (activeChannel.value === 'about') {
    return {
      label: copy ? '档案 / DB 使用说明' : 'PROFILE / DB USER GUIDE',
      title: t.value.nav.about,
      description: profile.intro[locale.value],
      items: [{ meta: copy ? '本体 / 偶尔在线' : 'IDENTITY / OCCASIONALLY ONLINE', title: profile.name, description: profile.role[locale.value], to: '/about', status: 'online' }],
    }
  }
  return {
    label: copy ? `任务 / 随笔 · ${posts.length} 篇` : `MISSION / ESSAYS · ${posts.length} FILES`,
    title: t.value.home.posts,
    description: t.value.blog.subtitle,
    items: [...posts].sort((left, right) => right.publishedAt.localeCompare(left.publishedAt)).slice(0, 3).map((post) => ({
      meta: `${post.category.toUpperCase()} · ${post.readingTime} ${t.value.common.min}`,
      title: post.title[locale.value],
      description: post.excerpt[locale.value],
      to: `/essays/${post.slug}`,
      status: 'published',
    })),
  }
})

/** 请求关闭当前任务面板。 */
const close = () => emit('close')

/** 处理任务面板的 Escape 键关闭操作。 */
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    close()
    return
  }
  if (event.key !== 'Tab') return
  const focusable = surface.value?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]')
  if (!focusable?.length) return
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

watch(() => props.open, async (open) => {
  if (!open) return
  await nextTick()
  closeButton.value?.focus()
}, { immediate: true })
</script>

<template>
  <div v-if="open" class="mission-panel" @click.self="close">
    <section id="mission-panel" ref="surface" class="mission-panel__surface" role="dialog" aria-modal="true" :aria-labelledby="`mission-panel-${activeChannel}`" :aria-describedby="`mission-panel-${activeChannel}-description`" @keydown="handleKeydown">
      <button ref="closeButton" class="mission-panel__close" data-action="close" type="button" :aria-label="locale === 'zh-CN' ? '关闭任务面板' : 'Close mission panel'" @click="close">
        <X :size="18" />
        <span>{{ locale === 'zh-CN' ? '关闭 / ESC' : 'CLOSE / ESC' }}</span>
      </button>
      <p class="mission-panel__label">{{ mission.label }}</p>
      <h2 :id="`mission-panel-${activeChannel}`">{{ mission.title }}</h2>
      <p :id="`mission-panel-${activeChannel}-description`" class="mission-panel__description">{{ mission.description }}</p>
      <div class="mission-panel__items">
        <RouterLink v-for="item in mission.items" :key="item.to" :to="item.to" class="mission-panel__item" :data-status="item.status" @click="close">
          <small>{{ item.meta }}</small>
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
          <ArrowUpRight :size="18" aria-hidden="true" />
        </RouterLink>
      </div>
    </section>
  </div>
</template>
