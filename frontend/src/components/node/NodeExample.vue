<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import type { NodeExample } from '../../types/velaluna'
import { getHighlighter } from '../../composables/useHighlighter'
import type { ThemedToken } from 'shiki'

const props = defineProps<{ example: NodeExample }>()

const lines = ref<ThemedToken[][]>([])

async function highlight() {
  const hl = await getHighlighter()
  const result = hl.codeToTokens(props.example.code, {
    theme: 'github-dark',
    lang: props.example.language as Parameters<typeof hl.codeToTokens>[1]['lang']
  })
  lines.value = result.tokens
}

onMounted(highlight)
watch(() => props.example.code, highlight)
</script>

<template>
  <div class="node-example">
    <pre class="node-example__code"><code><template v-if="lines.length"><template v-for="(line, i) in lines" :key="i"><span v-for="(token, j) in line" :key="j" :style="{ color: token.color }">{{ token.content }}</span><br /></template></template><template v-else>{{ example.code }}</template></code></pre>
    <p class="node-example__explanation">{{ example.explanation }}</p>
  </div>
</template>

<style scoped>
.node-example__code {
  background: #0d1117;
  padding: 1rem;
  border-radius: 6px;
  overflow-x: auto;
  font-size: 0.8125rem;
  line-height: 1.65;
  margin: 0 0 0.75rem;
  font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', ui-monospace, monospace;
}

.node-example__code code {
  background: none;
  padding: 0;
  font-size: inherit;
}

.node-example__explanation {
  font-size: 0.875rem;
  color: #4b5563;
  margin: 0;
  line-height: 1.55;
}
</style>
