export type Condicion = 'despejado' | 'nubes' | 'lluvia' | 'tormenta' | 'nieve' | 'niebla'

/**
 * Agrupa los códigos WMO (weather_code de Open-Meteo) en las 6 familias que
 * maneja el overlay dinámico. Tabla oficial: https://open-meteo.com/en/docs
 * ("WMO Weather interpretation codes"). Importante: 80-82 son averses de
 * pluie (lluvia), no nieve — las de nieve son 71-77 y 85-86.
 */
const FAMILIAS_WMO: Record<Condicion, readonly number[]> = {
  despejado: [0],
  nubes: [1, 2, 3],
  niebla: [45, 48],
  lluvia: [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82],
  nieve: [71, 73, 75, 77, 85, 86],
  tormenta: [95, 96, 99],
}

const CODIGO_A_FAMILIA: Record<number, Condicion> = Object.fromEntries(
  Object.entries(FAMILIAS_WMO).flatMap(([familia, codigos]) => codigos.map((codigo) => [codigo, familia as Condicion])),
)

export function mapCondicion(codigoWmo: number): Condicion {
  return CODIGO_A_FAMILIA[codigoWmo] ?? 'nubes'
}
