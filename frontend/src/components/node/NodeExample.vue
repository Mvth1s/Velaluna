<script setup lang="ts">
import type { NodeExample } from '../../types/velaluna'

defineProps<{ example: NodeExample }>()
</script>

<template>
  <div class="node-example">
    <pre class="node-example__code"><code>{{ example.code }}</code></pre>
    <p class="node-example__explanation">{{ example.explanation }}</p>
  </div>
</template>

<style scoped>
.node-example__code {
  background: #1f2937;
  color: #f9fafb;
  padding: 1rem;
  border-radius: 6px;
  overflow-x: auto;
  font-size: 0.8125rem;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
  margin: 0 0 0.75rem;
}

.node-example__explanation {
  font-size: 0.875rem;
  color: #4b5563;
  margin: 0;
}
</style>
