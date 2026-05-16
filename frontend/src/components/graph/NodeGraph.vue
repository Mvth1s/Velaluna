<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCytoscape } from '../../composables/useCytoscape'
import type { Node, NodeStatus } from '../../types/velaluna'

const props = defineProps<{
  nodes: Node[]
  statuses: Record<string, NodeStatus>
}>()

const emit = defineEmits<{
  nodeClick: [node: Node]
  lockedNodeClick: [node: Node]
}>()

const containerRef = ref<HTMLElement | null>(null)
const nodesRef = computed(() => props.nodes)
const statusesRef = computed(() => props.statuses)

useCytoscape(containerRef, nodesRef, statusesRef, {
  onNodeTap(nodeId, status) {
    const node = props.nodes.find(n => n.id === nodeId)
    if (!node) return
    if (status === 'locked') {
      emit('lockedNodeClick', node)
      return
    }
    emit('nodeClick', node)
  }
})
</script>

<template>
  <div class="node-graph-wrap">
    <div ref="containerRef" class="node-graph" />
    <div class="graph-legend" aria-hidden="true">
      <span class="legend-item"><span class="legend-dot legend-dot--completed" />Maîtrisé</span>
      <span class="legend-item"><span class="legend-dot legend-dot--in-progress" />En cours</span>
      <span class="legend-item"><span class="legend-dot legend-dot--available" />Disponible</span>
      <span class="legend-item"><span class="legend-dot legend-dot--locked" />Verrouillé</span>
    </div>
  </div>
</template>

<style scoped>
.node-graph-wrap {
  flex: 1;
  position: relative;
  display: flex;
  overflow: hidden;
}

.node-graph {
  flex: 1;
  min-height: 500px;
  background: transparent;
  overflow: hidden;
  position: relative;
}

.graph-legend {
  position: absolute;
  bottom: 24px;
  left: 32px;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 16px;
  background: rgba(16, 24, 40, 0.65);
  border: 1px solid var(--border);
  border-radius: 999px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  z-index: 3;
  pointer-events: none;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 7px;
  font-family: var(--font-label);
  font-size: 10px;
  font-weight: 300;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-slate);
  white-space: nowrap;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-dot--completed {
  background: var(--color-ivory);
  box-shadow: 0 0 6px rgba(232, 227, 216, 0.5);
}

.legend-dot--in-progress {
  background: var(--color-sand);
}

.legend-dot--available {
  background: var(--color-stellar);
  box-shadow: 0 0 6px rgba(88, 130, 136, 0.5);
}

.legend-dot--locked {
  background: var(--color-deep);
  border: 1px solid var(--color-slate);
  opacity: 0.7;
}

@media (max-width: 640px) {
  .node-graph {
    min-height: 0;
  }

  .graph-legend {
    gap: 10px;
    padding: 8px 12px;
    bottom: 12px;
    left: 12px;
    font-size: 9px;
  }
}
</style>
