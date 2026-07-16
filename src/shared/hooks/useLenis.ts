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

    // Contenido async (fotos de noticias, video del recuadro atmosférico, forecast) sigue
    // cambiando la altura real de la página bastante después del mount inicial — sin refrescar,
    // los ScrollTrigger creados temprano (useEscalaPanel, useRevelarEnScroll) quedan con
    // start/end calculados contra una página más corta de lo que termina siendo, y el timing
    // se desincroniza en silencio (confirmado: el panel de Noticias llegaba a su encogimiento
    // final ~1600px antes de lo esperado, con el `end` cacheado del ScrollTrigger apuntando a
    // un punto muy anterior al real). Mismo fix ya validado en la sesión del Footer/cortina
    // (revertida junto con ese efecto en particular) — reincorporado acá de forma general,
    // para cualquier ScrollTrigger del sitio, no solo uno.
    const resizeObserver = new ResizeObserver(() => ScrollTrigger.refresh())
    resizeObserver.observe(document.body)

    return () => {
      gsap.ticker.remove(onTick)
      lenis.destroy()
      resizeObserver.disconnect()
    }
  }, [])
}
