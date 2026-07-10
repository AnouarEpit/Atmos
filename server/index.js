import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { climaRouter } from './routes/clima.routes.js'
import { noticiasRouter } from './routes/noticias.routes.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use('/api/clima', climaRouter)
app.use('/api/noticias', noticiasRouter)

// En Vercel el handler se invoca por request (sin listen) — api/index.js importa `app` directo.
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Atmos backend escuchando en http://localhost:${PORT}`)
  })
}

export default app
