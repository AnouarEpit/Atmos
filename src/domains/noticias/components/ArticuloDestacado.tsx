import type { Noticia } from '../../../lib/api/noticiasApi'

interface Props {
  noticia: Noticia
}

export function ArticuloDestacado({ noticia }: Props) {
  return (
    <article className="pb-8 border-b border-atmos-slate/20">
      <a href={noticia.enlace} target="_blank" rel="noreferrer" className="group block">
        {noticia.imagen && (
          <div className="mb-5 overflow-hidden rounded-2xl aspect-[16/9] bg-atmos-slate/10">
            <img
              src={noticia.imagen}
              alt=""
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="h-full w-full object-cover transition-[scale] duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.parentElement!.style.display = 'none'
              }}
            />
          </div>
        )}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-3">
          {/* fondo atmos-gold + texto atmos-ink (no atmos-bone): bone sobre gold da 2.37:1, falla WCAG AA — ink sobre gold da 6.56:1 */}
          <span className="font-mono text-[0.6875rem] uppercase tracking-wider bg-atmos-gold text-atmos-ink px-2.5 py-1 rounded-full whitespace-nowrap">
            {noticia.categoria}
          </span>
          <time dateTime={noticia.publicadoEn} className="font-mono text-xs text-atmos-slate whitespace-nowrap">
            il y a {noticia.publicadoHaceHoras}h
          </time>
        </div>
        <h3 className="font-display text-[1.625rem] font-normal text-atmos-ink leading-snug mb-3">
          {noticia.titular}
        </h3>
        {/* line-clamp-2: altura del destacado predecible por diseño (no depende de cuán
            largo venga el extracto ese día) — mismo criterio que el resto de recortes
            del sitio, ahora resuelto en CSS puro en vez de medir con JS en runtime. */}
        <p className="font-sans text-base text-atmos-slate leading-relaxed mb-4 max-w-2xl line-clamp-2">
          {noticia.extracto}
        </p>
        <p className="font-mono text-xs uppercase tracking-wider text-atmos-slate inline-flex items-center gap-1.5">
          {noticia.fuente}
          <span aria-hidden className="inline-block transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </p>
      </a>
    </article>
  )
}
