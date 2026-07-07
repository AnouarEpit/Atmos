import type { ReactNode } from 'react'

interface Props {
  etiqueta: string
  valor: string
  detalle?: string
  icono: ReactNode
}

/** Fila del layout mobile "Zen" — valor+unidad nunca se rompen a otra línea (era el bug del diseño anterior). */
export function FilaZen({ etiqueta, valor, detalle, icono }: Props) {
  return (
    <div>
      <div className="flex items-center gap-1.5">
        {icono}
        <p className="font-mono text-[0.625rem] uppercase tracking-wider text-atmos-slate">{etiqueta}</p>
      </div>
      <p className="mt-1 whitespace-nowrap">
        <span className="font-display text-2xl font-medium text-atmos-ink">{valor}</span>
        {detalle && <span className="ml-1.5 font-sans text-sm text-atmos-slate">{detalle}</span>}
      </p>
    </div>
  )
}
