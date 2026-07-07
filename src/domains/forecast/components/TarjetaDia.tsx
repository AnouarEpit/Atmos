import { mapCondicion } from '../../../lib/clima/condicion'
import { IconoClima } from '../../../shared/ui/IconoClima'

interface Props {
  fechaLabel: string
  fechaUnix: number
  minima: number
  maxima: number
  idClima: number
  semanaMin: number
  semanaMax: number
}

export const DIAS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']

export function TarjetaDia({ fechaLabel, fechaUnix, minima, maxima, idClima, semanaMin, semanaMax }: Props) {
  const fecha = new Date(fechaUnix * 1000)
  const condicion = mapCondicion(idClima)
  const rango = semanaMax - semanaMin || 1
  const inicioPct = ((minima - semanaMin) / rango) * 100
  const anchoPct = ((maxima - minima) / rango) * 100

  return (
    <div className="group relative z-10 flex min-w-[7.5rem] shrink-0 flex-col items-center gap-3 rounded-2xl bg-white px-5 py-6 shadow-[0_8px_24px_rgba(20,24,28,0.06),0_2px_6px_rgba(20,24,28,0.04)] transition-[translate,box-shadow] duration-[650ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(20,24,28,0.1),0_4px_10px_rgba(20,24,28,0.06)]">
      <span className="font-mono text-xs text-atmos-slate transition-colors duration-[420ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:text-atmos-gold">
        {fechaLabel}
      </span>
      <span className="font-sans text-sm text-atmos-ink">{DIAS[fecha.getDay()]}</span>
      <IconoClima
        condicion={condicion}
        className="h-9 w-9 text-atmos-slate transition-[scale,color] duration-[550ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover:text-atmos-gold"
      />
      <span className="font-display text-2xl font-medium text-atmos-ink">{Math.round(maxima)}°</span>
      <div className="w-full">
        <div className="relative h-1 w-full rounded-full bg-atmos-slate/15">
          <div
            className="absolute h-1 rounded-full bg-atmos-gold transition-colors duration-[550ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:bg-atmos-ink"
            style={{ left: `${inicioPct}%`, width: `${anchoPct}%` }}
          />
        </div>
        <span className="mt-1 block text-center font-mono text-[0.6875rem] text-atmos-slate">{Math.round(minima)}°</span>
      </div>
    </div>
  )
}
