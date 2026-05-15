<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useContentStore } from '../stores/contentStore'
import NodeExample from '../components/node/NodeExample.vue'
import type { Node } from '../types/velaluna'

const route = useRoute()
const router = useRouter()
const contentStore = useContentStore()

const node = ref<Node | null>(null)
const loading = ref(true)

onMounted(async () => {
  node.value = await contentStore.fetchNode(route.params.id as string)
  loading.value = false
})
</script>

<template>
  <div class="node-view">
    <div v-if="loading" class="node-view__state">Chargement...</div>

    <template v-else-if="node">
      <header class="node-view__header">
        <button @click="router.back()">← Retour</button>
        <h1>{{ node.label }}</h1>
        <span class="node-view__difficulty">{{ node.difficulty }}</span>
      </header>

      <div class="node-view__body">
        <section>
          <h2>Explication</h2>
          <p>{{ node.explanation }}</p>
        </section>
        <section>
          <h2>Analogie</h2>
          <p>{{ node.analogy }}</p>
        </section>
        <section>
          <h2>Exemple</h2>
          <NodeExample :example="node.example" />
        </section>
      </div>
    </template>
  </div>
</template>

<style scoped>
.node-view {
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem;
}

.node-view__state {
  color: #6b7280;
  padding: 3rem;
  text-align: center;
}

.node-view__header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.node-view__header button {
  background: none;
  border: none;
  cursor: pointer;
  color: #3b82f6;
  font-size: 0.875rem;
}

.node-view__header h1 {
  flex: 1;
  font-size: 1.75rem;
}

.node-view__difficulty {
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: uppercase;
}

.node-view__body {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.node-view__body h2 {
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #6b7280;
  margin-bottom: 0.625rem;
}

.node-view__body p {
  font-size: 0.9375rem;
  line-height: 1.6;
  color: #374151;
}
</style>
