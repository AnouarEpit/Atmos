import type { ClimaDiario } from '../../lib/api/tipos'
import { TarjetaDia } from './components/TarjetaDia'

interface Props {
  dias?: ClimaDiario[]
}

export function Forecast({ dias }: Props) {
  if (!dias?.length) return null

  return (
    <section id="previsions" className="bg-atmos-bone px-6 md:px-10 py-16">
      <h2 className="font-display text-2xl text-atmos-ink mb-1">Prévisions 7 jours</h2>
      <div className="h-px w-full bg-atmos-slate/20 mb-8" />
      <div className="flex gap-4 overflow-x-auto pb-2">
        {dias.slice(0, 7).map((dia, indice) => (
          <TarjetaDia
            key={dia.dt}
            indice={indice}
            fechaUnix={dia.dt}
            minima={dia.temp.min}
            maxima={dia.temp.max}
            idClima={dia.weather[0].id}
          />
        ))}
      </div>
    </section>
  )
}
