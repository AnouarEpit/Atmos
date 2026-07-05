import type { Ciudad } from '../../lib/data/ciudades'
import type { RespuestaClima } from '../../lib/api/tipos'
import { FondoDinamico } from './components/FondoDinamico'
import { TemperaturaDisplay } from './components/TemperaturaDisplay'
import { BuscadorCiudad } from './components/BuscadorCiudad'
import { useOverlayPorHora } from './hooks/useOverlayPorHora'

interface Props {
  ciudad: Ciudad
  clima?: RespuestaClima
  cargando: boolean
  error: boolean
  onReintentar: () => void
  onSeleccionarCiudad: (ciudad: Ciudad) => void
}

export function HeroTemperatura({ ciudad, clima, cargando, error, onReintentar, onSeleccionarCiudad }: Props) {
  const idClima = clima?.current.weather[0]?.id ?? 800
  const overlay = useOverlayPorHora(idClima, clima?.timezone_offset ?? 0)

  return (
    <section id="accueil" className="relative h-screen w-full overflow-hidden">
      <FondoDinamico foto={ciudad.foto} gradiente={overlay.gradiente} tinte={overlay.tinte} />

      <div className="relative z-10 flex h-full flex-col justify-end px-6 md:px-10 pb-20">
        {error ? (
          <div className="text-atmos-bone">
            <p className="font-display text-2xl">Impossible de charger la météo de {ciudad.nombre}.</p>
            <button
              type="button"
              onClick={onReintentar}
              className="mt-3 font-sans text-sm text-atmos-fog underline underline-offset-4 hover:text-atmos-bone"
            >
              Réessayer
            </button>
          </div>
        ) : cargando || !clima ? (
          <p className="font-display text-2xl text-atmos-bone">Chargement du ciel de {ciudad.nombre}…</p>
        ) : (
          <TemperaturaDisplay
            temperatura={clima.current.temp}
            sensacion={clima.current.feels_like}
            ciudad={ciudad.nombre}
            pais={ciudad.pais}
            descripcion={clima.current.weather[0]?.description ?? ''}
          />
        )}
        <BuscadorCiudad onSeleccionar={onSeleccionarCiudad} />
      </div>
    </section>
  )
}
