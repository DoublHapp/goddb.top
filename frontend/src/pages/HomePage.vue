<script setup lang="ts">
import { ArrowDown, ArrowRight, Github, MapPin, Radio } from 'lucide-vue-next'
import PostRow from '@/components/PostRow.vue'
import ProjectCard from '@/components/ProjectCard.vue'
import SectionHeading from '@/components/SectionHeading.vue'
import TerminalBar from '@/components/TerminalBar.vue'
import { posts, profile, projects } from '@/content'
import { useLocale } from '@/composables/useLocale'
import { useSeo } from '@/composables/useSeo'

const { locale, t } = useLocale()
const featuredProjects = projects.filter((project) => project.featured)
useSeo(() => locale.value === 'zh-CN' ? '技术终端与个人作品集' : 'Technical terminal and portfolio', () => profile.intro[locale.value], '/')
</script>

<template>
  <div>
    <section class="hero shell">
      <TerminalBar command="whoami --verbose" />
      <div class="hero-grid">
        <div class="hero-copy">
          <p class="eyebrow"><Radio :size="14" /> {{ t.home.eyebrow }}</p>
          <h1>{{ t.home.titleA }}<br><span>{{ t.home.titleB }}</span></h1>
          <p class="hero-intro">{{ profile.intro[locale] }}</p>
          <div class="hero-actions">
            <RouterLink to="/projects" class="primary-button">{{ t.nav.projects }} <ArrowRight :size="17" /></RouterLink>
            <a href="https://github.com/DoublHapp" target="_blank" rel="noreferrer" class="text-link"><Github :size="17" /> GitHub</a>
          </div>
        </div>
        <aside class="signal-panel">
          <span class="panel-label">// {{ t.home.intro }}</span>
          <div class="signal-name"><i></i><strong>{{ profile.name }}</strong></div>
          <p>{{ profile.role[locale] }}</p>
          <dl>
            <div><dt>LOC</dt><dd><MapPin :size="14" /> {{ profile.location[locale] }}</dd></div>
            <div><dt>STATUS</dt><dd class="accent">{{ profile.availability[locale] }}</dd></div>
          </dl>
          <div class="skill-cloud"><span v-for="skill in profile.skills" :key="skill">{{ skill }}</span></div>
        </aside>
      </div>
      <a href="#selected" class="scroll-cue"><ArrowDown :size="16" /> SCROLL_TO_EXPLORE</a>
    </section>

    <section id="selected" class="content-section shell">
      <SectionHeading index="01" :title="t.home.projects" :action="t.common.viewAll" to="/projects" />
      <div class="project-grid"><ProjectCard v-for="project in featuredProjects" :key="project.slug" :project="project" /></div>
    </section>

    <section class="content-section shell">
      <SectionHeading index="02" :title="t.home.posts" :action="t.common.viewAll" to="/blog" />
      <div class="post-list"><PostRow v-for="post in posts" :key="post.slug" :post="post" /></div>
    </section>
  </div>
</template>
