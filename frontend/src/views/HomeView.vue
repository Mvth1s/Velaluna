<script setup lang="ts">
import { useRouter } from 'vue-router'
import StarField from '../components/StarField.vue'
import { LOGO_SQUARE } from '../assets/logos'

const router = useRouter()
</script>

<template>
  <div class="home">
    <StarField />

    <div class="home-layout">
      <!-- Left: logo + text -->
      <div class="home-text">
        <p class="home-text__eyebrow">Cartographie du savoir</p>
        <h1 class="home-text__title">
          Apprends la tech,<br>
          <em class="home-text__accent">concept par concept</em>
        </h1>
        <p class="home-text__desc">
          Navigue dans un graphe de connaissances interactif.
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

      <!-- Right: logo carré -->
      <div class="home-visual">
        <img :src="LOGO_SQUARE" alt="" class="home-visual__logo" />
      </div>
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

/* ── Layout ── */
.home-layout {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  align-items: center;
  gap: 48px;
  max-width: 1080px;
  width: 100%;
  padding: 60px 48px;
}

/* ── Text column ── */
.home-text {
  display: flex;
  flex-direction: column;
}

.home-text__eyebrow {
  font-family: var(--font-label);
  font-size: 10px;
  font-weight: 300;
  letter-spacing: 0.34em;
  text-transform: uppercase;
  color: var(--color-stellar);
  margin-bottom: 16px;
}

.home-text__title {
  font-family: var(--font-display);
  font-size: clamp(2.25rem, 5vw, 4rem);
  font-weight: 400;
  line-height: 1.1;
  color: var(--color-ivory);
  margin-bottom: 22px;
}

.home-text__accent {
  font-style: italic;
  color: var(--color-stellar);
}

.home-text__desc {
  font-size: 1rem;
  line-height: 1.65;
  color: rgba(232, 227, 216, 0.62);
  margin-bottom: 36px;
  max-width: 430px;
}

/* ── Buttons ── */
.home-actions {
  display: flex;
  gap: 14px;
  align-items: center;
  margin-bottom: 52px;
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
  gap: 36px;
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

/* ── Logo visuel ── */
.home-visual {
  display: flex;
  align-items: center;
  justify-content: center;
}

.home-visual__logo {
  width: 100%;
  max-width: 280px;
  height: auto;
  opacity: 0.88;
  filter: drop-shadow(0 0 48px rgba(88, 130, 136, 0.25));
}

/* ── Mobile ── */
@media (max-width: 768px) {
  .home-layout {
    grid-template-columns: 1fr;
    padding: 56px 24px;
    gap: 48px;
  }
  .home-text__title { font-size: 2.25rem; }
  .home-visual { order: -1; }
  .home-visual__logo { max-width: 180px; }
}

@media (max-width: 480px) {
  .home-layout { padding: 48px 20px; }
  .home-text__title { font-size: 1.875rem; }
  .home-stats { gap: 24px; }
  .home-visual { display: none; }
}
</style>
