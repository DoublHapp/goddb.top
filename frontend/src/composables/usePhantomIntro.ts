import { computed, readonly, ref } from 'vue'
import type { MotionPreference } from './useReducedMotion'

export type PhantomIntroStage = 'idle' | 'split' | 'gaze' | 'collapse' | 'brand-lock'

export interface PlayPhantomIntroOptions {
  manual?: boolean
}

const INTRO_SEEN_KEY = 'goddb:phantom:intro-seen'
const REDUCED_QUERY = '(prefers-reduced-motion: reduce)'
const WATCHDOG_MS = 1250
const timeline = [
  { at: 100, stage: 'split' },
  { at: 280, stage: 'gaze' },
  { at: 640, stage: 'collapse' },
] as const satisfies ReadonlyArray<{ at: number, stage: PhantomIntroStage }>

/** 安全读取本标签页是否已经完成过开场。 */
const hasSeenIntro = () => {
  if (typeof sessionStorage === 'undefined') return false
  try {
    return sessionStorage.getItem(INTRO_SEEN_KEY) === '1'
  } catch {
    return false
  }
}

const stage = ref<PhantomIntroStage>(hasSeenIntro() ? 'brand-lock' : 'idle')
const isPlaying = ref(false)
const motion = ref<MotionPreference>('full')
let runId = 0
let timers: ReturnType<typeof setTimeout>[] = []
let resolvePlayback: (() => void) | undefined

/** 清理当前时间线的全部阶段任务。 */
const clearTimeline = () => {
  timers.forEach((timer) => clearTimeout(timer))
  timers = []
}

/** 将开场原子化收束到可交互的品牌锁定状态。 */
const finishIntro = () => {
  clearTimeline()
  stage.value = 'brand-lock'
  isPlaying.value = false
  if (typeof sessionStorage !== 'undefined') {
    try {
      sessionStorage.setItem(INTRO_SEEN_KEY, '1')
    } catch {
      // 浏览器禁用存储时仍应正常完成开场。
    }
  }
  resolvePlayback?.()
  resolvePlayback = undefined
}

/**
 * 提供 Phantom 开场的共享连续时间线。
 *
 * @returns 当前阶段、播放状态、动效偏好以及播放和跳过操作。
 */
export function usePhantomIntro() {
  const shouldAutoPlay = computed(() => !hasSeenIntro())

  /**
   * 从统一时间原点启动开场，避免串行等待导致阶段漂移。
   *
   * @param options 手动重播时传入 `manual: true`，可越过会话去重。
   * @returns 在品牌锁定或跳过后完成的 Promise。
   */
  const playIntro = (options: PlayPhantomIntroOptions = {}): Promise<void> => {
    if (!options.manual && hasSeenIntro()) {
      finishIntro()
      return Promise.resolve()
    }

    runId += 1
    clearTimeline()
    resolvePlayback?.()
    const currentRun = runId
    motion.value = typeof window !== 'undefined' && window.matchMedia(REDUCED_QUERY).matches ? 'reduced' : 'full'
    isPlaying.value = true

    const playback = new Promise<void>((resolve) => {
      resolvePlayback = resolve
    })

    if (motion.value === 'reduced') {
      stage.value = 'gaze'
      timers.push(setTimeout(() => {
        if (currentRun === runId) finishIntro()
      }, 480))
      return playback
    }

    stage.value = 'idle'
    timeline.forEach((entry) => {
      timers.push(setTimeout(() => {
        if (currentRun === runId) stage.value = entry.stage
      }, entry.at))
    })
    timers.push(setTimeout(() => {
      if (currentRun === runId) finishIntro()
    }, 1000))
    timers.push(setTimeout(() => {
      if (currentRun === runId && isPlaying.value) finishIntro()
    }, WATCHDOG_MS))
    return playback
  }

  /** 立即取消当前演出并进入品牌锁定状态。 */
  const skipIntro = () => {
    runId += 1
    finishIntro()
  }

  return {
    stage: readonly(stage),
    isPlaying: readonly(isPlaying),
    shouldAutoPlay,
    motion: readonly(motion),
    playIntro,
    skipIntro,
  }
}
