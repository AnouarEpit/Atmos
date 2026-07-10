export interface Mercado {
  simbolo: string
  nombre: string
  precio: number
  variacionPorcentual: number
}

export async function obtenerBolsa(): Promise<Mercado[]> {
  const respuesta = await fetch('/api/bolsa')

  if (!respuesta.ok) {
    throw new Error(`Error al obtener la bolsa (${respuesta.status})`)
  }

  return respuesta.json()
}
