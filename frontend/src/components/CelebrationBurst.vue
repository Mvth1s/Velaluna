<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

defineProps<{ techLabel: string }>()
const emit = defineEmits<{ done: [] }>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let raf = 0
const timers: ReturnType<typeof setTimeout>[] = []

type Particle = {
  x: number; y: number
  vx: number; vy: number
  r: number
  color: string
  alpha: number
  gravity: number
  decay: number
  shape: 'circle' | 'star'
  rotation: number
  rotSpeed: number
}

const COLORS = [
  '#E8E3D8', '#E8E3D8', '#E8E3D8',  // ivory (most common)
  '#588288', '#588288',               // stellar
  '#C8B898',                          // sand
  '#FFFFFF',                          // white flash
]

function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, rot: number) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rot)
  ctx.beginPath()
  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI * i) / 4
    const radius = i % 2 === 0 ? r : r * 0.38
    if (i === 0) ctx.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius)
    else ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius)
  }
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

function spawnBurst(particles: Particle[], x: number, y: number, count: number) {
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.6
    const speed = 2.5 + Math.random() * 6.5
    const isLarge = Math.random() < 0.22
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - (1.5 + Math.random() * 2),
      r: isLarge ? 4 + Math.random() * 3 : 1.5 + Math.random() * 2.5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: 1,
      gravity: 0.06 + Math.random() * 0.06,
      decay: isLarge ? 0.008 + Math.random() * 0.006 : 0.014 + Math.random() * 0.012,
      shape: isLarge ? 'star' : 'circle',
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.18,
    })
  }
}

onMounted(() => {
  const cvs = canvasRef.value
  if (!cvs) return
  const ctx = cvs.getContext('2d')
  if (!ctx) return

  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  cvs.width = cvs.offsetWidth * dpr
  cvs.height = cvs.offsetHeight * dpr
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  const w = cvs.offsetWidth
  const h = cvs.offsetHeight

  let particles: Particle[] = []

  // Burst positions spread across screen
  const cx = w / 2
  const cy = h / 2

  const schedule = (fn: () => void, ms: number) => {
    timers.push(setTimeout(fn, ms))
  }

  // Wave 1: centre + flancs immédiats
  schedule(() => spawnBurst(particles, cx, cy * 0.45, 55), 0)
  schedule(() => spawnBurst(particles, cx * 0.25, cy * 0.5, 40), 80)
  schedule(() => spawnBurst(particles, cx * 1.75, cy * 0.5, 40), 160)

  // Wave 2
  schedule(() => spawnBurst(particles, cx * 0.5, cy * 0.3, 35), 320)
  schedule(() => spawnBurst(particles, cx * 1.5, cy * 0.35, 35), 420)
  schedule(() => spawnBurst(particles, cx, cy * 0.7, 38), 500)

  // Wave 3: finale dispersée
  schedule(() => spawnBurst(particles, cx * 0.18, cy * 0.75, 28), 750)
  schedule(() => spawnBurst(particles, cx * 1.82, cy * 0.7, 28), 850)
  schedule(() => spawnBurst(particles, cx * 0.65, cy * 0.2, 30), 950)
  schedule(() => spawnBurst(particles, cx * 1.35, cy * 0.22, 30), 1050)

  // Auto-dismiss
  schedule(() => emit('done'), 4200)

  const draw = () => {
    // Trailing fade instead of full clear → comet tails
    ctx.fillStyle = 'rgba(0, 0, 26, 0.18)'
    ctx.fillRect(0, 0, w, h)

    particles = particles.filter(p => p.alpha > 0.025)

    for (const p of particles) {
      p.vy += p.gravity
      p.x += p.vx
      p.y += p.vy
      p.vx *= 0.985
      p.alpha -= p.decay
      p.rotation += p.rotSpeed

      ctx.save()
      ctx.globalAlpha = Math.max(0, p.alpha)
      ctx.fillStyle = p.color

      if (p.shape === 'star') {
        drawStar(ctx, p.x, p.y, p.r, p.rotation)
      } else {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()
    }

    raf = requestAnimationFrame(draw)
  }
  draw()
})

onUnmounted(() => {
  cancelAnimationFrame(raf)
  timers.forEach(clearTimeout)
})
</script>

<template>
  <div class="burst-overlay">
    <canvas ref="canvasRef" class="burst-canvas" />
    <div class="burst-text">
      <div class="burst-text__icon">✦</div>
      <p class="burst-text__sub">Constellation maîtrisée</p>
      <h2 class="burst-text__title">{{ techLabel }}</h2>
    </div>
  </div>
</template>

<style scoped>
.burst-overlay {
  position: fixed;
  inset: 0;
  z-index: 500;
  pointer-events: none;
}

.burst-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.burst-text {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  animation: burstTextIn 0.5s 0.2s ease-out both, burstTextOut 0.6s 3.4s ease-in both;
}

.burst-text__icon {
  font-size: 3.5rem;
  color: var(--color-ivory);
  text-shadow:
    0 0 20px rgba(232, 227, 216, 0.9),
    0 0 60px rgba(232, 227, 216, 0.5);
  animation: iconPulse 1.2s 0.3s ease-in-out infinite alternate;
}

.burst-text__sub {
  font-family: var(--font-label);
  font-size: 11px;
  font-weight: 300;
  letter-spacing: 0.38em;
  text-transform: uppercase;
  color: var(--color-stellar);
}

.burst-text__title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 6vw, 3.5rem);
  font-weight: 400;
  color: var(--color-ivory);
  text-shadow: 0 0 40px rgba(232, 227, 216, 0.4);
  letter-spacing: 0.04em;
}

@keyframes burstTextIn {
  from { opacity: 0; transform: scale(0.88) translateY(12px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}

@keyframes burstTextOut {
  from { opacity: 1; transform: scale(1); }
  to   { opacity: 0; transform: scale(1.04); }
}

@keyframes iconPulse {
  from { text-shadow: 0 0 20px rgba(232,227,216,0.9), 0 0 60px rgba(232,227,216,0.5); }
  to   { text-shadow: 0 0 30px rgba(232,227,216,1),   0 0 90px rgba(232,227,216,0.7); }
}
</style>
