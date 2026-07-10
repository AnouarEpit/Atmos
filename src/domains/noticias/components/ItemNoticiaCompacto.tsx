import type { Noticia } from '../../../lib/api/noticiasApi'

interface Props {
  noticia: Noticia
}

export function ItemNoticiaCompacto({ noticia }: Props) {
  return (
    <article className="py-5 border-b border-atmos-slate/20">
      <a href={noticia.enlace} target="_blank" rel="noreferrer" className="group flex items-start gap-4">
        {noticia.imagen && (
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
          <div className="flex items-center gap-2 mb-1.5">
            {/* atmos-gold sobre atmos-bone da 2.37:1 (falla WCAG AA) — atmos-slate da ~6.5:1, y de hecho es lo que usa TarjetaDia para su índice */}
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
      </a>
    </article>
  )
}
