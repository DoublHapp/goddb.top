<script setup lang="ts">
import { ArrowRight, ArrowUpRight } from 'lucide-vue-next'
import PostRow from '@/components/PostRow.vue'
import SectionHeading from '@/components/SectionHeading.vue'
import PlaygroundCanvas from '@/components/PlaygroundCanvas.vue'
import ToolCard from '@/components/ToolCard.vue'
import { posts, profile } from '@/content'
import { useLocale } from '@/composables/useLocale'
import { useSeo } from '@/composables/useSeo'
import { useToolLibrary } from '@/composables/useToolLibrary'

const { locale, t } = useLocale()
const { featuredTools } = useToolLibrary()
useSeo(() => locale.value === 'zh-CN' ? 'DB 的线上工作台' : 'DB’s workbench', () => profile.intro[locale.value], '/')
</script>

<template>
  <div class="home-page">
    <section class="hero home-hero shell">
      <PlaygroundCanvas />
      <div class="hero-copy">
        <p class="eyebrow">{{ t.home.eyebrow }}</p>
        <h1>{{ t.home.titleA }}<br><span>{{ t.home.titleB }}</span></h1>
        <p class="hero-intro">{{ profile.intro[locale] }}</p>
        <div class="hero-actions"><RouterLink to="/tools" class="primary-button">{{ t.nav.tools }} <ArrowRight :size="17" /></RouterLink><RouterLink to="/essays" class="secondary-button">{{ t.home.enterEssays }} <ArrowRight :size="17" /></RouterLink></div>
      </div>
    </section>

    <section id="selected" class="content-section shell home-tools">
      <SectionHeading index="01" :title="t.home.projects" :action="t.common.viewAll" to="/tools" />
      <div class="tool-grid"><ToolCard v-for="tool in featuredTools" :key="tool.slug" :tool="tool" /></div>
    </section>

    <section class="content-section shell">
      <SectionHeading index="02" :title="t.home.posts" :action="t.common.viewAll" to="/essays" />
      <div class="post-list"><PostRow v-for="post in posts" :key="post.slug" :post="post" /></div>
    </section>

    <nav class="home-secondary shell" aria-label="Secondary navigation">
      <RouterLink to="/projects">{{ t.nav.projects }} <ArrowUpRight :size="15" /></RouterLink>
      <RouterLink to="/about">{{ t.nav.about }} <ArrowUpRight :size="15" /></RouterLink>
    </nav>
  </div>
</template>
