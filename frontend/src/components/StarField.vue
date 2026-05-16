<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface Star   { x: number; y: number; size: number; duration: number; delay: number }
interface Orb    { x: number; y: number; size: number; color: string; opacity: number; duration: number; delay: number }
interface Nebula { x: number; y: number; size: number; color: string; duration: number; delay: number }

const stars   = ref<Star[]>([])
const orbs    = ref<Orb[]>([])
const nebulae = ref<Nebula[]>([])

function rand(min: number, max: number) { return min + Math.random() * (max - min) }

onMounted(() => {
  stars.value = Array.from({ length: 100 }, () => ({
    x: rand(0, 100),
    y: rand(0, 100),
    size: rand(1, 3),
    duration: rand(2, 6),
    delay: rand(0, 6)
  }))

  orbs.value = Array.from({ length: 4 }, () => ({
    x: rand(5, 95),
    y: rand(5, 95),
    size: rand(6, 20),
    color: Math.random() > 0.5 ? '#588288' : '#8A9DB8',
    opacity: rand(0.3, 0.6),
    duration: rand(20, 40),
    delay: rand(0, 20)
  }))

  nebulae.value = Array.from({ length: 3 }, () => ({
    x: rand(10, 90),
    y: rand(10, 90),
    size: rand(200, 400),
    color: Math.random() > 0.5 ? '#588288' : '#1A2744',
    duration: rand(15, 30),
    delay: rand(0, 15)
  }))
})
</script>

<template>
  <div class="starfield" aria-hidden="true">
    <div
      v-for="(star, i) in stars"
      :key="`s${i}`"
      class="starfield__star"
      :style="{
        left: `${star.x}%`,
        top: `${star.y}%`,
        width: `${star.size}px`,
        height: `${star.size}px`,
        animationDuration: `${star.duration}s`,
        animationDelay: `${star.delay}s`
      }"
    />
    <div
      v-for="(orb, i) in orbs"
      :key="`o${i}`"
      class="starfield__orb"
      :style="{
        left: `${orb.x}%`,
        top: `${orb.y}%`,
        width: `${orb.size}px`,
        height: `${orb.size}px`,
        background: orb.color,
        opacity: orb.opacity,
        animationDuration: `${orb.duration}s`,
        animationDelay: `${orb.delay}s`
      }"
    />
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

.starfield__star {
  position: absolute;
  background: white;
  border-radius: 50%;
  animation: twinkle linear infinite;
}

.starfield__orb {
  position: absolute;
  border-radius: 50%;
  animation: drift ease-in-out infinite;
}

.starfield__nebula {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.07;
  animation: breathe ease-in-out infinite;
  transform: translate(-50%, -50%);
}

@keyframes twinkle {
  0%, 100% { opacity: 0.15; transform: scale(1); }
  50%       { opacity: 1;    transform: scale(1.3); }
}

@keyframes drift {
  0%   { transform: translate(0, 0); }
  33%  { transform: translate(12px, -8px); }
  66%  { transform: translate(-8px, 12px); }
  100% { transform: translate(0, 0); }
}

@keyframes breathe {
  0%, 100% { transform: translate(-50%, -50%) scale(1);    opacity: 0.06; }
  50%       { transform: translate(-50%, -50%) scale(1.15); opacity: 0.10; }
}
</style>
