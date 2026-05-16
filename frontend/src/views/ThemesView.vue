<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useContentStore } from '../stores/contentStore'
import StarField from '../components/StarField.vue'
import { LOGO_BANNER } from '../assets/logos'
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

    <header class="top-bar">
      <button class="top-bar__logo-btn" @click="router.push('/')">
        <img :src="LOGO_BANNER" alt="Velaluna" class="top-bar__logo" />
      </button>
    </header>

    <main class="themes-content">
      <p class="themes-content__eyebrow">Explorer</p>
      <h1 class="themes-content__title">Quel domaine veux-tu<br>explorer ?</h1>

      <div v-if="loading" class="state-msg">Chargement...</div>
      <div v-else-if="error" class="state-msg state-msg--error">{{ error }}</div>

      <div v-else class="themes-grid">
        <button
          v-for="theme in themes"
          :key="theme.id"
          class="theme-card"
          @click="router.push(`/themes/${theme.id}`)"
        >
          <strong class="theme-card__label">{{ theme.label }}</strong>
          <p class="theme-card__desc">{{ theme.description }}</p>
          <span class="theme-card__cta">Explorer →</span>
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

/* ── Top bar ── */
.top-bar {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  padding: 16px 28px;
  border-bottom: 1px solid var(--border);
  background: rgba(0, 0, 26, 0.82);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.top-bar__logo-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
}

.top-bar__logo {
  height: 56px;
  width: auto;
  max-width: 280px;
  object-fit: contain;
  opacity: 0.9;
  transition: opacity 0.2s;
}
.top-bar__logo:hover { opacity: 1; }

/* ── Content ── */
.themes-content {
  position: relative;
  z-index: 1;
  max-width: 780px;
  margin: 0 auto;
  padding: 60px 28px 80px;
}

.themes-content__eyebrow {
  font-family: var(--font-label);
  font-size: 10px;
  font-weight: 300;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: var(--color-stellar);
  margin-bottom: 14px;
}

.themes-content__title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 400;
  line-height: 1.1;
  color: var(--color-ivory);
  margin-bottom: 48px;
}

.state-msg {
  text-align: center;
  color: var(--text-mute);
  padding: 3rem;
  font-family: var(--font-ui);
}
.state-msg--error { color: #f87171; }

/* ── Grid ── */
.themes-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.theme-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 28px;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: var(--surface-2);
  backdrop-filter: blur(8px);
  cursor: pointer;
  text-align: left;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  width: 100%;
}

.theme-card:hover {
  border-color: var(--border-strong);
  box-shadow: 0 8px 32px rgba(88, 130, 136, 0.18), 0 0 0 1px rgba(88, 130, 136, 0.1);
  background: rgba(26, 39, 68, 0.5);
}

.theme-card__label {
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 400;
  line-height: 1.1;
  color: var(--color-ivory);
}

.theme-card__desc {
  font-family: var(--font-ui);
  font-size: 0.9375rem;
  color: rgba(232, 227, 216, 0.7);
  line-height: 1.55;
  flex: 1;
}

.theme-card__cta {
  font-family: var(--font-label);
  font-size: 10px;
  font-weight: 300;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--color-stellar);
  margin-top: 4px;
}

@media (max-width: 640px) {
  .themes-content { padding: 40px 16px 60px; }
  .themes-content__title { font-size: 2rem; margin-bottom: 32px; }
  .themes-grid { grid-template-columns: 1fr; gap: 14px; }
  .theme-card { padding: 22px; }
}
</style>
