import { useEffect, useRef, useState } from 'react'

/** 2 ondulaciones suaves vía Bezier cúbica, puntos como fracción del ancho medido real (no valores fijos). */
function pathOndulado(ancho: number): string {
  const w = ancho || 100
  return `M${w * 0.02},12 C${w * 0.17},4 ${w * 0.33},16 ${w * 0.5},8 C${w * 0.67},2 ${w * 0.83},16 ${w * 0.98},6`
}

/**
 * Trazo dorado bajo la palabra "actuelles" (no el título entero) — se dibuja
 * al entrar la sección en viewport, lento y suave, se repite al re-entrar.
 * Envuelve la palabra en un span `position:relative` y mide su ancho real
 * con getBoundingClientRect (+ ResizeObserver, no solo al montar) para que
 * el trazo se ajuste automático a cualquier tamaño de texto — desktop,
 * mobile, cualquier breakpoint — sin depender de un ancho fijo.
 *
 * pathLength=1 normaliza el largo del trazo a 1, así strokeDasharray/
 * strokeDashoffset no dependen de la geometría real del path SVG.
 *
 * IntersectionObserver + transición CSS, no GSAP: un tween de GSAP acá
 * (probado primero) saltaba de golpe en vez de dibujarse gradual, porque
 * `gsap.ticker.lagSmoothing(0)` (activo globalmente en useLenis.ts para el
 * scroll-shrink del hero) hace que cualquier micro-lag salte tweens de
 * duración fija entero en vez de interpolarlos — verificado muestreando
 * strokeDashoffset cada 100ms. CSS transition la maneja el compositor del
 * navegador, inmune a ese problema.
 */
export function SubrayadoAnimado() {
  const spanRef = useRef<HTMLSpanElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [visible, setVisible] = useState(false)
  const [ancho, setAncho] = useState(0)

  useEffect(() => {
    if (!spanRef.current) return
    const medir = () => setAncho(spanRef.current!.getBoundingClientRect().width)
    medir()
    const resizeObserver = new ResizeObserver(medir)
    resizeObserver.observe(spanRef.current)
    return () => resizeObserver.disconnect()
  }, [])

  useEffect(() => {
    if (!svgRef.current) return
    const observer = new IntersectionObserver(
      ([entrada]) => setVisible(entrada.isIntersecting),
      { rootMargin: '0px 0px -15% 0px' },
    )
    observer.observe(svgRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <span ref={spanRef} className="relative inline-block">
      actuelles
      <svg
        ref={svgRef}
        viewBox={`0 0 ${ancho || 100} 20`}
        className="absolute inset-x-0 -bottom-2 h-4"
        style={{ width: ancho || '100%' }}
        fill="none"
        aria-hidden
      >
        <path
          d={pathOndulado(ancho)}
          stroke="var(--color-atmos-gold)"
          strokeWidth="3"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={visible ? 0 : 1}
          style={{ transition: 'stroke-dashoffset 1.8s cubic-bezier(0.16, 1, 0.3, 1)' }}
        />
      </svg>
    </span>
  )
}
