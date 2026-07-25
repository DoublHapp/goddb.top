import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('DB宇宙场景热路径', () => {
  const scenePath = resolve(process.cwd(), 'src/lib/dbverse/scene.ts')

  it('tick 不创建 Vector、Geometry 或 Material', () => {
    const source = readFileSync(scenePath, 'utf8')
    const tick = source.slice(source.indexOf('const tick ='), source.indexOf('const focusIp ='))
    expect(tick).not.toMatch(/new THREE\.(Vector|BufferGeometry|.*Material)/)
    expect(tick).not.toContain('.clone()')
  })

  it('流星采用预分配动态缓冲池', () => {
    const source = readFileSync(scenePath, 'utf8')
    expect(source).toContain('THREE.DynamicDrawUsage')
    expect(source).toContain('const meteorPool = createMeteorPool')
    expect(source).toContain('meteorPool.attribute.needsUpdate = true')
  })
})
