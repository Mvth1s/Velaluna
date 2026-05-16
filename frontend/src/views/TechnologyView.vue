<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useContentStore } from '../stores/contentStore'
import { useProgressStore } from '../stores/progressStore'
import NodeGraph from '../components/graph/NodeGraph.vue'
import GraphLegend from '../components/graph/GraphLegend.vue'
import NodeCard from '../components/node/NodeCard.vue'
import StarField from '../components/StarField.vue'
import { LOGO_SQUARE } from '../assets/logos'
import type { Node, NodeStatus, Technology } from '../types/velaluna'

const route = useRoute()
const router = useRouter()
const contentStore = useContentStore()
const progressStore = useProgressStore()

const techId = computed(() => route.params.techId as string)
const themeId = computed(() => route.params.themeId as string)
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
  showToast('Concept maîtrisé ✦')
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
    <StarField />

    <header class="technology-view__header">
      <button class="technology-view__back" @click="router.push(`/themes/${themeId}`)">
        <img :src="LOGO_SQUARE" alt="Velaluna" class="technology-view__logo" />
      </button>
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
        <span class="technology-view__completion-icon">✦</span>
        <div>
          <strong>{{ technology?.label }} maîtrisé</strong>
          <span>Tu as traversé toute la constellation.</span>
        </div>
      </div>
    </Transition>

    <GraphLegend />

    <div v-if="loading" class="technology-view__loading">Chargement de la constellation...</div>

    <div v-else class="technology-view__content">
      <NodeGraph
        :nodes="nodes"
        :statuses="statuses"
        @node-click="onNodeClick"
        @locked-node-click="onLockedNodeClick($event)"
      />
    </div>

    <Transition name="node-card">
      <NodeCard
        v-if="selectedNode"
        :node="selectedNode"
        :status="statuses[selectedNode.id]"
        @close="selectedNode = null"
        @complete="onComplete"
      />
    </Transition>

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
  position: relative;
}

.technology-view__header {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1.5rem;
  border-bottom: 1px solid var(--color-deep);
  background: rgba(0, 0, 26, 0.85);
  backdrop-filter: blur(8px);
  min-height: 60px;
}

.technology-view__logo {
  height: 32px;
  object-fit: contain;
  opacity: 0.85;
  transition: opacity 0.2s;
}

.technology-view__logo:hover {
  opacity: 1;
}

.technology-view__back {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
}

.technology-view__title {
  flex: 1;
}

.technology-view__title h1 {
  font-family: var(--font-display);
  font-size: 1.375rem;
  font-weight: 400;
  color: var(--color-ivory);
  line-height: 1.2;
}

.technology-view__description {
  font-family: var(--font-ui);
  font-size: 0.8125rem;
  color: var(--color-sand);
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
  font-family: var(--font-label);
  font-size: 1rem;
  font-weight: 400;
  color: var(--color-ivory);
  white-space: nowrap;
}

.technology-view__progress--done {
  color: var(--color-stellar);
  text-shadow: 0 0 8px rgba(88, 130, 136, 0.6);
}

.technology-view__progress span {
  color: var(--color-sand);
  opacity: 0.6;
  font-size: 0.875rem;
}

.technology-view__reset {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-sand);
  opacity: 0.5;
  font-size: 1rem;
  padding: 0.25rem;
  line-height: 1;
  border-radius: 4px;
  transition: opacity 0.2s, color 0.2s;
}

.technology-view__reset:hover {
  opacity: 1;
  color: var(--color-stellar);
}

.technology-view__completion {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.75rem 1.5rem;
  background: rgba(88, 130, 136, 0.1);
  border-bottom: 1px solid rgba(88, 130, 136, 0.3);
  color: var(--color-stellar);
}

.technology-view__completion-icon {
  font-size: 1.25rem;
  line-height: 1;
  text-shadow: 0 0 8px rgba(88, 130, 136, 0.8);
}

.technology-view__completion strong {
  display: block;
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: 400;
  color: var(--color-ivory);
}

.technology-view__completion span {
  font-family: var(--font-ui);
  font-size: 0.8125rem;
  color: var(--color-sand);
}

.technology-view__loading {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-sand);
  font-family: var(--font-label);
  font-weight: 300;
  letter-spacing: 0.05em;
}

.technology-view__content {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  overflow: hidden;
}

.completion-enter-active,
.completion-leave-active {
  transition: all 0.35s ease;
}

.completion-enter-from,
.completion-leave-to {
  opacity: 0;
  transform: translateY(-0.5rem);
}

.node-card-enter-active,
.node-card-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.node-card-enter-from,
.node-card-leave-to {
  opacity: 0;
  transform: scale(0.96);
}

.technology-view__toast {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(26, 39, 68, 0.95);
  border: 1px solid var(--color-stellar);
  color: var(--color-ivory);
  padding: 0.625rem 1.25rem;
  border-radius: 20px;
  font-family: var(--font-ui);
  font-size: 0.875rem;
  white-space: nowrap;
  z-index: 100;
  box-shadow: 0 0 20px rgba(88, 130, 136, 0.3);
  backdrop-filter: blur(8px);
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
