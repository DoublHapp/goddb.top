<script setup lang="ts">
import { ArrowUpRight, Github, Radio } from 'lucide-vue-next'
import { useLocale } from '@/composables/useLocale'
import PhantomEyeMark from './PhantomEyeMark.vue'

const { t } = useLocale()
</script>

<template>
  <footer class="site-footer">
    <div class="shell footer-inner">
      <div class="footer-signature"><PhantomEyeMark /><p><strong>GODDB.TOP</strong><span>© 2026 DB — {{ t.footer }}</span></p></div>
      <nav class="footer-nav" :aria-label="t.common.mobileNav"><RouterLink to="/essays">{{ t.nav.blog }}</RouterLink><RouterLink to="/dbverse">{{ t.nav.dbverse }}</RouterLink><RouterLink to="/projects">{{ t.nav.projects }}</RouterLink><RouterLink to="/about">{{ t.nav.about }}</RouterLink></nav>
      <div class="footer-links">
        <span class="system-status"><Radio :size="13" /> {{ t.status }}</span>
        <a href="https://github.com/DoublHapp" target="_blank" rel="noreferrer" :aria-label="t.about.github"><Github :size="17" /><ArrowUpRight :size="13" /></a>
      </div>
    </div>
  </footer>
</template>
