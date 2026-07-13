import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { obtenerNoticias, type AlcanceNoticias } from '../../lib/api/noticiasApi'
import { useRevelarEnScroll } from '../../shared/hooks/useRevelarEnScroll'
import { useEscalaPanel } from '../../shared/hooks/useEscalaPanel'
import { CirculoAnimado } from './components/CirculoAnimado'
import { NavCategorias, CATEGORIAS } from './components/NavCategorias'
import { PanelNoticias } from './components/PanelNoticias'
import { RailSecundario } from './components/RailSecundario'
import { AussiActualite } from './components/AussiActualite'
import { TickerBourse } from './components/TickerBourse'
import { NoticiasMobile } from './components/NoticiasMobile'

const SECUNDARIOS_COLUMNA = 3
const RAIL_MAX = 8
const AUSSI_MAX = 3

export function Noticias() {
  const [categoriaActiva, setCategoriaActiva] = useState<AlcanceNoticias>('francia')
  const revelarHeader = useRevelarEnScroll<HTMLDivElement>({ y: 24, start: 'top 92%', end: 'top 68%', activarEn: 'mobile' })
  // 'desktop'/'mobile': gsap.matchMedia() no crea el tween/ScrollTrigger fuera de su
  // breakpoint (mismo patrón ya usado en DatosDetalle) — ahora hay dos bloques
  // (grid desktop / pestañas mobile) en vez de uno solo, sin duplicar carga por frame.
  const revelarGrid = useRevelarEnScroll<HTMLDivElement>({ start: 'top 85%', end: 'top 50%', activarEn: 'desktop' })
  const revelarMobile = useRevelarEnScroll<HTMLDivElement>({ start: 'top 85%', end: 'top 50%', activarEn: 'mobile' })
  // Mismo mecanismo que el panel flotante de DatosDetalle (useEscalaPanel, solo desktop vía
  // gsap.matchMedia interno al hook): la sección entera (esquinas redondeadas + fondo sable)
  // aparece pequeña y crece hasta su tamaño real siguiendo el scroll, en vez de solo fade+y.
  const escalaSeccion = useEscalaPanel<HTMLElement>(0.96)
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

  // El sidebar nunca repite la categoría activa del nav (si ya estás viendo "Dans le
  // monde" en la columna principal, mostrar "Dans le monde" otra vez al lado es
  // contenido duplicado, no un digest útil) — cae a "Économie" en ese único caso.
  const alcanceSidebar: AlcanceNoticias = categoriaActiva === 'mundo' ? 'finanzas' : 'mundo'
  const labelSidebar = CATEGORIAS.find((c) => c.alcance === alcanceSidebar)?.label ?? ''
  // Mismas queryKeys que usan PanelNoticias/RailSecundario internamente — React Query
  // comparte caché (sin llamada extra), esto le da a Noticias.tsx el array completo para
  // armar "Aussi dans l'actualité" con lo que sobra después del tope fijo de la columna
  // principal (SECUNDARIOS_COLUMNA).
  const { data: dataPrincipal } = useQuery({
    queryKey: ['noticias', categoriaActiva],
    queryFn: () => obtenerNoticias(categoriaActiva),
    staleTime: 15 * 60 * 1000,
  })
  const { data: dataSidebar } = useQuery({
    queryKey: ['noticias', alcanceSidebar],
    queryFn: () => obtenerNoticias(alcanceSidebar),
    staleTime: 15 * 60 * 1000,
  })

  if (!data?.length) return null

  const [destacada, ...resto] = data
  const paraAussi = (dataPrincipal ?? []).slice(1 + SECUNDARIOS_COLUMNA, 1 + SECUNDARIOS_COLUMNA + AUSSI_MAX)

  return (
    <section ref={escalaSeccion} id="actus" className="relative isolate rounded-t-[3.5rem] bg-atmos-sable px-6 md:px-10 py-16">
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

          {/* items-start + topes fijos en vez de medir alturas en runtime: dos intentos
              anteriores con JS (rail recortado contra el destacado, después al revés,
              columna principal recortada contra el rail con `useLayoutEffect`+refs
              cruzados entre hermanos) terminaron en bugs reales de timing y en huecos
              que solo se trasladaban de una columna a la otra. Con altura por ítem ya
              acotada (`line-clamp-2` en los componentes de noticia) un tope fijo por
              columna (SECUNDARIOS_COLUMNA / RAIL_MAX) alcanza para que ninguna quede
              con hueco grande ni desborde, sin medir nada — y lo que sobra del feed
              principal no se esconde detrás de un botón, se reorganiza en una
              cuadrícula ancha debajo de todo (`AussiActualite`), con más espacio para
              leer cada artículo en vez de apretarlo en la columna angosta. */}
          <div ref={revelarGrid} className="grid md:grid-cols-[1fr_23rem] gap-16 items-start">
            {/* Prefijo "main-"/"sidebar-" en la key, no el valor de categoría solo: ambos
                divs sacan su key del mismo set de valores (AlcanceNoticias) — sin prefijo,
                React reconcilia children por key a través de TODOS los hermanos del mismo
                padre (no solo por posición), así que un click que hace que la key del panel
                principal pase a coincidir con la key que tenía el sidebar un instante antes
                (ej. clic en "Dans le monde" mientras el sidebar ya mostraba "mundo") reusa en
                silencio ese nodo DOM ya montado en vez de crear uno nuevo — la entrada nunca
                se anima porque, para React, no hubo remount. Confirmado con getAnimations()
                real frame a frame: sin el prefijo, el panel principal aparecía con 0
                animaciones activas ya en el primer frame; con el prefijo, siempre remonta. */}
            <div key={`main-${categoriaActiva}`} className="min-w-0 animate-[atmos-pasar-pagina_420ms_cubic-bezier(0.22,1,0.36,1)]">
              <PanelNoticias alcance={categoriaActiva} maxSecundarios={SECUNDARIOS_COLUMNA} />
            </div>

            <div key={`sidebar-${alcanceSidebar}`} className="min-w-0 animate-[atmos-pasar-pagina_420ms_cubic-bezier(0.22,1,0.36,1)]">
              <p className="font-mono text-xs uppercase tracking-wider text-atmos-slate mb-6">{labelSidebar}</p>
              <RailSecundario data={dataSidebar} max={RAIL_MAX} />
            </div>
          </div>

          <AussiActualite noticias={paraAussi} />

          {/* Bourse: franja propia de ancho completo debajo de todo, no metida dentro
              del rail — antes vivía pegada al final de "Dans le monde" y se leía como
              una caja suelta con hueco vacío alrededor. El marquee ya es horizontal y
              de ancho completo por diseño (TickerBourse), este es su lugar natural. */}
          <div className="mt-16 border-t border-atmos-slate/20 pt-8">
            <p className="font-mono text-xs uppercase tracking-wider text-atmos-slate mb-4">Bourse</p>
            <TickerBourse />
          </div>
        </div>
      </div>
    </section>
  )
}
