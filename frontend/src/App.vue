<script setup lang="ts">
</script>

<template>
  <RouterView />
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
  background: var(--color-space);
  color: var(--color-ivory);
  -webkit-font-smoothing: antialiased;
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: var(--color-night);
}

::-webkit-scrollbar-thumb {
  background: var(--color-deep);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-stellar);
}
</style>
