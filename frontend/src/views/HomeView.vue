<script setup lang="ts">
import { useRouter } from 'vue-router'
import StarField from '../components/StarField.vue'
import { LOGO_BANNER } from '../assets/logos'

const router = useRouter()
</script>

<template>
  <div class="home">
    <StarField />
    <div class="home__content">
      <img :src="LOGO_BANNER" alt="Velaluna" class="home__logo" />
      <p class="home__tagline">Apprends la tech, concept par concept</p>
      <button class="home__cta" @click="router.push('/themes')">Commencer</button>
    </div>
  </div>
</template>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.home__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  text-align: center;
  padding: 3rem 2rem;
}

.home__logo {
  max-width: 360px;
  width: 100%;
  min-height: 96px;
  object-fit: contain;
}

.home__tagline {
  font-family: var(--font-label);
  font-weight: 300;
  font-size: 1.375rem;
  color: var(--color-sand);
  letter-spacing: 0.06em;
}

.home__cta {
  margin-top: 0.5rem;
  padding: 0.875rem 3rem;
  background: transparent;
  border: 1px solid var(--color-stellar);
  border-radius: 24px;
  color: var(--color-ivory);
  font-family: var(--font-ui);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  letter-spacing: 0.04em;
  transition: background 0.2s, box-shadow 0.2s, border-color 0.2s;
}

.home__cta:hover {
  background: rgba(88, 130, 136, 0.12);
  border-color: var(--color-ivory);
  box-shadow: 0 0 24px rgba(88, 130, 136, 0.35);
}
</style>
