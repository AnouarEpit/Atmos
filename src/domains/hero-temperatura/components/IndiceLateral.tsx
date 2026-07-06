import type { ClimaActual } from '../../../lib/api/tipos'
import { nivelUV } from '../../../lib/clima/formato'

interface Props {
  actual: ClimaActual
}

export function IndiceLateral({ actual }: Props) {
  const items = [
    { etiqueta: 'Ressenti', valor: `${Math.round(actual.feels_like)}°` },
    { etiqueta: 'Vent', valor: `${Math.round(actual.wind_speed * 3.6)} km/h` },
    { etiqueta: 'Humidité', valor: `${actual.humidity}%` },
    { etiqueta: 'UV', valor: nivelUV(actual.uvi) },
  ]

  return (
    <div className="absolute left-6 top-0 bottom-0 z-10 hidden flex-col justify-center gap-8 md:left-20 md:flex">
      {items.map((item, indice) => (
        <div key={item.etiqueta} className="group">
          <p className="font-mono text-[0.625rem] tracking-wide text-atmos-gold opacity-80 transition-opacity duration-200 ease-out group-hover:opacity-100 [text-shadow:0_1px_8px_rgba(0,0,0,0.6)]">
            {String(indice + 1).padStart(2, '0')} · {item.etiqueta}
          </p>
          <p className="mt-1.5 origin-left font-mono text-2xl text-atmos-bone transition-transform duration-200 ease-out group-hover:scale-105 [text-shadow:0_1px_8px_rgba(0,0,0,0.6)]">
            {item.valor}
          </p>
        </div>
      ))}
    </div>
  )
}
