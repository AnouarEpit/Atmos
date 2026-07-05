import { Router } from 'express'
import { obtenerClima } from '../services/climaService.js'

export const climaRouter = Router()

climaRouter.get('/', async (req, res) => {
  const { lat, lon } = req.query

  if (!lat || !lon) {
    res.status(400).json({ error: 'Los parámetros lat y lon son obligatorios' })
    return
  }

  try {
    const clima = await obtenerClima(lat, lon)
    res.json(clima)
  } catch (error) {
    res.status(502).json({ error: error.message })
  }
})
