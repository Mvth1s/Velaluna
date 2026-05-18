import type { Request, Response } from 'express'
import pool from '../db/database'

export async function getAllThemes(_req: Request, res: Response) {
  try {
    const { rows: themes } = await pool.query('SELECT * FROM themes')
    const data = await Promise.all(
      themes.map(async theme => {
        const { rows: techs } = await pool.query(
          'SELECT id FROM technologies WHERE theme_id = $1',
          [theme.id]
        )
        return { ...theme, technologies: techs.map((t: { id: string }) => t.id) }
      })
    )
    res.json({ data, error: null })
  } catch {
    res.status(500).json({ data: null, error: 'Internal server error' })
  }
}
