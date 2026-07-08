import { Router } from 'express'
import { obtenerClima, obtenerTemperaturasLote } from '../services/climaService.js'

export const climaRouter = Router()

climaRouter.get('/lote', async (req, res) => {
  const { lat, lon } = req.query

  if (!lat || !lon) {
    res.status(400).json({ error: 'Los parámetros lat y lon son obligatorios' })
    return
  }

  const lats = lat.split(',').map(Number)
  const lons = lon.split(',').map(Number)

  if (lats.length !== lons.length || lats.some(Number.isNaN) || lons.some(Number.isNaN)) {
    res.status(400).json({ error: 'lat y lon deben ser listas numéricas de igual longitud' })
    return
  }

  try {
    const temperaturas = await obtenerTemperaturasLote(lats.map((la, i) => ({ lat: la, lon: lons[i] })))
    res.json({ temperaturas })
  } catch (error) {
    res.status(502).json({ error: error.message })
  }
})

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
