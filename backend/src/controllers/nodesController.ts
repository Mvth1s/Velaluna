import type { Request, Response } from 'express'
import db from '../db/database'

interface NodeRow {
  id: string
  label: string
  difficulty: string
  data: string
}

function parseNode(row: NodeRow) {
  return { id: row.id, label: row.label, difficulty: row.difficulty, ...JSON.parse(row.data) }
}

export function getNodeById(req: Request, res: Response) {
  const row = db.prepare('SELECT * FROM nodes WHERE id = ?').get(req.params.id) as
    | NodeRow
    | undefined

  if (!row) return res.status(404).json({ data: null, error: 'Node not found' })

  res.json({ data: parseNode(row), error: null })
}

export function getNodesByTechnology(req: Request, res: Response) {
  const rows = db
    .prepare(
      `SELECT n.* FROM nodes n
       JOIN technology_nodes tn ON n.id = tn.node_id
       WHERE tn.technology_id = ?
       ORDER BY tn.position`
    )
    .all(req.params.id) as NodeRow[]

  res.json({ data: rows.map(parseNode), error: null })
}
