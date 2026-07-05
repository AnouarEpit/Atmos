export interface Noticia {
  id: string
  titular: string
  fuente: string
  publicadoHaceHoras: number
}

export async function obtenerNoticias(ciudad: string): Promise<Noticia[]> {
  const respuesta = await fetch(`/api/noticias?ciudad=${encodeURIComponent(ciudad)}`)

  if (!respuesta.ok) {
    throw new Error(`Error al obtener noticias (${respuesta.status})`)
  }

  return respuesta.json()
}
