const CICLO_SINODICO_DIAS = 29.530588853
/** 6 enero 2000, 18:14 UTC — referencia estándar de nueva luna usada por la mayoría de algoritmos simplificados. */
const NUEVA_LUNA_REFERENCIA_MS = Date.UTC(2000, 0, 6, 18, 14, 0)

export interface FaseLunar {
  nombre: string
  /** 0 (nueva) a 1 (llena a mitad de ciclo, y de vuelta a 0) — fracción del disco iluminada. */
  iluminacion: number
  /** 0 a 1 dentro del ciclo sinódico, 0=nueva, 0.5=llena — usado para dibujar el icono. */
  cicloFraccion: number
}

const NOMBRES_FASES = [
  'Nouvelle lune',
  'Premier croissant',
  'Premier quartier',
  'Gibbeuse croissante',
  'Pleine lune',
  'Gibbeuse décroissante',
  'Dernier quartier',
  'Dernier croissant',
]

/**
 * Fase lunar por edad del ciclo sinódico — matemática pura, sin API ni
 * dependencia externa. Función pura y testeable de forma aislada.
 */
export function faseLunar(fecha: Date = new Date()): FaseLunar {
  const diasTranscurridos = (fecha.getTime() - NUEVA_LUNA_REFERENCIA_MS) / 86400000
  const edadDias = ((diasTranscurridos % CICLO_SINODICO_DIAS) + CICLO_SINODICO_DIAS) % CICLO_SINODICO_DIAS
  const cicloFraccion = edadDias / CICLO_SINODICO_DIAS
  const indice = Math.floor(cicloFraccion * 8 + 0.5) % 8
  const iluminacion = (1 - Math.cos(cicloFraccion * 2 * Math.PI)) / 2
  return { nombre: NOMBRES_FASES[indice], iluminacion, cicloFraccion }
}
