import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

const DATA_DIR = path.join(__dirname, '../../data')
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })

const db = new Database(path.join(DATA_DIR, 'velaluna.db'))

db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

db.exec([
  `CREATE TABLE IF NOT EXISTS themes (
    id          TEXT PRIMARY KEY,
    label       TEXT NOT NULL,
    description TEXT,
    icon        TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS technologies (
    id          TEXT PRIMARY KEY,
    label       TEXT NOT NULL,
    theme_id    TEXT NOT NULL,
    description TEXT,
    logo        TEXT,
    FOREIGN KEY (theme_id) REFERENCES themes(id)
  )`,
  `CREATE TABLE IF NOT EXISTS nodes (
    id         TEXT PRIMARY KEY,
    label      TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    data       TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS technology_nodes (
    technology_id TEXT    NOT NULL,
    node_id       TEXT    NOT NULL,
    position      INTEGER,
    PRIMARY KEY (technology_id, node_id),
    FOREIGN KEY (technology_id) REFERENCES technologies(id),
    FOREIGN KEY (node_id)       REFERENCES nodes(id)
  )`
].join(';'))

export default db
