import type { Noticia } from '../../../lib/api/noticiasApi'

interface Props {
  noticia: Noticia
}

export function ItemNoticiaCompacto({ noticia }: Props) {
  return (
    <article className="py-5 border-b border-atmos-slate/20">
      <a href={noticia.enlace} target="_blank" rel="noreferrer" className="group flex items-center gap-4">
        {noticia.imagen && (
          // Tamaño FIJO (cuadrado, mismo que el diseño original) + `items-center` en
          // el <a>: la foto mantiene su recorte natural (fotos de noticias son casi
          // siempre 16:9, estirarlas a una tira angosta las recorta mal, se probó y se
          // veía roto) y el desbalance de alturas con títulos largos se resuelve
          // centrando, no deformando la imagen. Probado agrandarla a w-24 (landscape) —
          // rompía el ajuste de una línea de "À la une · il y a 12h" en mobile (la
          // categoría más larga del set), revertido a w-20.
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-atmos-slate/10">
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
        <div className="min-w-0 flex-1">
          {/* flex-wrap: con categorías largas ("Environnement") + poco ancho (mobile,
              foto al lado) la fila no entraba en una línea — antes rompía a media
              palabra ("il y a" / "12h" separados). whitespace-nowrap en cada mitad
              (categoría, "· il y a Nh" como una sola unidad) + flex-wrap en la fila:
              si no entra, categoría pasa a su propia línea y "· il y a Nh" baja
              entero a la siguiente, nunca partido a media palabra. */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mb-1.5">
            {/* atmos-gold sobre atmos-bone da 2.37:1 (falla WCAG AA) — atmos-slate da ~6.5:1, y de hecho es lo que usa TarjetaDia para su índice */}
            <span className="font-mono text-[0.6875rem] uppercase tracking-wider text-atmos-slate whitespace-nowrap">
              {noticia.categoria}
            </span>
            <span className="font-mono text-[0.6875rem] text-atmos-slate whitespace-nowrap">
              <span className="text-atmos-slate/40" aria-hidden>
                ·{' '}
              </span>
              <time dateTime={noticia.publicadoEn}>il y a {noticia.publicadoHaceHoras}h</time>
            </span>
          </div>
          <h4 className="font-display text-lg font-normal text-atmos-ink leading-snug">{noticia.titular}</h4>
        </div>
      </a>
    </article>
  )
}
