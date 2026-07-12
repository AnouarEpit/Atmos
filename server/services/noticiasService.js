/**
 * Noticias reales vía NewsData.io (`/api/1/latest`). Tres alcances:
 * - `francia`: `country=fr`+`language=fr` — noticias de Francia (feed principal).
 * - `mundo`: solo `language=fr`, sin `country` — noticias globales pero en
 *   francés (medios francófonos de cualquier país: RFI, France24 Monde, etc.),
 *   coherente con que el sitio entero está en francés, en vez de mezclar
 *   idiomas en la tarjeta.
 * - `finanzas`: `category=business`+`country=fr` — noticias económicas/bursátiles
 *   de Francia, para la pestaña Bourse (complementa el ticker de mercados con
 *   contexto real, no solo números).
 * - `sport`/`culture`: `category=sports`/`category=entertainment`+`country=fr` —
 *   para el nav de categorías de "À la une" (mismo patrón que `finanzas`).
 *
 * `image=1` pide solo artículos que ya traen imagen (evita huecos en las
 * tarjetas). `removeduplicate=1` filtra sindicaciones repetidas entre medios
 * del mismo grupo editorial.
 *
 * Caché en memoria de 15 min POR ALCANCE: el free tier de NewsData.io ya
 * entrega los artículos con 12h de delay (no cambian minuto a minuto), y esto
 * evita gastar cuota (200 créditos/día) con cada visita si varios usuarios
 * entran en un rango corto de tiempo.
 */
const CATEGORIAS_FR = {
  business: 'Économie',
  crime: 'Faits divers',
  domestic: 'Société',
  education: 'Éducation',
  entertainment: 'Culture',
  environment: 'Environnement',
  food: 'Gastronomie',
  health: 'Santé',
  lifestyle: 'Style de vie',
  politics: 'Politique',
  science: 'Science',
  sports: 'Sport',
  technology: 'Technologie',
  tourism: 'Tourisme',
  top: 'À la une',
  world: 'Monde',
  other: 'Actualité',
}

const DURACION_CACHE_MS = 15 * 60 * 1000
const cachePorAlcance = new Map()

function traducirCategoria(categorias) {
  const primera = categorias?.[0] ?? 'other'
  return CATEGORIAS_FR[primera] ?? 'Actualité'
}

/** NewsData.io da `pubDate` "naive" en UTC (ej. "2026-07-09 12:05:00") + `pubDateTZ:"UTC"` — se le agrega la Z explícita, no se asume la zona del servidor. */
function pubDateAIso(pubDate) {
  return new Date(`${pubDate.replace(' ', 'T')}Z`).toISOString()
}

async function obtenerDeNewsData(alcance) {
  const apiKey = process.env.NEWSDATA_API_KEY
  if (!apiKey) throw new Error('Falta NEWSDATA_API_KEY en el entorno')

  const parametros = new URLSearchParams({
    apikey: apiKey,
    language: 'fr',
    image: '1',
    removeduplicate: '1',
    size: alcance === 'francia' ? '8' : '6',
  })
  // Sacar `country` solo (sin más) seguía devolviendo mayoría Francia — el francés
  // es idioma dominante de Francia, no filtra "internacional" por sí solo.
  // `category=world` sí trae contenido genuinamente global (verificado en vivo:
  // Congo, Senegal, OTAN/Ucrania), aunque la fuente sea un medio francés cubriendo
  // el mundo — que es exactamente "noticias mundiales" en francés, lo pedido.
  if (alcance === 'mundo') {
    parametros.set('category', 'world')
  } else if (alcance === 'finanzas') {
    parametros.set('category', 'business')
    parametros.set('country', 'fr')
  } else if (alcance === 'sport') {
    parametros.set('category', 'sports')
    parametros.set('country', 'fr')
  } else if (alcance === 'culture') {
    parametros.set('category', 'entertainment')
    parametros.set('country', 'fr')
  } else {
    parametros.set('country', 'fr')
  }

  const respuesta = await fetch(`https://newsdata.io/api/1/latest?${parametros}`)
  if (!respuesta.ok) {
    throw new Error(`NewsData.io respondió ${respuesta.status}`)
  }

  const cuerpo = await respuesta.json()
  const ahora = Date.now()

  return (cuerpo.results ?? []).map((articulo) => {
    const publicadoEn = pubDateAIso(articulo.pubDate)
    const horas = Math.max(1, Math.round((ahora - new Date(publicadoEn).getTime()) / 3_600_000))
    return {
      id: articulo.article_id,
      categoria: traducirCategoria(articulo.category),
      titular: articulo.title,
      extracto: articulo.description || articulo.title,
      fuente: articulo.source_name,
      enlace: articulo.link,
      imagen: articulo.image_url,
      publicadoHaceHoras: horas,
      publicadoEn,
    }
  })
}

export async function obtenerNoticias(alcance = 'francia') {
  const cache = cachePorAlcance.get(alcance)
  if (cache && cache.expiraEn > Date.now()) {
    return cache.datos
  }

  const datos = await obtenerDeNewsData(alcance)
  cachePorAlcance.set(alcance, { datos, expiraEn: Date.now() + DURACION_CACHE_MS })
  return datos
}
