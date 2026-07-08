export type BucketHora = 'aube' | 'jour' | 'crepuscule' | 'nuit'

/**
 * Compartido entre useOverlayPorHora (hero) y RecuadroAtmosferico (video
 * día/noche de DatosDetalle mobile) — un solo umbral de "es de noche" para
 * todo el sitio, no dos lógicas separadas que puedan desincronizarse.
 */
export function bucketHoraLocal(timezoneOffsetSegundos: number): BucketHora {
  const localMs = Date.now() + timezoneOffsetSegundos * 1000
  const hora = new Date(localMs).getUTCHours()
  if (hora >= 5 && hora < 7) return 'aube'
  if (hora >= 7 && hora < 18) return 'jour'
  if (hora >= 18 && hora < 20) return 'crepuscule'
  return 'nuit'
}
