<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useContentStore } from '../stores/contentStore'
import { useProgressStore } from '../stores/progressStore'
import NodeGraph from '../components/graph/NodeGraph.vue'
import GraphLegend from '../components/graph/GraphLegend.vue'
import NodeCard from '../components/node/NodeCard.vue'
import type { Node, NodeStatus, Technology } from '../types/velaluna'

const route = useRoute()
const router = useRouter()
const contentStore = useContentStore()
const progressStore = useProgressStore()

const techId = computed(() => route.params.id as string)
const technology = ref<Technology | null>(null)
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

const completedCount = computed(() =>
  Object.values(statuses.value).filter(s => s === 'completed').length
)

const isCompleted = computed(() =>
  nodes.value.length > 0 && completedCount.value === nodes.value.length
)

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') selectedNode.value = null
}

onMounted(async () => {
  window.addEventListener('keydown', onKeydown)
  ;[technology.value, nodes.value] = await Promise.all([
    contentStore.fetchTechnology(techId.value),
    contentStore.fetchNodes(techId.value)
  ])
  loading.value = false
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
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

function onLockedNodeClick(node: Node) {
  const missingLabels = node.prerequisites
    .filter(id => statuses.value[id] !== 'completed')
    .map(id => nodes.value.find(n => n.id === id)?.label ?? id)

  if (missingLabels.length > 0) {
    showToast(`À compléter d'abord : ${missingLabels.join(', ')}`)
  } else {
    showToast('Complète d\'abord les prérequis !')
  }
}

function onComplete(projectId: string) {
  if (!selectedNode.value) return
  progressStore.completeNode(techId.value, selectedNode.value.id, projectId)
  showToast('Concept validé !')
}

function confirmReset() {
  if (confirm(`Réinitialiser la progression pour ${technology.value?.label ?? techId.value} ?`)) {
    progressStore.resetTechProgress(techId.value)
    selectedNode.value = null
  }
}
</script>

<template>
  <div class="technology-view">
    <header class="technology-view__header">
      <button class="technology-view__back" @click="router.push('/')">← Retour</button>
      <div class="technology-view__title">
        <h1>{{ technology?.label ?? techId }}</h1>
        <p v-if="technology?.description" class="technology-view__description">
          {{ technology.description }}
        </p>
      </div>
      <div v-if="!loading" class="technology-view__header-right">
        <div class="technology-view__progress" :class="{ 'technology-view__progress--done': isCompleted }">
          {{ completedCount }}<span>/{{ nodes.length }}</span>
        </div>
        <button
          v-if="completedCount > 0"
          class="technology-view__reset"
          title="Réinitialiser la progression"
          @click="confirmReset"
        >↺</button>
      </div>
    </header>

    <Transition name="completion">
      <div v-if="isCompleted" class="technology-view__completion">
        <span class="technology-view__completion-icon">🎉</span>
        <div>
          <strong>{{ technology?.label }} complété !</strong>
          <span>Tu as maîtrisé tous les concepts.</span>
        </div>
      </div>
    </Transition>

    <GraphLegend />

    <div v-if="loading" class="technology-view__loading">Chargement du graphe...</div>

    <div v-else class="technology-view__content">
      <NodeGraph
        :nodes="nodes"
        :statuses="statuses"
        @node-click="onNodeClick"
        @locked-node-click="onLockedNodeClick($event)"
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
  padding: 0.75rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  background: #ffffff;
  min-height: 56px;
}

.technology-view__title {
  flex: 1;
}

.technology-view__title h1 {
  font-size: 1.0625rem;
  font-weight: 600;
  line-height: 1.3;
}

.technology-view__description {
  font-size: 0.8125rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.3;
}

.technology-view__header-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.technology-view__progress {
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
  white-space: nowrap;
}

.technology-view__progress--done {
  color: #16a34a;
}

.technology-view__progress span {
  font-weight: 400;
  color: #9ca3af;
  font-size: 0.9375rem;
}

.technology-view__reset {
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  font-size: 1rem;
  padding: 0.25rem;
  line-height: 1;
  border-radius: 4px;
}

.technology-view__reset:hover {
  color: #6b7280;
  background: #f3f4f6;
}

.technology-view__completion {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.75rem 1.5rem;
  background: #f0fdf4;
  border-bottom: 1px solid #bbf7d0;
  color: #15803d;
}

.technology-view__completion-icon {
  font-size: 1.375rem;
  line-height: 1;
}

.technology-view__completion strong {
  display: block;
  font-size: 0.9375rem;
}

.technology-view__completion span {
  font-size: 0.8125rem;
  opacity: 0.8;
}

.technology-view__back {
  background: none;
  border: none;
  cursor: pointer;
  color: #3b82f6;
  font-size: 0.875rem;
  padding: 0;
  white-space: nowrap;
  flex-shrink: 0;
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

.completion-enter-active,
.completion-leave-active {
  transition: all 0.3s ease;
}

.completion-enter-from,
.completion-leave-to {
  opacity: 0;
  transform: translateY(-0.5rem);
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
