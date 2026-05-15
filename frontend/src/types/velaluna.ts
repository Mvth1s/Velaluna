export type Difficulty = 'beginner' | 'intermediate' | 'advanced'
export type NodeStatus = 'locked' | 'available' | 'in_progress' | 'completed'

export interface Theme {
  id: string
  label: string
  description: string
  icon: string
  technologies: string[]
}

export interface Technology {
  id: string
  label: string
  theme_id: string
  description: string
  logo: string
  nodes: string[]
}

export interface NodeExample {
  language: string
  code: string
  explanation: string
}

export interface NodeProject {
  id: string
  label: string
  difficulty: Difficulty
  description: string
  hint: string
}

export interface Node {
  id: string
  label: string
  difficulty: Difficulty
  technologies: string[]
  explanation: string
  analogy: string
  example: NodeExample
  prerequisites: string[]
  unlocks: string[]
  projects: NodeProject[]
}
