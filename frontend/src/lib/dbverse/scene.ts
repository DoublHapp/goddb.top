import * as THREE from 'three'
import { dbverseIps, getDbverseEntriesByIp } from '@/content/dbverse'
import type { DbverseIp, DbverseIpSlug } from '@/types/content'
import { degradeDbverseQuality, detectDbverseQuality, qualityConfigs, type DbverseQuality } from './quality'

export type DbverseSceneMode = 'overview' | 'ip' | 'detail'

export interface DbverseSceneOptions {
  canvas: HTMLCanvasElement
  mode: DbverseSceneMode
  activeIp?: DbverseIpSlug
  reducedMotion: boolean
  onContextLost: () => void
  onContextRestored: () => void
  onQualityChange: (quality: DbverseQuality) => void
}

export type DbversePickResult = { type: 'ip'; slug: DbverseIpSlug } | { type: 'entry'; slug: string }

export interface DbverseSceneController {
  resize: () => void
  tick: (time: number) => void
  setPointerTarget: (x: number, y: number) => void
  pick: (x: number, y: number) => DbversePickResult | undefined
  focusIp: (slug: DbverseIpSlug) => void
  reset: () => void
  pause: (paused: boolean) => void
  dispose: () => void
}

interface CelestialRuntime {
  root: THREE.Group
  orbitSpeed: number
  originX: number
  originY: number
  originZ: number
  escapeX: number
  escapeY: number
  escapeZ: number
}

interface BeaconRuntime {
  root: THREE.Group
  phase: number
  radius: number
  speed: number
  yOffset: number
}

const createPoints = (count: number, spread: number, color: string, size: number) => {
  const positions = new Float32Array(count * 3)
  for (let index = 0; index < count; index += 1) {
    const radius = spread * (.25 + Math.random() * .75)
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    positions[index * 3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[index * 3 + 1] = radius * Math.cos(phi) * .6
    positions[index * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta)
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const material = new THREE.PointsMaterial({ color, size, transparent: true, opacity: .75, depthWrite: false, blending: THREE.AdditiveBlending })
  return new THREE.Points(geometry, material)
}

const createCelestial = (ip: DbverseIp, asteroidCount: number) => {
  const root = new THREE.Group()
  root.name = ip.slug
  root.position.set(...ip.position)
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(ip.radius, 48, 32),
    new THREE.MeshStandardMaterial({ color: ip.celestialType === 'planet' ? '#082b61' : '#190707', roughness: .82, metalness: .12, emissive: ip.accent, emissiveIntensity: ip.celestialType === 'planet' ? .22 : .08 }),
  )
  sphere.userData.ip = ip.slug
  root.add(sphere)
  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(ip.radius * 1.09, 40, 28),
    new THREE.MeshBasicMaterial({ color: ip.accent, transparent: true, opacity: ip.celestialType === 'planet' ? .13 : .06, side: THREE.BackSide, blending: THREE.AdditiveBlending }),
  )
  root.add(atmosphere)
  if (ip.celestialType === 'planet') {
    const ring = new THREE.Mesh(new THREE.RingGeometry(ip.radius * 1.35, ip.radius * 2.15, 96), new THREE.MeshBasicMaterial({ color: ip.secondaryColor, transparent: true, opacity: .36, side: THREE.DoubleSide, blending: THREE.AdditiveBlending }))
    ring.rotation.x = Math.PI * .68
    root.add(ring)
    const moon = new THREE.Mesh(new THREE.SphereGeometry(.28, 20, 14), new THREE.MeshStandardMaterial({ color: '#a8dfff', emissive: ip.accent, emissiveIntensity: .2 }))
    moon.position.set(ip.radius * 2.45, .45, 0)
    root.add(moon)
  } else {
    const halo = new THREE.Mesh(new THREE.RingGeometry(ip.radius * 1.05, ip.radius * 1.34, 96), new THREE.MeshBasicMaterial({ color: ip.secondaryColor, transparent: true, opacity: .82, side: THREE.DoubleSide, blending: THREE.AdditiveBlending }))
    halo.lookAt(0, 0, 10)
    root.add(halo)
    const geometry = new THREE.IcosahedronGeometry(.12, 0)
    const material = new THREE.MeshStandardMaterial({ color: '#71331f', emissive: ip.accent, emissiveIntensity: .12, roughness: 1 })
    const belt = new THREE.InstancedMesh(geometry, material, asteroidCount)
    const matrix = new THREE.Matrix4()
    for (let index = 0; index < asteroidCount; index += 1) {
      const angle = index / asteroidCount * Math.PI * 2
      const radius = ip.radius * (1.6 + Math.random() * .8)
      matrix.makeScale(.5 + Math.random() * 1.6, .5 + Math.random(), .5 + Math.random() * 1.4)
      matrix.setPosition(Math.cos(angle) * radius, (Math.random() - .5) * .5, Math.sin(angle) * radius)
      belt.setMatrixAt(index, matrix)
    }
    root.add(belt)
  }
  return root
}

const createContentBeacon = (ip: DbverseIp, slug: string, index: number) => {
  const root = new THREE.Group()
  const coreGeometry = ip.slug === 'naruto' ? new THREE.SphereGeometry(.19, 18, 12) : new THREE.IcosahedronGeometry(.24, 1)
  const coreMaterial = new THREE.MeshStandardMaterial({ color: ip.slug === 'naruto' ? '#d8f5ff' : '#482014', emissive: ip.accent, emissiveIntensity: 1.4, roughness: .5 })
  const core = new THREE.Mesh(coreGeometry, coreMaterial)
  core.userData.entry = slug
  root.add(core)
  const signal = new THREE.Mesh(new THREE.RingGeometry(.34, .42, 36), new THREE.MeshBasicMaterial({ color: ip.secondaryColor, transparent: true, opacity: .78, side: THREE.DoubleSide, blending: THREE.AdditiveBlending }))
  signal.rotation.x = Math.PI * .5
  root.add(signal)
  if (ip.slug === 'naruto') {
    const satellite = new THREE.Mesh(new THREE.BoxGeometry(.12, .06, .38), new THREE.MeshBasicMaterial({ color: ip.secondaryColor }))
    satellite.position.x = .34
    root.add(satellite)
  } else {
    const trailGeometry = new THREE.BufferGeometry()
    trailGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0, 0, 0, -.5, .08, .18, -1, -.04, .38]), 3))
    root.add(new THREE.Line(trailGeometry, new THREE.LineBasicMaterial({ color: ip.secondaryColor, transparent: true, opacity: .48, blending: THREE.AdditiveBlending })))
  }
  root.userData.phase = index * 1.7
  return root
}

const createMeteorPool = (count: number) => {
  const positions = new Float32Array(count * 6)
  const velocities = new Float32Array(count * 3)
  const lives = new Float32Array(count)
  const geometry = new THREE.BufferGeometry()
  const attribute = new THREE.BufferAttribute(positions, 3)
  attribute.setUsage(THREE.DynamicDrawUsage)
  geometry.setAttribute('position', attribute)
  const material = new THREE.LineBasicMaterial({ color: '#bceaff', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })
  return { lines: new THREE.LineSegments(geometry, material), positions, velocities, lives, attribute, material, count, active: false }
}

export const createDbverseScene = (options: DbverseSceneOptions): DbverseSceneController => {
  let quality = detectDbverseQuality()
  let config = qualityConfigs[quality]
  const renderer = new THREE.WebGLRenderer({ canvas: options.canvas, antialias: quality !== 'low', alpha: false, powerPreference: quality === 'high' ? 'high-performance' : 'default' })
  const scene = new THREE.Scene()
  scene.background = new THREE.Color('#02040d')
  scene.fog = new THREE.FogExp2('#040713', .012)
  const camera = new THREE.PerspectiveCamera(48, 1, .1, 140)
  camera.position.set(0, 1.2, 17)
  scene.add(new THREE.AmbientLight('#789cff', .42))
  const keyLight = new THREE.PointLight('#b8d9ff', 18, 48)
  keyLight.position.set(-2, 7, 10)
  scene.add(keyLight)
  const stars = createPoints(config.starCount, 66, '#b9d5ff', quality === 'low' ? .045 : .035)
  scene.add(stars)
  const nebulae: THREE.Points[] = []
  for (let index = 0; index < config.nebulaCount; index += 1) {
    const nebula = createPoints(700, 24, index % 2 ? '#7e3cff' : '#1266bb', .09)
    nebula.scale.set(1.8, .22, .8)
    nebula.rotation.z = index * 1.7
    nebulae.push(nebula)
    scene.add(nebula)
  }
  const shownIps = options.mode === 'overview' ? dbverseIps : dbverseIps.filter((ip) => ip.slug === options.activeIp)
  const roots = new Map<DbverseIpSlug, CelestialRuntime>()
  const pickTargets: THREE.Object3D[] = []
  shownIps.forEach((ip) => {
    const adjusted = options.mode === 'overview' ? ip : { ...ip, position: [0, 0, 0] as [number, number, number], radius: options.mode === 'detail' ? ip.radius * 1.25 : ip.radius * 1.55 }
    const root = createCelestial(adjusted, config.asteroidCount)
    const escapeDirection = ip.position[0] < 0 ? -1 : 1
    roots.set(ip.slug, { root, orbitSpeed: ip.orbitSpeed, originX: root.position.x, originY: root.position.y, originZ: root.position.z, escapeX: escapeDirection * 18, escapeY: 5 + ip.position[1] * 2, escapeZ: -18 })
    pickTargets.push(root.children[0] as THREE.Object3D)
    scene.add(root)
  })
  const beacons: BeaconRuntime[] = []
  if (options.mode === 'ip' && options.activeIp) {
    const activeConfig = dbverseIps.find((ip) => ip.slug === options.activeIp)
    if (activeConfig) getDbverseEntriesByIp(options.activeIp).forEach((entry, index) => {
      const root = createContentBeacon(activeConfig, entry.slug, index)
      beacons.push({ root, phase: index * 1.7, radius: activeConfig.radius * (2.35 + index * .28), speed: activeConfig.slug === 'naruto' ? .34 : .22, yOffset: (index % 2 ? -.45 : .5) })
      pickTargets.push(root.children[0] as THREE.Object3D)
      scene.add(root)
    })
  }
  if (options.activeIp === 'sekiro') {
    const embers = createPoints(qualityConfigs[quality].starCount / 8, 9, '#ff6b2d', .055)
    scene.add(embers)
  }
  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()
  const pointerTarget = new THREE.Vector2()
  const cameraTarget = new THREE.Vector3(0, .2, 0)
  const desiredCamera = new THREE.Vector3(0, 1.2, options.mode === 'overview' ? 17 : 12)
  const renderedCamera = new THREE.Vector3()
  const cameraOffset = new THREE.Vector3()
  const unitScale = new THREE.Vector3(1, 1, 1)
  const hiddenScale = new THREE.Vector3(.001, .001, .001)
  const meteorPool = createMeteorPool(quality === 'low' ? 18 : 36)
  scene.add(meteorPool.lines)
  let paused = false
  let disposed = false
  let focused: DbverseIpSlug | undefined
  let lastTime = performance.now()
  let slowFrames = 0
  let elapsed = 0
  const speed = options.reducedMotion ? .1 : 1

  const launchMeteors = (originX: number, originY: number, originZ: number) => {
    if (options.reducedMotion) return
    for (let index = 0; index < meteorPool.count; index += 1) {
      const offset = index * 6
      const velocityOffset = index * 3
      const angle = index / meteorPool.count * Math.PI * 2 + Math.random() * .25
      const velocity = 7 + Math.random() * 9
      meteorPool.positions[offset] = originX
      meteorPool.positions[offset + 1] = originY
      meteorPool.positions[offset + 2] = originZ
      meteorPool.positions[offset + 3] = originX
      meteorPool.positions[offset + 4] = originY
      meteorPool.positions[offset + 5] = originZ
      meteorPool.velocities[velocityOffset] = Math.cos(angle) * velocity
      meteorPool.velocities[velocityOffset + 1] = Math.sin(angle) * velocity * .48
      meteorPool.velocities[velocityOffset + 2] = -5 - Math.random() * 7
      meteorPool.lives[index] = .65 + Math.random() * .55
    }
    meteorPool.material.opacity = .92
    meteorPool.active = true
    meteorPool.attribute.needsUpdate = true
  }

  const resize = () => {
    const width = options.canvas.clientWidth || window.innerWidth
    const height = options.canvas.clientHeight || window.innerHeight
    camera.aspect = width / Math.max(height, 1)
    camera.updateProjectionMatrix()
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, config.maxDpr))
    renderer.setSize(width, height, false)
  }
  const tick = (time: number) => {
    if (disposed || paused) return
    const delta = Math.min((time - lastTime) / 1000, .05)
    lastTime = time
    elapsed += delta * speed
    if (delta > .032) slowFrames += 1
    else slowFrames = Math.max(0, slowFrames - 2)
    if (slowFrames > 180 && quality !== 'low') {
      quality = degradeDbverseQuality(quality)
      config = qualityConfigs[quality]
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, config.maxDpr))
      options.onQualityChange(quality)
      slowFrames = 0
    }
    stars.rotation.y += delta * .008 * speed
    nebulae.forEach((nebula, index) => { nebula.rotation.y += delta * (.002 + index * .001) * speed })
    roots.forEach((runtime, slug) => {
      const root = runtime.root
      root.rotation.y += delta * runtime.orbitSpeed * speed
      if (focused && slug !== focused) {
        root.position.x += (runtime.escapeX - root.position.x) * (options.reducedMotion ? .006 : .055)
        root.position.y += (runtime.escapeY - root.position.y) * (options.reducedMotion ? .006 : .055)
        root.position.z += (runtime.escapeZ - root.position.z) * (options.reducedMotion ? .006 : .055)
        root.scale.lerp(hiddenScale, options.reducedMotion ? .006 : .045)
      } else {
        root.position.x += (runtime.originX - root.position.x) * .055
        root.position.y += (runtime.originY - root.position.y) * .055
        root.position.z += (runtime.originZ - root.position.z) * .055
        root.scale.lerp(unitScale, .06)
      }
      root.visible = !focused || slug === focused || root.scale.x > .02
    })
    beacons.forEach((beacon, index) => {
      const angle = elapsed * beacon.speed + beacon.phase
      beacon.root.position.set(Math.cos(angle) * beacon.radius, beacon.yOffset + Math.sin(angle * 1.7) * .28, Math.sin(angle) * beacon.radius * .48)
      beacon.root.rotation.y = -angle + index * .3
      beacon.root.children[1]?.rotation.set(Math.PI * .5, 0, elapsed * 1.8)
    })
    if (meteorPool.active) {
      let alive = 0
      for (let index = 0; index < meteorPool.count; index += 1) {
        if (meteorPool.lives[index] <= 0) continue
        alive += 1
        meteorPool.lives[index] -= delta
        const offset = index * 6
        const velocityOffset = index * 3
        meteorPool.positions[offset + 3] = meteorPool.positions[offset]
        meteorPool.positions[offset + 4] = meteorPool.positions[offset + 1]
        meteorPool.positions[offset + 5] = meteorPool.positions[offset + 2]
        meteorPool.positions[offset] += meteorPool.velocities[velocityOffset] * delta
        meteorPool.positions[offset + 1] += meteorPool.velocities[velocityOffset + 1] * delta
        meteorPool.positions[offset + 2] += meteorPool.velocities[velocityOffset + 2] * delta
      }
      meteorPool.material.opacity = Math.min(.92, alive / meteorPool.count * 1.5)
      meteorPool.attribute.needsUpdate = true
      meteorPool.active = alive > 0
    }
    cameraOffset.set(pointerTarget.x * .35, pointerTarget.y * .2, 0)
    renderedCamera.copy(desiredCamera).add(cameraOffset)
    camera.position.lerp(renderedCamera, options.reducedMotion ? .008 : .04)
    camera.lookAt(cameraTarget)
    renderer.render(scene, camera)
  }
  const focusIp = (slug: DbverseIpSlug) => {
    const runtime = roots.get(slug)
    if (!runtime) return
    focused = slug
    cameraTarget.copy(runtime.root.position)
    desiredCamera.set(runtime.root.position.x * .4, runtime.root.position.y + .4, options.reducedMotion ? 13 : 8.5)
    roots.forEach((other, otherSlug) => { if (otherSlug !== slug) launchMeteors(other.root.position.x, other.root.position.y, other.root.position.z) })
  }
  const reset = () => {
    focused = undefined
    meteorPool.active = false
    meteorPool.material.opacity = 0
    cameraTarget.set(0, .2, 0)
    desiredCamera.set(0, 1.2, options.mode === 'overview' ? 17 : 12)
  }
  const contextLost = (event: Event) => { event.preventDefault(); paused = true; options.onContextLost() }
  const contextRestored = () => { paused = false; resize(); options.onContextRestored() }
  options.canvas.addEventListener('webglcontextlost', contextLost)
  options.canvas.addEventListener('webglcontextrestored', contextRestored)
  resize()
  return {
    resize,
    tick,
    setPointerTarget: (x, y) => pointerTarget.set(x, y),
    pick: (x, y) => {
      pointer.set(x, y)
      raycaster.setFromCamera(pointer, camera)
      const data = raycaster.intersectObjects(pickTargets, false)[0]?.object.userData
      if (data?.ip) return { type: 'ip', slug: data.ip as DbverseIpSlug }
      if (data?.entry) return { type: 'entry', slug: data.entry as string }
      return undefined
    },
    focusIp,
    reset,
    pause: (value) => { paused = value; lastTime = performance.now() },
    dispose: () => {
      disposed = true
      options.canvas.removeEventListener('webglcontextlost', contextLost)
      options.canvas.removeEventListener('webglcontextrestored', contextRestored)
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh
        mesh.geometry?.dispose()
        const materials = Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : []
        materials.forEach((material) => {
          Object.values(material).forEach((value) => { if ((value as { isTexture?: boolean })?.isTexture) (value as THREE.Texture).dispose() })
          material.dispose()
        })
      })
      renderer.dispose()
      renderer.forceContextLoss()
    },
  }
}
