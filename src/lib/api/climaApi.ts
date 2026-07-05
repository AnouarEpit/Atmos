import type { RespuestaClima } from './tipos'

export async function obtenerClima(lat: number, lon: number): Promise<RespuestaClima> {
  const respuesta = await fetch(`/api/clima?lat=${lat}&lon=${lon}`)

  if (!respuesta.ok) {
    throw new Error(`Error al obtener el clima (${respuesta.status})`)
  }

  return respuesta.json()
}
