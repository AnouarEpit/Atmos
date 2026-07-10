import { Router } from 'express'
import { obtenerBolsa } from '../services/bolsaService.js'

export const bolsaRouter = Router()

bolsaRouter.get('/', async (_req, res) => {
  try {
    res.json(await obtenerBolsa())
  } catch (error) {
    console.error('Error al obtener bolsa:', error)
    res.status(502).json({ error: 'No se pudo obtener la bolsa' })
  }
})
