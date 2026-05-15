<script setup lang="ts">
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
</script>

<template>
  <aside class="node-card">
    <header class="node-card__header">
      <div class="node-card__title">
        <h2>{{ node.label }}</h2>
        <span class="node-card__difficulty">{{ DIFFICULTY_LABELS[node.difficulty] }}</span>
      </div>
      <button class="node-card__close" aria-label="Fermer" @click="emit('close')">✕</button>
    </header>

    <div class="node-card__body">
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

      <section class="node-card__section">
        <h3>Mini-projets</h3>
        <div class="node-card__projects">
          <NodeProject
            v-for="project in node.projects"
            :key="project.id"
            :project="project"
            :completed="status === 'completed'"
            @complete="emit('complete', project.id)"
          />
        </div>
      </section>
    </div>
  </aside>
</template>

<style scoped>
.node-card {
  width: 380px;
  min-width: 380px;
  height: 100%;
  overflow-y: auto;
  border-left: 3px solid var(--color-stellar);
  background: var(--color-night);
  display: flex;
  flex-direction: column;
}

.node-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 1.25rem 1.25rem 1rem;
  border-bottom: 1px solid var(--color-deep);
  position: sticky;
  top: 0;
  background: var(--color-night);
  z-index: 1;
}

.node-card__title h2 {
  font-family: var(--font-display);
  font-size: 1.375rem;
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
  padding: 0.125rem;
  flex-shrink: 0;
  transition: opacity 0.2s, color 0.2s;
}

.node-card__close:hover {
  opacity: 1;
  color: var(--color-ivory);
}

.node-card__body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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
  color: var(--color-sand) !important;
}

.node-card__projects {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
</style>
