import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { obtenerNoticias, type AlcanceNoticias } from '../../lib/api/noticiasApi'
import { useRevelarEnScroll } from '../../shared/hooks/useRevelarEnScroll'
import { CirculoAnimado } from './components/CirculoAnimado'
import { NavCategorias, CATEGORIAS } from './components/NavCategorias'
import { PanelNoticias } from './components/PanelNoticias'
import { TickerBourse } from './components/TickerBourse'
import { NoticiasMobile } from './components/NoticiasMobile'

export function Noticias() {
  const [categoriaActiva, setCategoriaActiva] = useState<AlcanceNoticias>('francia')
  const revelarHeader = useRevelarEnScroll<HTMLDivElement>({ y: 24, start: 'top 92%', end: 'top 68%', activarEn: 'mobile' })
  // 'desktop'/'mobile': gsap.matchMedia() no crea el tween/ScrollTrigger fuera de su
  // breakpoint (mismo patrón ya usado en DatosDetalle) — ahora hay dos bloques
  // (grid desktop / pestañas mobile) en vez de uno solo, sin duplicar carga por frame.
  const revelarGrid = useRevelarEnScroll<HTMLDivElement>({ start: 'top 85%', end: 'top 50%', activarEn: 'desktop' })
  const revelarMobile = useRevelarEnScroll<HTMLDivElement>({ start: 'top 85%', end: 'top 50%', activarEn: 'mobile' })
  // Ya no depende de la ciudad seleccionada: son noticias reales de Francia (NewsData.io,
  // plan free no filtra de forma confiable por ciudad), no un feed personalizado por ciudad
  // como simulaba el mock anterior. staleTime largo: el backend ya cachea 15min de su lado,
  // y el contenido no cambia minuto a minuto — evita refetch al solo cambiar de ciudad.
  // queryFn envuelto en arrow function (no pasar `obtenerNoticias` directo): React Query
  // llama a queryFn con un objeto de contexto como primer argumento, que pisaría el default
  // param `alcance='francia'` si se pasa la referencia de la función tal cual.
  // Solo para mobile (destacada/resto de `NoticiasMobile` y el contador del header mobile) —
  // desktop obtiene su propio feed vía `PanelNoticias` según la categoría activa del nav
  // (misma queryKey ['noticias','francia'] cuando la categoría es "À la une", React Query
  // comparte caché, sin llamada extra).
  const { data } = useQuery({
    queryKey: ['noticias', 'francia'],
    queryFn: () => obtenerNoticias('francia'),
    staleTime: 15 * 60 * 1000,
  })

  if (!data?.length) return null

  const [destacada, ...resto] = data

  // El sidebar nunca repite la categoría activa del nav (si ya estás viendo "Dans le
  // monde" en la columna principal, mostrar "Dans le monde" otra vez al lado es
  // contenido duplicado, no un digest útil) — cae a "Économie" en ese único caso.
  const alcanceSidebar: AlcanceNoticias = categoriaActiva === 'mundo' ? 'finanzas' : 'mundo'
  const labelSidebar = CATEGORIAS.find((c) => c.alcance === alcanceSidebar)?.label ?? ''

  return (
    <section id="actus" className="relative isolate rounded-t-[3.5rem] bg-atmos-sable px-6 md:px-10 py-16">
      <div className="max-w-6xl mx-auto">
        {/* Header compartido solo mobile: en desktop el nav de categorías (abajo)
            reemplaza este título único — "À la une" es una categoría más del nav. */}
        <div ref={revelarHeader} className="md:hidden flex items-baseline justify-between mb-10">
          <h2 className="font-display text-2xl text-atmos-ink">
            <CirculoAnimado>À la une</CirculoAnimado>
          </h2>
          <p className="font-mono text-xs uppercase tracking-wider text-atmos-slate">{data.length} articles</p>
        </div>

        <div ref={revelarMobile} className="md:hidden">
          <NoticiasMobile destacada={destacada} resto={resto} />
        </div>

        {/* Desktop: nav de categorías arriba + 2 columnas (feed principal según
            categoría activa + sidebar con otra categoría como digest — nunca la misma
            que la activa, ver `alcanceSidebar`). min-w-0 en ambas: sin esto, un grid
            item conserva min-width:auto por default y contenido intrínsecamente ancho
            puede empujar el track entero (mismo bug ya documentado con flex-1). */}
        <div className="hidden md:block">
          <NavCategorias activa={categoriaActiva} onCambiar={setCategoriaActiva} />

          {/* items-start: "Dans le monde" (6 ítems compactos) es estructuralmente más
              corta que "À la une" (destacada con imagen+extracto + lista) — forzar la
              sidebar a la misma altura (grid stretch + mt-auto en el ticker) solo
              trasladaba el hueco vacío al medio de la columna, se veía roto. La
              asimetría entre columnas es composición editorial válida (no un bug a
              tapar) — el ticker va pegado al final real de su propio contenido, con
              separación y un corte (border-t) que lo marca como cierre intencional
              de la columna, no como relleno forzado. */}
          <div ref={revelarGrid} className="grid md:grid-cols-[1fr_23rem] gap-16 items-start">
            <div key={categoriaActiva} className="min-w-0 animate-[atmos-aparecer_300ms_ease-out]">
              <PanelNoticias alcance={categoriaActiva} />
            </div>

            <div key={alcanceSidebar} className="min-w-0 animate-[atmos-aparecer_300ms_ease-out]">
              <p className="font-mono text-xs uppercase tracking-wider text-atmos-slate mb-6">{labelSidebar}</p>
              <PanelNoticias alcance={alcanceSidebar} variante="compacta" />
              <div className="mt-12 border-t border-atmos-slate/20 pt-6">
                <p className="font-mono text-xs uppercase tracking-wider text-atmos-slate mb-4">Bourse</p>
                <TickerBourse />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
