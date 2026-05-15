import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { NodeStatus } from '../types/velaluna'

interface NodeProgress {
  status: 'in_progress' | 'completed'
  completed_at?: string
  completed_project_id?: string
}

interface ProgressData {
  version: number
  progress: Record<string, Record<string, NodeProgress>>
}

const STORAGE_KEY = 'velaluna_progress'

function loadFromStorage(): ProgressData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as ProgressData) : { version: 1, progress: {} }
  } catch {
    return { version: 1, progress: {} }
  }
}

export const useProgressStore = defineStore('progress', () => {
  const data = ref<ProgressData>(loadFromStorage())

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data.value))
  }

  function getNodeStatus(techId: string, nodeId: string, prerequisites: string[]): NodeStatus {
    const stored = data.value.progress[techId]?.[nodeId]
    if (stored?.status === 'completed') return 'completed'
    if (stored?.status === 'in_progress') return 'in_progress'

    if (prerequisites.length === 0) return 'available'
    const allDone = prerequisites.every(
      id => data.value.progress[techId]?.[id]?.status === 'completed'
    )
    return allDone ? 'available' : 'locked'
  }

  function startNode(techId: string, nodeId: string) {
    if (!data.value.progress[techId]) data.value.progress[techId] = {}
    if (data.value.progress[techId][nodeId]?.status === 'completed') return
    data.value.progress[techId][nodeId] = { status: 'in_progress' }
    save()
  }

  function completeNode(techId: string, nodeId: string, projectId: string) {
    if (!data.value.progress[techId]) data.value.progress[techId] = {}
    data.value.progress[techId][nodeId] = {
      status: 'completed',
      completed_at: new Date().toISOString(),
      completed_project_id: projectId
    }
    save()
  }

  function getCompletedCountForTech(techId: string): number {
    const techProgress = data.value.progress[techId]
    if (!techProgress) return 0
    return Object.values(techProgress).filter(n => n.status === 'completed').length
  }

  function resetProgress() {
    data.value = { version: 1, progress: {} }
    save()
  }

  return { getNodeStatus, startNode, completeNode, getCompletedCountForTech, resetProgress }
})
