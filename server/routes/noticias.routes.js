import { Router } from 'express'
import { obtenerNoticias } from '../services/noticiasService.js'

export const noticiasRouter = Router()

noticiasRouter.get('/', async (req, res) => {
  const alcance = req.query.alcance === 'mundo' ? 'mundo' : 'francia'
  try {
    res.json(await obtenerNoticias(alcance))
  } catch (error) {
    console.error('Error al obtener noticias:', error)
    res.status(502).json({ error: 'No se pudieron obtener las noticias' })
  }
})
