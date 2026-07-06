/** Compartido entre datos-detalle e IndiceLateral (hero) — evita duplicar la lógica de umbrales. */
export function nivelUV(uvi: number): string {
  if (uvi < 3) return 'Faible'
  if (uvi < 6) return 'Modéré'
  if (uvi < 8) return 'Élevé'
  return 'Très élevé'
}

/**
 * Formatea un unix timestamp (ya correctamente calculado por el backend con
 * utc_offset_seconds, ver climaService.js) como "HH:mm" en la hora LOCAL de
 * la ciudad — no la del navegador. Misma técnica que useOverlayPorHora:
 * se suma el offset y se lee como si fuera UTC.
 */
export function formatearHora(unixSegundos: number, timezoneOffsetSegundos: number): string {
  const fecha = new Date((unixSegundos + timezoneOffsetSegundos) * 1000)
  const horas = String(fecha.getUTCHours()).padStart(2, '0')
  const minutos = String(fecha.getUTCMinutes()).padStart(2, '0')
  return `${horas}:${minutos}`
}

/** Bucketing simple del índice europeo de calidad del aire (0-100+) de Open-Meteo Air Quality. */
export function calidadAireInfo(aqi: number): { etiqueta: string; colorClase: string } {
  if (aqi <= 40) return { etiqueta: 'Bonne', colorClase: 'bg-[#5b7a5e]' }
  if (aqi <= 80) return { etiqueta: 'Modérée', colorClase: 'bg-atmos-gold' }
  return { etiqueta: 'Mauvaise', colorClase: 'bg-[#a8503f]' }
}

const DIRECCIONES_VIENTO = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO']

/** Compartido entre datos-detalle y ResumenCiudad (noticias) — evita duplicar la lógica. */
export function direccionViento(grados: number): string {
  return DIRECCIONES_VIENTO[Math.round(grados / 45) % 8]
}
