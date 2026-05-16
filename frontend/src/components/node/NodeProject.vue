<script setup lang="ts">
import type { NodeProject, Difficulty } from '../../types/velaluna'

defineProps<{
  project: NodeProject
  completed: boolean
}>()

const emit = defineEmits<{ complete: [] }>()

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  beginner: 'Débutant',
  intermediate: 'Intermédiaire',
  advanced: 'Avancé'
}
</script>

<template>
  <div class="node-project" :class="{ 'node-project--completed': completed }">
    <div class="node-project__header">
      <strong>{{ project.label }}</strong>
      <span class="node-project__difficulty">{{ DIFFICULTY_LABELS[project.difficulty] }}</span>
    </div>
    <p class="node-project__description">{{ project.description }}</p>
    <details class="node-project__hint">
      <summary>Indice</summary>
      <p>{{ project.hint }}</p>
    </details>
    <button v-if="!completed" class="node-project__complete" @click="emit('complete')">
      Marquer comme maîtrisé
    </button>
    <div v-else class="node-project__done">✦ Maîtrisé</div>
  </div>
</template>

<style scoped>
.node-project {
  border: 1px solid var(--color-deep);
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: rgba(26, 39, 68, 0.3);
  transition: border-color 0.2s;
}

.node-project--completed {
  border-color: rgba(34, 197, 94, 0.3);
  background: rgba(34, 197, 94, 0.05);
}

.node-project__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.node-project__header strong {
  font-family: var(--font-ui);
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--color-ivory);
}

.node-project__difficulty {
  font-family: var(--font-label);
  font-size: 0.6875rem;
  font-weight: 300;
  color: var(--color-sand);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  opacity: 0.7;
}

.node-project__description {
  font-family: var(--font-ui);
  font-size: 0.875rem;
  color: var(--color-sand);
  line-height: 1.55;
}

.node-project__hint {
  font-family: var(--font-ui);
  font-size: 0.875rem;
}

.node-project__hint summary {
  cursor: pointer;
  color: var(--color-stellar);
  user-select: none;
  font-size: 0.8125rem;
  letter-spacing: 0.02em;
}

.node-project__hint p {
  margin-top: 0.5rem;
  color: var(--color-sand);
  opacity: 0.8;
  line-height: 1.5;
}

.node-project__complete {
  background: var(--color-stellar);
  color: var(--color-space);
  border: none;
  border-radius: 20px;
  padding: 0.5rem 1.25rem;
  cursor: pointer;
  font-family: var(--font-ui);
  font-size: 0.875rem;
  font-weight: 500;
  align-self: flex-start;
  transition: filter 0.2s, box-shadow 0.2s;
}

.node-project__complete:hover {
  filter: brightness(1.1);
  box-shadow: 0 0 12px rgba(88, 130, 136, 0.5);
}

.node-project__done {
  font-family: var(--font-label);
  font-weight: 300;
  color: var(--color-done);
  font-size: 0.875rem;
  letter-spacing: 0.05em;
  text-shadow: 0 0 6px rgba(34, 197, 94, 0.4);
}
</style>
