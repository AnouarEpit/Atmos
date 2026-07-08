import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { obtenerClima } from '../../lib/api/climaApi'

/**
 * Compartido entre hero-temperatura, forecast y datos-detalle: los tres
 * dominios necesitan el mismo current+daily, así que se pide una sola vez
 * aquí (React Query deduplica por queryKey si algún día se llama en más
 * de un lugar) y se pasa hacia abajo desde App.tsx.
 *
 * placeholderData: keepPreviousData — sin esto, cambiar de ciudad cambia el
 * queryKey (['clima', lat, lon]) y `data` pasa por `undefined` mientras carga
 * la ciudad nueva (si no estaba ya en caché). Forecast/DatosDetalle/Noticias
 * hacen `if (!dias) return null` etc., así que ese `undefined` los desmonta
 * a los tres de golpe — la página colapsa a solo el alto del hero por un
 * instante, y el navegador clampea scrollY a 0 (no hay nada más abajo para
 * scrollear). Cuando el contenido vuelve, el scroll no se restaura solo.
 * Encontrado buscando un bug de "el scroll salta al elegir ciudad" que
 * parecía de animación pero era este colapso — verificado midiendo
 * document.documentElement.scrollHeight en el momento exacto del click:
 * caía a 844px (= clientHeight) antes de volver a ~4700px.
 */
export function useClimaActual(lat: number, lon: number) {
  return useQuery({
    queryKey: ['clima', lat, lon],
    queryFn: () => obtenerClima(lat, lon),
    refetchInterval: 5 * 60 * 1000,
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData,
  })
}
