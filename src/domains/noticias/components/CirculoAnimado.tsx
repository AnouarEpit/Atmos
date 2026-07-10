import { useEffect, useRef, useState } from 'react'

interface Punto {
  x: number
  y: number
}

// MARGEN: cuánto se extiende el óvalo más allá del texto (controla qué tan
// "generoso" envuelve la palabra). HOLGURA: buffer EXTRA en el <svg> más allá
// de eso — necesario porque un <svg> recorta su propio contenido por defecto
// (viewBox = caja de recorte, no solo de referencia) y el radio del óvalo sin
// holgura tocaba el borde justo: ni el jitter (hasta ~4.6% del radio) ni la
// mitad del strokeWidth (1.25px, el trazo se centra en el path) tenían margen
// — se veían recortados los costados. PAD_SVG = MARGEN + HOLGURA es lo que
// realmente separa el <svg> del <span>, no MARGEN solo.
const MARGEN = { x: 16, y: 13 }
const HOLGURA = 20
const PAD_SVG = { x: MARGEN.x + HOLGURA, y: MARGEN.y + HOLGURA }

/**
 * Misma fórmula pero CERRADA (`p0`/`p3` envuelven por módulo, no caen de
 * vuelta en el propio punto) — arregla de raíz el "corte" visible que
 * dejaban tanto la superposición (pellizco) como el hueco (línea
 * interrumpida) de los dos intentos anteriores: acá no hay costura, la
 * tangente en el punto de unión se calcula igual que en cualquier otro
 * punto de la curva, así que cierra sin marca ninguna.
 */
function pathCerrado(puntos: Punto[]): string {
  const n = puntos.length
  if (n < 3) return ''
  let d = `M${puntos[0].x},${puntos[0].y}`
  for (let i = 0; i < n; i++) {
    const p0 = puntos[(i - 1 + n) % n]
    const p1 = puntos[i]
    const p2 = puntos[(i + 1) % n]
    const p3 = puntos[(i + 2) % n]
    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6
    d += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`
  }
  return `${d} Z`
}

/**
 * Círculo dibujado a mano alzada alrededor del texto (como un profesor
 * marcando una nota). Historia real hasta que cerró bien:
 * 1. Curva abierta con superposición (barrido 390°) — pellizco/pico donde
 *    el trazo se doblaba sobre sí mismo cerca del punto de partida.
 * 2. Curva abierta con hueco (barrido 340°) — arreglaba el pellizco pero
 *    dejaba el corte/interrupción visible que se reportó después.
 * 3. **Curva CERRADA de verdad** (`pathCerrado`, wraparound por módulo,
 *    barrido 360° completo): la tangente en la costura se calcula igual
 *    que en cualquier otro punto de la curva, sin caso especial — cierra
 *    limpio, sin pellizco ni corte.
 * Sigue habiendo muchos puntos (44, cada ~8°) por la misma razón que ya
 * valía con la curva abierta: con pocos puntos el Catmull-Rom no maneja
 * bien la curvatura fuerte de un óvalo ancho/bajo.
 *
 * `escala`/`fase` parametrizan un SEGUNDO trazo (ver `CirculoAnimado`) —
 * una sola línea se sentía "de vector", no de mano: un profesor real circula
 * dos veces al marcar. `escala` agranda apenas el segundo trazo (no calca
 * el primero) y `fase` desplaza los armónicos del jitter (no es la misma
 * ondulación repetida, sería obviamente el mismo trazo duplicado).
 */
function pathCirculo(ancho: number, alto: number, escala = 1, fase = 0): string {
  const w = ancho || 100
  const h = alto || 40
  // Centro relativo a la caja del <svg> (que empieza en PAD_SVG, no en MARGEN)
  // — si se centra contra MARGEN solo, el óvalo queda descentrado hacia
  // arriba-izquierda dentro del viewBox real.
  const cx = PAD_SVG.x + w / 2
  const cy = PAD_SVG.y + h / 2
  const rx = (w / 2 + MARGEN.x) * escala
  const ry = (h / 2 + MARGEN.y) * escala
  const puntos: Punto[] = []
  const pasos = 44
  for (let i = 0; i < pasos; i++) {
    const angDeg = i * (360 / pasos)
    const angRad = (angDeg * Math.PI) / 180
    const jitter = 1 + Math.sin(angRad * 2.4 + 1.1 + fase) * 0.028 + Math.sin(angRad * 5.3 + 0.4 + fase * 1.7) * 0.018
    puntos.push({
      x: cx + rx * jitter * Math.cos(angRad),
      y: cy + ry * jitter * Math.sin(angRad),
    })
  }
  return pathCerrado(puntos)
}

/**
 * Mismo mecanismo que `SubrayadoAnimado` (`DatosDetalle`): IntersectionObserver
 * + transición CSS de `stroke-dashoffset` (no GSAP — un tween de duración fija
 * saltaría de golpe por `gsap.ticker.lagSmoothing(0)`, activo globalmente para
 * el scroll-shrink del hero, documentado ahí). `pathLength=1` normaliza el
 * largo del trazo, así el dasharray/dashoffset no depende de la geometría real.
 */
export function CirculoAnimado({ children }: { children: React.ReactNode }) {
  const spanRef = useRef<HTMLSpanElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [visible, setVisible] = useState(false)
  const [tamano, setTamano] = useState({ ancho: 0, alto: 0 })

  useEffect(() => {
    if (!spanRef.current) return
    const medir = () => {
      const rect = spanRef.current!.getBoundingClientRect()
      setTamano({ ancho: rect.width, alto: rect.height })
    }
    medir()
    const resizeObserver = new ResizeObserver(medir)
    resizeObserver.observe(spanRef.current)
    return () => resizeObserver.disconnect()
  }, [])

  useEffect(() => {
    if (!svgRef.current) return
    const observer = new IntersectionObserver(([entrada]) => setVisible(entrada.isIntersecting), {
      rootMargin: '0px 0px -15% 0px',
    })
    observer.observe(svgRef.current)
    return () => observer.disconnect()
  }, [])

  const anchoSvg = tamano.ancho + PAD_SVG.x * 2
  const altoSvg = tamano.alto + PAD_SVG.y * 2

  return (
    <span ref={spanRef} className="relative inline-block">
      {children}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${anchoSvg || 100} ${altoSvg || 40}`}
        className="absolute z-10 pointer-events-none overflow-visible"
        style={{ width: anchoSvg || '100%', height: altoSvg || '100%', left: -PAD_SVG.x, top: -PAD_SVG.y }}
        fill="none"
        aria-hidden
      >
        <path
          d={pathCirculo(tamano.ancho, tamano.alto)}
          stroke="var(--color-atmos-gold)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={visible ? 0 : 1}
          style={{ transition: 'stroke-dashoffset 2.4s cubic-bezier(0.16, 1, 0.3, 1)' }}
        />
        {/* Segundo trazo, apenas más grande y desfasado (`escala`/`fase`) — un solo
            trazo se leía "de vector", un profesor de verdad circula dos veces. Más
            fino y semitransparente (accesorio, no protagonista) y arranca con un
            pequeño delay para que se sienta como el segundo pasaje de la lapicera,
            no dos trazos dibujándose exactamente a la vez. */}
        <path
          d={pathCirculo(tamano.ancho, tamano.alto, 1.055, 2.1)}
          stroke="var(--color-atmos-gold)"
          strokeOpacity={0.6}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={visible ? 0 : 1}
          style={{ transition: 'stroke-dashoffset 2.4s cubic-bezier(0.16, 1, 0.3, 1) 0.15s' }}
        />
      </svg>
    </span>
  )
}
