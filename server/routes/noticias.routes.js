import { Router } from 'express'
import { obtenerNoticias } from '../services/noticiasService.js'

export const noticiasRouter = Router()

noticiasRouter.get('/', (req, res) => {
  const ciudad = req.query.ciudad || 'votre ville'
  res.json(obtenerNoticias(ciudad))
})
