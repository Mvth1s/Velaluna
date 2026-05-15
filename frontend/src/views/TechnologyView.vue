<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useContentStore } from '../stores/contentStore'
import { useProgressStore } from '../stores/progressStore'
import NodeGraph from '../components/graph/NodeGraph.vue'
import GraphLegend from '../components/graph/GraphLegend.vue'
import NodeCard from '../components/node/NodeCard.vue'
import type { Node, NodeStatus } from '../types/velaluna'

const route = useRoute()
const router = useRouter()
const contentStore = useContentStore()
const progressStore = useProgressStore()

const techId = computed(() => route.params.id as string)
const nodes = ref<Node[]>([])
const selectedNode = ref<Node | null>(null)
const loading = ref(true)
const toastMessage = ref<string | null>(null)
let toastTimer: ReturnType<typeof setTimeout> | null = null

const statuses = computed<Record<string, NodeStatus>>(() => {
  const result: Record<string, NodeStatus> = {}
  nodes.value.forEach(node => {
    result[node.id] = progressStore.getNodeStatus(techId.value, node.id, node.prerequisites)
  })
  return result
})

onMounted(async () => {
  nodes.value = await contentStore.fetchNodes(techId.value)
  loading.value = false
})

function showToast(message: string) {
  toastMessage.value = message
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastMessage.value = null
  }, 3000)
}

function onNodeClick(node: Node) {
  selectedNode.value = node
  progressStore.startNode(techId.value, node.id)
}

function onLockedNodeClick() {
  showToast('Complète d\'abord les prérequis !')
}

function onComplete(projectId: string) {
  if (!selectedNode.value) return
  progressStore.completeNode(techId.value, selectedNode.value.id, projectId)
  showToast('Concept validé !')
}
</script>

<template>
  <div class="technology-view">
    <header class="technology-view__header">
      <button class="technology-view__back" @click="router.push('/')">← Retour</button>
      <h1>{{ techId }}</h1>
    </header>

    <GraphLegend />

    <div v-if="loading" class="technology-view__loading">Chargement du graphe...</div>

    <div v-else class="technology-view__content">
      <NodeGraph
        :nodes="nodes"
        :statuses="statuses"
        @node-click="onNodeClick"
        @locked-node-click="onLockedNodeClick"
      />

      <NodeCard
        v-if="selectedNode"
        :node="selectedNode"
        :status="statuses[selectedNode.id]"
        @close="selectedNode = null"
        @complete="onComplete"
      />
    </div>

    <Transition name="toast">
      <div v-if="toastMessage" class="technology-view__toast">{{ toastMessage }}</div>
    </Transition>
  </div>
</template>

<style scoped>
.technology-view {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.technology-view__header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  background: #ffffff;
}

.technology-view__header h1 {
  font-size: 1.125rem;
  font-weight: 600;
  text-transform: capitalize;
}

.technology-view__back {
  background: none;
  border: none;
  cursor: pointer;
  color: #3b82f6;
  font-size: 0.875rem;
  padding: 0;
}

.technology-view__back:hover {
  text-decoration: underline;
}

.technology-view__loading {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
}

.technology-view__content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.technology-view__toast {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: #1f2937;
  color: #ffffff;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.875rem;
  white-space: nowrap;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(0.5rem);
}
</style>
