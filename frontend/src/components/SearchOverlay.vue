<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useContentStore } from '../stores/contentStore'
import type { Node, Technology } from '../types/velaluna'

const emit = defineEmits<{ close: [] }>()

const router = useRouter()
const contentStore = useContentStore()

const query = ref('')
const inputRef = ref<HTMLInputElement | null>(null)
const resultRefs = ref<HTMLElement[]>([])
const activeIndex = ref(0)
const loading = ref(false)

type SearchEntry = { node: Node; tech: Technology }
const index = ref<SearchEntry[]>([])

onMounted(async () => {
  await nextTick()
  inputRef.value?.focus()
  if (index.value.length === 0) {
    loading.value = true
    index.value = await contentStore.fetchAllNodes()
    loading.value = false
  }
})

const results = computed<SearchEntry[]>(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return []
  return index.value
    .filter(({ node, tech }) =>
      node.label.toLowerCase().includes(q) ||
      tech.label.toLowerCase().includes(q) ||
      node.explanation.toLowerCase().includes(q)
    )
    .slice(0, 8)
})

watch(results, () => { activeIndex.value = 0 })

watch(activeIndex, async (idx) => {
  await nextTick()
  resultRefs.value[idx]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
})

function navigate(entry: SearchEntry) {
  router.push(`/themes/${entry.tech.theme_id}/${entry.tech.id}?node=${entry.node.id}`)
  emit('close')
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    emit('close')
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    activeIndex.value = Math.min(activeIndex.value + 1, results.value.length - 1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    activeIndex.value = Math.max(activeIndex.value - 1, 0)
  } else if (e.key === 'Enter' && results.value.length > 0) {
    navigate(results.value[activeIndex.value])
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))

const DIFFICULTY_LABEL: Record<string, string> = {
  beginner: 'Débutant',
  intermediate: 'Intermédiaire',
  advanced: 'Avancé',
}
</script>

<template>
  <div class="search-backdrop" @click.self="emit('close')">
    <div class="search-modal" role="dialog" aria-label="Recherche">
      <div class="search-input-wrap">
        <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          ref="inputRef"
          v-model="query"
          class="search-input"
          placeholder="Rechercher un concept, une technologie…"
          autocomplete="off"
          spellcheck="false"
        />
        <kbd class="search-esc">Esc</kbd>
      </div>

      <div v-if="loading" class="search-state">Chargement de l'index…</div>
      <div v-else-if="query && results.length === 0" class="search-state">Aucun résultat pour « {{ query }} »</div>

      <ul v-else-if="results.length > 0" class="search-results">
        <li
          v-for="(entry, i) in results"
          :key="`${entry.tech.id}--${entry.node.id}`"
          :ref="el => { if (el) resultRefs[i] = el as HTMLElement }"
          class="search-result"
          :class="{ 'search-result--active': i === activeIndex }"
          @mouseenter="activeIndex = i"
          @click="navigate(entry)"
        >
          <div class="search-result__main">
            <span class="search-result__label">{{ entry.node.label }}</span>
            <span class="search-result__diff">{{ DIFFICULTY_LABEL[entry.node.difficulty] }}</span>
          </div>
          <div class="search-result__meta">
            <span class="search-result__tech">{{ entry.tech.label }}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
        </li>
      </ul>

      <div v-else class="search-hint">
        <span>↑↓ naviguer</span>
        <span>↵ ouvrir</span>
        <span>Esc fermer</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-backdrop {
  position: fixed;
  inset: 0;
  z-index: 600;
  background: rgba(0, 0, 26, 0.7);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: clamp(60px, 12vh, 120px);
}

.search-modal {
  width: 100%;
  max-width: 560px;
  background: rgba(16, 24, 40, 0.96);
  border: 1px solid var(--border-strong);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 24px 80px rgba(0, 0, 26, 0.7), 0 0 0 1px rgba(88, 130, 136, 0.1);
  margin: 0 16px;
}

/* ── Input ── */
.search-input-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
}

.search-icon {
  color: var(--color-stellar);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  font-family: var(--font-ui);
  font-size: 1rem;
  font-weight: 300;
  color: var(--color-ivory);
  caret-color: var(--color-stellar);
}
.search-input::placeholder {
  color: var(--text-mute);
}

.search-esc {
  font-family: var(--font-label);
  font-size: 10px;
  font-weight: 300;
  letter-spacing: 0.06em;
  color: var(--text-mute);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 2px 6px;
  flex-shrink: 0;
}

/* ── State messages ── */
.search-state {
  padding: 24px 20px;
  font-family: var(--font-label);
  font-size: 11px;
  font-weight: 300;
  letter-spacing: 0.1em;
  color: var(--text-mute);
  text-align: center;
}

/* ── Results ── */
.search-results {
  list-style: none;
  padding: 8px;
  max-height: 340px;
  overflow-y: auto;
}

.search-result {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 11px 14px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.12s;
}
.search-result--active {
  background: rgba(88, 130, 136, 0.14);
}

.search-result__main {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.search-result__label {
  font-family: var(--font-ui);
  font-size: 0.9375rem;
  font-weight: 300;
  color: var(--color-ivory);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.search-result__diff {
  font-family: var(--font-label);
  font-size: 9px;
  font-weight: 300;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-mute);
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 2px 7px;
  flex-shrink: 0;
}

.search-result__meta {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  color: var(--color-stellar);
}

.search-result__tech {
  font-family: var(--font-label);
  font-size: 10px;
  font-weight: 300;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

/* ── Hint bar ── */
.search-hint {
  display: flex;
  gap: 20px;
  justify-content: center;
  padding: 14px 20px;
  border-top: 1px solid var(--border);
  font-family: var(--font-label);
  font-size: 10px;
  font-weight: 300;
  letter-spacing: 0.1em;
  color: var(--text-mute);
}
</style>
