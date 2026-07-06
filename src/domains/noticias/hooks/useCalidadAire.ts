import { useQuery } from '@tanstack/react-query'
import { obtenerCalidadAire } from '../../../lib/api/aireApi'

/** La calidad del aire cambia lento — staleTime largo evita refetch innecesario al navegar. */
export function useCalidadAire(lat: number, lon: number) {
  return useQuery({
    queryKey: ['aire', lat, lon],
    queryFn: () => obtenerCalidadAire(lat, lon),
    staleTime: 30 * 60 * 1000,
  })
}
