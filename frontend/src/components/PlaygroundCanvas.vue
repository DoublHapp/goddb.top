<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const canvas = ref<HTMLCanvasElement>()
const frame = ref<HTMLElement>()
const isPaused = ref(false)
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
let animationFrame = 0
let resizeObserver: ResizeObserver | undefined
let context: CanvasRenderingContext2D | null = null
let nodes: Array<{ x: number; y: number; vx: number; vy: number; radius: number }> = []
let pointer = { x: -1000, y: -1000, active: false }

const getNodeCount = () => window.matchMedia('(max-width: 680px)').matches ? 28 : 70

const randomNode = (width: number, height: number) => ({
  x: Math.random() * width,
  y: Math.random() * height,
  vx: (Math.random() - .5) * .22,
  vy: (Math.random() - .5) * .22,
  radius: Math.random() * 1.8 + 1.2,
})

const resize = () => {
  if (!canvas.value || !frame.value) return
  const bounds = frame.value.getBoundingClientRect()
  const ratio = Math.min(window.devicePixelRatio || 1, 2)
  canvas.value.width = bounds.width * ratio
  canvas.value.height = bounds.height * ratio
  canvas.value.style.width = `${bounds.width}px`
  canvas.value.style.height = `${bounds.height}px`
  context = canvas.value.getContext('2d')
  context?.setTransform(ratio, 0, 0, ratio, 0, 0)
  const nodeCount = getNodeCount()
  if (nodes.length !== nodeCount) nodes = Array.from({ length: nodeCount }, () => randomNode(bounds.width, bounds.height))
}

const draw = () => {
  if (!context || !canvas.value || !frame.value) return
  const { width, height } = frame.value.getBoundingClientRect()
  context.clearRect(0, 0, width, height)
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#8b7cf6'
  const coral = getComputedStyle(document.documentElement).getPropertyValue('--coral').trim() || '#ff8b7b'

  nodes.forEach((node) => {
    if (!isPaused.value) {
      node.x += node.vx
      node.y += node.vy
      if (node.x < 0 || node.x > width) node.vx *= -1
      if (node.y < 0 || node.y > height) node.vy *= -1
    }
    if (pointer.active) {
      const dx = node.x - pointer.x
      const dy = node.y - pointer.y
      const distance = Math.hypot(dx, dy)
      if (distance < 100 && distance > 0) {
        node.x += dx / distance * .45
        node.y += dy / distance * .45
      }
    }
  })

  nodes.forEach((node, index) => {
    nodes.slice(index + 1).forEach((other) => {
      const distance = Math.hypot(node.x - other.x, node.y - other.y)
      if (distance > 125) return
      context!.beginPath()
      context!.moveTo(node.x, node.y)
      context!.lineTo(other.x, other.y)
      context!.strokeStyle = `rgba(139, 124, 246, ${(.18 * (1 - distance / 125)).toFixed(3)})`
      context!.lineWidth = 1
      context!.stroke()
    })
    context!.beginPath()
    context!.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
    context!.fillStyle = index % 7 === 0 ? coral : accent
    context!.globalAlpha = .75
    context!.fill()
    context!.globalAlpha = 1
  })
  if (!reducedMotion.matches && !isPaused.value && !document.hidden) animationFrame = requestAnimationFrame(draw)
}

const updatePointer = (event: PointerEvent) => {
  if (!frame.value || event.pointerType === 'touch') return
  const bounds = frame.value.getBoundingClientRect()
  pointer = { x: event.clientX - bounds.left, y: event.clientY - bounds.top, active: true }
}

const resetPointer = () => { pointer.active = false }

const render = () => {
  cancelAnimationFrame(animationFrame)
  draw()
}

const togglePaused = () => {
  isPaused.value = !isPaused.value
  render()
}

const handleVisibility = () => {
  if (document.hidden) cancelAnimationFrame(animationFrame)
  else render()
}

const handleReducedMotion = () => render()

onMounted(() => {
  resizeObserver = new ResizeObserver(resize)
  if (frame.value) resizeObserver.observe(frame.value)
  resize()
  render()
  document.addEventListener('visibilitychange', handleVisibility)
  reducedMotion.addEventListener('change', handleReducedMotion)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  cancelAnimationFrame(animationFrame)
  document.removeEventListener('visibilitychange', handleVisibility)
  reducedMotion.removeEventListener('change', handleReducedMotion)
})
</script>

<template>
  <div ref="frame" class="playground-canvas" @pointermove="updatePointer" @pointerleave="resetPointer">
    <canvas ref="canvas" aria-label="Interactive network playground" role="img"></canvas>
    <div class="playground-canvas__readout"><span>LIVE_RENDER</span><strong>{{ isPaused ? 'PAUSED' : 'ACTIVE' }}</strong></div>
    <button class="playground-canvas__toggle" type="button" :aria-label="isPaused ? 'Resume playground' : 'Pause playground'" @click="togglePaused">{{ isPaused ? 'RUN' : 'PAUSE' }}</button>
  </div>
</template>
