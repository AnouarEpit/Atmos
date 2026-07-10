import { useQuery } from '@tanstack/react-query'
import { obtenerNoticias } from '../../lib/api/noticiasApi'
import { useRevelarEnScroll } from '../../shared/hooks/useRevelarEnScroll'
import { ArticuloDestacado } from './components/ArticuloDestacado'
import { CirculoAnimado } from './components/CirculoAnimado'
import { ItemNoticiaCompacto } from './components/ItemNoticiaCompacto'
import { NoticiasMundo } from './components/NoticiasMundo'

export function Noticias() {
  const revelarHeader = useRevelarEnScroll<HTMLDivElement>({ y: 24, start: 'top 92%', end: 'top 68%' })
  const revelarGrid = useRevelarEnScroll<HTMLDivElement>({ start: 'top 85%', end: 'top 50%' })
  // Ya no depende de la ciudad seleccionada: son noticias reales de Francia (NewsData.io,
  // plan free no filtra de forma confiable por ciudad), no un feed personalizado por ciudad
  // como simulaba el mock anterior. staleTime largo: el backend ya cachea 15min de su lado,
  // y el contenido no cambia minuto a minuto — evita refetch al solo cambiar de ciudad.
  // queryFn envuelto en arrow function (no pasar `obtenerNoticias` directo): React Query
  // llama a queryFn con un objeto de contexto como primer argumento, que pisaría el default
  // param `alcance='francia'` si se pasa la referencia de la función tal cual.
  const { data } = useQuery({
    queryKey: ['noticias', 'francia'],
    queryFn: () => obtenerNoticias('francia'),
    staleTime: 15 * 60 * 1000,
  })

  if (!data?.length) return null

  const [destacada, ...resto] = data

  return (
    <section id="actus" className="relative isolate rounded-t-[3.5rem] bg-atmos-sable px-6 md:px-10 py-16">
      <div className="max-w-6xl mx-auto">
        <div ref={revelarHeader} className="flex items-baseline justify-between mb-10">
          <h2 className="font-display text-2xl text-atmos-ink">
            <CirculoAnimado>À la une</CirculoAnimado>
          </h2>
          <p className="font-mono text-xs uppercase tracking-wider text-atmos-slate">{data.length} articles</p>
        </div>

        <div ref={revelarGrid} className="grid grid-cols-1 lg:grid-cols-[1fr_23rem] gap-12">
          <div>
            <ArticuloDestacado noticia={destacada} />
            {resto.map((noticia) => (
              <ItemNoticiaCompacto key={noticia.id} noticia={noticia} />
            ))}
          </div>

          <NoticiasMundo />
        </div>
      </div>
    </section>
  )
}
