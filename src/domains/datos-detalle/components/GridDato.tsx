interface Props {
  etiqueta: string
  valor: string
  detalle?: string
}

export function GridDato({ etiqueta, valor, detalle }: Props) {
  return (
    <div className="border-t border-atmos-slate/20 pt-4">
      <p className="font-mono text-xs uppercase tracking-wider text-atmos-slate">{etiqueta}</p>
      <p className="font-mono text-3xl text-atmos-ink mt-2">{valor}</p>
      {detalle && <p className="font-sans text-sm text-atmos-slate mt-1">{detalle}</p>}
    </div>
  )
}
