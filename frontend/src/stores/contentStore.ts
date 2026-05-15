import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Theme, Technology, Node } from '../types/velaluna'

const API = '/api'

export const useContentStore = defineStore('content', () => {
  const themes = ref<Theme[]>([])
  const technologies = ref<Technology[]>([])
  const nodesCache = ref<Record<string, Node>>({})

  async function fetchThemes(): Promise<Theme[]> {
    const res = await fetch(`${API}/themes`)
    const { data } = (await res.json()) as { data: Theme[] }
    themes.value = data
    return data
  }

  async function fetchTechnologies(): Promise<Technology[]> {
    const res = await fetch(`${API}/technologies`)
    const { data } = (await res.json()) as { data: Technology[] }
    technologies.value = data
    return data
  }

  async function fetchTechnology(id: string): Promise<Technology> {
    const cached = technologies.value.find(t => t.id === id)
    if (cached) return cached
    const res = await fetch(`${API}/technologies/${id}`)
    const { data } = (await res.json()) as { data: Technology }
    if (!technologies.value.find(t => t.id === id)) technologies.value.push(data)
    return data
  }

  async function fetchNodes(techId: string): Promise<Node[]> {
    const res = await fetch(`${API}/technologies/${techId}/nodes`)
    const { data } = (await res.json()) as { data: Node[] }
    data.forEach(node => {
      nodesCache.value[node.id] = node
    })
    return data
  }

  async function fetchNode(nodeId: string): Promise<Node> {
    if (nodesCache.value[nodeId]) return nodesCache.value[nodeId]
    const res = await fetch(`${API}/nodes/${nodeId}`)
    const { data } = (await res.json()) as { data: Node }
    nodesCache.value[nodeId] = data
    return data
  }

  return { themes, technologies, nodesCache, fetchThemes, fetchTechnologies, fetchTechnology, fetchNodes, fetchNode }
})
