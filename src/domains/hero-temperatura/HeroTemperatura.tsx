import { useRef } from 'react'
import type { Ciudad } from '../../lib/data/ciudades'
import type { RespuestaClima } from '../../lib/api/tipos'
import { FondoDinamico } from './components/FondoDinamico'
import { TemperaturaDisplay } from './components/TemperaturaDisplay'
import { IndiceLateral, IndiceMobileInline } from './components/IndiceLateral'
import { IndicadorScroll } from './components/IndicadorScroll'
import { useOverlayPorHora } from './hooks/useOverlayPorHora'
import { useEncogimientoScroll } from './hooks/useEncogimientoScroll'

interface Props {
  ciudad: Ciudad
  clima?: RespuestaClima
  cargando: boolean
  error: boolean
  onReintentar: () => void
  /** Gatea el fade-in escalonado del texto/UI del hero — false mientras el Preloader todavía tapa la pantalla. */
  revelado: boolean
}

const EASE_REVELADO = 'cubic-bezier(0.16, 1, 0.3, 1)'

function estiloRevelado(revelado: boolean, delayMs: number, duracionMs = 900) {
  return {
    opacity: revelado ? 1 : 0,
    transform: revelado ? 'translateY(0)' : 'translateY(14px)',
    transition: `opacity ${duracionMs}ms ${EASE_REVELADO}, transform ${duracionMs}ms ${EASE_REVELADO}`,
    transitionDelay: `${delayMs}ms`,
  }
}

export function HeroTemperatura({ ciudad, clima, cargando, error, onReintentar, revelado }: Props) {
  const idClima = clima?.current.weather[0]?.id ?? 800
  const overlay = useOverlayPorHora(idClima, clima?.timezone_offset ?? 0)
  const seccionRef = useRef<HTMLElement>(null)
  useEncogimientoScroll(seccionRef)

  return (
    <section ref={seccionRef} id="accueil" className="relative h-screen w-full overflow-hidden rounded-b-[3.5rem]">
      <FondoDinamico foto={ciudad.foto} gradiente={overlay.gradiente} tinte={overlay.tinte} posicionFoto={ciudad.posicionFoto} />

      {clima && !error && <IndiceLateral actual={clima.current} revelado={revelado} />}
      <IndicadorScroll revelado={revelado} />

      <div className="pointer-events-none relative z-10 flex h-full items-center justify-end px-6 md:px-10 lg:pr-[5.5rem]">
        <div className="pointer-events-auto text-right" style={estiloRevelado(revelado, 0)}>
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
          {clima && !error && (
            <div className="mt-6">
              <IndiceMobileInline actual={clima.current} />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
