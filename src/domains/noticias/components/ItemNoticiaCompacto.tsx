import type { Noticia } from '../../../lib/api/noticiasApi'

interface Props {
  noticia: Noticia
  indice: number
}

export function ItemNoticiaCompacto({ noticia, indice }: Props) {
  return (
    <article className="py-5 border-b border-atmos-slate/20 flex gap-4">
      {/* atmos-gold sobre atmos-bone da 2.37:1 (falla WCAG AA) — atmos-slate da ~6.5:1, y de hecho es lo que usa TarjetaDia para su índice */}
      <span className="font-mono text-xs text-atmos-slate pt-1 shrink-0">{String(indice + 1).padStart(2, '0')}</span>
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="font-mono text-[0.6875rem] uppercase tracking-wider text-atmos-slate">
            {noticia.categoria}
          </span>
          <span className="text-atmos-slate/40" aria-hidden>
            ·
          </span>
          <time dateTime={noticia.publicadoEn} className="font-mono text-[0.6875rem] text-atmos-slate">
            il y a {noticia.publicadoHaceHoras}h
          </time>
        </div>
        <h4 className="font-display text-lg font-normal text-atmos-ink leading-snug">{noticia.titular}</h4>
      </div>
    </article>
  )
}
