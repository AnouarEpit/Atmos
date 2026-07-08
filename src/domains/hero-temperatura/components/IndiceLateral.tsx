import type { ClimaActual } from '../../../lib/api/tipos'
import { nivelUV } from '../../../lib/clima/formato'

interface Props {
  actual: ClimaActual
  /** Fade-in escalonado tras el Preloader. Va en la propia raíz `absolute` (no en un wrapper: `transform` en un wrapper crearía un containing block nuevo y rompería el posicionamiento). */
  revelado?: boolean
}

const EASE_REVELADO = 'cubic-bezier(0.16, 1, 0.3, 1)'

function estiloRevelado(revelado?: boolean) {
  if (revelado === undefined) return undefined
  return {
    opacity: revelado ? 1 : 0,
    transform: revelado ? 'translateY(0)' : 'translateY(14px)',
    transition: `opacity 900ms ${EASE_REVELADO}, transform 900ms ${EASE_REVELADO}`,
    transitionDelay: '250ms',
  }
}

function calcularItems(actual: ClimaActual) {
  return [
    { etiqueta: 'Ressenti', valor: `${Math.round(actual.feels_like)}°` },
    { etiqueta: 'Vent', valor: `${Math.round(actual.wind_speed * 3.6)} km/h` },
    { etiqueta: 'Humidité', valor: `${actual.humidity}%` },
    { etiqueta: 'UV', valor: nivelUV(actual.uvi) },
  ]
}

/** Desktop: columna vertical fija a la izquierda del hero. */
export function IndiceLateral({ actual, revelado }: Props) {
  const items = calcularItems(actual)

  return (
    <div
      className="absolute left-6 top-0 bottom-0 z-10 hidden flex-col justify-center gap-8 md:left-20 md:flex"
      style={estiloRevelado(revelado)}
    >
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

/**
 * Mobile: fila horizontal compacta, en el flujo normal del contenido (no
 * absoluta), debajo de la temperatura — max-w-sm/ml-auto alineado con el
 * resto del bloque de temperatura a la derecha.
 */
export function IndiceMobileInline({ actual }: Props) {
  const items = calcularItems(actual)

  return (
    <div className="ml-auto flex max-w-sm justify-between md:hidden">
      {items.map((item) => (
        <div key={item.etiqueta} className="text-center">
          <p className="font-mono text-[0.5625rem] uppercase tracking-wide text-atmos-gold opacity-90 [text-shadow:0_1px_8px_rgba(0,0,0,0.6)]">
            {item.etiqueta}
          </p>
          <p className="mt-1 font-mono text-base text-atmos-bone [text-shadow:0_1px_8px_rgba(0,0,0,0.6)]">
            {item.valor}
          </p>
        </div>
      ))}
    </div>
  )
}
