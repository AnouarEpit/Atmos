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
    <g>
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
function Rama({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" strokeLinecap="round" strokeLinejoin="round" className={`fill-none stroke-atmos-ink ${className ?? ''}`}>
      <path d="M2,38 C6,33 5,28 10,24" strokeWidth={2.6} />
      <path d="M10,24 C13,21 10,18 15,14" strokeWidth={1.9} />
      <path d="M15,14 C18,11 15,8 20,4" strokeWidth={1.3} />
      <path d="M6,30 C4,27 2,25 1,22" strokeWidth={1.1} />
      <path d="M11,21 C15,20 18,22 23,19" strokeWidth={1.2} />
      <path d="M18,22 C20,21 22,23 24,21" strokeWidth={0.8} />
      <path d="M16,11 C19,10 21,12 25,9" strokeWidth={0.9} />
      <Flor x={6} y={30} r={1.8} />
      <Flor x={10} y={24} r={2} />
      <Flor x={23} y={19} r={1.9} />
      <Flor x={25} y={9} r={1.6} />
      <Flor x={20} y={4} r={2.1} />
      <Flor x={15} y={14} r={1.5} />
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
  const revelarGold = useRevelarEnScroll<HTMLDivElement>({ y: 16, scale: 0.35, start: 'top 95%', end: 'top 45%' })
  const revelarSlate = useRevelarEnScroll<HTMLDivElement>({ y: -16, start: 'top 88%', end: 'top 50%' })
  const revelarRamaSup = useRevelarEnScroll<HTMLDivElement>({ y: -12, start: 'top 90%', end: 'top 55%' })
  const revelarRamaInf = useRevelarEnScroll<HTMLDivElement>({ y: 12, start: 'top 88%', end: 'top 50%' })

  return (
    // Bug real encontrado antes de esto: `overflow-x-hidden` (solo un eje en "hidden") fuerza
    // por regla CSS al otro eje a computarse como `auto` — que igual recorta visualmente. El
    // "sangrado" de la ronda anterior en realidad seguía cortado en el borde exacto de la
    // sección, por eso el usuario seguía viendo la línea. Fix real: `overflow-x-clip` en vez de
    // `overflow-x-hidden` — `clip` es el único valor que NO dispara ese quirk (spec: solo valores
    // "distintos de visible o clip" fuerzan al otro eje), así que overflow-y queda genuinamente
    // visible y las nubes sangran de verdad hacia Forecast/Noticias sin ningún límite artificial.
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
      <div className="absolute top-0 right-0 h-40 w-36 overflow-hidden rotate-180">
        <div ref={revelarRamaSup} className="h-full w-full">
          <div className="h-full w-full motion-safe:animate-[atmos-rama-balanceo_7s_ease-in-out_infinite]">
            <Rama className="h-full w-full" />
          </div>
        </div>
      </div>
      <div ref={revelarRamaInf} className="absolute bottom-0 left-0 h-40 w-36 overflow-hidden">
        <div
          className="h-full w-full motion-safe:animate-[atmos-rama-balanceo_8s_ease-in-out_infinite]"
          style={{ animationDelay: '0.6s' }}
        >
          <Rama className="h-full w-full" />
        </div>
      </div>
    </div>
  )
}
