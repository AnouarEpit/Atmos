import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { obtenerCalidadAire } from '../../../lib/api/aireApi'

/**
 * La calidad del aire cambia lento — staleTime largo evita refetch innecesario al navegar.
 * placeholderData: keepPreviousData — mismo motivo que useClimaActual.ts: sin esto, cambiar
 * de ciudad hace pasar `data` por `undefined` un instante, contribuyendo al colapso de altura
 * de página que clampeaba el scroll a 0 al elegir ciudad (ver comentario ahí para el detalle).
 */
export function useCalidadAire(lat: number, lon: number) {
  return useQuery({
    queryKey: ['aire', lat, lon],
    queryFn: () => obtenerCalidadAire(lat, lon),
    staleTime: 30 * 60 * 1000,
    placeholderData: keepPreviousData,
  })
}
