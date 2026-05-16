<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useContentStore } from '../stores/contentStore'
import StarField from '../components/StarField.vue'
import { LOGO_SQUARE } from '../assets/logos'
import type { Theme } from '../types/velaluna'

const router = useRouter()
const contentStore = useContentStore()

const themes = ref<Theme[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    themes.value = await contentStore.fetchThemes()
  } catch {
    error.value = 'Impossible de charger les thèmes. Vérifie que le backend est démarré.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="themes-view">
    <StarField />

    <header class="themes-view__header">
      <button class="themes-view__back" @click="router.push('/')">
        <img :src="LOGO_SQUARE" alt="Velaluna" class="themes-view__logo" />
      </button>
    </header>

    <main class="themes-view__content">
      <h1 class="themes-view__title">Quel domaine veux-tu explorer ?</h1>

      <div v-if="loading" class="themes-view__state">Chargement...</div>
      <div v-else-if="error" class="themes-view__state themes-view__state--error">{{ error }}</div>

      <div v-else class="themes-view__grid">
        <button
          v-for="theme in themes"
          :key="theme.id"
          class="theme-card"
          @click="router.push(`/themes/${theme.id}`)"
        >
          <strong class="theme-card__label">{{ theme.label }}</strong>
          <p class="theme-card__description">{{ theme.description }}</p>
        </button>
      </div>
    </main>
  </div>
</template>

<style scoped>
.themes-view {
  min-height: 100vh;
  position: relative;
}

.themes-view__header {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  border-bottom: 1px solid var(--color-deep);
  background: rgba(0, 0, 26, 0.85);
  backdrop-filter: blur(8px);
}

.themes-view__back {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.themes-view__logo {
  width: 36px;
  height: 36px;
  object-fit: contain;
  opacity: 0.85;
  transition: opacity 0.2s;
}

.themes-view__logo:hover {
  opacity: 1;
}

.themes-view__content {
  position: relative;
  z-index: 1;
  max-width: 720px;
  margin: 0 auto;
  padding: 3.5rem 2rem;
}

.themes-view__title {
  font-family: var(--font-display);
  font-size: 1.875rem;
  font-weight: 400;
  color: var(--color-ivory);
  margin-bottom: 2.5rem;
  text-align: center;
}

.themes-view__state {
  text-align: center;
  color: var(--color-sand);
  padding: 3rem;
  font-family: var(--font-ui);
}

.themes-view__state--error {
  color: #f87171;
}

.themes-view__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}

.theme-card {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  padding: 1.75rem 1.5rem;
  border: 1px solid var(--color-deep);
  border-radius: 12px;
  background: rgba(26, 39, 68, 0.55);
  backdrop-filter: blur(6px);
  cursor: pointer;
  text-align: left;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
}

.theme-card:hover {
  border-color: var(--color-stellar);
  box-shadow: 0 0 20px rgba(88, 130, 136, 0.2);
  background: rgba(26, 39, 68, 0.85);
}

.theme-card__label {
  font-family: var(--font-ui);
  font-size: 1.0625rem;
  font-weight: 600;
  color: var(--color-ivory);
}

.theme-card__description {
  font-family: var(--font-ui);
  font-size: 0.875rem;
  color: var(--color-sand);
  line-height: 1.5;
  margin: 0;
}
</style>
