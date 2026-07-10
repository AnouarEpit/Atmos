import { Router } from 'express'
import { obtenerNoticias } from '../services/noticiasService.js'

export const noticiasRouter = Router()

noticiasRouter.get('/', async (_req, res) => {
  try {
    res.json(await obtenerNoticias())
  } catch (error) {
    console.error('Error al obtener noticias:', error)
    res.status(502).json({ error: 'No se pudieron obtener las noticias' })
  }
})
