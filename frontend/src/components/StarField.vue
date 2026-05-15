<script setup lang="ts">
function generateStars(count: number, glowing: boolean): string {
  const shadows: string[] = []
  for (let i = 0; i < count; i++) {
    const x = Math.floor(Math.random() * 2560)
    const y = Math.floor(Math.random() * 1600)
    const opacity = 0.2 + Math.random() * 0.6
    const color = `rgba(255, 255, 255, ${opacity.toFixed(2)})`
    if (glowing) {
      shadows.push(`${x}px ${y}px 2px 1px ${color}`)
    } else {
      shadows.push(`${x}px ${y}px 0 0 ${color}`)
    }
  }
  return shadows.join(', ')
}

const smallStars  = generateStars(120, false)
const largeStars  = generateStars(30, true)
</script>

<template>
  <div class="starfield" aria-hidden="true">
    <div class="starfield__small" :style="{ boxShadow: smallStars }" />
    <div class="starfield__large" :style="{ boxShadow: largeStars }" />
  </div>
</template>

<style scoped>
.starfield {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
  background: var(--color-space);
}

.starfield__small,
.starfield__large {
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  height: 1px;
  background: transparent;
  border-radius: 50%;
}

.starfield__large {
  width: 2px;
  height: 2px;
}
</style>
