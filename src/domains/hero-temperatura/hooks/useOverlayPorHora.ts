import { mapCondicion, type Condicion } from '../../../lib/clima/condicion'
import { bucketHoraLocal, type BucketHora } from '../../../lib/clima/horaLocal'

interface Gradiente {
  stop1: string
  stop2: string
  stop3: string
}

/**
 * Siempre oscuro (abajo) → transparente (arriba): el texto en atmos-bone
 * queda legible sin decidir contraste caso por caso. El color base también
 * cambia de hue por bucket (cálido al amanecer/atardecer, índigo profundo
 * de noche) para que el paso de hora sea perceptible, no solo un cambio de
 * opacidad.
 */
const GRADIENTES_HORA: Record<BucketHora, Gradiente> = {
  aube: { stop1: 'rgba(64,40,52,0.72)', stop2: 'rgba(64,40,52,0.30)', stop3: 'rgba(64,40,52,0.10)' },
  jour: { stop1: 'rgba(24,28,26,0.28)', stop2: 'rgba(24,28,26,0.06)', stop3: 'rgba(24,28,26,0.04)' },
  crepuscule: { stop1: 'rgba(58,32,44,0.80)', stop2: 'rgba(58,32,44,0.38)', stop3: 'rgba(58,32,44,0.14)' },
  nuit: { stop1: 'rgba(8,10,24,0.94)', stop2: 'rgba(8,10,24,0.58)', stop3: 'rgba(8,10,24,0.22)' },
}

/** Colores más saturados que la v1: el blend "overlay" con tintes desaturados apenas rotaba el hue, solo bajaba luminosidad. */
const TINTES_CLIMA: Record<Condicion, string> = {
  despejado: 'rgba(214,163,64,0.18)',
  nubes: 'rgba(168,180,190,0.24)',
  lluvia: 'rgba(46,64,86,0.44)',
  tormenta: 'rgba(44,30,74,0.56)',
  nieve: 'rgba(196,212,224,0.30)',
  niebla: 'rgba(188,194,198,0.52)',
}

export function useOverlayPorHora(idClima: number, timezoneOffsetSegundos: number) {
  const bucketHora = bucketHoraLocal(timezoneOffsetSegundos)
  const condicion = mapCondicion(idClima)

  return {
    bucketHora,
    condicion,
    gradiente: GRADIENTES_HORA[bucketHora],
    tinte: TINTES_CLIMA[condicion],
  }
}
