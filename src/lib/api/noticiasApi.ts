export interface Noticia {
  id: string
  categoria: string
  titular: string
  extracto: string
  fuente: string
  /** URL del artículo real (NewsData.io) — hace clicable la tarjeta. */
  enlace: string
  /** Puede faltar pese al filtro `image=1` del backend (datos de terceros) — los componentes deben degradar sin ella. */
  imagen?: string
  publicadoHaceHoras: number
  /** ISO 8601 real, para <time dateTime=...> — no solo el texto "il y a Nh". */
  publicadoEn: string
}

export type AlcanceNoticias = 'francia' | 'mundo' | 'finanzas' | 'sport' | 'culture'

export async function obtenerNoticias(alcance: AlcanceNoticias = 'francia'): Promise<Noticia[]> {
  const respuesta = await fetch(`/api/noticias?alcance=${alcance}`)

  if (!respuesta.ok) {
    throw new Error(`Error al obtener noticias (${respuesta.status})`)
  }

  return respuesta.json()
}
