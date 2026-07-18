<script setup lang="ts">
import { CheckCircle2, Github } from 'lucide-vue-next'
import { profile } from '@/content'
import { useLocale } from '@/composables/useLocale'
import { useSeo } from '@/composables/useSeo'

const { locale, t } = useLocale()
useSeo(() => t.value.nav.about, () => t.value.about.bio, '/about')
</script>

<template>
  <section class="page shell">
    <p class="eyebrow">{{ t.about.eyebrow }}</p>
    <div class="page-lead split-lead"><h1>{{ t.about.title }}</h1><p>{{ t.about.bio }}</p></div>
    <div class="about-grid">
      <article class="profile-block">
        <span class="panel-label">// {{ t.about.identity }}</span>
        <h2>{{ profile.name }}</h2><p>{{ profile.role[locale] }}</p>
        <div class="profile-links"><a href="https://github.com/DoublHapp" target="_blank" rel="noreferrer"><Github :size="17" /> {{ t.about.github }}</a></div>
      </article>
      <article class="matrix-block"><h2>{{ t.about.capabilities }}</h2><div class="matrix"><span v-for="skill in profile.skills" :key="skill">{{ skill }}<i></i></span></div></article>
      <article class="principles-block"><h2>{{ t.about.principles }}</h2><ul><li v-for="fact in t.about.facts" :key="fact"><CheckCircle2 :size="17" />{{ fact }}</li></ul></article>
    </div>
  </section>
</template>
