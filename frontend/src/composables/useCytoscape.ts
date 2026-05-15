import { onMounted, onUnmounted, watch } from 'vue'
import type { Ref } from 'vue'
import cytoscape from 'cytoscape'
import type { Core, ElementDefinition, StylesheetStyle } from 'cytoscape'
import type { Node, NodeStatus } from '../types/velaluna'

const LAYOUT_OPTIONS = {
  name: 'dagre',
  rankDir: 'TB',
  nodeSep: 60,
  rankSep: 80,
  padding: 30
}

const STYLES: StylesheetStyle[] = [
  {
    selector: 'node',
    style: {
      label: 'data(label)',
      'text-valign': 'center',
      'text-halign': 'center',
      'font-size': '13px',
      width: '130px',
      height: '44px',
      shape: 'roundrectangle',
      color: '#ffffff',
      'text-wrap': 'wrap',
      'text-max-width': '120px',
      'font-weight': 500
    }
  },
  {
    selector: 'node[status="locked"]',
    style: { 'background-color': '#9ca3af' }
  },
  {
    selector: 'node[status="available"]',
    style: { 'background-color': '#3b82f6' }
  },
  {
    selector: 'node[status="in_progress"]',
    style: { 'background-color': '#f59e0b' }
  },
  {
    selector: 'node[status="completed"]',
    style: { 'background-color': '#22c55e' }
  },
  {
    selector: 'edge',
    style: {
      width: 2,
      'line-color': '#d1d5db',
      'target-arrow-color': '#d1d5db',
      'target-arrow-shape': 'triangle',
      'curve-style': 'bezier'
    }
  }
]

function buildElements(nodes: Node[], statuses: Record<string, NodeStatus>): ElementDefinition[] {
  const nodeSet = new Set(nodes.map(n => n.id))

  const nodeElements: ElementDefinition[] = nodes.map(node => ({
    data: {
      id: node.id,
      label: node.label,
      status: statuses[node.id] ?? 'locked'
    }
  }))

  const edgeElements: ElementDefinition[] = []
  nodes.forEach(node => {
    node.unlocks.forEach(targetId => {
      if (nodeSet.has(targetId)) {
        edgeElements.push({
          data: { id: `${node.id}-->${targetId}`, source: node.id, target: targetId }
        })
      }
    })
  })

  return [...nodeElements, ...edgeElements]
}

interface Handlers {
  onNodeTap: (nodeId: string, status: NodeStatus) => void
}

export function useCytoscape(
  container: Ref<HTMLElement | null>,
  nodes: Ref<Node[]>,
  statuses: Ref<Record<string, NodeStatus>>,
  handlers: Handlers
) {
  let cy: Core | null = null

  function init() {
    if (!container.value) return
    cy?.destroy()

    cy = cytoscape({
      container: container.value,
      elements: buildElements(nodes.value, statuses.value),
      style: STYLES,
      layout: LAYOUT_OPTIONS
    })

    cy.on('tap', 'node', event => {
      const node = event.target
      handlers.onNodeTap(node.id() as string, node.data('status') as NodeStatus)
    })
  }

  function updateStatuses() {
    if (!cy) return
    cy.nodes().forEach(node => {
      node.data('status', statuses.value[node.id()] ?? 'locked')
    })
  }

  onMounted(init)
  onUnmounted(() => cy?.destroy())
  watch(() => nodes.value, init)
  watch(() => statuses.value, updateStatuses, { deep: true })
}
