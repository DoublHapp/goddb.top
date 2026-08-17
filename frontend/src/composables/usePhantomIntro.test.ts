import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const INTRO_SEEN_KEY = 'goddb:phantom:intro-seen'

const setReducedMotion = (matches: boolean) => vi.stubGlobal('matchMedia', vi.fn(() => ({
  matches,
  media: '(prefers-reduced-motion: reduce)',
  onchange: null,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  addListener: vi.fn(),
  removeListener: vi.fn(),
  dispatchEvent: vi.fn(),
})))

const loadIntro = async () => {
  vi.resetModules()
  return import('./usePhantomIntro')
}

beforeEach(() => {
  vi.useFakeTimers()
  sessionStorage.clear()
  setReducedMotion(false)
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('usePhantomIntro 开场状态机', () => {
  it('按 idle、split、gaze、collapse、brand-lock 顺序完成首次开场', async () => {
    const { usePhantomIntro } = await loadIntro()
    const intro = usePhantomIntro()

    expect(intro.stage.value).toBe('idle')
    const playback = intro.playIntro()
    expect(intro.isPlaying.value).toBe(true)

    await vi.advanceTimersByTimeAsync(100)
    expect(intro.stage.value).toBe('split')
    await vi.advanceTimersByTimeAsync(180)
    expect(intro.stage.value).toBe('gaze')
    await vi.advanceTimersByTimeAsync(360)
    expect(intro.stage.value).toBe('collapse')
    await vi.advanceTimersByTimeAsync(360)
    await playback

    expect(intro.stage.value).toBe('brand-lock')
    expect(intro.isPlaying.value).toBe(false)
    expect(sessionStorage.getItem(INTRO_SEEN_KEY)).toBe('1')
  })

  it('同一标签页会话不重复自动播放，但允许手动重播', async () => {
    sessionStorage.setItem(INTRO_SEEN_KEY, '1')
    const { usePhantomIntro } = await loadIntro()
    const intro = usePhantomIntro()

    expect(intro.shouldAutoPlay.value).toBe(false)
    expect(intro.stage.value).toBe('brand-lock')

    const playback = intro.playIntro({ manual: true })
    expect(intro.isPlaying.value).toBe(true)
    await vi.runAllTimersAsync()
    await playback
    expect(intro.stage.value).toBe('brand-lock')
  })

  it('跳过与异常看门狗都立即收束到品牌锁定状态', async () => {
    const { usePhantomIntro } = await loadIntro()
    const intro = usePhantomIntro()

    void intro.playIntro()
    intro.skipIntro()
    expect(intro.stage.value).toBe('brand-lock')
    expect(intro.isPlaying.value).toBe(false)

    void intro.playIntro({ manual: true })
    await vi.advanceTimersByTimeAsync(1250)
    expect(intro.stage.value).toBe('brand-lock')
    expect(intro.isPlaying.value).toBe(false)
  })

  it('低动态模式省略裂屏阶段并保留静态凝视', async () => {
    setReducedMotion(true)
    const { usePhantomIntro } = await loadIntro()
    const intro = usePhantomIntro()
    const playback = intro.playIntro()

    expect(intro.motion.value).toBe('reduced')
    expect(intro.stage.value).toBe('gaze')
    await vi.runAllTimersAsync()
    await playback
    expect(intro.stage.value).toBe('brand-lock')
  })

})
