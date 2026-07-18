import { computed, ref } from 'vue'

type Theme = 'light' | 'dark'

const media = typeof window === 'undefined' ? undefined : window.matchMedia('(prefers-color-scheme: dark)')

const getPreferredTheme = (): Theme => {
  if (typeof window === 'undefined') return 'dark'
  const saved = localStorage.getItem('theme') as Theme | null
  if (saved === 'light' || saved === 'dark') return saved
  return media?.matches ? 'dark' : 'light'
}

const theme = ref<Theme>(getPreferredTheme())

const applyTheme = (value: Theme) => {
  if (typeof document === 'undefined') return
  document.documentElement.dataset.theme = value
  document.documentElement.style.colorScheme = value
}

applyTheme(theme.value)
media?.addEventListener('change', (event) => {
  if (localStorage.getItem('theme')) return
  theme.value = event.matches ? 'dark' : 'light'
  applyTheme(theme.value)
})

export function useTheme() {
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    localStorage.setItem('theme', theme.value)
    applyTheme(theme.value)
  }

  return {
    theme,
    toggleTheme,
    isDark: computed(() => theme.value === 'dark'),
  }
}
