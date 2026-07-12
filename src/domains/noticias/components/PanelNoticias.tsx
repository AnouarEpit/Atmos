import { useQuery } from '@tanstack/react-query'
import { obtenerNoticias, type AlcanceNoticias } from '../../../lib/api/noticiasApi'
import { ArticuloDestacado } from './ArticuloDestacado'
import { ItemNoticiaCompacto } from './ItemNoticiaCompacto'

interface Props {
  alcance: AlcanceNoticias
  /**
   * 'destacada' (default): primer artículo grande (`ArticuloDestacado`) + resto
   * compacto — para el feed principal. 'compacta': todos los artículos en lista
   * compacta, sin destacar ninguno — para el sidebar "Dans le monde", que es un
   * digest de referencia rápida, no la protagonista de la columna.
   */
  variante?: 'destacada' | 'compacta'
}

/**
 * Panel de noticias genérico: mismo estilo que "À la une" (sin tarjeta blanca,
 * son noticias igual) — usado tanto en las pestañas mobile (`NoticiasMobile`)
 * como en el nav de categorías desktop (`Noticias.tsx`).
 */
export function PanelNoticias({ alcance, variante = 'destacada' }: Props) {
  const { data } = useQuery({
    queryKey: ['noticias', alcance],
    queryFn: () => obtenerNoticias(alcance),
    staleTime: 15 * 60 * 1000,
  })

  if (!data?.length) return null

  if (variante === 'compacta') {
    return (
      <div>
        {data.map((noticia) => (
          <ItemNoticiaCompacto key={noticia.id} noticia={noticia} />
        ))}
      </div>
    )
  }

  const [destacada, ...resto] = data

  return (
    <div>
      <ArticuloDestacado noticia={destacada} />
      {resto.map((noticia) => (
        <ItemNoticiaCompacto key={noticia.id} noticia={noticia} />
      ))}
    </div>
  )
}
