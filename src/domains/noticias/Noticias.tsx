import { useQuery } from '@tanstack/react-query'
import { obtenerNoticias } from '../../lib/api/noticiasApi'
import { NoticiaCard } from './components/NoticiaCard'

interface Props {
  ciudad: string
}

export function Noticias({ ciudad }: Props) {
  const { data } = useQuery({
    queryKey: ['noticias', ciudad],
    queryFn: () => obtenerNoticias(ciudad),
  })

  if (!data?.length) return null

  return (
    <section id="actus" className="bg-atmos-bone px-6 md:px-10 py-16 max-w-3xl">
      <h2 className="font-display text-2xl text-atmos-ink mb-1">À la une</h2>
      <div className="h-px w-full bg-atmos-slate/20 mb-2" />
      {data.map((noticia) => (
        <NoticiaCard key={noticia.id} {...noticia} />
      ))}
    </section>
  )
}
