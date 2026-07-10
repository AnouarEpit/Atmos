/**
 * Noticias reales vía NewsData.io (`/api/1/latest`) — reemplaza el mock
 * anterior. `country=fr`+`language=fr` (noticias de Francia, no de la
 * ciudad seleccionada: la API no filtra por ciudad de forma confiable en
 * el plan free, así que dejó de tener sentido inyectar el nombre de
 * ciudad en los titulares como hacía el mock). `image=1` pide solo
 * artículos que ya traen imagen (evita placeholders/huecos en las
 * tarjetas). `removeduplicate=1` filtra sindicaciones repetidas entre
 * medios del mismo grupo editorial.
 *
 * Caché en memoria de 15 min: el free tier de NewsData.io ya entrega los
 * artículos con 12h de delay (no cambian minuto a minuto), y esto evita
 * gastar cuota (200 créditos/día) con cada visita si varios usuarios
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
let cache = { datos: null, expiraEn: 0 }

function traducirCategoria(categorias) {
  const primera = categorias?.[0] ?? 'other'
  return CATEGORIAS_FR[primera] ?? 'Actualité'
}

/** NewsData.io da `pubDate` "naive" en UTC (ej. "2026-07-09 12:05:00") + `pubDateTZ:"UTC"` — se le agrega la Z explícita, no se asume la zona del servidor. */
function pubDateAIso(pubDate) {
  return new Date(`${pubDate.replace(' ', 'T')}Z`).toISOString()
}

async function obtenerDeNewsData() {
  const apiKey = process.env.NEWSDATA_API_KEY
  if (!apiKey) throw new Error('Falta NEWSDATA_API_KEY en el entorno')

  const parametros = new URLSearchParams({
    apikey: apiKey,
    country: 'fr',
    language: 'fr',
    image: '1',
    removeduplicate: '1',
    size: '8',
  })

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

export async function obtenerNoticias() {
  if (cache.datos && cache.expiraEn > Date.now()) {
    return cache.datos
  }

  const datos = await obtenerDeNewsData()
  cache = { datos, expiraEn: Date.now() + DURACION_CACHE_MS }
  return datos
}
