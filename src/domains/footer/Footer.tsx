import { useEffect, useRef, useState } from 'react'
import { TextoRevelado } from '../../shared/ui/TextoRevelado'

const ENLACES = [
  { href: '#accueil', label: 'Accueil' },
  { href: '#previsions', label: 'Prévisions' },
  { href: '#actus', label: 'Actus' },
]

const CONTACTOS = [
  { label: 'E-mail', valor: 'anouarkhalibouriz@gmail.com', href: 'mailto:anouarkhalibouriz@gmail.com' },
  {
    label: 'LinkedIn',
    valor: 'Anouar Khali Bouriz',
    href: 'https://www.linkedin.com/in/anouar-khali-bouriz-969531339/',
  },
  { label: 'GitHub', valor: 'AnouarEpit', href: 'https://github.com/AnouarEpit' },
]

const MARQUEE_TEXTO = 'OUVERT AUX OPPORTUNITÉS PROFESSIONNELLES'
const MARQUEE_ITEMS = Array.from({ length: 6 }, () => MARQUEE_TEXTO)

const LETRAS_ATMOS = 'Atmos'.split('')
const STAGGER_LETRA = 45
const EASE = 'cubic-bezier(0.22,1,0.36,1)'
// La barra wordmark+nav+copyright pasó de ser todo el footer a ser su cierre —
// arranca después del bloque de contacto (ver DELAY_BARRA), no compite con la CTA.
const DELAY_BARRA = 750
const DELAY_RESTO_BARRA = DELAY_BARRA + LETRAS_ATMOS.length * STAGGER_LETRA + 120

/**
 * Sección de cierre. La curva de transición NO vive acá — vive en el
 * `rounded-b-[3.5rem]` de `Noticias` (mismo mecanismo que Hero→Forecast):
 * `Footer` es `atmos-bone`, igual que `body` (ver `tokens.css`), así que
 * redondear las esquinas de ESTA sección no revelaría ningún color distinto
 * detrás — invisible por definición.
 *
 * Estructura (de arriba a abajo): titular CTA ("discutamos") + subtítulo →
 * franja marquee ambiental (loop CSS puro, mismo `atmos-ticker-flujo` que ya
 * usa `TickerBourse` — sin `Observer` reactivo a scroll ni ScrollTrigger
 * nuevo, dial MOTION 4/10 pide ambiental, no scroll-jacking, y "Conditions
 * actuelles" ya tuvo un bug real de freeze por exceso de ScrollTrigger
 * simultáneos) → bloque de contacto (Email/LinkedIn/GitHub, mismo patrón
 * label mono + hairline + link grande que ya usa `Noticias`) → barra final
 * wordmark+nav+copyright.
 *
 * `atmos-gold` NO se usa como color de texto ni de borde acá: calculado,
 * gold sobre `atmos-bone` da 2.37:1 — falla tanto el mínimo texto (4.5:1)
 * como el de UI no-textual (3:1). Hover de links usa `border-atmos-ink`
 * (mismo patrón ya usado en el nav de este archivo), gold queda reservado
 * solo al anillo de foco (`focus-visible:ring-atmos-gold`, ya usado en todo
 * el sitio para foco de teclado, no como color de reposo/hover).
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

  function estiloReveal(delayMs: number, distanciaPx = 14, duracionMs = 600) {
    return {
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : `translateY(${distanciaPx}px)`,
      transition: `opacity ${duracionMs}ms ${EASE}, transform ${duracionMs}ms ${EASE}`,
      transitionDelay: `${delayMs}ms`,
    } as const
  }

  return (
    <footer ref={ref} className="relative bg-atmos-bone px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-6xl">
        <h2
          style={estiloReveal(0, 20)}
          className="max-w-2xl font-display text-3xl font-light leading-tight text-atmos-ink md:text-5xl"
        >
          Discutons de votre prochain projet.
        </h2>
        <p style={estiloReveal(150)} className="mt-4 max-w-md font-sans text-sm text-atmos-slate md:text-base">
          Ce site fait partie des projets que je construis. Ouvert à toute opportunité professionnelle.
        </p>

        <div
          style={{ opacity: visible ? 1 : 0, transition: `opacity 800ms ${EASE}`, transitionDelay: '300ms' }}
          className="mt-14 overflow-hidden border-y border-atmos-slate/20 py-4 md:mt-16"
        >
          <div className="flex w-max motion-safe:animate-[atmos-ticker-flujo_32s_linear_infinite]">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((texto, indice) => (
              <span
                key={indice}
                className="flex shrink-0 items-center gap-6 whitespace-nowrap px-6 font-mono text-xs uppercase tracking-[0.2em] text-atmos-slate"
              >
                {texto}
                <span aria-hidden="true" className="h-1 w-1 rounded-full bg-atmos-slate/40" />
              </span>
            ))}
          </div>
        </div>

        <div className="mt-14 grid gap-10 sm:grid-cols-3 md:mt-16">
          {CONTACTOS.map((contacto, indice) => {
            const esExterno = !contacto.href.startsWith('mailto:')
            return (
              <div key={contacto.label} style={estiloReveal(400 + indice * 90, 16)} className="min-w-0">
                <h3 className="font-mono text-xs uppercase tracking-wider text-atmos-slate">{contacto.label}</h3>
                <div className="my-2 h-px bg-atmos-slate/20" />
                <a
                  href={contacto.href}
                  target={esExterno ? '_blank' : undefined}
                  rel={esExterno ? 'noopener noreferrer' : undefined}
                  className="block break-words rounded-sm border-b border-transparent pb-1 font-display text-xl text-atmos-ink transition-colors duration-200 ease-out hover:border-atmos-ink focus-visible:border-atmos-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atmos-gold md:text-2xl"
                >
                  {contacto.valor}
                </a>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-6xl border-t border-atmos-slate/20 pt-10 md:mt-20">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
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
                    transitionDelay: `${DELAY_BARRA + indice * STAGGER_LETRA}ms`,
                  }}
                >
                  {letra}
                </span>
              ))}
            </span>
            <p style={estiloReveal(DELAY_RESTO_BARRA, 10)} className="mt-3 max-w-xs font-sans text-sm text-atmos-slate">
              Le temps qu'il fait, les nouvelles qui comptent{' '}
              <TextoRevelado texto="un seul regard sur le monde." className="font-bold text-atmos-ink" loop />
            </p>
          </div>

          <nav style={estiloReveal(DELAY_RESTO_BARRA, 10)} className="flex gap-8 font-sans text-sm text-atmos-ink">
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
          style={{
            opacity: visible ? 1 : 0,
            transition: `opacity 600ms ${EASE}`,
            transitionDelay: `${DELAY_RESTO_BARRA + 80}ms`,
          }}
          className="mt-10 font-mono text-xs uppercase tracking-wider text-atmos-slate/70"
        >
          © {new Date().getFullYear()} Atmos
        </div>
      </div>
    </footer>
  )
}
