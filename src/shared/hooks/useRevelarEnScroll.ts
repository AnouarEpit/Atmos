import { useCallback, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Opciones {
  y?: number
  /** Escala inicial opcional (ej. 0.35) que crece hasta 1 en sync con el reveal — reversible como el resto (scrub). */
  scale?: number
  start?: string
  end?: string
  /**
   * Opcional, default `'siempre'` (comportamiento previo sin cambios). Cuando
   * el elemento vive dentro de un wrapper `hidden md:block`/`md:hidden` (dos
   * variantes desktop/mobile del mismo contenido, ej. `DatosDetalle`,
   * `FormasAtmosfericas`), la mitad invisible seguía calculando su
   * ScrollTrigger en cada scroll igual — trabajo desperdiciado que se suma al
   * de toda la página. `'desktop'`/`'mobile'` usa `gsap.matchMedia()` (mismo
   * mecanismo ya probado en `useEscalaPanel`) para no crear ese tween/trigger
   * fuera de su breakpoint — cero cambio visual (el elemento ya era invisible
   * ahí), solo menos trabajo por frame.
   */
  activarEn?: 'siempre' | 'desktop' | 'mobile'
}

const CONSULTA_DESKTOP = '(min-width: 768px)'
const CONSULTA_MOBILE = '(max-width: 767px)'

/**
 * Reveal scroll-scrubbed (cinematográfico: el fade/subida sigue el ritmo
 * real del scroll — adelante, atrás, rápido, lento — en vez de dispararse
 * una vez con una duración fija). GSAP ScrollTrigger + scrub, mismo patrón
 * ya probado en useEncogimientoScroll.ts (shrink del hero).
 *
 * A diferencia de un tween de duración fija, un tween scrub no tiene timer
 * propio: su progreso lo marca directamente la posición de scroll en cada
 * tick (Lenis empuja cada scroll a ScrollTrigger.update(), ver
 * useLenis.ts), así que el bug de `gsap.ticker.lagSmoothing(0)` documentado
 * en SubrayadoAnimado (tweens de duración fija saltando de golpe) no aplica
 * acá — no hay duración que saltar.
 *
 * `ref` es un callback ref, no un ref object + useEffect: Forecast/
 * DatosDetalle/Noticias devuelven `null` mientras no hay datos, así que la
 * sección real recién existe en el DOM en un render posterior. Un
 * `useEffect` con un ref object corre una sola vez con el ref todavía en
 * null y no vuelve a dispararse solo porque el nodo aparezca después (mismo
 * bug ya encontrado con el primer enfoque, IntersectionObserver). El
 * callback ref sí se ejecuta exactamente cuando React monta el nodo real.
 */
export function useRevelarEnScroll<T extends HTMLElement>({
  y = 36,
  scale,
  start = 'top 88%',
  end = 'top 55%',
  activarEn = 'siempre',
}: Opciones = {}) {
  const tweenRef = useRef<gsap.core.Tween | null>(null)
  const mmRef = useRef<ReturnType<typeof gsap.matchMedia> | null>(null)

  return useCallback(
    (nodo: T | null) => {
      tweenRef.current?.scrollTrigger?.kill()
      tweenRef.current?.kill()
      mmRef.current?.revert()
      if (!nodo) return

      const crearTween = () => {
        tweenRef.current = gsap.fromTo(
          nodo,
          { opacity: 0, y, ...(scale !== undefined ? { scale } : {}) },
          {
            opacity: 1,
            y: 0,
            ...(scale !== undefined ? { scale: 1 } : {}),
            ease: 'none',
            scrollTrigger: { trigger: nodo, start, end, scrub: 0.4 },
          },
        )
      }

      // 'siempre' (default, la inmensa mayoría de los usos de este hook): comportamiento
      // idéntico al de antes de agregar `activarEn`, sin envolver en matchMedia.
      if (activarEn === 'siempre') {
        crearTween()
        return
      }

      // 'desktop'/'mobile': el tween/ScrollTrigger ni se crea fuera de su breakpoint —
      // gsap.matchMedia() ya se encarga de recrearlo/destruirlo solo al cruzar los 768px.
      const mm = gsap.matchMedia()
      mmRef.current = mm
      mm.add(activarEn === 'desktop' ? CONSULTA_DESKTOP : CONSULTA_MOBILE, () => {
        crearTween()
        return () => {
          tweenRef.current?.scrollTrigger?.kill()
          tweenRef.current?.kill()
        }
      })
    },
    [y, scale, start, end, activarEn],
  )
}
