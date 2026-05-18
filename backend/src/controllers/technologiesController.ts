import type { Request, Response } from 'express'
import pool from '../db/database'

async function getNodeIds(techId: string): Promise<string[]> {
  const { rows } = await pool.query(
    'SELECT node_id FROM technology_nodes WHERE technology_id = $1 ORDER BY position',
    [techId]
  )
  return rows.map((r: { node_id: string }) => r.node_id)
}

export async function getAllTechnologies(_req: Request, res: Response) {
  try {
    const { rows: techs } = await pool.query('SELECT * FROM technologies')
    const data = await Promise.all(
      techs.map(async tech => ({ ...tech, nodes: await getNodeIds(tech.id) }))
    )
    res.json({ data, error: null })
  } catch {
    res.status(500).json({ data: null, error: 'Internal server error' })
  }
}

export async function getTechnologyById(req: Request, res: Response) {
  try {
    const { rows } = await pool.query('SELECT * FROM technologies WHERE id = $1', [req.params.id])
    if (rows.length === 0) return res.status(404).json({ data: null, error: 'Technology not found' })
    const tech = rows[0]
    res.json({ data: { ...tech, nodes: await getNodeIds(tech.id) }, error: null })
  } catch {
    res.status(500).json({ data: null, error: 'Internal server error' })
  }
}
