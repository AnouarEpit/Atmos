export interface CalidadAire {
  aqi: number
}

export async function obtenerCalidadAire(lat: number, lon: number): Promise<CalidadAire> {
  const respuesta = await fetch(`/api/aire?lat=${lat}&lon=${lon}`)

  if (!respuesta.ok) {
    throw new Error(`Error al obtener calidad del aire (${respuesta.status})`)
  }

  return respuesta.json()
}
