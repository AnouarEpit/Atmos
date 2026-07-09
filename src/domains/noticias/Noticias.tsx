import { useQuery } from '@tanstack/react-query'
import { obtenerNoticias } from '../../lib/api/noticiasApi'
import type { Ciudad } from '../../lib/data/ciudades'
import type { RespuestaClima } from '../../lib/api/tipos'
import { useRevelarEnScroll } from '../../shared/hooks/useRevelarEnScroll'
import { ArticuloDestacado } from './components/ArticuloDestacado'
import { ItemNoticiaCompacto } from './components/ItemNoticiaCompacto'
import { ResumenCiudad } from './components/ResumenCiudad'

interface Props {
  ciudad: Ciudad
  clima?: RespuestaClima
}

export function Noticias({ ciudad, clima }: Props) {
  const revelarHeader = useRevelarEnScroll<HTMLDivElement>({ y: 24, start: 'top 92%', end: 'top 68%' })
  const revelarGrid = useRevelarEnScroll<HTMLDivElement>({ start: 'top 85%', end: 'top 50%' })
  const { data } = useQuery({
    queryKey: ['noticias', ciudad.nombre],
    queryFn: () => obtenerNoticias(ciudad.nombre),
  })

  if (!data?.length) return null

  const [destacada, ...resto] = data

  return (
    <section id="actus" className="relative isolate rounded-t-[3.5rem] bg-atmos-sable px-6 md:px-10 py-16">
      <div className="max-w-6xl mx-auto">
        <div ref={revelarHeader} className="flex items-baseline justify-between mb-10">
          <h2 className="font-display text-2xl text-atmos-ink">À la une</h2>
          <p className="font-mono text-xs uppercase tracking-wider text-atmos-slate">{data.length} articles</p>
        </div>

        <div ref={revelarGrid} className="grid grid-cols-1 lg:grid-cols-[1fr_23rem] gap-12">
          <div>
            <ArticuloDestacado noticia={destacada} />
            {resto.map((noticia, indice) => (
              <ItemNoticiaCompacto key={noticia.id} noticia={noticia} indice={indice + 1} />
            ))}
          </div>

          {clima && <ResumenCiudad ciudad={ciudad} clima={clima} />}
        </div>
      </div>
    </section>
  )
}
