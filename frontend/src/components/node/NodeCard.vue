<script setup lang="ts">
import type { Node, NodeStatus } from '../../types/velaluna'
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
</script>

<template>
  <aside class="node-card">
    <header class="node-card__header">
      <div class="node-card__title">
        <h2>{{ node.label }}</h2>
        <span class="node-card__difficulty">{{ node.difficulty }}</span>
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
        <p class="node-card__analogy">{{ node.analogy }}</p>
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
  border-left: 1px solid #e5e7eb;
  background: #ffffff;
  display: flex;
  flex-direction: column;
}

.node-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 1.25rem;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  background: #ffffff;
  z-index: 1;
}

.node-card__title h2 {
  font-size: 1.125rem;
  margin-bottom: 0.25rem;
}

.node-card__difficulty {
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.node-card__close {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.125rem;
  color: #9ca3af;
  line-height: 1;
  padding: 0.125rem;
  flex-shrink: 0;
}

.node-card__close:hover {
  color: #374151;
}

.node-card__body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.node-card__section h3 {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #6b7280;
  margin-bottom: 0.625rem;
}

.node-card__section p {
  font-size: 0.9375rem;
  line-height: 1.6;
  color: #374151;
}

.node-card__analogy {
  font-style: italic;
  color: #4b5563 !important;
}

.node-card__projects {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
</style>
