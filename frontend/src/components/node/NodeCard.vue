<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Node, NodeStatus, Difficulty } from '../../types/velaluna'
import NodeExample from './NodeExample.vue'
import NodeProject from './NodeProject.vue'

const props = defineProps<{
  node: Node
  status: NodeStatus
  nodes: Node[]
  statuses: Record<string, NodeStatus>
}>()

const emit = defineEmits<{
  close: []
  start: []
  complete: []
}>()

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  beginner: 'Débutant',
  intermediate: 'Intermédiaire',
  advanced: 'Avancé'
}

const STATUS_LABELS: Record<NodeStatus, string> = {
  locked: 'Verrouillé',
  available: 'Disponible',
  in_progress: 'En cours',
  completed: 'Maîtrisé',
}

const byId = computed(() => Object.fromEntries(props.nodes.map(n => [n.id, n])))
const prerequisites = computed(() => props.node.prerequisites.map(id => byId.value[id]).filter(Boolean))
const unlocks = computed(() => props.node.unlocks.map(id => byId.value[id]).filter(Boolean))

const celebrating = ref(false)

function handleComplete() {
  celebrating.value = true
  setTimeout(() => {
    emit('complete')
    celebrating.value = false
    setTimeout(() => emit('close'), 100)
  }, 1500)
}
</script>

<template>
  <div class="modal-back" @click.self="emit('close')">
    <div class="modal" role="dialog" :aria-label="node.label">
      <!-- Header -->
      <div class="modal-head">
        <div class="modal-head__content">
          <h2 class="modal-head__title">{{ node.label }}</h2>
          <div class="modal-head__meta">
            <span class="chip" :class="status">
              <span class="chip__dot" />
              {{ STATUS_LABELS[status] }}
            </span>
            <span class="diff" :class="node.difficulty">{{ DIFFICULTY_LABELS[node.difficulty] }}</span>
          </div>
        </div>
        <button class="modal-close" aria-label="Fermer" @click="emit('close')">
          <svg width="14" height="14" viewBox="0 0 14 14">
            <path d="M2,2 L12,12 M12,2 L2,12" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
          </svg>
        </button>
      </div>

      <!-- Body -->
      <div class="modal-body">
        <!-- Locked warning -->
        <div v-if="status === 'locked'" class="locked-banner">
          <div class="locked-banner__label">Verrouillé</div>
          <p>Valide d'abord {{ prerequisites.length === 1 ? 'le prérequis' : 'les prérequis' }} pour débloquer ce concept.</p>
        </div>

        <!-- Explication -->
        <div class="block">
          <div class="block-h">Explication</div>
          <p class="block-text">{{ node.explanation }}</p>
        </div>

        <!-- Analogie -->
        <div class="block">
          <div class="block-h">Analogie</div>
          <div class="analogy">{{ node.analogy }}</div>
        </div>

        <!-- Exemple -->
        <div class="block">
          <div class="block-h">Exemple</div>
          <NodeExample :example="node.example" />
        </div>

        <!-- Connexions -->
        <div v-if="prerequisites.length > 0 || unlocks.length > 0" class="block">
          <div class="block-h">Connexions</div>
          <div class="connections">
            <div v-if="prerequisites.length > 0" class="connection-group">
              <div class="connection-group__label">Prérequis</div>
              <div class="connection-list">
                <div
                  v-for="n in prerequisites"
                  :key="n.id"
                  class="connection-item"
                  :class="{ 'connection-item--done': statuses[n.id] === 'completed' }"
                >
                  <span class="connection-item__dot" />
                  <span>{{ n.label }}</span>
                </div>
              </div>
            </div>
            <div v-if="unlocks.length > 0" class="connection-group">
              <div class="connection-group__label">Débloque</div>
              <div class="connection-list">
                <div
                  v-for="n in unlocks"
                  :key="n.id"
                  class="connection-item"
                  :class="{ 'connection-item--done': statuses[n.id] === 'completed' }"
                >
                  <span class="connection-item__dot" />
                  <span>{{ n.label }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Mini-projets -->
        <div class="block">
          <div class="block-h">Mini-projet{{ node.projects.length > 1 ? 's' : '' }}</div>
          <div class="projects-list">
            <NodeProject
              v-for="project in node.projects"
              :key="project.id"
              :project="project"
              :completed="status === 'completed'"
            />
          </div>
        </div>

        <!-- Actions footer -->
        <div class="modal-actions">
          <template v-if="status === 'completed'">
            <button class="btn btn-ghost" @click="emit('close')">Fermer</button>
          </template>
          <template v-else-if="status === 'available'">
            <button class="btn btn-ghost" @click="emit('start')">Marquer comme commencé</button>
            <button class="btn btn-primary" @click="handleComplete">
              Marquer comme maîtrisé <span class="btn-arrow" />
            </button>
          </template>
          <template v-else-if="status === 'in_progress'">
            <button class="btn btn-primary" @click="handleComplete">
              Marquer comme maîtrisé <span class="btn-arrow" />
            </button>
          </template>
          <template v-else-if="status === 'locked'">
            <button class="btn btn-ghost" @click="emit('close')">Retour au graphe</button>
          </template>
        </div>
      </div>
    </div>
  </div>

  <!-- Célébration -->
  <Transition name="celebration">
    <div v-if="celebrating" class="node-celebration">
      <div class="celebration__icon">✦</div>
      <p class="celebration__text">Concept maîtrisé !</p>
      <div class="celebration__particles">
        <div class="burst-particle" style="--tx: 0px; --ty: -70px" />
        <div class="burst-particle" style="--tx: 67px; --ty: -22px" />
        <div class="burst-particle" style="--tx: 41px; --ty: 58px" />
        <div class="burst-particle" style="--tx: -41px; --ty: 58px" />
        <div class="burst-particle" style="--tx: -67px; --ty: -22px" />
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* ── Overlay ── */
.modal-back {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(0, 0, 12, 0.72);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
}

/* ── Modal ── */
.modal {
  width: min(880px, 100%);
  max-height: 100%;
  background: linear-gradient(180deg, rgba(16,24,40,0.97), rgba(10,16,28,0.97));
  border: 1px solid var(--border-strong);
  border-radius: 18px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow:
    0 30px 80px rgba(0,0,0,0.6),
    0 0 0 1px rgba(88,130,136,0.08),
    0 0 60px rgba(88,130,136,0.06);
}

/* ── Header ── */
.modal-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 22px 28px;
  border-bottom: 1px solid var(--border);
  background: linear-gradient(180deg, rgba(88,130,136,0.06), transparent);
  position: sticky;
  top: 0;
  z-index: 1;
}

.modal-head__title {
  font-family: var(--font-display);
  font-size: 2.25rem;
  font-weight: 400;
  line-height: 1.05;
  color: var(--color-ivory);
  letter-spacing: 0.02em;
  margin-bottom: 10px;
}

.modal-head__meta {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.modal-close {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-slate);
  flex-shrink: 0;
  transition: border-color 0.2s, color 0.2s;
  cursor: pointer;
}
.modal-close:hover { border-color: var(--accent); color: var(--color-ivory); }

/* ── Chips & Diffs ── */
.chip {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 4px 10px;
  border-radius: 999px;
  font-family: var(--font-label);
  font-size: 10px;
  font-weight: 300;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  border: 1px solid var(--border);
  white-space: nowrap;
}
.chip__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
  background: currentColor;
}
.chip.completed { color: var(--color-ivory); border-color: rgba(232,227,216,0.5); background: rgba(232,227,216,0.05); }
.chip.completed .chip__dot { box-shadow: 0 0 8px var(--color-ivory); }
.chip.available { color: var(--color-stellar); border-color: rgba(88,130,136,0.5); background: rgba(88,130,136,0.08); }
.chip.available .chip__dot { box-shadow: 0 0 8px var(--color-stellar); }
.chip.in_progress { color: var(--color-sand); border-color: rgba(200,184,152,0.5); background: rgba(200,184,152,0.06); }
.chip.locked { color: var(--color-slate); opacity: 0.7; }

.diff {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-label);
  font-size: 10px;
  font-weight: 300;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  padding: 4px 9px;
  border-radius: 999px;
  border: 1px solid var(--border-strong);
  white-space: nowrap;
}
.diff::before {
  content: '';
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
}
.diff.beginner { color: var(--color-slate); }
.diff.intermediate { color: var(--color-sand); border-color: rgba(200,184,152,0.4); }
.diff.advanced { color: #d99780; border-color: rgba(217,151,128,0.4); }

/* ── Body ── */
.modal-body {
  padding: 28px;
  overflow-y: auto;
  flex: 1;
  scrollbar-width: thin;
  scrollbar-color: var(--border) transparent;
}
.modal-body::-webkit-scrollbar { width: 6px; }
.modal-body::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

/* ── Blocks ── */
.block { margin-bottom: 28px; }
.block:last-child { margin-bottom: 0; }

.block-h {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
  font-family: var(--font-label);
  font-size: 11px;
  font-weight: 300;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--color-stellar);
  white-space: nowrap;
}
.block-h::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border);
}

.block-text {
  font-size: 1rem;
  line-height: 1.65;
  color: rgba(232, 227, 216, 0.9);
}

/* ── Locked banner ── */
.locked-banner {
  padding: 14px 18px;
  background: rgba(138,157,187,0.08);
  border: 1px solid var(--border);
  border-radius: 10px;
  margin-bottom: 28px;
}
.locked-banner__label {
  font-family: var(--font-label);
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-sand);
  margin-bottom: 6px;
}
.locked-banner p {
  font-size: 14px;
  color: rgba(232, 227, 216, 0.8);
}

/* ── Analogy ── */
.analogy {
  padding: 18px 20px 18px 24px;
  border-left: 2px solid var(--accent);
  background: linear-gradient(90deg, rgba(88,130,136,0.1), transparent 70%);
  border-radius: 0 8px 8px 0;
  font-style: italic;
  color: rgba(232, 227, 216, 0.85);
  line-height: 1.65;
}

/* ── Connections ── */
.connections {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.connection-group__label {
  font-family: var(--font-label);
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--color-slate);
  margin-bottom: 10px;
}
.connection-list { display: flex; flex-direction: column; gap: 8px; }
.connection-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: rgba(26,39,68,0.3);
  font-size: 14px;
}
.connection-item__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  background: var(--color-stellar);
  box-shadow: 0 0 6px var(--color-stellar);
}
.connection-item--done .connection-item__dot {
  background: var(--color-ivory);
  box-shadow: 0 0 6px rgba(232,227,216,0.5);
}

/* ── Projects ── */
.projects-list { display: flex; flex-direction: column; gap: 12px; }

/* ── Actions ── */
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 11px 22px;
  font-family: var(--font-label);
  font-size: 11px;
  font-weight: 300;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--color-ivory);
  border: 1px solid var(--border-strong);
  border-radius: 999px;
  background: rgba(26, 39, 68, 0.4);
  transition: background 0.2s, border-color 0.2s;
  cursor: pointer;
  white-space: nowrap;
}
.btn:hover { background: rgba(88, 130, 136, 0.2); border-color: var(--accent); }

.btn-primary {
  background: linear-gradient(180deg, rgba(88,130,136,0.4), rgba(88,130,136,0.18));
  border-color: var(--accent);
}
.btn-primary:hover {
  background: linear-gradient(180deg, rgba(88,130,136,0.55), rgba(88,130,136,0.28));
  box-shadow: 0 0 20px rgba(88,130,136,0.2);
}

.btn-ghost { background: transparent; border-color: var(--border); }
.btn-ghost:hover { background: rgba(88, 130, 136, 0.1); }

.btn-arrow {
  display: inline-block;
  width: 18px;
  height: 1px;
  background: currentColor;
  position: relative;
}
.btn-arrow::after {
  content: '';
  position: absolute;
  right: -1px;
  top: -3px;
  border-left: 5px solid currentColor;
  border-top: 3px solid transparent;
  border-bottom: 3px solid transparent;
}

/* ── Célébration ── */
.node-celebration {
  position: fixed;
  inset: 0;
  z-index: 300;
  background: rgba(0, 0, 26, 0.85);
  backdrop-filter: blur(4px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
}

.celebration__icon {
  font-size: 4rem;
  color: var(--color-stellar);
  text-shadow: 0 0 24px rgba(88, 130, 136, 0.9);
  animation: celebIcon 400ms ease-out forwards;
}

.celebration__text {
  font-family: var(--font-display);
  font-size: 2rem;
  color: var(--color-ivory);
  animation: celebFade 400ms 200ms ease-out both;
}

.celebration__particles {
  position: relative;
  width: 0;
  height: 0;
}

.burst-particle {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-stellar);
  transform: translate(-50%, -50%);
  animation: burst 800ms 200ms ease-out both;
}

.celebration-enter-active, .celebration-leave-active { transition: opacity 0.15s; }
.celebration-enter-from, .celebration-leave-to { opacity: 0; }

@keyframes celebIcon {
  0%   { transform: scale(0);   opacity: 0; }
  70%  { transform: scale(1.3); opacity: 1; }
  100% { transform: scale(1);   opacity: 1; }
}
@keyframes celebFade {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes burst {
  0%   { transform: translate(calc(-50%), calc(-50%)) scale(1); opacity: 1; }
  100% { transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(0); opacity: 0; }
}

@media (max-width: 640px) {
  .modal-back { padding: 1rem; align-items: center; justify-content: center; }
  .modal { width: 90vw; max-width: 90vw; max-height: 90vh; border-radius: 16px; }
  .modal-head { padding: 16px 20px; }
  .modal-head__title { font-size: 1.75rem; }
  .modal-body { padding: 20px; }
  .connections { grid-template-columns: 1fr; }
  .modal-actions { flex-wrap: wrap; }
}
</style>
