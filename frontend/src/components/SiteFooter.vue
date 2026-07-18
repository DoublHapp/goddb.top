<script setup lang="ts">
import { Github, Radio } from 'lucide-vue-next'
import { useLocale } from '@/composables/useLocale'

const { t } = useLocale()
</script>

<template>
  <footer class="site-footer">
    <div class="shell footer-inner">
      <p>© 2026 DB — {{ t.footer }}</p>
      <div class="footer-links">
        <span class="system-status"><Radio :size="13" /> {{ t.status }}</span>
        <a href="https://github.com/DoublHapp" target="_blank" rel="noreferrer" :aria-label="t.about.github"><Github :size="17" /></a>
      </div>
    </div>
  </footer>
</template>
