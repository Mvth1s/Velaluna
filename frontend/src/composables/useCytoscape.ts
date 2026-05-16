import { onMounted, onUnmounted, watch } from 'vue'
import type { Ref } from 'vue'
import cytoscape from 'cytoscape'
import type { Core, ElementDefinition, StylesheetStyle } from 'cytoscape'
import type { Node, NodeStatus } from '../types/velaluna'

const LAYOUT_OPTIONS = {
  name: 'cose',
  animate: true,
  animationDuration: 800,
  nodeRepulsion: 8000,
  idealEdgeLength: 120,
  gravity: 0.4,
  randomize: true,
  fit: true,
  padding: 40
}

const LAYOUT_OPTIONS_MOBILE = {
  ...LAYOUT_OPTIONS,
  nodeRepulsion: 4000,
  idealEdgeLength: 70,
  padding: 20,
}

function isMobile() {
  return window.innerWidth < 640
}

const STYLES: StylesheetStyle[] = [
  {
    selector: 'node',
    style: {
      label: 'data(label)',
      'text-valign': 'center',
      'text-halign': 'center',
      'font-family': 'Jura, sans-serif',
      'font-weight': 300,
      'font-size': '11px',
      width: '68px',
      height: '68px',
      shape: 'ellipse',
      color: '#E8E3D8',
      'text-wrap': 'wrap',
      'text-max-width': '58px',
      'border-width': 0,
    }
  },
  {
    selector: 'node[status="locked"]',
    style: {
      'background-color': '#1A2744',
      color: '#8A9DB8',
      'font-size': '10px',
      width: '52px',
      height: '52px',
    }
  },
  {
    selector: 'node[status="available"]',
    style: {
      'background-color': '#588288',
      color: '#E8E3D8',
      'shadow-blur': 8,
      'shadow-color': '#588288',
      'shadow-opacity': 0.4,
      'shadow-offset-x': 0,
      'shadow-offset-y': 0,
    }
  },
  {
    selector: 'node[status="in_progress"]',
    style: {
      'background-color': '#8A9DB8',
      color: '#00001A',
      'shadow-blur': 8,
      'shadow-color': '#8A9DB8',
      'shadow-opacity': 0.4,
      'shadow-offset-x': 0,
      'shadow-offset-y': 0,
    }
  },
  {
    selector: 'node[status="completed"]',
    style: {
      'background-color': '#22c55e',
      color: '#00001A',
      width: '72px',
      height: '72px',
      'shadow-blur': 12,
      'shadow-color': '#22c55e',
      'shadow-opacity': 0.5,
      'shadow-offset-x': 0,
      'shadow-offset-y': 0,
    }
  },
  {
    selector: 'edge',
    style: {
      width: 1.5,
      'line-color': '#1A2744',
      'line-opacity': 0.8,
      'target-arrow-color': '#588288',
      'target-arrow-shape': 'triangle',
      'arrow-scale': 0.6,
      'curve-style': 'bezier',
    }
  },
  {
    selector: 'edge[?completed]',
    style: {
      'line-color': '#588288',
      'line-opacity': 1,
      'target-arrow-color': '#22c55e',
    }
  },
]

function getMobileStyles(): StylesheetStyle[] {
  return STYLES.map(s => {
    if (s.selector === 'node') return { ...s, style: { ...s.style, width: '44px', height: '44px', 'font-size': '9px', 'text-max-width': '38px' } }
    if (s.selector === 'node[status="locked"]') return { ...s, style: { ...s.style, width: '36px', height: '36px' } }
    if (s.selector === 'node[status="completed"]') return { ...s, style: { ...s.style, width: '48px', height: '48px' } }
    return s
  })
}

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
          data: {
            id: `${node.id}-->${targetId}`,
            source: node.id,
            target: targetId,
            completed: statuses[node.id] === 'completed' ? true : undefined
          }
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
  let resizeObserver: ResizeObserver | null = null

  function init() {
    if (!container.value) return
    cy?.destroy()
    resizeObserver?.disconnect()

    const mobile = isMobile()
    cy = cytoscape({
      container: container.value,
      elements: buildElements(nodes.value, statuses.value),
      style: mobile ? getMobileStyles() : STYLES,
      layout: mobile ? LAYOUT_OPTIONS_MOBILE : LAYOUT_OPTIONS,
      backgroundColor: 'transparent',
    })

    cy.on('tap', 'node', event => {
      const node = event.target
      handlers.onNodeTap(node.id() as string, node.data('status') as NodeStatus)
    })

    resizeObserver = new ResizeObserver(() => {
      cy?.resize()
      cy?.fit()
    })
    resizeObserver.observe(container.value)
  }

  function updateStatuses() {
    if (!cy) return
    cy.nodes().forEach(node => {
      node.data('status', statuses.value[node.id()] ?? 'locked')
    })
    cy.edges().forEach(edge => {
      const sourceStatus = statuses.value[edge.data('source')]
      edge.data('completed', sourceStatus === 'completed' ? true : undefined)
    })
    cy.style().update()
  }

  onMounted(init)
  onUnmounted(() => {
    cy?.destroy()
    resizeObserver?.disconnect()
  })
  watch(nodes, init)
  watch(statuses, updateStatuses, { deep: true })
}
