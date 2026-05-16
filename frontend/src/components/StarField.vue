<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let raf = 0
let resizeCleanup: (() => void) | null = null

onMounted(() => {
  const cvs = canvasRef.value
  if (!cvs) return
  const ctx = cvs.getContext('2d')
  if (!ctx) return

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    cvs.width = cvs.offsetWidth * dpr
    cvs.height = cvs.offsetHeight * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }
  resize()
  window.addEventListener('resize', resize)
  resizeCleanup = () => window.removeEventListener('resize', resize)

  type Hue = 'ivory' | 'sand' | 'slate'
  const stars = Array.from({ length: 220 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() * 1.1 + 0.2,
    twinkle: Math.random() * Math.PI * 2,
    speed: 0.0008 + Math.random() * 0.0015,
    hue: (Math.random() < 0.15 ? 'sand' : Math.random() < 0.5 ? 'ivory' : 'slate') as Hue,
  }))

  const motes = Array.from({ length: 10 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: 40 + Math.random() * 70,
    phase: Math.random() * Math.PI * 2,
  }))

  const draw = (t: number) => {
    const w = cvs.offsetWidth
    const h = cvs.offsetHeight
    ctx.clearRect(0, 0, w, h)

    for (const m of motes) {
      const px = m.x * w + Math.sin(t * 0.0001 + m.phase) * 30
      const py = m.y * h + Math.cos(t * 0.00008 + m.phase) * 20
      const grad = ctx.createRadialGradient(px, py, 0, px, py, m.r)
      grad.addColorStop(0, 'rgba(88,130,136,0.06)')
      grad.addColorStop(1, 'rgba(88,130,136,0)')
      ctx.fillStyle = grad
      ctx.fillRect(px - m.r, py - m.r, m.r * 2, m.r * 2)
    }

    for (const s of stars) {
      const px = s.x * w
      const py = s.y * h
      const alpha = (0.35 + 0.4 * Math.sin(s.twinkle + t * s.speed)).toFixed(3)
      ctx.fillStyle = s.hue === 'ivory' ? `rgba(232,227,216,${alpha})`
                    : s.hue === 'sand'  ? `rgba(200,184,152,${alpha})`
                    :                     `rgba(138,157,187,${alpha})`
      ctx.beginPath()
      ctx.arc(px, py, s.r, 0, Math.PI * 2)
      ctx.fill()
    }

    raf = requestAnimationFrame(draw)
  }
  draw(0)
})

onUnmounted(() => {
  cancelAnimationFrame(raf)
  resizeCleanup?.()
})
</script>

<template>
  <div class="starfield" aria-hidden="true">
    <canvas ref="canvasRef" class="starfield__canvas" />
    <div class="starfield__veil" />
  </div>
</template>

<style scoped>
.starfield {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
  background: radial-gradient(ellipse at 50% 30%, #131e3a 0%, #00001A 60%, #00000c 100%);
}

.starfield__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.starfield__veil {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 90%, rgba(88,130,136,0.12), transparent 50%),
    radial-gradient(circle at 85% 10%, rgba(200,184,152,0.06), transparent 45%);
}
</style>
