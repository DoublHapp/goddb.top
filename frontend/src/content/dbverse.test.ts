import { describe, expect, it } from 'vitest'
import { dbverseEntries, dbverseIps, getDbverseEntriesByIp, getDbverseIp } from './dbverse'

describe('DB宇宙 IP 内容注册', () => {
  it('只开放唯一的火影与只狼星域', () => {
    expect(dbverseIps.map((ip) => ip.slug)).toEqual(['naruto', 'sekiro'])
    expect(new Set(dbverseIps.map((ip) => ip.slug)).size).toBe(dbverseIps.length)
  })

  it('每条内容均指向存在且有真实内容的 IP', () => {
    dbverseEntries.forEach((entry) => expect(getDbverseIp(entry.ip)).toBeDefined())
    dbverseIps.forEach((ip) => expect(getDbverseEntriesByIp(ip.slug).length).toBeGreaterThan(0))
  })

  it('火影与只狼内容映射正确且不再使用 section', () => {
    expect(getDbverseEntriesByIp('naruto').map((entry) => entry.slug)).toEqual(['naruto-blue-bird-memory'])
    expect(getDbverseEntriesByIp('sekiro').map((entry) => entry.slug)).toEqual(['sekiro-immortality-story'])
    dbverseEntries.forEach((entry) => expect(entry).not.toHaveProperty('section'))
  })
})
