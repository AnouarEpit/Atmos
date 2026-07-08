import { useQuery } from '@tanstack/react-query'
import { obtenerTemperaturasLote } from '../../lib/api/climaApi'
import { ciudades } from '../../lib/data/ciudades'

/**
 * Temperatura actual de las 19 ciudades curadas, en una sola request — usada
 * por el buscador (overlay/menú) para mostrar "18°" junto a cada resultado.
 * `enabled` la deja perezosa: no se pide hasta que el buscador se abre por
 * primera vez. staleTime largo porque no hace falta que sea al segundo.
 */
export function useTemperaturasCiudades(habilitado: boolean) {
  const { data } = useQuery({
    queryKey: ['temperaturas-lote'],
    queryFn: () => obtenerTemperaturasLote(ciudades.map((c) => ({ lat: c.lat, lon: c.lon }))),
    enabled: habilitado,
    staleTime: 10 * 60 * 1000,
  })

  const porSlug = new Map<string, number>()
  data?.forEach((temp, indice) => porSlug.set(ciudades[indice].slug, temp))
  return porSlug
}
