import type { RespuestaClima } from './tipos'

export async function obtenerClima(lat: number, lon: number): Promise<RespuestaClima> {
  const respuesta = await fetch(`/api/clima?lat=${lat}&lon=${lon}`)

  if (!respuesta.ok) {
    throw new Error(`Error al obtener el clima (${respuesta.status})`)
  }

  return respuesta.json()
}

/** Temperatura actual de varias ciudades a la vez (buscador) — mismo orden que `coordenadas`. */
export async function obtenerTemperaturasLote(coordenadas: { lat: number; lon: number }[]): Promise<number[]> {
  const lat = coordenadas.map((c) => c.lat).join(',')
  const lon = coordenadas.map((c) => c.lon).join(',')
  const respuesta = await fetch(`/api/clima/lote?lat=${lat}&lon=${lon}`)

  if (!respuesta.ok) {
    throw new Error(`Error al obtener temperaturas en lote (${respuesta.status})`)
  }

  const datos: { temperaturas: number[] } = await respuesta.json()
  return datos.temperaturas
}
