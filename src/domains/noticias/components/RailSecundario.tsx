import type { Noticia } from '../../../lib/api/noticiasApi'
import { ItemNoticiaCompacto } from './ItemNoticiaCompacto'

interface Props {
  data: Noticia[] | undefined
  /** Tope fijo de artículos — no se mide contra nada (ver historia en git de
      este componente: dos intentos con `useLayoutEffect`/refs cruzados entre
      hermanos terminaron en bugs reales de timing). Con altura por ítem ya
      acotada (`line-clamp-2` en `ItemNoticiaCompacto`), un número fijo alcanza
      para no desbordar ni dejar hueco grande — mismo criterio que el dial
      DENSITY del proyecto ("secundarios en grid 3-4 ítems máx"). */
  max?: number
}

/** Rail "Dans le monde": lista compacta de tamaño fijo, altura predecible por CSS (sin JS). */
export function RailSecundario({ data, max = 5 }: Props) {
  if (!data?.length) return null

  return (
    // [&>article:last-child]:border-b-0: el último ítem no arrastra su propio
    // borde inferior colgando solo — el espacio que sigue (hasta "Aussi dans
    // l'actualité") ya trae su propio `border-t`, dos líneas con hueco en medio
    // se leían como una línea suelta sin sentido.
    <div className="[&>article:last-child]:border-b-0">
      {data.slice(0, max).map((noticia) => (
        <ItemNoticiaCompacto key={noticia.id} noticia={noticia} />
      ))}
    </div>
  )
}
