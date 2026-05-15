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
  lockedNodeClick: []
}>()

const containerRef = ref<HTMLElement | null>(null)
const nodesRef = computed(() => props.nodes)
const statusesRef = computed(() => props.statuses)

useCytoscape(containerRef, nodesRef, statusesRef, {
  onNodeTap(nodeId, status) {
    if (status === 'locked') {
      emit('lockedNodeClick')
      return
    }
    const node = props.nodes.find(n => n.id === nodeId)
    if (node) emit('nodeClick', node)
  }
})
</script>

<template>
  <div ref="containerRef" class="node-graph" />
</template>

<style scoped>
.node-graph {
  flex: 1;
  min-height: 500px;
  background: #ffffff;
}
</style>
