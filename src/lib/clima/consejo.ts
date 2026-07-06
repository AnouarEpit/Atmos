import type { ClimaActual } from '../api/tipos'
import { mapCondicion } from './condicion'

export type TipoConsejo = 'sol' | 'viento' | 'lluvia' | 'general'

export interface Consejo {
  tipo: TipoConsejo
  texto: string
}

const UMBRAL_UV_ALTO = 6
const UMBRAL_VIENTO_KMH = 25

/**
 * Reglas simples sobre datos ya disponibles (sin IA, sin llamada nueva) —
 * función pura, testeable de forma aislada del componente que la usa.
 */
export function consejoDelDia(actual: ClimaActual): Consejo {
  const vientoKmh = actual.wind_speed * 3.6
  const condicion = mapCondicion(actual.weather[0]?.id ?? 0)

  if (actual.uvi >= UMBRAL_UV_ALTO) {
    return { tipo: 'sol', texto: 'Indice UV élevé — pensez à la protection solaire.' }
  }
  if (vientoKmh > UMBRAL_VIENTO_KMH) {
    return { tipo: 'viento', texto: 'Vent fort attendu — pensez à sécuriser les objets extérieurs.' }
  }
  if (condicion === 'lluvia' || condicion === 'tormenta') {
    return { tipo: 'lluvia', texto: "Pluie au programme — n'oubliez pas votre parapluie." }
  }
  return { tipo: 'general', texto: 'Journée agréable pour sortir profiter du temps.' }
}
