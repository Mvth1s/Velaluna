<script setup lang="ts">
import type { NodeProject } from '../../types/velaluna'

defineProps<{
  project: NodeProject
  completed: boolean
}>()

const emit = defineEmits<{ complete: [] }>()
</script>

<template>
  <div class="node-project" :class="{ 'node-project--completed': completed }">
    <div class="node-project__header">
      <strong>{{ project.label }}</strong>
      <span class="node-project__difficulty">{{ project.difficulty }}</span>
    </div>
    <p class="node-project__description">{{ project.description }}</p>
    <details class="node-project__hint">
      <summary>Indice</summary>
      <p>{{ project.hint }}</p>
    </details>
    <button v-if="!completed" class="node-project__complete" @click="emit('complete')">
      Marquer comme terminé
    </button>
    <div v-else class="node-project__done">✓ Terminé</div>
  </div>
</template>

<style scoped>
.node-project {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.node-project--completed {
  border-color: #22c55e;
  background: #f0fdf4;
}

.node-project__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.node-project__difficulty {
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.node-project__description {
  font-size: 0.875rem;
  color: #374151;
  line-height: 1.5;
}

.node-project__hint {
  font-size: 0.875rem;
}

.node-project__hint summary {
  cursor: pointer;
  color: #3b82f6;
  user-select: none;
}

.node-project__hint p {
  margin-top: 0.375rem;
  color: #6b7280;
}

.node-project__complete {
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.875rem;
  align-self: flex-start;
  transition: background 0.15s;
}

.node-project__complete:hover {
  background: #2563eb;
}

.node-project__done {
  color: #16a34a;
  font-weight: 600;
  font-size: 0.875rem;
}
</style>
