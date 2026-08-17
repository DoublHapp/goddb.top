<script setup lang="ts">
import { Menu, Moon, Sun, Volume2, VolumeX, X } from 'lucide-vue-next'
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useLocale } from '@/composables/useLocale'
import { usePhantomIntro } from '@/composables/usePhantomIntro'
import { useSound } from '@/composables/useSound'
import { useTheme } from '@/composables/useTheme'
import PhantomEyeMark from './PhantomEyeMark.vue'

const route = useRoute()
const { locale, t, toggleLocale } = useLocale()
const { isDark, toggleTheme } = useTheme()
const { isPlaying, playIntro } = usePhantomIntro()
const { enabled: soundEnabled, label: soundLabel, ariaPressed, toggleSound } = useSound()
const open = ref(false)
const menuButton = ref<HTMLButtonElement>()
const mobileNav = ref<HTMLElement>()

const navItems = [
  { path: '/', key: 'home', weak: false },
  { path: '/essays', key: 'blog', weak: false },
  { path: '/dbverse', key: 'dbverse', weak: false },
  { path: '/projects', key: 'projects', weak: false },
  { path: '/about', key: 'about', weak: false },
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
  <header class="site-header" :class="{ 'site-header--open': open, 'site-header--dbverse': route.path.startsWith('/dbverse') }">
    <div class="shell header-inner">
      <div class="brand">
        <button class="brand-mark" data-action="replay-brand" type="button" :aria-label="t.home.eyeMark.replay" :disabled="isPlaying" @click="playIntro({ manual: true })"><PhantomEyeMark /></button>
        <RouterLink to="/" @click="open = false">goddb<span class="accent">.top</span></RouterLink>
      </div>
      <nav class="desktop-nav" :aria-label="t.common.primaryNav">
        <RouterLink v-for="(item, index) in navItems" :key="item.path" :to="item.path" :class="{ active: isActive(item.path), 'nav-weak': 'weak' in item && item.weak }" :aria-current="isActive(item.path) ? 'page' : undefined">
          <span class="nav-index">0{{ index }}</span>
          {{ t.nav[item.key] }}
        </RouterLink>
      </nav>
      <div class="header-actions">
        <button class="sound-switch" data-action="sound" type="button" :aria-label="soundLabel" :aria-pressed="ariaPressed" :title="soundLabel" @click="toggleSound">
          <Volume2 v-if="soundEnabled" :size="17" /><VolumeX v-else :size="17" /><span>{{ soundLabel }}</span>
        </button>
        <button class="theme-switch" type="button" :aria-label="isDark ? t.common.lightTheme : t.common.darkTheme" :title="isDark ? t.common.lightTheme : t.common.darkTheme" @click="toggleTheme">
          <Sun v-if="isDark" :size="17" />
          <Moon v-else :size="17" />
        </button>
        <button class="language-switch" type="button" :aria-label="locale === 'zh-CN' ? 'Switch to English' : '切换到中文'" @click="toggleLocale">{{ t.language }}</button>
        <button ref="menuButton" class="menu-button" type="button" :aria-label="open ? (locale === 'zh-CN' ? '关闭菜单' : 'Close menu') : t.common.menu" :aria-expanded="open" aria-controls="mobile-navigation" @click="toggleMenu">
          <X v-if="open" :size="20" />
          <Menu v-else :size="20" />
        </button>
      </div>
    </div>
    <Transition name="mobile-menu">
      <nav v-if="open" id="mobile-navigation" ref="mobileNav" class="mobile-nav shell" :aria-label="t.common.mobileNav">
        <RouterLink v-for="item in navItems" :key="item.path" :to="item.path" :class="{ active: isActive(item.path) }" :aria-current="isActive(item.path) ? 'page' : undefined" @click="closeMenu()">
          <span>0{{ navItems.indexOf(item) }}</span>{{ t.nav[item.key] }}
        </RouterLink>
      </nav>
    </Transition>
  </header>
</template>
