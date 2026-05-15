<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useContentStore } from '../stores/contentStore'
import { useProgressStore } from '../stores/progressStore'
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
  <main class="home">
    <header class="home__header">
      <h1>Velaluna</h1>
      <p>Apprends la tech, concept par concept.</p>
    </header>

    <div v-if="loading" class="home__state">Chargement...</div>
    <div v-else-if="error" class="home__state home__state--error">{{ error }}</div>

    <div v-else class="home__themes">
      <section v-for="theme in themes" :key="theme.id" class="theme-section">
        <h2>{{ theme.label }}</h2>
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
            <span>{{ tech.description }}</span>
          </button>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.home {
  max-width: 860px;
  margin: 0 auto;
  padding: 3rem 2rem;
}

.home__header {
  text-align: center;
  margin-bottom: 3.5rem;
}

.home__header h1 {
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.home__header p {
  color: #6b7280;
  font-size: 1.0625rem;
}

.home__state {
  text-align: center;
  color: #6b7280;
  padding: 3rem;
}

.home__state--error {
  color: #dc2626;
}

.home__themes {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.theme-section h2 {
  font-size: 1.375rem;
  margin-bottom: 0.375rem;
}

.theme-section__description {
  color: #6b7280;
  font-size: 0.9375rem;
  margin-bottom: 1rem;
}

.theme-section__techs {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.tech-card {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding: 1.125rem 1.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  background: #ffffff;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.15s, box-shadow 0.15s;
  min-width: 180px;
}

.tech-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);
}

.tech-card__top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.tech-card strong {
  font-size: 1.0625rem;
  color: #111827;
}

.tech-card__progress {
  font-size: 0.75rem;
  font-weight: 600;
  color: #22c55e;
  background: #f0fdf4;
  border-radius: 4px;
  padding: 0.125rem 0.375rem;
  white-space: nowrap;
}

.tech-card span {
  font-size: 0.8125rem;
  color: #6b7280;
  line-height: 1.4;
}
</style>
