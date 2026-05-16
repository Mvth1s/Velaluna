<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useContentStore } from '../stores/contentStore'
import { useProgressStore } from '../stores/progressStore'
import StarField from '../components/StarField.vue'
import { LOGO_SQUARE } from '../assets/logos'
import type { Theme, Technology } from '../types/velaluna'

const route = useRoute()
const router = useRouter()
const contentStore = useContentStore()
const progressStore = useProgressStore()

const themeId = route.params.themeId as string

const theme = ref<Theme | null>(null)
const technologies = ref<Technology[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const [allThemes, allTechs] = await Promise.all([
      contentStore.fetchThemes(),
      contentStore.fetchTechnologies()
    ])
    theme.value = allThemes.find(t => t.id === themeId) ?? null
    technologies.value = allTechs.filter(t => t.theme_id === themeId)
  } catch {
    error.value = 'Impossible de charger le contenu. Vérifie que le backend est démarré.'
  } finally {
    loading.value = false
  }
})

function progressPercent(tech: Technology): number {
  const completed = progressStore.getCompletedCountForTech(tech.id)
  return tech.nodes.length > 0 ? Math.round((completed / tech.nodes.length) * 100) : 0
}
</script>

<template>
  <div class="theme-view">
    <StarField />

    <header class="theme-view__header">
      <button class="theme-view__back" @click="router.push('/themes')">
        <img :src="LOGO_SQUARE" alt="Velaluna" class="theme-view__logo" />
      </button>
      <nav class="theme-view__breadcrumb" aria-label="Fil d'Ariane">
        <button class="theme-view__breadcrumb-link" @click="router.push('/')">Accueil</button>
        <span class="theme-view__breadcrumb-sep">›</span>
        <button class="theme-view__breadcrumb-link" @click="router.push('/themes')">Thèmes</button>
        <span class="theme-view__breadcrumb-sep">›</span>
        <span class="theme-view__breadcrumb-current">{{ theme?.label ?? themeId }}</span>
      </nav>
    </header>

    <main class="theme-view__content">
      <h1 class="theme-view__title">{{ theme?.label ?? themeId }}</h1>
      <p v-if="theme?.description" class="theme-view__description">{{ theme.description }}</p>

      <div v-if="loading" class="theme-view__state">Chargement...</div>
      <div v-else-if="error" class="theme-view__state theme-view__state--error">{{ error }}</div>

      <template v-else>
        <button class="theme-view__other-theme" @click="router.push('/themes')">
          ← Choisir un autre thème
        </button>

        <div class="theme-view__grid">
          <button
            v-for="tech in technologies"
            :key="tech.id"
            class="tech-card"
            @click="router.push(`/themes/${themeId}/${tech.id}`)"
          >
            <div class="tech-card__header">
              <strong class="tech-card__label">{{ tech.label }}</strong>
              <span class="tech-card__count">
                {{ progressStore.getCompletedCountForTech(tech.id) }}/{{ tech.nodes.length }}
              </span>
            </div>
            <p class="tech-card__description">{{ tech.description }}</p>
            <div class="tech-card__progress-track">
              <div
                class="tech-card__progress-fill"
                :style="{ width: `${progressPercent(tech)}%` }"
              />
            </div>
          </button>
        </div>
      </template>

    </main>
  </div>
</template>

<style scoped>
.theme-view {
  min-height: 100vh;
  position: relative;
}

.theme-view__header {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1.5rem;
  border-bottom: 1px solid var(--color-deep);
  background: rgba(0, 0, 26, 0.85);
  backdrop-filter: blur(8px);
}

.theme-view__back {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
}

.theme-view__logo {
  width: 36px;
  height: 36px;
  object-fit: contain;
  opacity: 0.85;
  transition: opacity 0.2s;
}

.theme-view__logo:hover {
  opacity: 1;
}

.theme-view__breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-family: var(--font-ui);
  font-size: 0.8125rem;
}

.theme-view__breadcrumb-link {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  color: var(--color-sand);
  opacity: 0.65;
  font-size: inherit;
  font-family: inherit;
  transition: opacity 0.15s;
}

.theme-view__breadcrumb-link:hover {
  opacity: 1;
  color: var(--color-ivory);
}

.theme-view__breadcrumb-sep {
  color: var(--color-deep);
  opacity: 0.8;
}

.theme-view__breadcrumb-current {
  color: var(--color-ivory);
  font-weight: 500;
}

.theme-view__content {
  position: relative;
  z-index: 1;
  max-width: 720px;
  margin: 0 auto;
  padding: 3rem 2rem;
}

.theme-view__title {
  font-family: var(--font-display);
  font-size: 1.875rem;
  font-weight: 400;
  color: var(--color-ivory);
  margin-bottom: 0.5rem;
}

.theme-view__description {
  font-family: var(--font-ui);
  font-size: 0.9375rem;
  color: var(--color-sand);
  margin-bottom: 2.5rem;
  line-height: 1.55;
}

.theme-view__state {
  text-align: center;
  color: var(--color-sand);
  padding: 3rem;
  font-family: var(--font-ui);
}

.theme-view__state--error {
  color: #f87171;
}

.theme-view__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  justify-items: center;
}

.tech-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 2rem;
  min-width: 260px;
  min-height: 140px;
  width: 100%;
  border: 1px solid var(--color-deep);
  border-radius: 12px;
  background: rgba(26, 39, 68, 0.55);
  backdrop-filter: blur(6px);
  cursor: pointer;
  text-align: left;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
}

.tech-card:hover {
  border-color: var(--color-stellar);
  box-shadow: 0 4px 20px rgba(88, 130, 136, 0.25);
  background: rgba(26, 39, 68, 0.85);
}

.tech-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.tech-card__label {
  font-family: var(--font-ui);
  font-size: 1.375rem;
  font-weight: 600;
  color: var(--color-ivory);
}

.tech-card__count {
  font-family: var(--font-label);
  font-size: 0.8125rem;
  font-weight: 400;
  color: var(--color-stellar);
  white-space: nowrap;
  flex-shrink: 0;
}

.tech-card__description {
  font-family: var(--font-ui);
  font-size: 1rem;
  color: var(--color-sand);
  line-height: 1.5;
  margin: 0;
}

.tech-card__progress-track {
  height: 10px;
  background: rgba(26, 39, 68, 0.8);
  border-radius: 6px;
  overflow: hidden;
  margin-top: 0.25rem;
  margin-bottom: 0;
  border: 1px solid rgba(88, 130, 136, 0.2);
}

.tech-card__progress-fill {
  height: 100%;
  background: var(--color-stellar);
  border-radius: 6px;
  transition: width 0.4s ease;
  box-shadow: 0 0 6px rgba(88, 130, 136, 0.5);
}

.theme-view__other-theme {
  display: inline-block;
  margin-bottom: 2rem;
  font-family: var(--font-ui);
  font-size: 0.875rem;
  color: var(--color-stellar);
  background: transparent;
  border: 1px solid var(--color-deep);
  border-radius: 6px;
  padding: 0.5rem 1.25rem;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
}

.theme-view__other-theme:hover {
  border-color: var(--color-stellar);
  color: var(--color-ivory);
}

@media (max-width: 640px) {
  .theme-view__content {
    padding: 2rem 1rem;
  }

  .theme-view__title {
    font-size: 1.5rem;
  }

  .theme-view__grid {
    grid-template-columns: 1fr;
  }

  .theme-view__breadcrumb {
    display: none;
  }
}
</style>
