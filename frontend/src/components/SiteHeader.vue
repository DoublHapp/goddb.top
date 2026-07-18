<script setup lang="ts">
import { Menu, Moon, Sun, X } from 'lucide-vue-next'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useLocale } from '@/composables/useLocale'
import { useTheme } from '@/composables/useTheme'

const route = useRoute()
const { t, toggleLocale } = useLocale()
const { isDark, toggleTheme } = useTheme()
const open = ref(false)

const navItems = [
  { path: '/', key: 'home' },
  { path: '/about', key: 'about' },
  { path: '/projects', key: 'projects' },
  { path: '/blog', key: 'blog' },
] as const

const isActive = (path: string) => path === '/' ? route.path === '/' : route.path.startsWith(path)
</script>

<template>
  <header class="site-header">
    <div class="shell header-inner">
      <RouterLink to="/" class="brand" aria-label="DoublHapp home" @click="open = false">
        <span class="brand-mark">&gt;_</span>
        <span>goddb<span class="accent">.top</span></span>
      </RouterLink>
      <nav class="desktop-nav" aria-label="Primary navigation">
        <RouterLink v-for="item in navItems" :key="item.path" :to="item.path" :class="{ active: isActive(item.path) }">
          {{ t.nav[item.key] }}
        </RouterLink>
      </nav>
      <div class="header-actions">
        <button class="theme-switch" type="button" :aria-label="isDark ? t.common.lightTheme : t.common.darkTheme" :title="isDark ? t.common.lightTheme : t.common.darkTheme" @click="toggleTheme">
          <Sun v-if="isDark" :size="17" />
          <Moon v-else :size="17" />
        </button>
        <button class="language-switch" type="button" @click="toggleLocale">{{ t.language }}</button>
        <button class="menu-button" type="button" :aria-label="t.common.menu" :aria-expanded="open" @click="open = !open">
          <X v-if="open" :size="20" />
          <Menu v-else :size="20" />
        </button>
      </div>
    </div>
    <nav v-if="open" class="mobile-nav shell" aria-label="Mobile navigation">
      <RouterLink v-for="item in navItems" :key="item.path" :to="item.path" :class="{ active: isActive(item.path) }" @click="open = false">
        <span>0{{ navItems.indexOf(item) + 1 }}</span>{{ t.nav[item.key] }}
      </RouterLink>
    </nav>
  </header>
</template>
