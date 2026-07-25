import { describe, expect, it } from 'vitest'
import { degradeDbverseQuality, qualityConfigs, selectDbverseQuality } from './quality'

describe('DB宇宙渲染质量', () => {
  it.each([
    { width: 390, dpr: 1, coarsePointer: false },
    { width: 1440, dpr: 1, coarsePointer: true },
    { width: 1440, dpr: 3, coarsePointer: false },
    { width: 1440, dpr: 1, coarsePointer: false, deviceMemory: 4 },
  ])('低能力设备选择低档', (profile) => expect(selectDbverseQuality(profile)).toBe('low'))

  it('高能力设备选择高档并满足粒子目标', () => {
    expect(selectDbverseQuality({ width: 1920, dpr: 1, coarsePointer: false, deviceMemory: 16, hardwareConcurrency: 12 })).toBe('high')
    expect(qualityConfigs.high.starCount).toBe(35000)
    expect(qualityConfigs.standard.starCount).toBe(16000)
    expect(qualityConfigs.low.maxDpr).toBe(1.25)
  })

  it('运行时只会单向降级', () => {
    expect(degradeDbverseQuality('high')).toBe('standard')
    expect(degradeDbverseQuality('standard')).toBe('low')
    expect(degradeDbverseQuality('low')).toBe('low')
  })
})
