import { useQuery } from '@tanstack/react-query'
import { obtenerNoticias, type AlcanceNoticias } from '../../../lib/api/noticiasApi'
import { ArticuloDestacado } from './ArticuloDestacado'
import { ItemNoticiaCompacto } from './ItemNoticiaCompacto'

interface Props {
  alcance: AlcanceNoticias
  /** Tope fijo de artículos secundarios bajo el destacado — sin esta prop
      (NoticiasMobile) se muestran todos, sin cambios. Con altura por ítem ya
      acotada (`line-clamp-2`), un número fijo alcanza para mantener la
      columna dentro de un rango predecible sin medir nada en runtime. */
  maxSecundarios?: number
}

/**
 * Panel de noticias genérico: primer artículo grande (`ArticuloDestacado`) +
 * resto compacto, mismo estilo que "À la une" (sin tarjeta blanca, son
 * noticias igual) — usado tanto en las pestañas mobile (`NoticiasMobile`)
 * como en el feed principal del nav de categorías desktop (`Noticias.tsx`).
 */
export function PanelNoticias({ alcance, maxSecundarios }: Props) {
  const { data } = useQuery({
    queryKey: ['noticias', alcance],
    queryFn: () => obtenerNoticias(alcance),
    staleTime: 15 * 60 * 1000,
  })

  if (!data?.length) return null

  const [destacada, ...resto] = data
  const mostrar = maxSecundarios != null ? resto.slice(0, maxSecundarios) : resto

  return (
    <div>
      <ArticuloDestacado noticia={destacada} />
      <div>
        {mostrar.map((noticia) => (
          <ItemNoticiaCompacto key={noticia.id} noticia={noticia} />
        ))}
      </div>
    </div>
  )
}
