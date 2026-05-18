<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useContentStore } from '../stores/contentStore'
import { useProgressStore } from '../stores/progressStore'
import StarField from '../components/StarField.vue'
import { LOGO_BANNER } from '../assets/logos'
import type { Theme, Technology } from '../types/velaluna'

const router = useRouter()
const contentStore = useContentStore()
const progressStore = useProgressStore()

const themes = ref<Theme[]>([])
const technologies = ref<Technology[]>([])
const loading = ref(true)

onMounted(async () => {
  ;[themes.value, technologies.value] = await Promise.all([
    contentStore.fetchThemes(),
    contentStore.fetchTechnologies()
  ])
  loading.value = false
})

function techsForTheme(themeId: string): Technology[] {
  return technologies.value.filter(t => t.theme_id === themeId)
}

function completedCount(tech: Technology): number {
  return progressStore.getCompletedCountForTech(tech.id)
}

function progressPercent(tech: Technology): number {
  return tech.nodes.length > 0
    ? Math.round((completedCount(tech) / tech.nodes.length) * 100)
    : 0
}

const totalNodes = computed(() =>
  technologies.value.reduce((sum, t) => sum + t.nodes.length, 0)
)

const totalCompleted = computed(() =>
  technologies.value.reduce((sum, t) => sum + completedCount(t), 0)
)

const globalPercent = computed(() =>
  totalNodes.value > 0 ? Math.round((totalCompleted.value / totalNodes.value) * 100) : 0
)

const hasAnyProgress = computed(() => totalCompleted.value > 0)

function confirmReset() {
  if (confirm('Réinitialiser toute la progression ?')) {
    progressStore.resetProgress()
  }
}
</script>

<template>
  <div class="progress-view">
    <StarField />

    <header class="top-bar">
      <button class="top-bar__logo-btn" @click="router.push('/')">
        <img :src="LOGO_BANNER" alt="Velaluna" class="top-bar__logo" />
      </button>
      <nav class="breadcrumb" aria-label="Fil d'Ariane">
        <button class="breadcrumb__link" @click="router.push('/')">Accueil</button>
        <span class="breadcrumb__sep">›</span>
        <span class="breadcrumb__current">Progression</span>
      </nav>
    </header>

    <main class="progress-content">
      <p class="progress-content__eyebrow">Tableau de bord</p>
      <h1 class="progress-content__title">Ma progression</h1>

      <div v-if="loading" class="state-msg">Chargement...</div>

      <template v-else>
        <!-- Global summary -->
        <div class="global-card">
          <div class="global-card__stats">
            <div class="global-stat">
              <span class="global-stat__value">{{ totalCompleted }}</span>
              <span class="global-stat__label">concepts maîtrisés</span>
            </div>
            <div class="global-stat">
              <span class="global-stat__value">{{ totalNodes - totalCompleted }}</span>
              <span class="global-stat__label">restants</span>
            </div>
            <div class="global-stat">
              <span class="global-stat__value">{{ globalPercent }}<span class="global-stat__pct">%</span></span>
              <span class="global-stat__label">complété</span>
            </div>
          </div>
          <div class="global-track">
            <div class="global-fill" :style="{ width: `${globalPercent}%` }" />
          </div>
        </div>

        <!-- Per theme -->
        <div v-for="theme in themes" :key="theme.id" class="theme-section">
          <h2 class="theme-section__label">{{ theme.label }}</h2>
          <div class="tech-list">
            <button
              v-for="tech in techsForTheme(theme.id)"
              :key="tech.id"
              class="tech-row"
              @click="router.push(`/themes/${theme.id}/${tech.id}`)"
            >
              <img :src="`/logos/${tech.logo}`" :alt="tech.label" class="tech-row__logo" />
              <div class="tech-row__body">
                <div class="tech-row__top">
                  <span class="tech-row__name">{{ tech.label }}</span>
                  <span class="tech-row__count">
                    {{ completedCount(tech) }}<span class="tech-row__total">/{{ tech.nodes.length }}</span>
                  </span>
                </div>
                <div class="tech-row__track">
                  <div class="tech-row__fill" :style="{ width: `${progressPercent(tech)}%` }" />
                </div>
              </div>
              <svg class="tech-row__arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Reset -->
        <div v-if="hasAnyProgress" class="reset-zone">
          <button class="reset-btn" @click="confirmReset">
            Réinitialiser toute la progression
          </button>
        </div>
      </template>
    </main>
  </div>
</template>

<style scoped>
.progress-view {
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
.progress-content {
  position: relative;
  z-index: 1;
  max-width: 640px;
  margin: 0 auto;
  padding: 60px 28px 80px;
}

.state-msg {
  text-align: center;
  color: var(--text-mute);
  padding: 3rem;
  font-family: var(--font-ui);
}

.progress-content__eyebrow {
  font-family: var(--font-label);
  font-size: 10px;
  font-weight: 300;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: var(--color-stellar);
  margin-bottom: 14px;
}

.progress-content__title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 400;
  line-height: 1.1;
  color: var(--color-ivory);
  margin-bottom: 40px;
}

/* ── Global card ── */
.global-card {
  padding: 24px 28px;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: var(--surface-2);
  margin-bottom: 48px;
}

.global-card__stats {
  display: flex;
  gap: 36px;
  margin-bottom: 18px;
}

.global-stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.global-stat__value {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 400;
  line-height: 1;
  color: var(--color-ivory);
}

.global-stat__pct {
  font-size: 1.25rem;
}

.global-stat__label {
  font-family: var(--font-label);
  font-size: 10px;
  font-weight: 300;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-mute);
}

.global-track {
  height: 4px;
  background: var(--border);
  border-radius: 2px;
  overflow: hidden;
}

.global-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-stellar), var(--color-ivory));
  border-radius: 2px;
  transition: width 0.6s cubic-bezier(.4,0,.2,1);
}

/* ── Theme sections ── */
.theme-section {
  margin-bottom: 36px;
}

.theme-section__label {
  font-family: var(--font-label);
  font-size: 10px;
  font-weight: 300;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--color-stellar);
  margin-bottom: 12px;
}

.tech-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* ── Tech row ── */
.tech-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--surface-2);
  cursor: pointer;
  text-align: left;
  width: 100%;
  transition: border-color 0.2s, background 0.2s;
}

.tech-row:hover {
  border-color: var(--border-strong);
  background: rgba(26, 39, 68, 0.5);
}

.tech-row__logo {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  flex-shrink: 0;
  object-fit: cover;
}

.tech-row__body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tech-row__top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.tech-row__name {
  font-family: var(--font-ui);
  font-size: 0.9375rem;
  font-weight: 300;
  color: var(--color-ivory);
}

.tech-row__count {
  font-family: var(--font-label);
  font-size: 0.8125rem;
  font-weight: 400;
  color: var(--color-ivory);
  white-space: nowrap;
  flex-shrink: 0;
}

.tech-row__total { color: var(--text-mute); }

.tech-row__track {
  height: 3px;
  background: var(--border);
  border-radius: 2px;
  overflow: hidden;
}

.tech-row__fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-stellar), var(--color-ivory));
  border-radius: 2px;
  transition: width 0.5s ease;
}

.tech-row__arrow {
  color: var(--text-mute);
  flex-shrink: 0;
  transition: color 0.2s;
}

.tech-row:hover .tech-row__arrow { color: var(--color-stellar); }

/* ── Reset ── */
.reset-zone {
  margin-top: 48px;
  display: flex;
  justify-content: center;
}

.reset-btn {
  font-family: var(--font-label);
  font-size: 10px;
  font-weight: 300;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-mute);
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 8px 18px;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
}

.reset-btn:hover {
  color: #f87171;
  border-color: rgba(248, 113, 113, 0.4);
}

/* ── Mobile ── */
@media (max-width: 640px) {
  .top-bar { padding: 12px 16px; }
  .breadcrumb { display: none; }
  .progress-content { padding: 40px 16px 60px; }
  .global-card__stats { gap: 24px; }
}
</style>
