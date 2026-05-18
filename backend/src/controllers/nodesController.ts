import type { Request, Response } from 'express'
import pool from '../db/database'

interface NodeRow {
  id: string
  label: string
  difficulty: string
  data: Record<string, unknown>
}

function parseNode(row: NodeRow) {
  return { id: row.id, label: row.label, difficulty: row.difficulty, ...row.data }
}

export async function getNodeById(req: Request, res: Response) {
  try {
    const { rows } = await pool.query('SELECT * FROM nodes WHERE id = $1', [req.params.id])
    if (rows.length === 0) return res.status(404).json({ data: null, error: 'Node not found' })
    res.json({ data: parseNode(rows[0] as NodeRow), error: null })
  } catch {
    res.status(500).json({ data: null, error: 'Internal server error' })
  }
}

export async function getNodesByTechnology(req: Request, res: Response) {
  try {
    const { rows } = await pool.query(
      `SELECT n.* FROM nodes n
       JOIN technology_nodes tn ON n.id = tn.node_id
       WHERE tn.technology_id = $1
       ORDER BY tn.position`,
      [req.params.id]
    )
    res.json({ data: (rows as NodeRow[]).map(parseNode), error: null })
  } catch {
    res.status(500).json({ data: null, error: 'Internal server error' })
  }
}
