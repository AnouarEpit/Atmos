import type { ClimaActual } from '../../lib/api/tipos'
import { nivelUV } from '../../lib/clima/formato'
import { GridDato } from './components/GridDato'
import { IconoAnimado } from './components/IconoAnimado'

interface Props {
  actual?: ClimaActual
}

const DIRECCIONES = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO']

function direccionViento(grados: number): string {
  return DIRECCIONES[Math.round(grados / 45) % 8]
}

export function DatosDetalle({ actual }: Props) {
  if (!actual) return null

  return (
    <section className="bg-atmos-bone px-6 md:px-10 py-16">
      <h2 className="font-display text-[2rem] font-light text-atmos-ink text-center">Conditions actuelles</h2>
      <p className="font-sans text-sm text-atmos-slate text-center mt-2 mb-10">
        Détails en temps réel pour aujourd'hui
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
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
      <p className="mt-10 font-mono text-[0.6875rem] text-atmos-slate/70">
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
