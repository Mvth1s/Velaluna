import type { Request, Response } from 'express'
import db from '../db/database'

interface TechnologyRow {
  id: string
  label: string
  theme_id: string
  description: string
  logo: string
}

interface NodeIdRow {
  node_id: string
}

function getNodeIds(techId: string): string[] {
  return (
    db
      .prepare('SELECT node_id FROM technology_nodes WHERE technology_id = ? ORDER BY position')
      .all(techId) as NodeIdRow[]
  ).map(r => r.node_id)
}

export function getAllTechnologies(_req: Request, res: Response) {
  const techs = db.prepare('SELECT * FROM technologies').all() as TechnologyRow[]
  const data = techs.map(tech => ({ ...tech, nodes: getNodeIds(tech.id) }))
  res.json({ data, error: null })
}

export function getTechnologyById(req: Request, res: Response) {
  const tech = db
    .prepare('SELECT * FROM technologies WHERE id = ?')
    .get(req.params.id) as TechnologyRow | undefined

  if (!tech) return res.status(404).json({ data: null, error: 'Technology not found' })

  res.json({ data: { ...tech, nodes: getNodeIds(tech.id) }, error: null })
}
