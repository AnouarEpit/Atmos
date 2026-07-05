import type { ClimaActual } from '../../lib/api/tipos'
import { GridDato } from './components/GridDato'

interface Props {
  actual?: ClimaActual
}

const DIRECCIONES = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO']

function direccionViento(grados: number): string {
  return DIRECCIONES[Math.round(grados / 45) % 8]
}

function nivelUV(uvi: number): string {
  if (uvi < 3) return 'Faible'
  if (uvi < 6) return 'Modéré'
  if (uvi < 8) return 'Élevé'
  return 'Très élevé'
}

export function DatosDetalle({ actual }: Props) {
  if (!actual) return null

  return (
    <section className="bg-atmos-bone px-6 md:px-10 py-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <GridDato etiqueta="UV" valor={String(Math.round(actual.uvi))} detalle={nivelUV(actual.uvi)} />
        <GridDato
          etiqueta="Vent"
          valor={`${Math.round(actual.wind_speed * 3.6)} km/h`}
          detalle={direccionViento(actual.wind_deg)}
        />
        <GridDato etiqueta="Humidité" valor={`${actual.humidity}%`} />
        <GridDato etiqueta="Pression" valor={`${actual.pressure} hPa`} />
      </div>
      <p className="mt-10 font-mono text-[11px] text-atmos-slate/70">
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
