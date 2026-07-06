import type { ReactNode } from 'react'

interface Props {
  etiqueta: string
  valor: string
  detalle?: string
  icono?: ReactNode
}

export function GridDato({ etiqueta, valor, detalle, icono }: Props) {
  return (
    <div className="border-t border-atmos-slate/20 pt-4">
      <div className="flex items-center gap-2">
        {icono}
        <p className="font-mono text-sm uppercase tracking-wider text-atmos-slate">{etiqueta}</p>
      </div>
      <p className="font-mono text-4xl font-bold text-atmos-ink mt-2">{valor}</p>
      {detalle && <p className="font-sans text-base text-atmos-slate mt-1">{detalle}</p>}
    </div>
  )
}
