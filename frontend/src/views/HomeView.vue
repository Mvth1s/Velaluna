<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useContentStore } from '../stores/contentStore'
import { useProgressStore } from '../stores/progressStore'
import StarField from '../components/StarField.vue'
import { LOGO_DARK } from '../assets/logos'
import type { Theme, Technology } from '../types/velaluna'

const router = useRouter()
const contentStore = useContentStore()
const progressStore = useProgressStore()

const themes = ref<Theme[]>([])
const technologies = ref<Technology[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    ;[themes.value, technologies.value] = await Promise.all([
      contentStore.fetchThemes(),
      contentStore.fetchTechnologies()
    ])
  } catch {
    error.value = 'Impossible de charger le contenu. Vérifie que le backend est démarré.'
  } finally {
    loading.value = false
  }
})

function getTechsByTheme(themeId: string): Technology[] {
  return technologies.value.filter(t => t.theme_id === themeId)
}
</script>

<template>
  <div class="home">
    <StarField />

    <div class="home__content">
      <header class="home__header">
        <img :src="LOGO_DARK" alt="Velaluna" class="home__logo" />
        <p class="home__tagline">learn by connection</p>
      </header>

      <div v-if="loading" class="home__state">Chargement...</div>
      <div v-else-if="error" class="home__state home__state--error">{{ error }}</div>

      <div v-else class="home__themes">
        <section v-for="theme in themes" :key="theme.id" class="theme-section">
          <h2 class="theme-section__title">{{ theme.label }}</h2>
          <p class="theme-section__description">{{ theme.description }}</p>
          <div class="theme-section__techs">
            <button
              v-for="tech in getTechsByTheme(theme.id)"
              :key="tech.id"
              class="tech-card"
              @click="router.push({ name: 'technology', params: { id: tech.id } })"
            >
              <div class="tech-card__top">
                <strong>{{ tech.label }}</strong>
                <span
                  v-if="progressStore.getCompletedCountForTech(tech.id) > 0"
                  class="tech-card__progress"
                >
                  {{ progressStore.getCompletedCountForTech(tech.id) }}/{{ tech.nodes.length }}
                </span>
              </div>
              <span class="tech-card__desc">{{ tech.description }}</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home {
  min-height: 100vh;
  position: relative;
}

.home__content {
  position: relative;
  z-index: 1;
  max-width: 820px;
  margin: 0 auto;
  padding: 4rem 2rem 3rem;
}

.home__header {
  text-align: center;
  margin-bottom: 4rem;
}

.home__logo {
  height: 56px;
  object-fit: contain;
  margin-bottom: 0.5rem;
}

.home__tagline {
  font-family: var(--font-label);
  font-weight: 300;
  font-size: 0.75rem;
  color: var(--color-sand);
  letter-spacing: 0.12em;
  text-transform: lowercase;
}

.home__state {
  text-align: center;
  color: var(--color-sand);
  padding: 3rem;
  font-family: var(--font-ui);
}

.home__state--error {
  color: #f87171;
}

.home__themes {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.theme-section__title {
  font-family: var(--font-display);
  font-size: 1.625rem;
  color: var(--color-ivory);
  margin-bottom: 0.375rem;
  font-weight: 400;
}

.theme-section__description {
  font-family: var(--font-ui);
  color: var(--color-sand);
  font-size: 0.9375rem;
  margin-bottom: 1.25rem;
}

.theme-section__techs {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.tech-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.25rem 1.5rem;
  border: 1px solid var(--color-deep);
  border-radius: 12px;
  background: rgba(26, 39, 68, 0.6);
  backdrop-filter: blur(6px);
  cursor: pointer;
  text-align: left;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  min-width: 190px;
}

.tech-card:hover {
  border-color: var(--color-stellar);
  box-shadow: 0 0 16px rgba(88, 130, 136, 0.25);
  background: rgba(26, 39, 68, 0.85);
}

.tech-card__top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.tech-card strong {
  font-family: var(--font-ui);
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-ivory);
}

.tech-card__progress {
  font-family: var(--font-label);
  font-size: 0.75rem;
  font-weight: 400;
  color: var(--color-stellar);
  background: rgba(88, 130, 136, 0.15);
  border-radius: 4px;
  padding: 0.125rem 0.375rem;
  white-space: nowrap;
}

.tech-card__desc {
  font-family: var(--font-ui);
  font-size: 0.8125rem;
  color: var(--color-sand);
  line-height: 1.45;
}
</style>
