import { useEffect, useRef, useState } from 'react'

const ENLACES = [
  { href: '#accueil', label: 'Accueil' },
  { href: '#previsions', label: 'Prévisions' },
  { href: '#actus', label: 'Actus' },
]

const LETRAS_ATMOS = 'Atmos'.split('')
const STAGGER_LETRA = 45
const EASE = 'cubic-bezier(0.22,1,0.36,1)'
// Resto del contenido arranca justo cuando la última letra ya empezó a asentarse,
// no cuando termina del todo — se siente como una sola entrada continua, no dos.
const DELAY_RESTO = LETRAS_ATMOS.length * STAGGER_LETRA + 120

/**
 * Sección de cierre. La curva de transición NO vive acá — vive en el
 * `rounded-b-[3.5rem]` de `Noticias` (mismo mecanismo que Hero→Forecast):
 * `Footer` es `atmos-bone`, igual que `body` (ver `tokens.css`), así que
 * redondear las esquinas de ESTA sección no revelaría ningún color distinto
 * detrás — invisible por definición. Noticias es `atmos-sable`; al redondear
 * su propia esquina inferior sí revela un color real (`bone`, que además
 * coincide con este footer, dando la costura continua).
 *
 * Reveal ligado a scroll (IntersectionObserver + transición CSS, no GSAP):
 * mismo motivo ya documentado en SubrayadoAnimado — un tween GSAP de
 * duración fija puede saltar de golpe por `gsap.ticker.lagSmoothing(0)`
 * (activo globalmente para el scrub del hero); IntersectionObserver +
 * transición CSS la deja en manos del compositor, inmune a eso. Reversible:
 * al salir de vista vuelve a ocultarse, se repite si se re-entra.
 */
export function Footer() {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const nodo = ref.current
    if (!nodo) return
    const observer = new IntersectionObserver(([entrada]) => setVisible(entrada.isIntersecting), {
      rootMargin: '0px 0px -10% 0px',
    })
    observer.observe(nodo)
    return () => observer.disconnect()
  }, [])

  return (
    <footer ref={ref} className="relative bg-atmos-bone px-6 py-16 md:px-10 md:py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 md:flex-row md:items-start md:justify-between">
        <div>
          <span className="font-display text-2xl italic tracking-wide text-atmos-ink">
            {LETRAS_ATMOS.map((letra, indice) => (
              <span
                key={indice}
                className="inline-block"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(14px)',
                  transition: `opacity 0.5s ${EASE}, transform 0.5s ${EASE}`,
                  transitionDelay: `${indice * STAGGER_LETRA}ms`,
                }}
              >
                {letra}
              </span>
            ))}
          </span>
          <p
            className="mt-3 max-w-xs font-sans text-sm text-atmos-slate"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(10px)',
              transition: `opacity 0.6s ${EASE}, transform 0.6s ${EASE}`,
              transitionDelay: `${DELAY_RESTO}ms`,
            }}
          >
            Le temps qu'il fait, les nouvelles qui comptent — un seul regard sur le monde.
          </p>
        </div>

        <nav
          className="flex gap-8 font-sans text-sm text-atmos-ink"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(10px)',
            transition: `opacity 0.6s ${EASE}, transform 0.6s ${EASE}`,
            transitionDelay: `${DELAY_RESTO}ms`,
          }}
        >
          {ENLACES.map((enlace) => (
            <a
              key={enlace.href}
              href={enlace.href}
              className="border-b border-transparent pb-1 transition-colors duration-200 ease-out hover:border-atmos-ink focus-visible:border-atmos-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atmos-gold rounded-sm"
            >
              {enlace.label}
            </a>
          ))}
        </nav>
      </div>

      <div
        className="mx-auto mt-14 max-w-6xl border-t border-atmos-slate/20 pt-6 font-mono text-xs uppercase tracking-wider text-atmos-slate/70"
        style={{
          opacity: visible ? 1 : 0,
          transition: `opacity 0.6s ${EASE}`,
          transitionDelay: `${DELAY_RESTO + 80}ms`,
        }}
      >
        © {new Date().getFullYear()} Atmos
      </div>
    </footer>
  )
}
