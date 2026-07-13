import type { AlcanceNoticias } from '../../../lib/api/noticiasApi'

export const CATEGORIAS: { alcance: AlcanceNoticias; label: string }[] = [
  { alcance: 'francia', label: 'À la une' },
  { alcance: 'mundo', label: 'Dans le monde' },
  { alcance: 'finanzas', label: 'Économie' },
  { alcance: 'sport', label: 'Sport' },
  { alcance: 'culture', label: 'Culture' },
]

/**
 * Letras individuales para la ola de hover (`group-hover` en el botón padre).
 * `aria-hidden` en el wrapper: la representación partida en spans es puramente
 * visual, el botón ya lleva `aria-label` con el texto completo — un lector de
 * pantalla no debe recorrer letra por letra.
 */
function Palabra({ texto }: { texto: string }) {
  return (
    <span aria-hidden="true" className="inline-flex">
      {texto.split('').map((letra, i) => (
        <span
          key={i}
          className="inline-block motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover:-translate-y-[3px]"
          style={{ transitionDelay: `${i * 28}ms` }}
        >
          {letra === ' ' ? ' ' : letra}
        </span>
      ))}
    </span>
  )
}

interface Props {
  activa: AlcanceNoticias
  onCambiar: (alcance: AlcanceNoticias) => void
}

/**
 * Nav de categorías de "À la une": texto plano separado por "/", sin fondo ni
 * highlight de color. Hover dispara una ola letra por letra (`Palabra`); la
 * categoría activa cambia a itálica (mismo `font-display` que los titulares,
 * marca "seleccionado" con tipografía, no con color) y mantiene el subrayado
 * fino visible siempre — en hover (inactiva) el subrayado se dibuja igual,
 * transitorio.
 */
export function NavCategorias({ activa, onCambiar }: Props) {
  return (
    <nav aria-label="Catégories" className="flex items-center gap-x-4 md:gap-x-6 mb-10 md:mb-12">
      {CATEGORIAS.map((cat, i) => {
        const esActiva = cat.alcance === activa
        return (
          <div key={cat.alcance} className="flex items-center gap-x-4 md:gap-x-6">
            {i > 0 && (
              <span aria-hidden="true" className="select-none text-atmos-fog">
                /
              </span>
            )}
            <button
              type="button"
              onClick={() => onCambiar(cat.alcance)}
              aria-label={cat.label}
              aria-pressed={esActiva}
              className="group relative pb-1 font-display text-base text-atmos-ink rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atmos-gold"
            >
              {/* Itálica no es animable por CSS (font-style es discreto, no interpola) — se
                  simula con dos capas apiladas (regular/itálica real, mismo Fraunces) que
                  hacen crossfade de opacidad, lento y suave en vez del salto instantáneo
                  que daba alternar la clase `italic` sola. */}
              <span className="relative inline-flex">
                <span
                  className={`inline-flex motion-safe:transition-opacity motion-safe:duration-[700ms] motion-safe:ease-[cubic-bezier(0.4,0,0.2,1)] ${
                    esActiva ? 'opacity-0' : 'opacity-100'
                  }`}
                >
                  <Palabra texto={cat.label} />
                </span>
                <span
                  className={`pointer-events-none absolute inset-0 inline-flex italic motion-safe:transition-opacity motion-safe:duration-[700ms] motion-safe:ease-[cubic-bezier(0.4,0,0.2,1)] ${
                    esActiva ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <Palabra texto={cat.label} />
                </span>
              </span>
              <span
                aria-hidden="true"
                className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-atmos-gold motion-safe:transition-transform motion-safe:duration-[650ms] motion-safe:ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  esActiva ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}
              />
            </button>
          </div>
        )
      })}
    </nav>
  )
}
