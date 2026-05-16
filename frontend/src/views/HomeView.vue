<script setup lang="ts">
import { useRouter } from 'vue-router'
import StarField from '../components/StarField.vue'
import { LOGO_BANNER } from '../assets/logos'

const router = useRouter()
</script>

<template>
  <div class="home">
    <StarField />

    <header class="home-bar">
      <img :src="LOGO_BANNER" alt="Velaluna" class="home-bar__logo" />
    </header>

    <div class="home-layout">
      <!-- Left: text -->
      <div class="home-text">
        <p class="home-text__eyebrow">Cartographie du savoir</p>
        <h1 class="home-text__title">
          Apprends la tech,<br>
          <em class="home-text__accent">concept par concept</em>
        </h1>
        <p class="home-text__desc">
          Navigue dans un graphe de connaissances interactif.<br>
          Chaque nœud est un concept relié à ses prérequis et à ce qu'il débloque.
        </p>
        <div class="home-actions">
          <button class="btn-primary" @click="router.push('/themes')">
            Explorer les thèmes <span class="btn-arrow" />
          </button>
        </div>
        <div class="home-stats">
          <div class="home-stat">
            <span class="home-stat__value">4</span>
            <span class="home-stat__label">Technos</span>
          </div>
          <div class="home-stat">
            <span class="home-stat__value">36</span>
            <span class="home-stat__label">Concepts</span>
          </div>
          <div class="home-stat">
            <span class="home-stat__value">∞</span>
            <span class="home-stat__label">Connexions</span>
          </div>
        </div>
      </div>

      <!-- Right: constellation visual -->
      <div class="home-visual" aria-hidden="true">
        <svg class="constellation" viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Edges -->
          <line x1="160" y1="60"  x2="80"  y2="140" stroke="rgba(88,130,136,0.4)" stroke-width="1" />
          <line x1="160" y1="60"  x2="240" y2="140" stroke="rgba(88,130,136,0.4)" stroke-width="1" />
          <line x1="80"  y1="140" x2="120" y2="230" stroke="rgba(88,130,136,0.3)" stroke-width="1" />
          <line x1="240" y1="140" x2="200" y2="230" stroke="rgba(88,130,136,0.3)" stroke-width="1" />
          <line x1="80"  y1="140" x2="200" y2="230" stroke="rgba(88,130,136,0.15)" stroke-width="1" />
          <line x1="240" y1="140" x2="120" y2="230" stroke="rgba(88,130,136,0.15)" stroke-width="1" />
          <line x1="120" y1="230" x2="200" y2="230" stroke="rgba(232,227,216,0.2)"  stroke-width="1" />
          <!-- Node: completed (top) -->
          <circle cx="160" cy="60" r="24" fill="#E8E3D8" opacity="0.95" />
          <circle cx="160" cy="60" r="30" fill="rgba(232,227,216,0.08)" />
          <!-- Nodes: available -->
          <circle cx="80"  cy="140" r="20" fill="#588288" opacity="0.9" />
          <circle cx="240" cy="140" r="20" fill="#588288" opacity="0.9" />
          <!-- Nodes: in_progress -->
          <circle cx="120" cy="230" r="18" fill="#C8B898" opacity="0.85" />
          <!-- Nodes: locked -->
          <circle cx="200" cy="230" r="16" fill="#1A2744" stroke="rgba(138,157,187,0.5)" stroke-width="1" />
          <!-- Glow on completed node -->
          <circle cx="160" cy="60" r="24" fill="none" stroke="rgba(232,227,216,0.3)" stroke-width="2">
            <animate attributeName="r" values="24;30;24" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0;0.3" dur="3s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

/* ── Top bar ── */
.home-bar {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  padding: 14px 28px;
  border-bottom: 1px solid var(--border);
  background: rgba(0, 0, 26, 0.65);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.home-bar__logo {
  height: 40px;
  width: auto;
  max-width: 220px;
  object-fit: contain;
}

/* ── Layout ── */
.home-layout {
  position: relative;
  z-index: 1;
  flex: 1;
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  align-items: center;
  gap: 40px;
  max-width: 1100px;
  margin: 0 auto;
  padding: 60px 40px;
  width: 100%;
}

/* ── Text ── */
.home-text {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.home-text__eyebrow {
  font-family: var(--font-label);
  font-size: 10px;
  font-weight: 300;
  letter-spacing: 0.34em;
  text-transform: uppercase;
  color: var(--color-stellar);
  margin-bottom: 20px;
}

.home-text__title {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 5.5vw, 4.25rem);
  font-weight: 400;
  line-height: 1.08;
  color: var(--color-ivory);
  margin-bottom: 24px;
}

.home-text__accent {
  font-style: italic;
  color: var(--color-stellar);
}

.home-text__desc {
  font-size: 1rem;
  line-height: 1.65;
  color: rgba(232, 227, 216, 0.65);
  margin-bottom: 36px;
  max-width: 440px;
}

/* ── Buttons ── */
.home-actions {
  display: flex;
  gap: 14px;
  align-items: center;
  margin-bottom: 48px;
  flex-wrap: wrap;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 13px 26px;
  font-family: var(--font-label);
  font-size: 11px;
  font-weight: 300;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  color: var(--color-ivory);
  border: 1px solid var(--accent);
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(88,130,136,0.36), rgba(88,130,136,0.14));
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
}
.btn-primary:hover {
  background: linear-gradient(180deg, rgba(88,130,136,0.52), rgba(88,130,136,0.26));
  box-shadow: 0 0 24px rgba(88, 130, 136, 0.22);
}

.btn-arrow {
  display: inline-block;
  width: 20px;
  height: 1px;
  background: currentColor;
  position: relative;
}
.btn-arrow::after {
  content: '';
  position: absolute;
  right: -1px;
  top: -3px;
  border-left: 5px solid currentColor;
  border-top: 3px solid transparent;
  border-bottom: 3px solid transparent;
}

/* ── Stats ── */
.home-stats {
  display: flex;
  gap: 32px;
}

.home-stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.home-stat__value {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 400;
  line-height: 1;
  color: var(--color-ivory);
}

.home-stat__label {
  font-family: var(--font-label);
  font-size: 10px;
  font-weight: 300;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--text-mute);
}

/* ── Constellation ── */
.home-visual {
  display: flex;
  align-items: center;
  justify-content: center;
}

.constellation {
  width: 100%;
  max-width: 320px;
  height: auto;
  opacity: 0.85;
  filter: drop-shadow(0 0 40px rgba(88, 130, 136, 0.2));
}

/* ── Mobile ── */
@media (max-width: 768px) {
  .home-layout {
    grid-template-columns: 1fr;
    padding: 48px 20px;
    gap: 48px;
  }

  .home-text__title { font-size: 2.5rem; }
  .home-visual { order: -1; }
  .constellation { max-width: 240px; }
}

@media (max-width: 480px) {
  .home-text__title { font-size: 2rem; }
  .home-stats { gap: 24px; }
  .home-visual { display: none; }
}
</style>
