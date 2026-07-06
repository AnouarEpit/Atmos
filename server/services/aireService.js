const BASE_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality'

/** Mismo patrón de proxy que climaService.js — sin API key, gratis, sin cuota práctica para una demo. */
export async function obtenerCalidadAire(lat, lon) {
  const params = new URLSearchParams({ latitude: lat, longitude: lon, current: 'european_aqi' })
  const respuesta = await fetch(`${BASE_URL}?${params}`)

  if (!respuesta.ok) {
    const detalle = await respuesta.text()
    throw new Error(`Open-Meteo Air Quality respondió ${respuesta.status}: ${detalle}`)
  }

  const datos = await respuesta.json()
  return { aqi: datos.current.european_aqi }
}
