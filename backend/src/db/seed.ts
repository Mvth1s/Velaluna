import fs from 'fs'
import path from 'path'
import pool from './database'

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

async function createTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS themes (
      id          TEXT PRIMARY KEY,
      label       TEXT NOT NULL,
      description TEXT,
      icon        TEXT
    );

    CREATE TABLE IF NOT EXISTS technologies (
      id          TEXT PRIMARY KEY,
      label       TEXT NOT NULL,
      theme_id    TEXT NOT NULL,
      description TEXT,
      logo        TEXT,
      FOREIGN KEY (theme_id) REFERENCES themes(id)
    );

    CREATE TABLE IF NOT EXISTS nodes (
      id         TEXT PRIMARY KEY,
      label      TEXT NOT NULL,
      difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
      data       JSONB NOT NULL
    );

    CREATE TABLE IF NOT EXISTS technology_nodes (
      technology_id TEXT    NOT NULL,
      node_id       TEXT    NOT NULL,
      position      INTEGER,
      PRIMARY KEY (technology_id, node_id),
      FOREIGN KEY (technology_id) REFERENCES technologies(id),
      FOREIGN KEY (node_id)       REFERENCES nodes(id)
    );
  `)
}

async function isEmpty(): Promise<boolean> {
  const { rows } = await pool.query('SELECT COUNT(*) FROM themes')
  return parseInt(rows[0].count, 10) === 0
}

async function seedData() {
  const themes = readJsonDir<ThemeJson>('themes')
  for (const theme of themes) {
    await pool.query(
      'INSERT INTO themes (id, label, description, icon) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING',
      [theme.id, theme.label, theme.description, theme.icon]
    )
  }

  const nodes = readJsonDir<NodeJson>('nodes')
  for (const node of nodes) {
    const { id, label, difficulty, ...rest } = node
    await pool.query(
      'INSERT INTO nodes (id, label, difficulty, data) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING',
      [id, label, difficulty, JSON.stringify(rest)]
    )
  }

  const technologies = readJsonDir<TechnologyJson>('technologies')
  for (const tech of technologies) {
    await pool.query(
      'INSERT INTO technologies (id, label, theme_id, description, logo) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING',
      [tech.id, tech.label, tech.theme_id, tech.description, tech.logo]
    )
    for (let i = 0; i < tech.nodes.length; i++) {
      await pool.query(
        'INSERT INTO technology_nodes (technology_id, node_id, position) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
        [tech.id, tech.nodes[i], i]
      )
    }
  }

  console.log(`Seed terminé : ${themes.length} thèmes, ${technologies.length} technos, ${nodes.length} nœuds.`)
}

export async function initDb() {
  await createTables()
  if (await isEmpty()) await seedData()
}

if (require.main === module) {
  initDb()
    .then(() => pool.end())
    .then(() => process.exit(0))
    .catch(err => { console.error('Seed échoué :', err); process.exit(1) })
}
