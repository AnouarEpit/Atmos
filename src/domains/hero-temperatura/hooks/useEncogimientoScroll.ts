import { useEffect, type RefObject } from 'react'
import gsap from 'gsap'

/**
 * Al terminar el scroll del hero, la sección se encoge levemente (scale
 * 1→0.95) sincronizado con la posición de scroll (scrub) — combinado con el
 * radio fijo de las esquinas (rounded-b-*), el encogimiento revela la curva
 * de forma mucho más notoria que un borde estático solo. Requiere que
 * useLenis() ya esté sincronizando Lenis con ScrollTrigger.
 */
export function useEncogimientoScroll(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!ref.current) return
    const tween = gsap.to(ref.current, {
      scale: 0.95,
      ease: 'power1.inOut',
      scrollTrigger: {
        trigger: ref.current,
        start: 'bottom 80%',
        end: 'bottom 20%',
        scrub: true,
      },
    })
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [ref])
}
