export interface Noticia {
  id: string
  categoria: string
  titular: string
  extracto: string
  fuente: string
  publicadoHaceHoras: number
  /** ISO 8601 real, para <time dateTime=...> — no solo el texto "il y a Nh". */
  publicadoEn: string
}

export async function obtenerNoticias(ciudad: string): Promise<Noticia[]> {
  const respuesta = await fetch(`/api/noticias?ciudad=${encodeURIComponent(ciudad)}`)

  if (!respuesta.ok) {
    throw new Error(`Error al obtener noticias (${respuesta.status})`)
  }

  return respuesta.json()
}
