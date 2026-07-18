<script setup lang="ts">
import { Menu, Moon, Sun, X } from 'lucide-vue-next'
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useLocale } from '@/composables/useLocale'
import { useTheme } from '@/composables/useTheme'

const route = useRoute()
const { t, toggleLocale } = useLocale()
const { isDark, toggleTheme } = useTheme()
const open = ref(false)
const menuButton = ref<HTMLButtonElement>()
const mobileNav = ref<HTMLElement>()

const navItems = [
  { path: '/', key: 'home', weak: false },
  { path: '/tools', key: 'tools', weak: false },
  { path: '/essays', key: 'blog', weak: false },
  { path: '/dbverse', key: 'dbverse', weak: true },
  { path: '/projects', key: 'projects', weak: true },
  { path: '/about', key: 'about', weak: true },
] as const

const isActive = (path: string) => path === '/' ? route.path === '/' : route.path.startsWith(path)

const toggleMenu = async () => {
  open.value = !open.value
  if (!open.value) return
  await nextTick()
  mobileNav.value?.querySelector<HTMLElement>('a')?.focus()
}

const closeMenu = (restoreFocus = false) => {
  if (!open.value) return
  open.value = false
  if (restoreFocus) nextTick(() => menuButton.value?.focus())
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') closeMenu(true)
}

onMounted(() => document.addEventListener('keydown', handleKeydown))
onBeforeUnmount(() => document.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <header class="site-header" :class="{ 'site-header--open': open }">
    <div class="shell header-inner">
      <RouterLink to="/" class="brand" :aria-label="t.common.brandHome" @click="open = false">
        <img class="brand-icon" src="/goddb-icon.png" alt="">
        <span>goddb<span class="accent">.top</span></span>
      </RouterLink>
      <nav class="desktop-nav" :aria-label="t.common.primaryNav">
        <RouterLink v-for="(item, index) in navItems" :key="item.path" :to="item.path" :class="{ active: isActive(item.path), 'nav-weak': 'weak' in item && item.weak }">
          <span class="nav-index">0{{ index + 1 }}</span>
          {{ t.nav[item.key] }}
        </RouterLink>
      </nav>
      <div class="header-actions">
        <button class="theme-switch" type="button" :aria-label="isDark ? t.common.lightTheme : t.common.darkTheme" :title="isDark ? t.common.lightTheme : t.common.darkTheme" @click="toggleTheme">
          <Sun v-if="isDark" :size="17" />
          <Moon v-else :size="17" />
        </button>
        <button class="language-switch" type="button" @click="toggleLocale">{{ t.language }}</button>
        <button ref="menuButton" class="menu-button" type="button" :aria-label="t.common.menu" :aria-expanded="open" aria-controls="mobile-navigation" @click="toggleMenu">
          <X v-if="open" :size="20" />
          <Menu v-else :size="20" />
        </button>
      </div>
    </div>
    <Transition name="mobile-menu">
      <nav v-if="open" id="mobile-navigation" ref="mobileNav" class="mobile-nav shell" :aria-label="t.common.mobileNav">
        <RouterLink v-for="item in navItems" :key="item.path" :to="item.path" :class="{ active: isActive(item.path) }" @click="closeMenu()">
          <span>0{{ navItems.indexOf(item) + 1 }}</span>{{ t.nav[item.key] }}
        </RouterLink>
      </nav>
    </Transition>
  </header>
</template>
