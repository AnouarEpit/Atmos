import { Router } from 'express'
import { obtenerCalidadAire } from '../services/aireService.js'

export const aireRouter = Router()

aireRouter.get('/', async (req, res) => {
  const { lat, lon } = req.query

  if (!lat || !lon) {
    res.status(400).json({ error: 'Los parámetros lat y lon son obligatorios' })
    return
  }

  try {
    const aire = await obtenerCalidadAire(lat, lon)
    res.json(aire)
  } catch (error) {
    res.status(502).json({ error: error.message })
  }
})
