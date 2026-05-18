import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://velaluna:velaluna@localhost:5432/velaluna'
})

export default pool
