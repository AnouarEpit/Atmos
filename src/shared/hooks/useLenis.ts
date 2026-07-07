import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Lenis se sincroniza con el ticker de GSAP (en vez de su propio rAF) y
 * empuja cada scroll a ScrollTrigger.update() — sin esto, cualquier
 * animación con scrollTrigger (ej. el "shrink" del hero) usaría la posición
 * de scroll nativa mientras Lenis suaviza visualmente la del usuario,
 * y quedarían desincronizadas (jank perceptible).
 */
export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1 })
    lenis.on('scroll', ScrollTrigger.update)

    function onTick(time: number) {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(onTick)
      lenis.destroy()
    }
  }, [])
}
