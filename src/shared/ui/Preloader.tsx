import { useEffect, useRef, useState } from 'react'
import { ciudadPorDefecto, ciudadPorSlug, type Ciudad } from '../../lib/data/ciudades'

interface PreloaderProps {
  listo: boolean
  onTerminado: () => void
}

const LETRAS_BIENVENUE = 'Bienvenue'.split('')
const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'
const EASE_CRECIMIENTO = 'cubic-bezier(0.65, 0, 0.35, 1)'
const CADENCIA_IMAGEN = 380
const DURACION_CRECIMIENTO = 1500
const STAGGER_LETRA = 22

/** Termina en la ciudad default real (Paris) — el handoff al Hero real detrás no debe notarse. */
const CIUDADES_CARRUSEL: Ciudad[] = [
  ciudadPorSlug('lyon'),
  ciudadPorSlug('berlin'),
  ciudadPorSlug('londres'),
  ciudadPorSlug('strasbourg'),
  ciudadPorDefecto,
].filter((c): c is Ciudad => c !== undefined)

/** Un solo arco suave (no la doble ondulación de SubrayadoAnimado) — trazo bajo "Atmos", más discreto. */
function pathArco(ancho: number): string {
  const w = ancho || 100
  return `M${w * 0.03},10 Q${w * 0.5},-2 ${w * 0.97},10`
}

/**
 * Splash de entrada, coreografiado 100% con CSS transitions (sin GSAP): un
 * timeline de gsap.timeline se probó primero y se sentía lageado — mismo
 * problema ya documentado en SubrayadoAnimado, `gsap.ticker.lagSmoothing(0)`
 * (activo globalmente en useLenis.ts para el scroll-shrink del hero) hace
 * saltar tweens de duración fija en vez de interpolarlos.
 *
 * Fases: "Bienvenue" letra por letra → "Atmos" en cursiva con trazo dorado →
 * ambos salen → caja mediana centrada, esquinas redondeadas, con carrusel
 * de fotos reales cruzando adentro (sin texto, sin overlay) → la caja crece
 * (width/height/border-radius en transición CSS, no mask ni custom property
 * — plain CSS transition, sin riesgo de salto) hasta llenar la pantalla con
 * las mismas esquinas del Hero real (redondeadas solo abajo, como
 * `rounded-b-[3.5rem]`) → el panel entero se desvanece revelando el Hero
 * real detrás, que ya muestra exactamente la misma foto en el mismo recorte
 * (handoff sin salto visible). No cierra hasta `listo` (datos clima ciudad
 * default ya llegaron, o timeout de seguridad en App.tsx).
 */
export function Preloader({ listo, onTerminado }: PreloaderProps) {
  const atmosTextoRef = useRef<HTMLSpanElement>(null)
  const [anchoAtmos, setAnchoAtmos] = useState(0)

  const [letrasVisibles, setLetrasVisibles] = useState(false)
  const [bienvenidaVisible, setBienvenidaVisible] = useState(true)
  const [atmosVisible, setAtmosVisible] = useState(false)
  const [dibujarTrazo, setDibujarTrazo] = useState(false)
  const [indiceImagen, setIndiceImagen] = useState(-1)
  const [mostrarCaja, setMostrarCaja] = useState(false)
  const [crecido, setCrecido] = useState(false)
  const [entradaLista, setEntradaLista] = useState(false)
  const [panelVisible, setPanelVisible] = useState(true)

  useEffect(() => {
    if (!atmosTextoRef.current) return
    const medir = () => setAnchoAtmos(atmosTextoRef.current!.getBoundingClientRect().width)
    medir()
    const resizeObserver = new ResizeObserver(medir)
    resizeObserver.observe(atmosTextoRef.current)
    return () => resizeObserver.disconnect()
  }, [])

  useEffect(() => {
    CIUDADES_CARRUSEL.forEach((ciudad) => {
      const img = new Image()
      img.src = ciudad.foto
    })
  }, [])

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    const inicioImagenes = 3550
    const temporizadores = [
      setTimeout(() => setLetrasVisibles(true), 20),
      setTimeout(() => setBienvenidaVisible(false), 820),
      setTimeout(() => setAtmosVisible(true), 1120),
      setTimeout(() => setDibujarTrazo(true), 1900),
      setTimeout(() => setAtmosVisible(false), 3050),
      setTimeout(() => setMostrarCaja(true), inicioImagenes - 150),
      ...CIUDADES_CARRUSEL.map((_, i) =>
        setTimeout(() => setIndiceImagen(i), inicioImagenes + i * CADENCIA_IMAGEN),
      ),
    ]

    const finCarrusel = inicioImagenes + (CIUDADES_CARRUSEL.length - 1) * CADENCIA_IMAGEN
    temporizadores.push(setTimeout(() => setCrecido(true), finCarrusel + 450))
    temporizadores.push(setTimeout(() => setEntradaLista(true), finCarrusel + 450 + DURACION_CRECIMIENTO + 200))

    return () => {
      temporizadores.forEach(clearTimeout)
    }
  }, [])

  useEffect(() => {
    if (!entradaLista || !listo) return

    const cerrar = setTimeout(() => setPanelVisible(false), 150)
    const terminar = setTimeout(() => {
      document.body.style.overflow = ''
      onTerminado()
    }, 150 + 850)

    return () => {
      clearTimeout(cerrar)
      clearTimeout(terminar)
    }
  }, [entradaLista, listo, onTerminado])

  return (
    <div
      className="fixed inset-0 z-[100] overflow-hidden bg-atmos-bone"
      style={{
        opacity: panelVisible ? 1 : 0,
        transition: `opacity 0.85s ${EASE}`,
      }}
    >
      <div
        className="absolute left-1/2 top-1/2 overflow-hidden shadow-[0_20px_60px_rgba(20,24,28,0.25)]"
        style={{
          width: crecido ? '100%' : 'min(24rem, 85vw)',
          height: crecido ? '100%' : 'min(15rem, 53vw)',
          opacity: mostrarCaja ? 1 : 0,
          transform: `translate(-50%, -50%) scale(${mostrarCaja ? 1 : 0.94})`,
          borderTopLeftRadius: crecido ? '0px' : '1.75rem',
          borderTopRightRadius: crecido ? '0px' : '1.75rem',
          borderBottomLeftRadius: crecido ? '3.5rem' : '1.75rem',
          borderBottomRightRadius: crecido ? '3.5rem' : '1.75rem',
          transition: `width ${DURACION_CRECIMIENTO}ms ${EASE_CRECIMIENTO}, height ${DURACION_CRECIMIENTO}ms ${EASE_CRECIMIENTO}, border-radius ${DURACION_CRECIMIENTO}ms ${EASE_CRECIMIENTO}, box-shadow ${DURACION_CRECIMIENTO}ms ${EASE_CRECIMIENTO}, opacity 0.5s ${EASE}, transform 0.5s ${EASE}`,
        }}
      >
        {CIUDADES_CARRUSEL.map((ciudad, i) => (
          <img
            key={ciudad.slug}
            src={ciudad.foto}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            style={{
              objectPosition: ciudad.posicionFoto ?? 'center',
              opacity: indiceImagen === i ? 1 : 0,
              transform: indiceImagen === i ? 'scale(1)' : 'scale(1.05)',
              transition: `opacity 0.55s ${EASE}, transform 0.9s ${EASE}`,
            }}
          />
        ))}
      </div>

      <p
        className="absolute inset-0 flex items-center justify-center font-sans text-2xl uppercase tracking-[0.35em] text-atmos-slate"
        style={{
          opacity: bienvenidaVisible ? 1 : 0,
          transform: bienvenidaVisible ? 'translateY(0)' : 'translateY(-10px)',
          transition: 'opacity 0.3s ease-in, transform 0.3s ease-in',
        }}
      >
        {LETRAS_BIENVENUE.map((letra, indice) => (
          <span
            key={indice}
            className="inline-block"
            style={{
              opacity: letrasVisibles ? 1 : 0,
              transform: letrasVisibles ? 'translateY(0)' : 'translateY(14px)',
              transition: `opacity 0.3s ${EASE}, transform 0.3s ${EASE}`,
              transitionDelay: `${indice * STAGGER_LETRA}ms`,
            }}
          >
            {letra}
          </span>
        ))}
      </p>
      <p
        className="absolute inset-0 flex items-center justify-center font-display text-6xl italic text-atmos-ink"
        style={{
          opacity: atmosVisible ? 1 : 0,
          transform: atmosVisible ? 'translateY(0)' : 'translateY(10px)',
          transition: `opacity 0.7s ${EASE}, transform 0.7s ${EASE}`,
        }}
      >
        <span ref={atmosTextoRef} className="relative inline-block">
          Atmos
          <svg
            viewBox={`0 0 ${anchoAtmos || 100} 20`}
            className="absolute inset-x-0 -bottom-3 h-5"
            style={{ width: anchoAtmos || '100%' }}
            fill="none"
            aria-hidden
          >
            <path
              d={pathArco(anchoAtmos)}
              stroke="var(--color-atmos-gold)"
              strokeWidth="3"
              strokeLinecap="butt"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={dibujarTrazo ? 0 : 1}
              style={{ transition: `stroke-dashoffset 1.1s ${EASE}` }}
            />
          </svg>
        </span>
      </p>
    </div>
  )
}
