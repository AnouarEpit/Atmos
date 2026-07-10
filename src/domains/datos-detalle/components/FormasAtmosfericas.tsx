import { useCallback } from 'react'
import gsap from 'gsap'
import { useRevelarEnScroll } from '../../../shared/hooks/useRevelarEnScroll'

/**
 * Flor de ciruelo/cerezo: 5 pétalos (elipses en anillo) + punto de centro
 * más oscuro — usa `--color-atmos-bad` (ya existente en tokens.css, tono
 * terracota apagado del semáforo de calidad de aire) en vez de un rojo
 * nuevo sin relación con la paleta.
 */
function Flor({ x, y, r = 2.1 }: { x: number; y: number; r?: number }) {
  const petalos = [0, 72, 144, 216, 288]
  return (
    <g data-flor style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}>
      {petalos.map((deg) => {
        const rad = (deg * Math.PI) / 180
        const cx = x + Math.cos(rad) * r * 0.75
        const cy = y + Math.sin(rad) * r * 0.75
        return (
          <ellipse
            key={deg}
            cx={cx}
            cy={cy}
            rx={r * 0.62}
            ry={r * 0.4}
            transform={`rotate(${deg} ${cx} ${cy})`}
            className="fill-atmos-bad"
          />
        )
      })}
      <circle cx={x} cy={y} r={r * 0.3} className="fill-atmos-ink" />
    </g>
  )
}

/**
 * Rama estilo tinta japonesa (ciruelo/sakura): tronco grueso con quiebres
 * angulares que va afinándose hacia las puntas (3 tramos de ancho
 * decreciente, no un trazo uniforme — el grosor variable es lo que lee
 * como pincel, no como línea de icono) + brotes asimétricos + flores
 * (`Flor`) repartidas a lo largo de la rama, no solo en las puntas.
 * A diferencia del resto de iconos del sitio (lineales, `currentColor`),
 * esta es deliberadamente a color — pedido explícito del usuario a partir
 * de una referencia real, con la advertencia de que introduce un color
 * (terracota) que antes solo vivía en el semáforo de calidad de aire.
 */
/**
 * Tronco + brotes se dibujan progresivamente (stroke-dashoffset, técnica ya
 * usada en `SubrayadoAnimado`) y las flores aparecen después con un pop
 * (opacity+scale, `transformBox:'fill-box'` para que cada una escale desde
 * su propio centro, no desde 0,0 del viewBox) — todo scrub-scrolleado
 * (mismo trigger/start/end que recibe el contenedor desde `FormasAtmosfericas`).
 * GSAP (no CSS transition) porque acá sí hace falta timeline con stagger
 * entre 13 elementos (7 trazos + 6 flores) — y al ser `scrub` (no duración
 * fija) no aplica el bug de `lagSmoothing(0)` documentado en
 * `SubrayadoAnimado` (ese solo salta tweens de duración fija).
 */
function Rama({
  className,
  start,
  end,
  activarEn,
}: {
  className?: string
  start: string
  end: string
  /** Igual que `activarEn` de `useRevelarEnScroll` — esta instancia vive en un wrapper
   * hidden md:block/md:hidden, así que el timeline (tronco+flores) tampoco se crea
   * fuera de su breakpoint (gsap.matchMedia, mismo mecanismo). */
  activarEn: 'desktop' | 'mobile'
}) {
  const svgRef = useCallback(
    (svg: SVGSVGElement | null) => {
      if (!svg) return

      const crearTimeline = () => {
        const tronco = svg.querySelectorAll<SVGPathElement>('[data-tronco]')
        const flores = svg.querySelectorAll<SVGGElement>('[data-flor]')
        gsap.set(tronco, { strokeDasharray: 1, strokeDashoffset: 1 })
        gsap.set(flores, { opacity: 0, scale: 0 })

        const tl = gsap.timeline({ scrollTrigger: { trigger: svg, start, end, scrub: 0.9 } })
        tl.to(tronco, { strokeDashoffset: 0, ease: 'none', duration: 1.6, stagger: 0.2 })
        tl.to(flores, { opacity: 1, scale: 1, ease: 'sine.out', duration: 1, stagger: 0.18 }, '-=0.7')

        return () => {
          tl.scrollTrigger?.kill()
          tl.kill()
        }
      }

      const mm = gsap.matchMedia()
      mm.add(activarEn === 'desktop' ? '(min-width: 768px)' : '(max-width: 767px)', crearTimeline)

      return () => mm.revert()
    },
    [start, end, activarEn],
  )

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 64 32"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`fill-none stroke-atmos-ink ${className ?? ''}`}
    >
      {/* Misma silueta de antes, reescalada (x1.6, y0.8) a una caja ancha y baja
          en vez de cuadrada — así el contenedor puede ser bajo (evita que la
          rama baje hasta la fila del título) sin perder proporción ni recortar. */}
      <path data-tronco pathLength={1} d="M3.2,30.4 C9.6,26.4 8,22.4 16,19.2" strokeWidth={2.6} />
      <path data-tronco pathLength={1} d="M16,19.2 C20.8,16.8 16,14.4 24,11.2" strokeWidth={1.9} />
      <path data-tronco pathLength={1} d="M24,11.2 C28.8,8.8 24,6.4 32,3.2" strokeWidth={1.3} />
      <path data-tronco pathLength={1} d="M9.6,24 C6.4,21.6 3.2,20 1.6,17.6" strokeWidth={1.1} />
      <path data-tronco pathLength={1} d="M17.6,16.8 C24,16 28.8,17.6 36.8,15.2" strokeWidth={1.2} />
      <path data-tronco pathLength={1} d="M28.8,17.6 C32,16.8 35.2,18.4 38.4,16.8" strokeWidth={0.8} />
      <path data-tronco pathLength={1} d="M25.6,8.8 C30.4,8 33.6,9.6 40,7.2" strokeWidth={0.9} />
      <Flor x={9.6} y={24} r={1.8} />
      <Flor x={16} y={19.2} r={2} />
      <Flor x={36.8} y={15.2} r={1.9} />
      <Flor x={40} y={7.2} r={1.6} />
      <Flor x={32} y={3.2} r={2.1} />
      <Flor x={24} y={11.2} r={1.5} />
    </svg>
  )
}

/**
 * Formas decorativas detrás del panel flotante de DatosDetalle — llenan el
 * margen vacío alrededor de la tarjeta sin competir con el contenido (MOTION
 * 4/10: ambiental, nunca protagonista):
 * - 2 manchas de nube muy desenfocadas (esquinas superior-izq/inferior-der),
 *   sin overflow-hidden que las recorte — el blur se apaga solo hacia
 *   afuera (nada de línea de corte dura) e invade levemente la sección
 *   vecina (Forecast arriba / Noticias abajo), a propósito.
 * - 2 ramas lineales asomando desde atrás (esquinas superior-der/inferior-izq),
 *   con balanceo sutil tipo viento.
 * Todo aparece con scroll-reveal (mismo mecanismo que el resto de la sección)
 * y respeta prefers-reduced-motion (motion-safe).
 */
export function FormasAtmosfericas() {
  // activarEn 'desktop'/'mobile': estos 6 reveals viven en wrappers hidden md:block /
  // md:hidden (dos variantes del mismo contenido) — sin esto, la mitad invisible en
  // cada breakpoint seguía calculando su ScrollTrigger en cada scroll igual, sumando
  // carga de trabajo por frame (hallazgo bug scroll trackpad laptop, sesión 2026-07-10).
  const revelarGold = useRevelarEnScroll<HTMLDivElement>({
    y: 16,
    scale: 0.35,
    start: 'top 95%',
    end: 'top 45%',
    activarEn: 'desktop',
  })
  const revelarSlate = useRevelarEnScroll<HTMLDivElement>({
    y: -16,
    start: 'top 88%',
    end: 'top 50%',
    activarEn: 'desktop',
  })
  // Contenedor: fade+translate de entrada nomás. El "crecimiento" real ahora lo da
  // el trazo dibujándose + flores apareciendo dentro de <Rama> (mismo start/end,
  // pasado como prop para que ambos efectos queden sincronizados).
  // Rango bien más largo que el resto de reveals (75-90% del viewport en vez de ~35%)
  // para que el dibujo del trazo + aparición de flores se sienta gradual y no apurado.
  const RAMA_SUP = { start: 'top 95%', end: 'top 20%' }
  const RAMA_INF = { start: 'top 92%', end: 'top 20%' }
  const RAMA_MOBILE_SUP = { start: 'top 95%', end: 'top 30%' }
  const RAMA_MOBILE_INF = { start: 'top 92%', end: 'top 30%' }
  const revelarRamaSup = useRevelarEnScroll<HTMLDivElement>({ y: -12, ...RAMA_SUP, activarEn: 'desktop' })
  const revelarRamaInf = useRevelarEnScroll<HTMLDivElement>({ y: 12, ...RAMA_INF, activarEn: 'desktop' })
  // Mobile: ramas propias, más chicas, ancladas cerca del título (centrado, esquinas
  // libres) y de la atribución (también centrada) — no reusar posición/tamaño desktop,
  // huecos vacíos son otros en mobile (sin panel flotante, contenido casi full-width).
  const revelarRamaMobileSup = useRevelarEnScroll<HTMLDivElement>({ y: -10, ...RAMA_MOBILE_SUP, activarEn: 'mobile' })
  const revelarRamaMobileInf = useRevelarEnScroll<HTMLDivElement>({ y: 10, ...RAMA_MOBILE_INF, activarEn: 'mobile' })

  return (
    <>
    {/* Bug real: `overflow-x-hidden` (solo un eje en "hidden") fuerza por regla CSS al otro eje a
        computarse como `auto` — que igual recorta visualmente, por eso `overflow-x-clip` en vez de
        `overflow-x-hidden` (único valor que no dispara ese quirk): overflow-y queda genuinamente
        visible y las nubes sangran de verdad hacia Forecast/Noticias sin límite artificial. */}
    <div aria-hidden className="hidden md:block pointer-events-none absolute inset-0 -z-10 overflow-x-clip">
      <div ref={revelarGold} className="absolute -top-28 -left-24 h-96 w-96">
        <div className="h-full w-full rounded-full bg-atmos-gold/25 blur-2xl motion-safe:animate-[atmos-resplandor_9s_ease-in-out_infinite]" />
      </div>
      <div
        ref={revelarSlate}
        className="absolute -bottom-32 -right-20 h-[26rem] w-[26rem] rounded-full bg-atmos-slate/[0.28] blur-2xl motion-safe:animate-[atmos-resplandor_11s_ease-in-out_infinite]"
        style={{ animationDelay: '1.2s' }}
      />

      {/*
        Ramas asomando desde atrás del panel: base anclada en la esquina real
        de la sección (siempre visible en el margen, sin importar cuánto se
        angoste el panel), puntas finas hacia el contenido.
        3 niveles de anidamiento a propósito, no por exceso de celo: el flip
        estático (rotate-180), el scroll-reveal de GSAP (opacity+translateY)
        y el balanceo CSS (rotate) animan los 3 la propiedad `transform` — si
        conviven en un solo nodo, cada animación pisa por completo el valor
        de la anterior (solo gana una fuente de `transform` por elemento), y
        eso fue justo el bug real encontrado: el flip de 180° y el balanceo
        se cancelaban entre sí en el nodo compartido. Un nodo por fuente de
        transform evita el conflicto sin trucos.
      */}
      {/* h-28 (140px, escalado 125%): más bajo que el gap real medido entre el borde
          superior de la sección y el título (~172px), así la rama nunca alcanza esa
          fila sin importar la curva interna — no depende solo del z-index del panel. */}
      <div className="absolute top-0 right-0 h-28 w-56 overflow-hidden rotate-180">
        <div ref={revelarRamaSup} className="h-full w-full">
          <div className="h-full w-full motion-safe:animate-[atmos-rama-balanceo_7s_ease-in-out_infinite]">
            <Rama className="h-full w-full" {...RAMA_SUP} activarEn="desktop" />
          </div>
        </div>
      </div>
      <div ref={revelarRamaInf} className="absolute bottom-0 left-0 h-28 w-56 overflow-hidden">
        <div
          className="h-full w-full motion-safe:animate-[atmos-rama-balanceo_8s_ease-in-out_infinite]"
          style={{ animationDelay: '0.6s' }}
        >
          <Rama className="h-full w-full" {...RAMA_INF} activarEn="desktop" />
        </div>
      </div>
    </div>

      {/* Mobile: mismas ramas, más chicas, propio wrapper (no md:block de arriba) —
          ancladas cerca del título y de la atribución, ambos centrados, únicos huecos
          libres en un layout mobile casi full-width sin panel flotante. */}
      <div aria-hidden className="md:hidden pointer-events-none absolute inset-0 -z-10 overflow-x-clip">
        <div className="absolute top-0 right-0 h-20 w-40 overflow-hidden rotate-180">
          <div ref={revelarRamaMobileSup} className="h-full w-full">
            <div className="h-full w-full motion-safe:animate-[atmos-rama-balanceo_7s_ease-in-out_infinite]">
              <Rama className="h-full w-full" {...RAMA_MOBILE_SUP} activarEn="mobile" />
            </div>
          </div>
        </div>
        <div ref={revelarRamaMobileInf} className="absolute bottom-0 left-0 h-20 w-40 overflow-hidden">
          <div
            className="h-full w-full motion-safe:animate-[atmos-rama-balanceo_8s_ease-in-out_infinite]"
            style={{ animationDelay: '0.6s' }}
          >
            <Rama className="h-full w-full" {...RAMA_MOBILE_INF} activarEn="mobile" />
          </div>
        </div>
      </div>
    </>
  )
}
