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
  type Star = {
    x: number; y: number; r: number
    twinkle: number; speed: number; hue: Hue
    dx: number; dy: number
  }

  const stars: Star[] = Array.from({ length: 220 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() * 1.1 + 0.2,
    twinkle: Math.random() * Math.PI * 2,
    speed: 0.0012 + Math.random() * 0.0022,
    hue: (Math.random() < 0.15 ? 'sand' : Math.random() < 0.5 ? 'ivory' : 'slate') as Hue,
    dx: (Math.random() - 0.5) * 0.000006,
    dy: (Math.random() - 0.5) * 0.000006,
  }))

  const motes = Array.from({ length: 10 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: 40 + Math.random() * 70,
    phase: Math.random() * Math.PI * 2,
  }))

  type Meteor = {
    x0: number; y0: number
    x1: number; y1: number
    startT: number
    duration: number
  }

  let meteors: Meteor[] = []
  let nextMeteorTime = 1500 + Math.random() * 2000
  let prevT = 0

  function spawnMeteor(t: number) {
    const angle = (20 + Math.random() * 25) * Math.PI / 180
    const dist = 0.28 + Math.random() * 0.2
    const x0 = Math.random() * 0.75
    const y0 = Math.random() * 0.35
    meteors.push({
      x0, y0,
      x1: x0 + Math.cos(angle) * dist,
      y1: y0 + Math.sin(angle) * dist,
      startT: t,
      duration: 550 + Math.random() * 350,
    })
    nextMeteorTime = t + 5000 + Math.random() * 8000
  }

  const draw = (t: number) => {
    const dt = prevT === 0 ? 16 : Math.min(t - prevT, 50)
    prevT = t

    const w = cvs.offsetWidth
    const h = cvs.offsetHeight
    ctx.clearRect(0, 0, w, h)

    // Nebula motes
    for (const m of motes) {
      const px = m.x * w + Math.sin(t * 0.0001 + m.phase) * 30
      const py = m.y * h + Math.cos(t * 0.00008 + m.phase) * 20
      const grad = ctx.createRadialGradient(px, py, 0, px, py, m.r)
      grad.addColorStop(0, 'rgba(88,130,136,0.06)')
      grad.addColorStop(1, 'rgba(88,130,136,0)')
      ctx.fillStyle = grad
      ctx.fillRect(px - m.r, py - m.r, m.r * 2, m.r * 2)
    }

    // Stars: drift + twinkle
    for (const s of stars) {
      s.x += s.dx * dt
      s.y += s.dy * dt
      if (s.x < -0.02) s.x = 1.02
      if (s.x > 1.02) s.x = -0.02
      if (s.y < -0.02) s.y = 1.02
      if (s.y > 1.02) s.y = -0.02

      const px = s.x * w
      const py = s.y * h
      const alpha = 0.2 + 0.7 * ((Math.sin(s.twinkle + t * s.speed) + 1) / 2)

      ctx.fillStyle = s.hue === 'ivory' ? `rgba(232,227,216,${alpha.toFixed(3)})`
                    : s.hue === 'sand'  ? `rgba(200,184,152,${alpha.toFixed(3)})`
                    :                     `rgba(138,157,187,${alpha.toFixed(3)})`
      ctx.beginPath()
      ctx.arc(px, py, s.r, 0, Math.PI * 2)
      ctx.fill()

      // Occasional faint glow on bright ivory stars
      if (s.hue === 'ivory' && s.r > 0.9 && alpha > 0.75) {
        ctx.beginPath()
        ctx.arc(px, py, s.r * 3, 0, Math.PI * 2)
        const glow = ctx.createRadialGradient(px, py, 0, px, py, s.r * 3)
        glow.addColorStop(0, `rgba(232,227,216,${(alpha * 0.12).toFixed(3)})`)
        glow.addColorStop(1, 'rgba(232,227,216,0)')
        ctx.fillStyle = glow
        ctx.fill()
      }
    }

    // Spawn meteors
    if (t >= nextMeteorTime) spawnMeteor(t)

    // Draw meteors
    meteors = meteors.filter(m => {
      const progress = (t - m.startT) / m.duration
      if (progress >= 1) return false

      const alpha = Math.sin(progress * Math.PI)
      const headX = (m.x0 + (m.x1 - m.x0) * progress) * w
      const headY = (m.y0 + (m.y1 - m.y0) * progress) * h
      const tailProgress = Math.max(0, progress - 0.35)
      const tailX = (m.x0 + (m.x1 - m.x0) * tailProgress) * w
      const tailY = (m.y0 + (m.y1 - m.y0) * tailProgress) * h

      const grad = ctx.createLinearGradient(tailX, tailY, headX, headY)
      grad.addColorStop(0, 'rgba(232,227,216,0)')
      grad.addColorStop(0.65, `rgba(232,227,216,${(alpha * 0.55).toFixed(3)})`)
      grad.addColorStop(1, `rgba(232,227,216,${(alpha * 0.9).toFixed(3)})`)
      ctx.beginPath()
      ctx.moveTo(tailX, tailY)
      ctx.lineTo(headX, headY)
      ctx.strokeStyle = grad
      ctx.lineWidth = 1.4
      ctx.stroke()

      return m.y0 + (m.y1 - m.y0) * progress < 1.1
    })

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
