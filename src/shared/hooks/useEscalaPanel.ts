import { useCallback, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface OpcionesEscalaPanel {
  /** Escala de partida/llegada al entrar (default 0.9, mismo valor que ya usaba DatosDetalle). */
  desde?: number
  /** Escala de llegada al SALIR (default `desde`, simétrico). Noticias usa un valor más
   * marcado que la entrada — un "cierre" reconocible antes del Footer, no el mismo
   * crecimiento en reversa. */
  salida?: number
  /**
   * Fracción (0-1) del recorrido de scroll de la sección que tarda en llegar a tamaño
   * completo tras entrar. Default 0.5 (mismo timing simétrico de siempre).
   */
  duracionEntrada?: number
  /**
   * Fracción (0-1) del recorrido que tarda en encogerse antes de terminar de salir —
   * ocurre en el ÚLTIMO tramo del scroll de la sección, no repartido a la mitad. Con
   * `duracionEntrada + duracionSalida < 1` queda un tramo intermedio "en reposo" (escala 1)
   * entre el crecimiento y el encogimiento — el panel se encoge recién mucho más abajo,
   * no a mitad de camino. Default 0.5 (sin gap, mismo timing de siempre).
   */
  duracionSalida?: number
  /** Easing del tramo de salida (default 'none', lineal — mismo timing de siempre). Noticias
   * usa 'power2.in' para que se sienta lento al empezar y cada vez más rápido hacia el final. */
  easeSalida?: string
  /**
   * Punto final del ScrollTrigger, formato GSAP (default `'bottom top'`, mismo de siempre —
   * DatosDetalle sin cambios). Noticias usa `'bottom bottom'`: el Footer que sigue es más
   * corto que un viewport, así que `'bottom top'` (que exige scrollear hasta que el borde
   * inferior de la sección llegue al TOPE del viewport) nunca se alcanza en scroll normal —
   * confirmado con Playwright, el cierre se frenaba en ~0.94 en vez de la escala final
   * pedida, justo en el tope real de scroll del documento. `'bottom bottom'` sí se alcanza
   * siempre que la sección sea más alta que el viewport (lo es).
   */
  end?: string
}

/**
 * Panel flotante de DatosDetalle: crece levemente al entrar en viewport y se
 * encoge de nuevo al salir hacia Noticias — mismo mecanismo scrub que
 * useEncogimientoScroll del hero (gsap.timeline con scrollTrigger, sin pin),
 * aplicado en las dos direcciones en vez de solo al salir. Solo desktop
 * (gsap.matchMedia crea/destruye el tween al cruzar el breakpoint, sin tocar
 * el layout mobile en absoluto).
 *
 * `ref` es un callback ref, no un ref object + useEffect: DatosDetalle
 * devuelve `null` mientras no hay datos, así que el panel real recién existe
 * en el DOM en un render posterior — mismo bug ya documentado y resuelto en
 * useRevelarEnScroll (un useEffect con ref object corre una sola vez con el
 * ref en null y no se vuelve a disparar solo porque el nodo aparezca).
 *
 * Respeta `prefers-reduced-motion`: con la preferencia activa, ni se crea el
 * tween — el panel queda fijo en su tamaño real, sin scale scroll-scrubbed.
 */
export function useEscalaPanel<T extends HTMLElement>(
  desde = 0.9,
  {
    salida = desde,
    duracionEntrada = 0.5,
    duracionSalida = 0.5,
    easeSalida = 'none',
    end = 'bottom top',
  }: OpcionesEscalaPanel = {},
) {
  const mmRef = useRef<ReturnType<typeof gsap.matchMedia> | null>(null)

  return useCallback(
    (nodo: T | null) => {
      mmRef.current?.revert()
      if (!nodo) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      const mm = gsap.matchMedia()
      mmRef.current = mm

      mm.add('(min-width: 768px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: nodo, start: 'top bottom', end, scrub: true },
        })
        tl.fromTo(nodo, { scale: desde }, { scale: 1, ease: 'none', duration: duracionEntrada })
        tl.to(nodo, { scale: salida, ease: easeSalida, duration: duracionSalida }, 1 - duracionSalida)

        return () => {
          tl.scrollTrigger?.kill()
          tl.kill()
        }
      })
    },
    [desde, salida, duracionEntrada, duracionSalida, easeSalida, end],
  )
}
