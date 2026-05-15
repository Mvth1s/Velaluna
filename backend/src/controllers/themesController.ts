import type { Request, Response } from 'express'
import db from '../db/database'

interface ThemeRow {
  id: string
  label: string
  description: string
  icon: string
}

interface TechIdRow {
  id: string
}

export function getAllThemes(_req: Request, res: Response) {
  const themes = db.prepare('SELECT * FROM themes').all() as ThemeRow[]

  const data = themes.map(theme => ({
    ...theme,
    technologies: (
      db.prepare('SELECT id FROM technologies WHERE theme_id = ?').all(theme.id) as TechIdRow[]
    ).map(t => t.id)
  }))

  res.json({ data, error: null })
}
