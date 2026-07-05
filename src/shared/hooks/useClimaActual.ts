import { useQuery } from '@tanstack/react-query'
import { obtenerClima } from '../../lib/api/climaApi'

/**
 * Compartido entre hero-temperatura, forecast y datos-detalle: los tres
 * dominios necesitan el mismo current+daily, así que se pide una sola vez
 * aquí (React Query deduplica por queryKey si algún día se llama en más
 * de un lugar) y se pasa hacia abajo desde App.tsx.
 */
export function useClimaActual(lat: number, lon: number) {
  return useQuery({
    queryKey: ['clima', lat, lon],
    queryFn: () => obtenerClima(lat, lon),
    refetchInterval: 5 * 60 * 1000,
    staleTime: 60 * 1000,
  })
}
