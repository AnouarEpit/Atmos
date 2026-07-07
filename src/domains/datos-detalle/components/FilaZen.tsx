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
      <div className="flex items-center gap-[0.4rem] whitespace-nowrap">
        {icono}
        <span className="font-display text-[1rem] font-semibold text-atmos-ink">{valor}</span>
      </div>
      {/* ml-[1.65rem] = ancho icono (1.25rem) + gap (0.4rem): label queda alineado con el valor, no con el icono. */}
      <p className="mt-1 ml-[1.65rem] font-mono text-[0.625rem] uppercase tracking-wider text-atmos-slate">
        {etiqueta}
        {detalle && <> · {detalle}</>}
      </p>
    </div>
  )
}
