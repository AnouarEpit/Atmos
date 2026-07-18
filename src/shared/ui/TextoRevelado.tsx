import { useEffect, useRef, useState } from 'react'

// Modo loop: entra con cascada por letra → queda quieta ~2s (ESPERA_MS) →
// sale sincronizada (todas las letras a la vez, SALIDA_MS) → reinicia.
const ESPERA_MS = 2000
const SALIDA_MS = 550

/**
 * Texto que aparece letra por letra al entrar en viewport, con rebote real
 * (varias oscilaciones, no un solo overshoot) — pedido explícito de acercarse
 * a la referencia SplitText/GSAP (`ease="elastic.out(1,0.3)"`) sin el plugin:
 * `@keyframes atmos-letra-elastica` (`tokens.css`) codifica la forma del
 * rebote, disparada por un `animation` CSS por char (delay = stagger) en vez
 * de un tween GSAP de duración fija — ese saltaría de golpe por
 * `gsap.ticker.lagSmoothing(0)` (activo globalmente para el scroll-shrink del
 * hero, documentado en `SubrayadoAnimado`/`CirculoAnimado`); una animación
 * CSS nativa la corre el compositor, inmune a eso. Mismo disparador
 * (IntersectionObserver) que ya usaba el wordmark "Atmos" del Footer, ahora
 * extraído acá para no duplicar esa lógica una segunda vez.
 * Reversible: al salir de vista vuelve a ocultarse, se repite si se re-entra.
 *
 * Modo `loop`: la entrada usa `atmos-letra-suave` (sin rebote — pedido
 * explícito de que la reaparición se sienta más suave/natural que el rebote
 * elástico, que queda solo para el modo one-shot). La salida es sincronizada
 * (`atmos-letra-desvanecer`, todas las letras juntas, sin stagger) — se
 * probó una salida en cascada inversa (rewind) y se revirtió a pedido
 * explícito, esta es la versión que quedó.
 *
 * `prefers-reduced-motion` se resuelve en JS (`matchMedia`, mismo patrón que
 * el video de `RecuadroAtmosferico`) y no con clases `motion-reduce:*`: esas
 * nunca podrían ganarle a un `style` inline por especificidad.
 *
 * Palabras agrupadas en su propio `<span>` `whitespace-nowrap` (bug real
 * reportado: cada letra suelta como su propio inline-block es, para el
 * navegador, un punto de corte de línea válido como cualquier otro — "un" se
 * partía en "u"/"n" al final de línea). El espacio entre palabras queda como
 * texto plano (no envuelto en span): ahí sí puede saltar de línea, y al no
 * ser el único contenido de un inline-block tampoco colapsa a ancho cero
 * (motivo real por el que antes hacía falta nbsp dentro de un span propio —
 * acá no aplica, el espacio vive suelto entre dos elementos).
 */
export function TextoRevelado({
  texto,
  tag: Tag = 'span',
  className = '',
  staggerMs = 90,
  distanciaPx = 40,
  duracionMs = 950,
  loop = false,
}: {
  texto: string
  tag?: 'span' | 'h2' | 'h3'
  className?: string
  staggerMs?: number
  distanciaPx?: number
  duracionMs?: number
  loop?: boolean
}) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  const [reducirMovimiento, setReducirMovimiento] = useState(false)
  const [fase, setFase] = useState<'entrando' | 'saliendo'>('entrando')

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducirMovimiento(media.matches)
    const escuchar = (e: MediaQueryListEvent) => setReducirMovimiento(e.matches)
    media.addEventListener('change', escuchar)
    return () => media.removeEventListener('change', escuchar)
  }, [])

  useEffect(() => {
    const nodo = ref.current
    if (!nodo) return
    const observer = new IntersectionObserver(([entrada]) => setVisible(entrada.isIntersecting), {
      rootMargin: '0px 0px -15% 0px',
    })
    observer.observe(nodo)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!loop || !visible || reducirMovimiento) return
    let cancelado = false
    const timeouts: ReturnType<typeof setTimeout>[] = []

    function ciclo() {
      setFase('entrando')
      const entradaTotal = (texto.length - 1) * staggerMs + duracionMs
      timeouts.push(
        setTimeout(() => {
          if (cancelado) return
          setFase('saliendo')
          timeouts.push(
            setTimeout(() => {
              if (!cancelado) ciclo()
            }, SALIDA_MS)
          )
        }, entradaTotal + ESPERA_MS)
      )
    }
    ciclo()

    return () => {
      cancelado = true
      timeouts.forEach(clearTimeout)
    }
  }, [loop, visible, reducirMovimiento, texto, staggerMs, duracionMs])

  function estiloLetra(indiceGlobal: number): React.CSSProperties {
    if (reducirMovimiento) return { opacity: 1, transform: 'none' }
    if (!visible) return { opacity: 0, transform: `translateY(${distanciaPx}px)` }
    if (loop && fase === 'saliendo') {
      return {
        '--distancia-letra': `${distanciaPx}px`,
        animation: `atmos-letra-desvanecer ${SALIDA_MS}ms cubic-bezier(0.16,1,0.3,1) both`,
      } as React.CSSProperties
    }
    const nombreKeyframe = loop ? 'atmos-letra-suave' : 'atmos-letra-elastica'
    return {
      '--distancia-letra': `${distanciaPx}px`,
      animation: `${nombreKeyframe} ${duracionMs}ms cubic-bezier(0.16,1,0.3,1) ${indiceGlobal * staggerMs}ms both`,
    } as React.CSSProperties
  }

  let indiceGlobal = -1
  const palabras = texto.split(' ').map((palabra, pIdx) => (
    <span key={pIdx} className="inline-block whitespace-nowrap">
      {palabra.split('').map((letra) => {
        indiceGlobal += 1
        return (
          <span key={indiceGlobal} className="inline-block" style={estiloLetra(indiceGlobal)}>
            {letra}
          </span>
        )
      })}
    </span>
  ))
  const contenido = palabras.flatMap((palabra, pIdx) => {
    if (pIdx === 0) return [palabra]
    indiceGlobal += 1 // el espacio también consume un "tick" del stagger, mismo ritmo que antes
    return [' ', palabra]
  })

  return (
    <Tag ref={ref as never} className={className}>
      {contenido}
    </Tag>
  )
}
