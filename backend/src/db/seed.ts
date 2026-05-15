import fs from 'fs'
import path from 'path'
import db from './database'

const CONTENT_PATH = process.env.CONTENT_PATH || path.join(__dirname, '../../../content')

interface ThemeJson {
  id: string
  label: string
  description: string
  icon: string
  technologies: string[]
}

interface TechnologyJson {
  id: string
  label: string
  theme_id: string
  description: string
  logo: string
  nodes: string[]
}

interface NodeJson {
  id: string
  label: string
  difficulty: string
  [key: string]: unknown
}

function readJsonDir<T>(subdir: string): T[] {
  const dir = path.join(CONTENT_PATH, subdir)
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .map(f => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf-8')) as T)
}

const insertTheme = db.prepare(
  'INSERT OR REPLACE INTO themes (id, label, description, icon) VALUES (@id, @label, @description, @icon)'
)
const insertTechnology = db.prepare(
  'INSERT OR REPLACE INTO technologies (id, label, theme_id, description, logo) VALUES (@id, @label, @theme_id, @description, @logo)'
)
const insertNode = db.prepare(
  'INSERT OR REPLACE INTO nodes (id, label, difficulty, data) VALUES (@id, @label, @difficulty, @data)'
)
const insertTechnologyNode = db.prepare(
  'INSERT OR IGNORE INTO technology_nodes (technology_id, node_id, position) VALUES (@technology_id, @node_id, @position)'
)

const seed = db.transaction(() => {
  const themes = readJsonDir<ThemeJson>('themes')
  for (const theme of themes) {
    insertTheme.run({ id: theme.id, label: theme.label, description: theme.description, icon: theme.icon })
  }

  const nodes = readJsonDir<NodeJson>('nodes')
  for (const node of nodes) {
    const { id, label, difficulty, ...rest } = node
    insertNode.run({ id, label, difficulty, data: JSON.stringify(rest) })
  }

  const technologies = readJsonDir<TechnologyJson>('technologies')
  for (const tech of technologies) {
    insertTechnology.run({
      id: tech.id,
      label: tech.label,
      theme_id: tech.theme_id,
      description: tech.description,
      logo: tech.logo
    })
    tech.nodes.forEach((nodeId, index) => {
      insertTechnologyNode.run({ technology_id: tech.id, node_id: nodeId, position: index })
    })
  }
})

seed()
console.log('Seed terminé.')
