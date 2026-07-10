/**
 * "Bourse" — movimiento de mercados vía Twelve Data (`/quote`). Los índices
 * puros (CAC 40, DAX, Nikkei, Dow Jones, Nasdaq...) están bloqueados en el
 * plan free (verificado en vivo: devuelven "available starting with the
 * Grow or Venture plan" o "invalid symbol" según el caso). Workaround real:
 * ETFs de país/región que sí funcionan en el free tier y siguen de cerca
 * esos mismos mercados (son los ETFs estándar que cualquier trader usa para
 * eso) — datos reales, en vivo, sin plan pago.
 */
const MERCADOS = [
  { simbolo: 'SPY', nombre: 'S&P 500' },
  { simbolo: 'QQQ', nombre: 'Nasdaq' },
  { simbolo: 'DIA', nombre: 'Dow Jones' },
  { simbolo: 'EWQ', nombre: 'France (CAC 40)' },
  { simbolo: 'EWG', nombre: 'Allemagne (DAX)' },
  { simbolo: 'EWU', nombre: 'Royaume-Uni (FTSE)' },
  { simbolo: 'EWJ', nombre: 'Japon (Nikkei)' },
]

const DURACION_CACHE_MS = 15 * 60 * 1000
let cache = { datos: null, expiraEn: 0 }

export async function obtenerBolsa() {
  if (cache.datos && cache.expiraEn > Date.now()) {
    return cache.datos
  }

  const apiKey = process.env.TWELVEDATA_API_KEY
  if (!apiKey) throw new Error('Falta TWELVEDATA_API_KEY en el entorno')

  const simbolos = MERCADOS.map((m) => m.simbolo).join(',')
  const respuesta = await fetch(`https://api.twelvedata.com/quote?symbol=${simbolos}&apikey=${apiKey}`)
  if (!respuesta.ok) {
    throw new Error(`Twelve Data respondió ${respuesta.status}`)
  }

  const cuerpo = await respuesta.json()
  const datos = MERCADOS.map(({ simbolo, nombre }) => {
    const q = cuerpo[simbolo]
    return {
      simbolo,
      nombre,
      precio: q ? Number(q.close) : null,
      variacionPorcentual: q ? Number(q.percent_change) : null,
    }
  }).filter((m) => m.precio !== null)

  cache = { datos, expiraEn: Date.now() + DURACION_CACHE_MS }
  return datos
}
