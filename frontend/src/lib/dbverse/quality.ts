export type DbverseQuality = 'high' | 'standard' | 'low'

export interface DbverseQualityConfig {
  starCount: number
  asteroidCount: number
  nebulaCount: number
  maxDpr: number
  glow: boolean
}

export interface DbverseDeviceProfile {
  width: number
  dpr: number
  coarsePointer: boolean
  deviceMemory?: number
  hardwareConcurrency?: number
}

export const qualityConfigs: Record<DbverseQuality, DbverseQualityConfig> = {
  high: { starCount: 35000, asteroidCount: 180, nebulaCount: 3, maxDpr: 2, glow: true },
  standard: { starCount: 16000, asteroidCount: 90, nebulaCount: 2, maxDpr: 1.6, glow: true },
  low: { starCount: 5000, asteroidCount: 32, nebulaCount: 1, maxDpr: 1.25, glow: false },
}

export const selectDbverseQuality = (profile: DbverseDeviceProfile): DbverseQuality => {
  if (profile.width < 680 || profile.coarsePointer || profile.dpr > 2.5 || (profile.deviceMemory ?? 8) <= 4 || (profile.hardwareConcurrency ?? 8) <= 4) return 'low'
  if (profile.width < 1200 || profile.dpr > 1.75 || (profile.deviceMemory ?? 8) < 8 || (profile.hardwareConcurrency ?? 8) < 8) return 'standard'
  return 'high'
}

export const degradeDbverseQuality = (quality: DbverseQuality): DbverseQuality => quality === 'high' ? 'standard' : 'low'

export const detectDbverseQuality = (): DbverseQuality => selectDbverseQuality({
  width: window.innerWidth,
  dpr: window.devicePixelRatio || 1,
  coarsePointer: window.matchMedia('(pointer: coarse)').matches,
  deviceMemory: (navigator as Navigator & { deviceMemory?: number }).deviceMemory,
  hardwareConcurrency: navigator.hardwareConcurrency,
})
