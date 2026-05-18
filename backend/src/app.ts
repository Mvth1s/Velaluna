import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import themesRouter from './routes/themes'
import technologiesRouter from './routes/technologies'
import nodesRouter from './routes/nodes'
import { initDb } from './db/seed'
import { metricsMiddleware, register } from './middleware/metrics'

const app = express()
const PORT = process.env.PORT ?? 3000

app.use(cors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:5173' }))
app.use(express.json())
app.use(metricsMiddleware)

app.get('/metrics', async (_req, res) => {
  res.set('Content-Type', register.contentType)
  res.end(await register.metrics())
})

app.use('/api/themes', themesRouter)
app.use('/api/technologies', technologiesRouter)
app.use('/api/nodes', nodesRouter)

const publicDir = path.join(__dirname, '../public')
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir))
  app.get('*', (_req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'))
  })
}

initDb()
  .then(() => {
    app.listen(Number(PORT), () => {
      console.log(`Velaluna API démarrée sur le port ${PORT}`)
    })
  })
  .catch(err => {
    console.error('Erreur initialisation DB :', err)
    process.exit(1)
  })
