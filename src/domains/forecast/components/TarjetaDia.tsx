import { mapCondicion } from '../../../lib/clima/condicion'
import { IconoClima } from '../../../shared/ui/IconoClima'

interface Props {
  indice: number
  fechaUnix: number
  minima: number
  maxima: number
  idClima: number
}

const DIAS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']

export function TarjetaDia({ indice, fechaUnix, minima, maxima, idClima }: Props) {
  const fecha = new Date(fechaUnix * 1000)
  const condicion = mapCondicion(idClima)

  return (
    <div className="flex min-w-[6.875rem] flex-col items-center gap-2 rounded-2xl bg-white px-5 py-6 shadow-[0_8px_24px_rgba(20,24,28,0.06),0_2px_6px_rgba(20,24,28,0.04)]">
      <span className="font-mono text-xs text-atmos-slate">{String(indice + 1).padStart(2, '0')}</span>
      <span className="font-sans text-sm text-atmos-ink">{DIAS[fecha.getDay()]}</span>
      <IconoClima condicion={condicion} className="h-6 w-6 text-atmos-slate" />
      <span className="font-display text-lg text-atmos-ink">{Math.round(maxima)}°</span>
      <span className="font-mono text-xs text-atmos-slate">{Math.round(minima)}°</span>
    </div>
  )
}
