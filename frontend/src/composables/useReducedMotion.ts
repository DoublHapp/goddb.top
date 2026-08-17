import { onBeforeUnmount, onMounted, readonly, ref, type Ref } from 'vue'

export type MotionPreference = 'full' | 'reduced'

const QUERY = '(prefers-reduced-motion: reduce)'

/**
 * 读取并持续跟踪系统的低动态偏好。
 *
 * @returns 低动态布尔值与可直接用于状态标记的动效模式。
 */
export function useReducedMotion(): {
  prefersReducedMotion: Readonly<Ref<boolean>>
  motion: Readonly<Ref<MotionPreference>>
} {
  const media = typeof window === 'undefined' ? undefined : window.matchMedia(QUERY)
  const prefersReducedMotion = ref(media?.matches ?? false)
  const motion = ref<MotionPreference>(prefersReducedMotion.value ? 'reduced' : 'full')

  /** 同步媒体查询结果，确保运行期间修改系统设置也能即时生效。 */
  const updatePreference = (event?: MediaQueryListEvent) => {
    prefersReducedMotion.value = event?.matches ?? media?.matches ?? false
    motion.value = prefersReducedMotion.value ? 'reduced' : 'full'
  }

  onMounted(() => {
    updatePreference()
    media?.addEventListener('change', updatePreference)
  })
  onBeforeUnmount(() => media?.removeEventListener('change', updatePreference))

  return {
    prefersReducedMotion: readonly(prefersReducedMotion),
    motion: readonly(motion),
  }
}
