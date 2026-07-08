const BASE_URL = 'https://api.open-meteo.com/v1/forecast'

/**
 * Textos en francés para los códigos WMO que devuelve Open-Meteo.
 * Tabla oficial: https://open-meteo.com/en/docs (sección "WMO Weather codes").
 * 80-82 son "averses de pluie" (lluvia), no nieve — 85-86 son las de nieve.
 */
const DESCRIPCIONES_WMO = {
  0: 'Ciel dégagé',
  1: 'Généralement dégagé',
  2: 'Partiellement nuageux',
  3: 'Couvert',
  45: 'Brouillard',
  48: 'Brouillard givrant',
  51: 'Bruine légère',
  53: 'Bruine modérée',
  55: 'Bruine dense',
  56: 'Bruine verglaçante légère',
  57: 'Bruine verglaçante dense',
  61: 'Pluie légère',
  63: 'Pluie modérée',
  65: 'Pluie forte',
  66: 'Pluie verglaçante légère',
  67: 'Pluie verglaçante forte',
  71: 'Neige légère',
  73: 'Neige modérée',
  75: 'Neige forte',
  77: 'Grains de neige',
  80: 'Averses de pluie légères',
  81: 'Averses de pluie modérées',
  82: 'Averses de pluie violentes',
  85: 'Averses de neige légères',
  86: 'Averses de neige fortes',
  95: 'Orage',
  96: 'Orage avec grêle légère',
  99: 'Orage avec grêle forte',
}

function descripcionParaCodigo(codigoWmo) {
  return DESCRIPCIONES_WMO[codigoWmo] ?? 'Conditions variables'
}

function construirCondicion(codigoWmo) {
  return { id: codigoWmo, main: String(codigoWmo), description: descripcionParaCodigo(codigoWmo), icon: '' }
}

/** Convierte un datetime local "naive" de Open-Meteo (sin zona) + su offset UTC en segundos a un unix timestamp real. */
function aUnixConOffset(fechaLocalIso, offsetSegundos) {
  return Math.floor((Date.parse(`${fechaLocalIso}Z`) - offsetSegundos * 1000) / 1000)
}

/** Fechas puras "YYYY-MM-DD" (daily.time) no llevan hora: Date.parse las trata como medianoche UTC, sin ambigüedad. */
function aUnixFecha(fechaIso) {
  return Math.floor(Date.parse(fechaIso) / 1000)
}

/**
 * Temperatura actual de varias ciudades en una sola llamada — Open-Meteo acepta
 * latitude/longitude como listas separadas por coma y devuelve un array de
 * resultados en el mismo orden. Usado por el buscador (overlay/menú) para
 * mostrar "18°" junto a cada resultado sin una request por ciudad.
 */
export async function obtenerTemperaturasLote(coordenadas) {
  const params = new URLSearchParams({
    latitude: coordenadas.map((c) => c.lat).join(','),
    longitude: coordenadas.map((c) => c.lon).join(','),
    current: 'temperature_2m',
    timezone: 'auto',
  })

  const respuesta = await fetch(`${BASE_URL}?${params}`)

  if (!respuesta.ok) {
    const detalle = await respuesta.text()
    throw new Error(`Open-Meteo respondió ${respuesta.status}: ${detalle}`)
  }

  const datos = await respuesta.json()
  return datos.map((d) => Math.round(d.current.temperature_2m))
}

export async function obtenerClima(lat, lon) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure,uv_index',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset',
    wind_speed_unit: 'ms',
    timezone: 'auto',
  })

  const respuesta = await fetch(`${BASE_URL}?${params}`)

  if (!respuesta.ok) {
    const detalle = await respuesta.text()
    throw new Error(`Open-Meteo respondió ${respuesta.status}: ${detalle}`)
  }

  const datos = await respuesta.json()
  const offsetSegundos = datos.utc_offset_seconds

  return {
    lat: datos.latitude,
    lon: datos.longitude,
    timezone: datos.timezone,
    timezone_offset: offsetSegundos,
    current: {
      dt: aUnixConOffset(datos.current.time, offsetSegundos),
      sunrise: aUnixConOffset(datos.daily.sunrise[0], offsetSegundos),
      sunset: aUnixConOffset(datos.daily.sunset[0], offsetSegundos),
      temp: datos.current.temperature_2m,
      feels_like: datos.current.apparent_temperature,
      humidity: datos.current.relative_humidity_2m,
      pressure: Math.round(datos.current.surface_pressure),
      uvi: datos.current.uv_index,
      wind_speed: datos.current.wind_speed_10m,
      wind_deg: datos.current.wind_direction_10m,
      weather: [construirCondicion(datos.current.weather_code)],
    },
    daily: datos.daily.time.map((fecha, indice) => ({
      dt: aUnixFecha(fecha),
      temp: { min: datos.daily.temperature_2m_min[indice], max: datos.daily.temperature_2m_max[indice] },
      weather: [construirCondicion(datos.daily.weather_code[indice])],
      // Open-Meteo no da estos agregados a nivel diario y el frontend no los usa hoy (solo dt/temp/weather en TarjetaDia).
      uvi: 0,
      wind_speed: 0,
      humidity: 0,
      pressure: 0,
    })),
  }
}
