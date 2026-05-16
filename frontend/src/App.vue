<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import SearchOverlay from './components/SearchOverlay.vue'

const searchOpen = ref(false)

function onKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    searchOpen.value = true
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <RouterView />
  <Transition name="search">
    <SearchOverlay v-if="searchOpen" @close="searchOpen = false" />
  </Transition>
</template>

<style>
@import './assets/styles/tokens.css';

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body, #app {
  height: 100%;
}

body {
  font-family: var(--font-ui);
  font-weight: 300;
  font-size: 15px;
  line-height: 1.55;
  letter-spacing: 0.005em;
  background: var(--color-space);
  color: var(--color-ivory);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

button, input, textarea { font-family: inherit; color: inherit; }
button { background: none; border: none; padding: 0; cursor: pointer; }
a { color: inherit; text-decoration: none; }

::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--color-stellar); }

.search-enter-active,
.search-leave-active {
  transition: opacity 0.18s ease;
}
.search-enter-from,
.search-leave-to {
  opacity: 0;
}
</style>
