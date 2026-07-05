interface Props {
  titular: string
  fuente: string
  publicadoHaceHoras: number
}

export function NoticiaCard({ titular, fuente, publicadoHaceHoras }: Props) {
  return (
    <article className="border-t border-atmos-slate/20 py-5">
      <p className="font-display text-lg text-atmos-ink leading-snug">{titular}</p>
      <p className="font-mono text-xs uppercase tracking-wider text-atmos-slate mt-2">
        {fuente} · il y a {publicadoHaceHoras}h
      </p>
    </article>
  )
}
