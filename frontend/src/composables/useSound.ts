import { computed, readonly, ref } from 'vue'
import { useLocale } from './useLocale'
import type { PhantomIntroStage } from './usePhantomIntro'

const SOUND_KEY = 'goddb:phantom:sound-enabled'

/** 安全读取用户持久化的声音选择，首次访问默认关闭。 */
const readSoundPreference = () => {
  if (typeof localStorage === 'undefined') return false
  try {
    return localStorage.getItem(SOUND_KEY) === '1'
  } catch {
    return false
  }
}

const enabled = ref(readSoundPreference())
let context: AudioContext | undefined

/** 按需创建浏览器音频上下文，不下载或实例化外部音频资源。 */
const getAudioContext = () => {
  if (typeof window === 'undefined') return undefined
  const AudioContextConstructor = window.AudioContext
  if (!AudioContextConstructor) return undefined
  context ??= new AudioContextConstructor()
  return context
}

/**
 * 使用短振荡器合成单个无版权提示音。
 *
 * @param frequency 振荡频率。
 * @param duration 提示音时长，单位为秒。
 * @param gain 峰值音量。
 */
const synthesizeTone = (frequency: number, duration: number, gain: number) => {
  if (!enabled.value) return
  const audioContext = getAudioContext()
  if (!audioContext) return
  if (audioContext.state === 'suspended') void audioContext.resume()

  const startedAt = audioContext.currentTime
  const oscillator = audioContext.createOscillator()
  const envelope = audioContext.createGain()
  oscillator.type = 'triangle'
  oscillator.frequency.setValueAtTime(frequency, startedAt)
  envelope.gain.setValueAtTime(0.0001, startedAt)
  envelope.gain.exponentialRampToValueAtTime(gain, startedAt + 0.012)
  envelope.gain.exponentialRampToValueAtTime(0.0001, startedAt + duration)
  oscillator.connect(envelope)
  envelope.connect(audioContext.destination)
  oscillator.start(startedAt)
  oscillator.stop(startedAt + duration)
}

/**
 * 提供默认静音、持久化且由 Web Audio 即时合成的声音控制。
 *
 * @returns 声音状态、无障碍文案、切换操作和开场阶段提示音。
 */
export function useSound() {
  const { t } = useLocale()
  /** 在用户手势中切换声音并持久化选择。 */
  const toggleSound = () => {
    enabled.value = !enabled.value
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(SOUND_KEY, enabled.value ? '1' : '0')
      } catch {
        // 存储不可用时保留当前页面内的声音选择。
      }
    }
    if (enabled.value) {
      const audioContext = getAudioContext()
      if (audioContext?.state === 'suspended') void audioContext.resume()
      synthesizeTone(440, 0.055, 0.025)
    }
  }

  /**
   * 为开场关键帧播放短促的合成反馈。
   *
   * @param stage 当前 Phantom 开场阶段。
   */
  const playIntroCue = (stage: PhantomIntroStage) => {
    const cue = {
      split: [110, 0.08, 0.035],
      gaze: [196, 0.12, 0.045],
      collapse: [146, 0.07, 0.03],
      'brand-lock': [330, 0.16, 0.04],
    }[stage] as [number, number, number] | undefined
    if (cue) synthesizeTone(...cue)
  }

  return {
    enabled: readonly(enabled),
    label: computed(() => enabled.value ? t.value.home.sound.enabled : t.value.home.sound.muted),
    ariaPressed: computed(() => enabled.value ? 'true' : 'false'),
    toggleSound,
    playIntroCue,
  }
}
