import { computed, ref } from 'vue'
import { tools } from '@/content/tools'
import type { Tool } from '@/types/content'

const favoriteToolsKey = 'goddb:favourite-tools'
const recentToolsKey = 'goddb:recent-tools'
const toolSlugs = new Set(tools.map((tool) => tool.slug))

export function useToolLibrary() {
  const featuredTools = computed(() => tools.filter((tool) => tool.featured))
  const findTool = (slug: string) => tools.find((tool) => tool.slug === slug)
  const categories = computed(() => ['all', ...new Set(tools.map((tool) => tool.category))])
  const favorites = ref<string[]>(readStorage(favoriteToolsKey))
  const recent = ref<string[]>(readStorage(recentToolsKey))
  const write = (key: string, value: string[]) => { try { localStorage.setItem(key, JSON.stringify(value)) } catch { return false } return true }
  const toggleFavorite = (slug: string) => { if (!toolSlugs.has(slug)) return; favorites.value = favorites.value.includes(slug) ? favorites.value.filter((item) => item !== slug) : [...favorites.value, slug]; write(favoriteToolsKey, favorites.value) }
  const markRecent = (slug: string) => { if (!toolSlugs.has(slug)) return; recent.value = [slug, ...recent.value.filter((item) => item !== slug)].slice(0, 6); write(recentToolsKey, recent.value) }
  const clearRecent = () => { recent.value = []; write(recentToolsKey, recent.value) }
  const isFavorite = (slug: string) => favorites.value.includes(slug)
  return { tools, featuredTools, categories, favorites, recent, findTool, toggleFavorite, markRecent, clearRecent, isFavorite }
}

export const getTool = (slug: string): Tool | undefined => tools.find((tool) => tool.slug === slug)

function readStorage(key: string): string[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) ?? '[]')
    return Array.isArray(value) ? [...new Set(value.filter((item): item is string => typeof item === 'string' && toolSlugs.has(item)))] : []
  } catch { return [] }
}
