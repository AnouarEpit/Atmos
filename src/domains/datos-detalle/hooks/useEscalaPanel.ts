import { useCallback, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

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
 */
export function useEscalaPanel<T extends HTMLElement>() {
  const mmRef = useRef<ReturnType<typeof gsap.matchMedia> | null>(null)

  return useCallback((nodo: T | null) => {
    mmRef.current?.revert()
    if (!nodo) return

    const mm = gsap.matchMedia()
    mmRef.current = mm

    mm.add('(min-width: 768px)', () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: nodo, start: 'top bottom', end: 'bottom top', scrub: true },
      })
      tl.fromTo(nodo, { scale: 0.9 }, { scale: 1, ease: 'none', duration: 1 }).to(nodo, {
        scale: 0.9,
        ease: 'none',
        duration: 1,
      })

      return () => {
        tl.scrollTrigger?.kill()
        tl.kill()
      }
    })
  }, [])
}
