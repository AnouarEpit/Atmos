import type { ClimaActual } from '../../lib/api/tipos'
import { nivelUV, direccionViento } from '../../lib/clima/formato'
import { GridDato } from './components/GridDato'
import { IconoAnimado } from './components/IconoAnimado'
import { RecuadroAtmosferico } from './components/RecuadroAtmosferico'
import { FilaZen } from './components/FilaZen'
import { SubrayadoAnimado } from './components/SubrayadoAnimado'

interface Props {
  actual?: ClimaActual
}

export function DatosDetalle({ actual }: Props) {
  if (!actual) return null

  return (
    <section className="bg-atmos-bone px-6 md:px-10 py-16">
      <h2 className="font-display text-[2rem] font-light text-atmos-ink text-center">
        Conditions <SubrayadoAnimado />
      </h2>
      <p className="font-sans text-sm text-atmos-slate text-center mt-3 mb-10">
        Détails en temps réel pour aujourd'hui
      </p>

      {/* Desktop: grid 2x4 con iconos animados, sin cambios */}
      <div className="hidden md:grid md:grid-cols-4 gap-8">
        <GridDato
          etiqueta="UV"
          valor={String(Math.round(actual.uvi))}
          detalle={nivelUV(actual.uvi)}
          icono={<IconoAnimado tipo="uv" className="h-6 w-6 text-atmos-gold" />}
        />
        <GridDato
          etiqueta="Vent"
          valor={`${Math.round(actual.wind_speed * 3.6)} km/h`}
          detalle={direccionViento(actual.wind_deg)}
          icono={<IconoAnimado tipo="vent" className="h-6 w-6 text-atmos-slate" />}
        />
        <GridDato
          etiqueta="Humidité"
          valor={`${actual.humidity}%`}
          icono={<IconoAnimado tipo="humidite" className="h-6 w-6 text-atmos-slate" />}
        />
        <GridDato
          etiqueta="Pression"
          valor={`${actual.pressure} hPa`}
          icono={<IconoAnimado tipo="pression" className="h-6 w-6 text-atmos-slate" />}
        />
      </div>

      {/* Mobile: variante "Zen" — recuadro atmosférico + lista de datos */}
      <div className="flex gap-[1.4rem] md:hidden max-w-sm mx-auto">
        <RecuadroAtmosferico />
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-[1.2rem] py-1">
          <FilaZen
            etiqueta="UV"
            valor={String(Math.round(actual.uvi))}
            detalle={nivelUV(actual.uvi)}
            icono={<IconoAnimado tipo="uv" className="h-5 w-5 text-atmos-gold" />}
          />
          <FilaZen
            etiqueta="Vent"
            valor={`${Math.round(actual.wind_speed * 3.6)} km/h`}
            detalle={direccionViento(actual.wind_deg)}
            icono={<IconoAnimado tipo="vent" className="h-5 w-5 text-atmos-slate" />}
          />
          <FilaZen
            etiqueta="Humidité"
            valor={`${actual.humidity}%`}
            icono={<IconoAnimado tipo="humidite" className="h-5 w-5 text-atmos-slate" />}
          />
          <FilaZen
            etiqueta="Pression"
            valor={`${actual.pressure} hPa`}
            icono={<IconoAnimado tipo="pression" className="h-5 w-5 text-atmos-slate" />}
          />
        </div>
      </div>

      <p className="mt-10 font-mono text-[0.6875rem] text-atmos-slate/70 text-center md:text-left">
        Données météo :{' '}
        <a
          href="https://open-meteo.com"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-2 hover:text-atmos-slate"
        >
          Open-Meteo.com
        </a>
      </p>
    </section>
  )
}
