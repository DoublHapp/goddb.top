import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const SOUND_KEY = 'goddb:phantom:sound-enabled'

const loadSound = async () => {
  vi.resetModules()
  return import('./useSound')
}

beforeEach(() => localStorage.clear())

afterEach(() => vi.restoreAllMocks())

describe('useSound 声音偏好', () => {
  it('首次访问默认静音且不创建音频实例', async () => {
    const audio = vi.spyOn(window, 'Audio')
    const { useSound } = await loadSound()
    const sound = useSound()

    expect(sound.enabled.value).toBe(false)
    expect(sound.label.value).toBe('静音')
    expect(audio).not.toHaveBeenCalled()
  })

  it('切换声音时同步 aria 状态与本地持久化', async () => {
    const { useSound } = await loadSound()
    const sound = useSound()

    sound.toggleSound()
    expect(sound.enabled.value).toBe(true)
    expect(sound.label.value).toBe('声音已开启')
    expect(sound.ariaPressed.value).toBe('true')
    expect(localStorage.getItem(SOUND_KEY)).toBe('1')

    sound.toggleSound()
    expect(sound.enabled.value).toBe(false)
    expect(sound.ariaPressed.value).toBe('false')
    expect(localStorage.getItem(SOUND_KEY)).toBe('0')
  })

  it('新实例恢复已保存的开启状态', async () => {
    localStorage.setItem(SOUND_KEY, '1')
    const { useSound } = await loadSound()
    const sound = useSound()

    expect(sound.enabled.value).toBe(true)
    expect(sound.label.value).toBe('声音已开启')
  })
})
