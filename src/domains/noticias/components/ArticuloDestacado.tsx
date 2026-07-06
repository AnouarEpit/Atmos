import type { Noticia } from '../../../lib/api/noticiasApi'

interface Props {
  noticia: Noticia
}

export function ArticuloDestacado({ noticia }: Props) {
  return (
    <article className="pb-8 border-b border-atmos-slate/20">
      <div className="flex items-center gap-3 mb-3">
        {/* fondo atmos-gold + texto atmos-ink (no atmos-bone): bone sobre gold da 2.37:1, falla WCAG AA — ink sobre gold da 6.56:1 */}
        <span className="font-mono text-[0.6875rem] uppercase tracking-wider bg-atmos-gold text-atmos-ink px-2.5 py-1 rounded-full">
          {noticia.categoria}
        </span>
        <time dateTime={noticia.publicadoEn} className="font-mono text-xs text-atmos-slate">
          il y a {noticia.publicadoHaceHoras}h
        </time>
      </div>
      <h3 className="font-display text-[1.625rem] font-normal text-atmos-ink leading-snug mb-3">
        {noticia.titular}
      </h3>
      <p className="font-sans text-base text-atmos-slate leading-relaxed mb-4 max-w-2xl">{noticia.extracto}</p>
      <p className="font-mono text-xs uppercase tracking-wider text-atmos-slate inline-flex items-center gap-1.5">
        {noticia.fuente}
        <span aria-hidden>→</span>
      </p>
    </article>
  )
}
