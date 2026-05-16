<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useContentStore } from '../stores/contentStore'
import { useProgressStore } from '../stores/progressStore'
import NodeGraph from '../components/graph/NodeGraph.vue'
import NodeCard from '../components/node/NodeCard.vue'
import StarField from '../components/StarField.vue'
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
const inProgressCount = computed(() =>
  Object.values(statuses.value).filter(s => s === 'in_progress').length
)
const availableCount = computed(() =>
  Object.values(statuses.value).filter(s => s === 'available').length
)

const progressPercent = computed(() =>
  nodes.value.length === 0 ? 0 : Math.round((completedCount.value / nodes.value.length) * 100)
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
  toastTimer = setTimeout(() => { toastMessage.value = null }, 3000)
}

function onNodeClick(node: Node) {
  selectedNode.value = node
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

function onStart() {
  if (!selectedNode.value) return
  progressStore.startNode(techId.value, selectedNode.value.id)
}

function onComplete() {
  if (!selectedNode.value) return
  const projectId = selectedNode.value.projects[0]?.id ?? ''
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
  <div class="tech-view">
    <StarField />

    <!-- Header -->
    <header class="tech-header">
      <div class="tech-header__top">
        <button
          class="back-btn"
          aria-label="Retour aux technologies"
          @click="router.push(`/themes/${themeId}`)"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
        </button>
        <span class="tech-header__eyebrow">Constellation</span>
        <button
          v-if="completedCount > 0 && !loading"
          class="reset-btn"
          title="Réinitialiser la progression"
          @click="confirmReset"
        >↺</button>
      </div>

      <h1 class="tech-header__title">{{ technology?.label ?? techId }}</h1>
      <p v-if="technology?.description" class="tech-header__desc">{{ technology.description }}</p>

      <div v-if="!loading" class="tech-header__bottom">
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: `${progressPercent}%` }" />
        </div>
        <div class="count-chips">
          <span v-if="inProgressCount > 0" class="count-chip count-chip--progress">
            {{ inProgressCount }} en cours
          </span>
          <span v-if="availableCount > 0" class="count-chip count-chip--avail">
            {{ availableCount }} disponibles
          </span>
          <span class="count-chip count-chip--score">
            {{ completedCount }}<span class="count-chip__total">/{{ nodes.length }}</span>
          </span>
        </div>
      </div>
    </header>

    <!-- Completion banner -->
    <Transition name="completion">
      <div v-if="isCompleted" class="completion-banner">
        <span class="completion-banner__icon">✦</span>
        <div>
          <strong>{{ technology?.label }} maîtrisé</strong>
          <span>Tu as traversé toute la constellation.</span>
        </div>
      </div>
    </Transition>

    <!-- Graph -->
    <div v-if="loading" class="loading-state">Chargement de la constellation...</div>

    <div v-else class="graph-area">
      <NodeGraph
        :nodes="nodes"
        :statuses="statuses"
        @node-click="onNodeClick"
        @locked-node-click="onLockedNodeClick($event)"
      />
    </div>

    <!-- Node modal -->
    <Transition name="node-card">
      <NodeCard
        v-if="selectedNode"
        :node="selectedNode"
        :status="statuses[selectedNode.id]"
        :nodes="nodes"
        :statuses="statuses"
        @close="selectedNode = null"
        @start="onStart"
        @complete="onComplete"
      />
    </Transition>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="toastMessage" class="toast">{{ toastMessage }}</div>
    </Transition>
  </div>
</template>

<style scoped>
.tech-view {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

/* ── Header ── */
.tech-header {
  position: relative;
  z-index: 2;
  padding: 20px 28px 0;
  background: linear-gradient(180deg, rgba(0,0,26,0.92) 0%, rgba(0,0,26,0.6) 80%, transparent 100%);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.tech-header__top {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: rgba(26, 39, 68, 0.3);
  color: var(--color-slate);
  cursor: pointer;
  flex-shrink: 0;
  transition: border-color 0.2s, color 0.2s, background 0.2s;
}
.back-btn:hover {
  border-color: var(--accent);
  color: var(--color-ivory);
  background: rgba(88, 130, 136, 0.12);
}

.tech-header__eyebrow {
  flex: 1;
  font-family: var(--font-label);
  font-size: 10px;
  font-weight: 300;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--color-stellar);
}

.reset-btn {
  color: var(--color-slate);
  opacity: 0.5;
  font-size: 1rem;
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.2s, color 0.2s;
}
.reset-btn:hover { opacity: 1; color: var(--color-stellar); }

.tech-header__title {
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 4vw, 2.625rem);
  font-weight: 400;
  line-height: 1.05;
  letter-spacing: 0.02em;
  color: var(--color-ivory);
  margin-bottom: 8px;
}

.tech-header__desc {
  font-size: 0.9rem;
  color: var(--text-mute);
  line-height: 1.4;
  margin-bottom: 16px;
  max-width: 600px;
}

.tech-header__bottom {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 18px;
}

.progress-track {
  height: 3px;
  background: var(--border);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-stellar), var(--color-ivory));
  border-radius: 2px;
  transition: width 0.6s cubic-bezier(.4,0,.2,1);
}

.count-chips {
  display: flex;
  align-items: center;
  gap: 8px;
}

.count-chip {
  font-family: var(--font-label);
  font-size: 10px;
  font-weight: 300;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  padding: 3px 10px;
  border-radius: 999px;
  border: 1px solid var(--border);
  white-space: nowrap;
}

.count-chip--progress {
  color: var(--color-sand);
  border-color: rgba(200, 184, 152, 0.3);
  background: rgba(200, 184, 152, 0.06);
}

.count-chip--avail {
  color: var(--color-stellar);
  border-color: rgba(88, 130, 136, 0.35);
  background: rgba(88, 130, 136, 0.07);
}

.count-chip--score {
  color: var(--color-ivory);
  border-color: rgba(232, 227, 216, 0.2);
  background: rgba(232, 227, 216, 0.04);
}

.count-chip__total {
  color: var(--text-mute);
}

/* ── Completion banner ── */
.completion-banner {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 28px;
  background: rgba(232, 227, 216, 0.05);
  border-bottom: 1px solid rgba(232, 227, 216, 0.18);
  color: var(--color-ivory);
}

.completion-banner__icon {
  font-size: 1.25rem;
  text-shadow: 0 0 10px rgba(232, 227, 216, 0.7);
  flex-shrink: 0;
}

.completion-banner strong {
  display: block;
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: 400;
}

.completion-banner span {
  font-size: 0.8125rem;
  color: var(--text-mute);
}

/* ── Loading ── */
.loading-state {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-mute);
  font-family: var(--font-label);
  font-weight: 300;
  letter-spacing: 0.08em;
}

/* ── Graph ── */
.graph-area {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* ── Toast ── */
.toast {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(26, 39, 68, 0.95);
  border: 1px solid var(--accent);
  color: var(--color-ivory);
  padding: 10px 20px;
  border-radius: 999px;
  font-family: var(--font-ui);
  font-size: 0.875rem;
  white-space: nowrap;
  z-index: 400;
  box-shadow: 0 0 20px rgba(88, 130, 136, 0.25);
  backdrop-filter: blur(8px);
}

/* ── Transitions ── */
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
  transform: scale(0.97);
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

/* ── Mobile ── */
@media (max-width: 640px) {
  .tech-header { padding: 14px 16px 0; }
  .tech-header__desc { display: none; }
  .tech-header__title { font-size: 1.5rem; }
  .tech-header__bottom { padding-bottom: 14px; }

  .completion-banner { padding: 12px 16px; }

  .toast {
    width: calc(100% - 2rem);
    text-align: center;
    white-space: normal;
    bottom: 1rem;
  }
}
</style>
