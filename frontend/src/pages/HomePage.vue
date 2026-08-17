<script setup lang="ts">
import { ArrowRight, ArrowUpRight, Radio, Sparkles } from 'lucide-vue-next'
import { computed, nextTick, ref } from 'vue'
import MissionPanel from '@/components/MissionPanel.vue'
import { dbverseEntries, posts, profile, projects } from '@/content'
import { useLocale } from '@/composables/useLocale'
import { usePhantomIntro } from '@/composables/usePhantomIntro'
import { useSeo } from '@/composables/useSeo'

const { locale, t } = useLocale()
const { isPlaying, playIntro } = usePhantomIntro()
const activeChannel = ref('essays')
const panelOpen = ref(false)
const channelTriggers = new Map<string, HTMLButtonElement>()
const latestPosts = computed(() => [...posts].sort((left, right) => right.publishedAt.localeCompare(left.publishedAt)).slice(0, 3))
const copy = computed(() => locale.value === 'zh-CN' ? {
  dispatch: 'PHANTOM 频道 / 选择任务',
  channels: '选择你的频道',
  latest: '最近截获的信号',
  essays: '随笔任务',
  projects: '作品档案',
  about: 'DB 使用说明',
  open: '打开任务面板',
  status: '真实内容 / 随时可撤离',
  break: '认真不是访问前置条件！',
} : {
  dispatch: 'PHANTOM CHANNELS / PICK A MISSION',
  channels: 'Choose your channel',
  latest: 'Latest intercepted signals',
  essays: 'Essay missions',
  projects: 'Project files',
  about: 'DB user guide',
  open: 'Open mission panel',
  status: 'REAL CONTENT / EXIT ANYTIME',
  break: 'SERIOUS THINKING IS OPTIONAL!',
})

/** 记录频道按钮，以便面板关闭后恢复键盘焦点。 */
const setChannelTrigger = (channel: string, element: unknown) => {
  if (element instanceof HTMLButtonElement) channelTriggers.set(channel, element)
}

/** 打开指定频道对应的真实内容任务面板。 */
const openChannel = (channel: string) => {
  activeChannel.value = channel
  panelOpen.value = true
}

/** 关闭任务面板并把焦点归还给原频道。 */
const closeChannel = async () => {
  panelOpen.value = false
  await nextTick()
  channelTriggers.get(activeChannel.value)?.focus()
}

useSeo(() => locale.value === 'zh-CN' ? 'DB 的线上工作台' : 'DB’s workbench', () => profile.intro[locale.value], '/')
</script>

<template>
  <div class="phantom-home">
    <section class="phantom-hero">
      <div class="phantom-rays" aria-hidden="true"></div>
      <div class="phantom-paper" aria-hidden="true"></div>
      <div class="phantom-hero-copy">
        <p class="phantom-eyebrow">{{ t.home.eyebrow }}</p>
        <h1 class="phantom-title">{{ t.home.titleA }}<br><span>{{ t.home.titleB }}</span></h1>
        <p class="phantom-intro-copy">{{ profile.intro[locale] }}</p>
        <RouterLink to="/essays" class="phantom-cta">{{ t.home.enterEssays }} <ArrowRight :size="18" /></RouterLink>
      </div>
      <aside class="phantom-hero-console">
        <small>{{ copy.status }}</small>
        <h2>{{ t.home.intro }}</h2>
        <p>{{ t.home.playgroundDescription }}</p>
        <div><button type="button" :disabled="isPlaying" @click="playIntro({ manual: true })">{{ t.home.phantom.replayGaze }}</button><RouterLink to="/projects">{{ t.nav.projects }}</RouterLink><RouterLink to="/about">{{ t.nav.about }}</RouterLink></div>
      </aside>
      <strong class="phantom-hero-break">{{ copy.break }}</strong>
    </section>

    <section class="phantom-section">
      <header class="phantom-section-heading"><span class="phantom-section-index">01</span><div><small>{{ copy.dispatch }}</small><h2>{{ copy.channels }}</h2></div></header>
      <div class="phantom-channels">
        <button :ref="(element) => setChannelTrigger('essays', element)" class="phantom-channel phantom-channel--primary" data-channel-trigger="essays" type="button" :aria-label="copy.essays" aria-haspopup="dialog" :aria-expanded="panelOpen && activeChannel === 'essays'" aria-controls="mission-panel" @click="openChannel('essays')">
          <span class="phantom-channel-meta"><span>01 / ESSAYS</span><span>{{ posts.length }} SIGNALS</span></span>
          <h3>{{ copy.essays }}</h3><p>{{ t.blog.subtitle }}</p><ArrowUpRight class="phantom-channel-arrow" :size="30" />
        </button>
        <button :ref="(element) => setChannelTrigger('projects', element)" class="phantom-channel phantom-channel--intel" data-channel-trigger="projects" type="button" :aria-label="copy.projects" aria-haspopup="dialog" :aria-expanded="panelOpen && activeChannel === 'projects'" aria-controls="mission-panel" @click="openChannel('projects')">
          <span class="phantom-channel-meta"><span>02 / PROJECTS</span><span>{{ projects.length }} FILES</span></span>
          <span class="phantom-channel-status">{{ t.projects.building }}</span><h3>{{ copy.projects }}</h3><p>{{ t.projects.subtitle }}</p><ArrowUpRight class="phantom-channel-arrow" :size="26" />
        </button>
        <button :ref="(element) => setChannelTrigger('about', element)" class="phantom-channel phantom-channel--action" data-channel-trigger="about" type="button" :aria-label="copy.about" aria-haspopup="dialog" :aria-expanded="panelOpen && activeChannel === 'about'" aria-controls="mission-panel" @click="openChannel('about')">
          <span class="phantom-channel-meta"><span>03 / PROFILE</span><span>DB</span></span>
          <h3>{{ copy.about }}</h3><p>{{ profile.role[locale] }}</p><ArrowUpRight class="phantom-channel-arrow" :size="26" />
        </button>
      </div>
    </section>

    <section class="phantom-section phantom-latest">
      <header class="phantom-section-heading"><span class="phantom-section-index">02</span><h2>{{ copy.latest }}</h2></header>
      <div class="phantom-story-list">
        <RouterLink v-for="post in latestPosts" :key="post.slug" :to="`/essays/${post.slug}`" class="phantom-story">
          <time :datetime="post.publishedAt"><span>{{ post.publishedAt.slice(5) }}</span><small>{{ post.publishedAt.slice(0, 4) }}</small></time>
          <span><small>{{ post.category }} / {{ post.readingTime }} {{ t.common.min }}</small><strong>{{ post.title[locale] }}</strong></span>
          <ArrowUpRight :size="22" />
        </RouterLink>
      </div>
    </section>

    <section class="phantom-section">
      <RouterLink to="/dbverse" class="phantom-universe">
        <span class="phantom-universe-copy"><small><Radio :size="13" /> {{ t.dbverse.eyebrow }} · {{ dbverseEntries.length }} SIGNALS</small><strong>{{ t.dbverse.bannerTitle }}</strong><span>{{ t.dbverse.bannerDescription }}</span><b>{{ t.dbverse.enter }} →</b></span>
        <span class="phantom-universe-orbit" aria-hidden="true"></span><Sparkles :size="42" aria-hidden="true" />
      </RouterLink>
    </section>
    <MissionPanel :channel="activeChannel" :open="panelOpen" @close="closeChannel" />
  </div>
</template>
