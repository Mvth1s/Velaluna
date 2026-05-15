import express from 'express'
import cors from 'cors'
import themesRouter from './routes/themes'
import technologiesRouter from './routes/technologies'
import nodesRouter from './routes/nodes'

const app = express()
const PORT = process.env.PORT ?? 3000

app.use(cors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:5173' }))
app.use(express.json())

app.use('/themes', themesRouter)
app.use('/technologies', technologiesRouter)
app.use('/nodes', nodesRouter)

app.listen(Number(PORT), () => {
  console.log(`Velaluna API démarrée sur le port ${PORT}`)
})
