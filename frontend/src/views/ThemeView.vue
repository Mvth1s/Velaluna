<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useContentStore } from '../stores/contentStore'
import { useProgressStore } from '../stores/progressStore'
import StarField from '../components/StarField.vue'
import { LOGO_BANNER } from '../assets/logos'
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

    <header class="top-bar">
      <button class="top-bar__logo-btn" @click="router.push('/')">
        <img :src="LOGO_BANNER" alt="Velaluna" class="top-bar__logo" />
      </button>
      <nav class="breadcrumb" aria-label="Fil d'Ariane">
        <button class="breadcrumb__link" @click="router.push('/')">Accueil</button>
        <span class="breadcrumb__sep">›</span>
        <button class="breadcrumb__link" @click="router.push('/themes')">Thèmes</button>
        <span class="breadcrumb__sep">›</span>
        <span class="breadcrumb__current">{{ theme?.label ?? themeId }}</span>
      </nav>
    </header>

    <main class="theme-content">
      <div v-if="loading" class="state-msg">Chargement...</div>
      <div v-else-if="error" class="state-msg state-msg--error">{{ error }}</div>

      <template v-else>
        <p class="theme-content__eyebrow">{{ theme?.label ?? themeId }}</p>
        <h1 class="theme-content__title">Choisis ta technologie</h1>
        <p v-if="theme?.description" class="theme-content__desc">{{ theme.description }}</p>

        <div class="tech-grid">
          <button
            v-for="tech in technologies"
            :key="tech.id"
            class="tech-card"
            @click="router.push(`/themes/${themeId}/${tech.id}`)"
          >
            <div class="tech-card__head">
              <strong class="tech-card__label">{{ tech.label }}</strong>
              <span class="tech-card__count">
                {{ progressStore.getCompletedCountForTech(tech.id) }}<span class="tech-card__count-total">/{{ tech.nodes.length }}</span>
              </span>
            </div>
            <p class="tech-card__desc">{{ tech.description }}</p>
            <div class="tech-card__track">
              <div class="tech-card__fill" :style="{ width: `${progressPercent(tech)}%` }" />
            </div>
          </button>
        </div>

        <button class="other-theme-btn" @click="router.push('/themes')">
          ← Choisir un autre thème
        </button>
      </template>
    </main>
  </div>
</template>

<style scoped>
.theme-view {
  min-height: 100vh;
  position: relative;
}

/* ── Top bar ── */
.top-bar {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 20px;
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
  flex-shrink: 0;
}

.top-bar__logo {
  height: 56px;
  width: auto;
  max-width: 280px;
  object-fit: contain;
  opacity: 0.85;
  transition: opacity 0.2s;
}
.top-bar__logo:hover { opacity: 1; }

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-ui);
  font-size: 0.8125rem;
}


.breadcrumb__link {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  color: var(--text-mute);
  font-size: inherit;
  font-family: inherit;
  transition: color 0.15s;
}
.breadcrumb__link:hover { color: var(--color-ivory); }

.breadcrumb__sep { color: var(--border-strong); }

.breadcrumb__current {
  color: var(--color-ivory);
  font-weight: 500;
}

/* ── Content ── */
.theme-content {
  position: relative;
  z-index: 1;
  max-width: 780px;
  margin: 0 auto;
  padding: 60px 28px 80px;
}

.state-msg {
  text-align: center;
  color: var(--text-mute);
  padding: 3rem;
  font-family: var(--font-ui);
}
.state-msg--error { color: #f87171; }

.theme-content__eyebrow {
  font-family: var(--font-label);
  font-size: 10px;
  font-weight: 300;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: var(--color-stellar);
  margin-bottom: 14px;
}

.theme-content__title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 400;
  line-height: 1.1;
  color: var(--color-ivory);
  margin-bottom: 12px;
}

.theme-content__desc {
  font-size: 0.9375rem;
  color: rgba(232, 227, 216, 0.7);
  line-height: 1.55;
  margin-bottom: 48px;
}

/* ── Grid ── */
.tech-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.tech-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 24px 26px;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: var(--surface-2);
  backdrop-filter: blur(8px);
  cursor: pointer;
  text-align: left;
  width: 100%;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
}

.tech-card:hover {
  border-color: var(--border-strong);
  box-shadow: 0 8px 32px rgba(88, 130, 136, 0.18);
  background: rgba(26, 39, 68, 0.5);
}

.tech-card__head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.tech-card__label {
  font-family: var(--font-display);
  font-size: 1.625rem;
  font-weight: 400;
  line-height: 1.1;
  color: var(--color-ivory);
  flex: 1;
}

.tech-card__count {
  font-family: var(--font-label);
  font-size: 0.875rem;
  font-weight: 400;
  color: var(--color-ivory);
  white-space: nowrap;
  flex-shrink: 0;
  padding-top: 4px;
}
.tech-card__count-total { color: var(--text-mute); }

.tech-card__desc {
  font-size: 0.875rem;
  color: rgba(232, 227, 216, 0.65);
  line-height: 1.55;
  flex: 1;
}

.tech-card__track {
  height: 3px;
  background: var(--border);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 6px;
}

.tech-card__fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-stellar), var(--color-ivory));
  border-radius: 2px;
  transition: width 0.5s ease;
}

.other-theme-btn {
  margin-top: 36px;
  display: block;
  font-family: var(--font-label);
  font-size: 11px;
  font-weight: 300;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-mute);
  cursor: pointer;
  transition: color 0.2s;
}
.other-theme-btn:hover { color: var(--color-ivory); }

@media (max-width: 640px) {
  .top-bar { padding: 12px 16px; }
  .breadcrumb { display: none; }
  .theme-content { padding: 40px 16px 60px; }
  .theme-content__title { font-size: 2rem; margin-bottom: 10px; }
  .theme-content__desc { margin-bottom: 32px; }
  .tech-grid { grid-template-columns: 1fr; gap: 14px; }
  .tech-card { padding: 20px; }
}
</style>
