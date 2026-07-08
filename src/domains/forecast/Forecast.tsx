import { useRef, useState } from 'react'
import type { ClimaDiario } from '../../lib/api/tipos'
import { etiquetaFecha } from '../../lib/clima/formato'
import { mapCondicion } from '../../lib/clima/condicion'
import { IconoClima } from '../../shared/ui/IconoClima'
import { useRevelarEnScroll } from '../../shared/hooks/useRevelarEnScroll'
import { TarjetaDia, DIAS } from './components/TarjetaDia'
import { SparklineSemana } from './components/SparklineSemana'

interface Props {
  dias?: ClimaDiario[]
}

export function Forecast({ dias }: Props) {
  const contenedorRef = useRef<HTMLDivElement>(null)
  const revelarTitulo = useRevelarEnScroll<HTMLHeadingElement>({ y: 24, start: 'top 92%', end: 'top 68%' })
  const revelarGrid = useRevelarEnScroll<HTMLDivElement>({ start: 'top 85%', end: 'top 50%' })
  const revelarMobile = useRevelarEnScroll<HTMLDivElement>({ start: 'top 85%', end: 'top 50%' })
  const [indice, setIndice] = useState(0)

  if (!dias?.length) return null

  const semana = dias.slice(0, 7)
  const semanaMin = Math.min(...semana.map((d) => d.temp.min))
  const semanaMax = Math.max(...semana.map((d) => d.temp.max))
  const maximas = semana.map((d) => d.temp.max)
  // Rango propio de las máximas (no semanaMin/semanaMax, que mezcla mínimas y sesgaría la curva hacia arriba).
  const maximasMin = Math.min(...maximas)
  const maximasMax = Math.max(...maximas)

  const etiquetas = semana.map((dia) => etiquetaFecha(new Date(dia.dt * 1000)))
  const diaSeleccionado = semana[indice]

  return (
    <section id="previsions" className="bg-atmos-bone px-6 md:px-10 py-16">
      <h2
        ref={revelarTitulo}
        className="font-display text-3xl font-light text-atmos-ink text-center mb-10 md:text-[2.625rem]"
      >
        Prévisions 7 jours
      </h2>

      {/* Desktop: grid completo con la curva de temperaturas máximas de fondo */}
      <div
        ref={(nodo) => {
          contenedorRef.current = nodo
          revelarGrid(nodo)
        }}
        className="relative hidden md:flex md:flex-wrap md:justify-center md:gap-7"
      >
        <SparklineSemana contenedorRef={contenedorRef} valores={maximas} minimo={maximasMin} maximo={maximasMax} />
        {semana.map((dia, i) => (
          <TarjetaDia
            key={dia.dt}
            fechaLabel={etiquetas[i]}
            fechaUnix={dia.dt}
            minima={dia.temp.min}
            maxima={dia.temp.max}
            idClima={dia.weather[0].id}
            semanaMin={semanaMin}
            semanaMax={semanaMax}
          />
        ))}
      </div>

      {/* Mobile: una sola tarjeta con pestañas de día + panel de detalle del día activo */}
      <div ref={revelarMobile} className="md:hidden">
        <div className="rounded-3xl bg-white p-6 shadow-[0_10px_32px_rgba(20,24,28,0.08),0_3px_8px_rgba(20,24,28,0.05)]">
          <div data-lenis-prevent className="scrollbar-fina flex gap-0.5 overflow-x-auto">
            {semana.map((dia, i) => (
              <button
                key={dia.dt}
                type="button"
                onClick={() => setIndice(i)}
                aria-pressed={i === indice}
                className={`shrink-0 rounded-full px-3 py-1.5 font-sans text-sm transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atmos-gold ${
                  i === indice ? 'bg-atmos-ink text-atmos-bone' : 'text-atmos-slate hover:text-atmos-ink'
                }`}
              >
                {DIAS[new Date(dia.dt * 1000).getDay()]}
              </button>
            ))}
          </div>

          <div className="mt-4 h-px bg-atmos-slate/15" />

          <div key={indice} className="mt-5 flex items-center justify-between animate-[atmos-aparecer_300ms_ease-out]">
            <div>
              <p className="font-mono text-xs uppercase tracking-wide text-atmos-gold">{etiquetas[indice]}</p>
              <p className="font-display text-5xl font-medium text-atmos-ink">{Math.round(diaSeleccionado.temp.max)}°</p>
              <p className="font-mono text-sm text-atmos-slate">Min {Math.round(diaSeleccionado.temp.min)}°</p>
            </div>
            <div className="text-right">
              <IconoClima
                condicion={mapCondicion(diaSeleccionado.weather[0].id)}
                className="ml-auto h-12 w-12 text-atmos-slate"
              />
              <p className="mt-2 font-sans text-xs text-atmos-slate capitalize">{diaSeleccionado.weather[0].description}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
