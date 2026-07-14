import type { Noticia } from '../../../lib/api/noticiasApi'

interface Props {
  noticias: Noticia[]
}

/**
 * Franja de ancho completo debajo de las dos columnas: en vez de recortar el
 * feed principal contra la altura del rail con "Voir plus" (dos intentos
 * anteriores, ver git log — uno dejaba hueco enorme bajo el rail, el otro
 * arrastraba bugs reales de timing entre `useLayoutEffect` de componentes
 * hermanos), la columna principal ahora muestra un tope fijo de artículos
 * (`PanelNoticias.maxSecundarios`) y el resto se reorganiza acá, en una
 * cuadrícula ancha de 3 columnas — más espacio para leer cada uno, en vez de
 * apretarlos en una columna angosta. Mismo lenguaje sin tarjeta blanca que el
 * resto de "À la une" (foto + categoría + título, son noticias, no widgets).
 */
export function AussiActualite({ noticias }: Props) {
  if (!noticias.length) return null

  return (
    <div className="mt-8 border-t border-atmos-slate/20 pt-8">
      <p className="font-mono text-xs uppercase tracking-wider text-atmos-slate mb-6">Aussi dans l'actualité</p>
      <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {noticias.map((noticia) => (
          <article key={noticia.id}>
            <a href={noticia.enlace} target="_blank" rel="noreferrer" className="group block">
              {noticia.imagen && (
                <div className="mb-4 overflow-hidden rounded-2xl aspect-[4/3] bg-atmos-slate/10">
                  <img
                    src={noticia.imagen}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition-[scale] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.parentElement!.style.display = 'none'
                    }}
                  />
                </div>
              )}
              <span className="font-mono text-[0.6875rem] uppercase tracking-wider text-atmos-slate">
                {noticia.categoria}
              </span>
              <h4 className="font-display text-lg font-normal text-atmos-ink leading-snug mt-1.5 line-clamp-2">
                {noticia.titular}
              </h4>
            </a>
          </article>
        ))}
      </div>
    </div>
  )
}
