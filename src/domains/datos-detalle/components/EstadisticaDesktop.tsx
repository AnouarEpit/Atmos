import type { ReactNode } from 'react'

interface Props {
  etiqueta: string
  valor: string
  detalle?: string
  icono: ReactNode
}

/** Celda del grid 2×2 desktop — label pequeño con icono, valor grande Fraunces con detalle inline (no en línea aparte, a diferencia de FilaZen mobile). */
export function EstadisticaDesktop({ etiqueta, valor, detalle, icono }: Props) {
  return (
    <div>
      <div className="flex items-center gap-2 text-atmos-slate">
        {icono}
        <p className="font-mono text-sm uppercase tracking-wider">{etiqueta}</p>
      </div>
      <p className="mt-2 flex items-baseline font-display text-4xl font-semibold text-atmos-ink">
        {valor}
        {detalle && <span className="ml-2 font-mono text-base font-normal text-atmos-slate">{detalle}</span>}
      </p>
    </div>
  )
}
