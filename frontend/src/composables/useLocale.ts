import { computed, readonly, ref } from 'vue'
import { messages } from '@/locales/messages'
import type { Locale } from '@/types/content'

const savedLocale = localStorage.getItem('locale')
const locale = ref<Locale>(savedLocale === 'en' ? 'en' : 'zh-CN')

export function useLocale() {
  const t = computed(() => messages[locale.value])

  const toggleLocale = () => {
    locale.value = locale.value === 'zh-CN' ? 'en' : 'zh-CN'
    localStorage.setItem('locale', locale.value)
    document.documentElement.lang = locale.value
  }

  return { locale: readonly(locale), t, toggleLocale }
}
