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
    }
  },
  {
    selector: 'node[status="locked"]',
    style: {
      'background-color': '#0A0F1A',
      'border-width': 1,
      'border-color': '#2A3A4A',
      'border-opacity': 0.5,
      color: '#3A4A5A',
      'font-size': '10px',
      width: '52px',
      height: '52px',
    }
  },

  {
    selector: 'node[status="available"]',
    style: {
      'background-fill': 'radial-gradient',
      'background-gradient-stop-colors': '#1A2744 #0D1830',
      'background-gradient-stop-positions': '60 100',
      'border-width': 2,
      'border-color': '#588288',
      'border-opacity': 1,
      'shadow-blur': 8,
      'shadow-color': '#588288',
      'shadow-opacity': 0.3,
      'shadow-offset-x': 0,
      'shadow-offset-y': 0,
    }
  },
  {
    selector: 'node[status="in_progress"]',
    style: {
      'background-fill': 'radial-gradient',
      'background-gradient-stop-colors': '#2A3A5A #1A2744',
      'background-gradient-stop-positions': '50 100',
      'border-width': 2,
      'border-color': '#8A9DBB',
      'border-style': 'dashed',
      'border-dash-pattern': [6, 3],
      'shadow-blur': 10,
      'shadow-color': '#8A9DBB',
      'shadow-opacity': 0.5,
      'shadow-offset-x': 0,
      'shadow-offset-y': 0,
      color: '#C8B898',
    }
  },
  {
    selector: 'node[status="completed"]',
    style: {
      'background-fill': 'radial-gradient',
      'background-gradient-stop-colors': '#588288 #1A2744',
      'background-gradient-stop-positions': '30 100',
      'border-width': 2,
      'border-color': '#E8E3D8',
      'border-opacity': 0.9,
      'shadow-blur': 14,
      'shadow-color': '#588288',
      'shadow-opacity': 0.7,
      'shadow-offset-x': 0,
      'shadow-offset-y': 0,
      width: '72px',
      height: '72px',
    }
  },
  {
    selector: 'edge',
    style: {
      width: 1.5,
      'line-color': '#2A4A5A',
      'line-opacity': 0.6,
      'target-arrow-color': '#2A4A5A',
      'target-arrow-shape': 'triangle',
      'arrow-scale': 0.6,
      'curve-style': 'bezier',
    }
  },
  {
    selector: 'edge[?completed]',
    style: {
      'line-color': '#588288',
      'line-opacity': 0.8,
      'target-arrow-color': '#588288',
    }
  },
]

function getMobileStyles(): StylesheetStyle[] {
  return STYLES.map(s => {
    if (s.selector === 'node') return { ...s, style: { ...s.style, width: '52px', height: '52px', 'font-size': '10px', 'text-max-width': '44px' } }
    if (s.selector === 'node[status="locked"]') return { ...s, style: { ...s.style, width: '40px', height: '40px' } }
    if (s.selector === 'node[status="completed"]') return { ...s, style: { ...s.style, width: '58px', height: '58px' } }
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
