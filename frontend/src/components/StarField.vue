<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Star {
  x: number; y: number; vx: number; vy: number
  size: number; phase: number; speed: number
}

interface ShootingStar {
  x: number; y: number; angle: number; speed: number
  length: number; opacity: number; life: number; age: number
}

interface Nebula { x: number; y: number; size: number; color: string; duration: number; delay: number }

const canvasRef = ref<HTMLCanvasElement | null>(null)
const nebulae = ref<Nebula[]>([])

let animId = 0
let stars: Star[] = []
let shootingStars: ShootingStar[] = []
let nextShootingAt = 0

function rand(min: number, max: number) { return min + Math.random() * (max - min) }

function initStars(w: number, h: number) {
  stars = Array.from({ length: 150 }, () => ({
    x: rand(0, w),
    y: rand(0, h),
    vx: (Math.random() - 0.5) * 0.15,
    vy: (Math.random() - 0.5) * 0.15,
    size: rand(0.8, 2.5),
    phase: rand(0, Math.PI * 2),
    speed: rand(0.0005, 0.002)
  }))
}

function scheduleNextShooting() {
  nextShootingAt = Date.now() + rand(4000, 10000)
}

function spawnShooting(w: number, h: number) {
  const angle = rand(20, 60) * (Math.PI / 180)
  shootingStars.push({
    x: rand(0, w * 0.7),
    y: rand(0, h * 0.33),
    angle,
    speed: rand(8, 16),
    length: rand(80, 180),
    opacity: 1,
    life: rand(40, 80),
    age: 0
  })
}

function draw(ctx: CanvasRenderingContext2D, w: number, h: number, now: number) {
  ctx.clearRect(0, 0, w, h)

  for (const star of stars) {
    star.x = (star.x + star.vx + w) % w
    star.y = (star.y + star.vy + h) % h
    const brightness = 0.2 + 0.8 * (0.5 + 0.5 * Math.sin(now * star.speed + star.phase))
    ctx.beginPath()
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255,255,255,${brightness.toFixed(3)})`
    ctx.fill()
  }

  if (now > nextShootingAt) {
    spawnShooting(w, h)
    scheduleNextShooting()
  }

  shootingStars = shootingStars.filter(s => s.age < s.life)
  for (const s of shootingStars) {
    const progress = s.age / s.life
    const alpha = (1 - progress) * s.opacity
    const tailX = s.x - Math.cos(s.angle) * s.length
    const tailY = s.y - Math.sin(s.angle) * s.length
    const grad = ctx.createLinearGradient(s.x, s.y, tailX, tailY)
    grad.addColorStop(0, `rgba(200,220,255,${alpha.toFixed(3)})`)
    grad.addColorStop(1, 'rgba(200,220,255,0)')
    ctx.beginPath()
    ctx.moveTo(s.x, s.y)
    ctx.lineTo(tailX, tailY)
    ctx.strokeStyle = grad
    ctx.lineWidth = 1.5
    ctx.stroke()
    s.x += Math.cos(s.angle) * s.speed
    s.y += Math.sin(s.angle) * s.speed
    s.age++
  }
}

function loop() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  draw(ctx, canvas.width, canvas.height, Date.now())
  animId = requestAnimationFrame(loop)
}

function resize() {
  const canvas = canvasRef.value
  if (!canvas) return
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  initStars(canvas.width, canvas.height)
}

onMounted(() => {
  nebulae.value = Array.from({ length: 3 }, () => ({
    x: rand(10, 90),
    y: rand(10, 90),
    size: rand(200, 400),
    color: Math.random() > 0.5 ? '#588288' : '#1A2744',
    duration: rand(15, 30),
    delay: rand(0, 15)
  }))
  resize()
  window.addEventListener('resize', resize)
  scheduleNextShooting()
  loop()
})

onUnmounted(() => {
  cancelAnimationFrame(animId)
  window.removeEventListener('resize', resize)
})
</script>

<template>
  <div class="starfield" aria-hidden="true">
    <canvas ref="canvasRef" class="starfield__canvas" />
    <div
      v-for="(neb, i) in nebulae"
      :key="`n${i}`"
      class="starfield__nebula"
      :style="{
        left: `${neb.x}%`,
        top: `${neb.y}%`,
        width: `${neb.size}px`,
        height: `${neb.size}px`,
        background: neb.color,
        animationDuration: `${neb.duration}s`,
        animationDelay: `${neb.delay}s`
      }"
    />
  </div>
</template>

<style scoped>
.starfield {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
  background: var(--color-space);
}

.starfield__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.starfield__nebula {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.07;
  animation: breathe ease-in-out infinite;
  transform: translate(-50%, -50%);
}

@keyframes breathe {
  0%, 100% { transform: translate(-50%, -50%) scale(1);    opacity: 0.06; }
  50%       { transform: translate(-50%, -50%) scale(1.15); opacity: 0.10; }
}
</style>
