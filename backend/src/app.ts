import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import themesRouter from './routes/themes'
import technologiesRouter from './routes/technologies'
import nodesRouter from './routes/nodes'

const app = express()
const PORT = process.env.PORT ?? 3000

app.use(cors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:5173' }))
app.use(express.json())

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

app.listen(Number(PORT), () => {
  console.log(`Velaluna API démarrée sur le port ${PORT}`)
})
