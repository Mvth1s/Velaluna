<script setup lang="ts">
import { ref } from 'vue'
import type { Node, NodeStatus, Difficulty } from '../../types/velaluna'
import NodeExample from './NodeExample.vue'
import NodeProject from './NodeProject.vue'

defineProps<{
  node: Node
  status: NodeStatus
}>()

const emit = defineEmits<{
  close: []
  complete: [projectId: string]
}>()

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  beginner: 'Débutant',
  intermediate: 'Intermédiaire',
  advanced: 'Avancé'
}

const celebrating = ref(false)
let pendingProjectId = ''

function handleComplete(projectId: string) {
  pendingProjectId = projectId
  celebrating.value = true
  setTimeout(() => {
    emit('complete', pendingProjectId)
    celebrating.value = false
    setTimeout(() => emit('close'), 100)
  }, 1600)
}
</script>

<template>
  <div class="node-card-overlay" @click.self="emit('close')">
    <div class="node-card">
      <header class="node-card__header">
        <div class="node-card__title">
          <h2>{{ node.label }}</h2>
          <span class="node-card__difficulty">{{ DIFFICULTY_LABELS[node.difficulty] }}</span>
        </div>
        <button class="node-card__close" aria-label="Fermer" @click="emit('close')">✕</button>
      </header>

      <div class="node-card__body">
        <div class="node-card__col">
          <section class="node-card__section">
            <h3>Explication</h3>
            <p>{{ node.explanation }}</p>
          </section>

          <section class="node-card__section">
            <h3>Analogie</h3>
            <div class="node-card__analogy">
              <p>{{ node.analogy }}</p>
            </div>
          </section>

          <section class="node-card__section">
            <h3>Exemple</h3>
            <NodeExample :example="node.example" />
          </section>
        </div>

        <div class="node-card__col">
          <section class="node-card__section">
            <h3>Mini-projets</h3>
            <div class="node-card__projects">
              <NodeProject
                v-for="project in node.projects"
                :key="project.id"
                :project="project"
                :completed="status === 'completed'"
                @complete="() => handleComplete(project.id)"
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>

  <Transition name="celebration">
    <div v-if="celebrating" class="node-card__celebration">
      <div class="celebration__icon">✦</div>
      <p class="celebration__text">Concept maîtrisé !</p>
      <div class="celebration__particles">
        <div class="burst-particle" style="--tx: 0px; --ty: -70px" />
        <div class="burst-particle" style="--tx: 67px; --ty: -22px" />
        <div class="burst-particle" style="--tx: 41px; --ty: 58px" />
        <div class="burst-particle" style="--tx: -41px; --ty: 58px" />
        <div class="burst-particle" style="--tx: -67px; --ty: -22px" />
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.node-card-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.node-card {
  position: relative;
  width: 90vw;
  max-width: 1100px;
  max-height: 85vh;
  overflow-y: auto;
  background: var(--color-night);
  border: 1px solid var(--color-deep);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
}

.node-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.5rem 1.75rem 1.25rem;
  border-bottom: 1px solid var(--color-deep);
  position: sticky;
  top: 0;
  background: var(--color-night);
  z-index: 1;
  border-radius: 16px 16px 0 0;
}

.node-card__title h2 {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 400;
  color: var(--color-ivory);
  margin-bottom: 0.25rem;
  line-height: 1.2;
}

.node-card__difficulty {
  font-family: var(--font-label);
  font-size: 0.6875rem;
  font-weight: 300;
  color: var(--color-stellar);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.node-card__close {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: var(--color-sand);
  opacity: 0.5;
  line-height: 1;
  padding: 0.25rem;
  flex-shrink: 0;
  transition: opacity 0.2s, color 0.2s;
}

.node-card__close:hover {
  opacity: 1;
  color: var(--color-ivory);
}

.node-card__body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  flex: 1;
}

.node-card__col {
  padding: 1.5rem 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.node-card__col:first-child {
  border-right: 1px solid var(--color-deep);
}

.node-card__section h3 {
  font-family: var(--font-label);
  font-size: 0.6875rem;
  font-weight: 300;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-stellar);
  margin-bottom: 0.625rem;
}

.node-card__section p {
  font-family: var(--font-ui);
  font-size: 0.9375rem;
  line-height: 1.7;
  color: var(--color-sand);
}

.node-card__analogy {
  background: var(--color-deep);
  border-radius: 8px;
  padding: 0.875rem 1rem;
}

.node-card__analogy p {
  font-style: italic;
}

.node-card__projects {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* ── Célébration ── */

.node-card__celebration {
  position: fixed;
  inset: 0;
  z-index: 300;
  background: rgba(0, 0, 26, 0.85);
  backdrop-filter: blur(4px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
}

.celebration__icon {
  font-size: 4rem;
  color: var(--color-done);
  text-shadow: 0 0 24px rgba(34, 197, 94, 0.8);
  animation: celebIcon 400ms ease-out forwards;
}

.celebration__text {
  font-family: var(--font-display);
  font-size: 2rem;
  color: var(--color-ivory);
  animation: celebFade 400ms 200ms ease-out both;
}

.celebration__particles {
  position: relative;
  width: 0;
  height: 0;
}

.burst-particle {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-done);
  transform: translate(-50%, -50%);
  animation: burst 800ms 200ms ease-out both;
}

/* Transition Vue */
.celebration-enter-active,
.celebration-leave-active {
  transition: opacity 0.15s;
}

.celebration-enter-from,
.celebration-leave-to {
  opacity: 0;
}

@keyframes celebIcon {
  0%   { transform: scale(0);   opacity: 0; }
  70%  { transform: scale(1.3); opacity: 1; }
  100% { transform: scale(1);   opacity: 1; }
}

@keyframes celebFade {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes burst {
  0%   { transform: translate(calc(-50%), calc(-50%)) scale(1); opacity: 1; }
  100% { transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(0); opacity: 0; }
}

@media (max-width: 640px) {
  .node-card-overlay {
    padding: 1rem;
    align-items: center;
    justify-content: center;
  }

  .node-card {
    width: 90vw;
    max-width: 90vw;
    height: auto;
    max-height: 90vh;
    border-radius: 16px;
  }

  .node-card__header {
    border-radius: 16px 16px 0 0;
  }

  .node-card__body {
    grid-template-columns: 1fr;
  }

  .node-card__col:first-child {
    border-right: none;
    border-bottom: 1px solid var(--color-deep);
  }
}
</style>
