import { useEffect, useRef, useState } from 'react'

const RADIO_BASE = 7
const RADIO_HOVER = 22
const FACTOR_LERP = 0.18
const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'

/**
 * Punto que sigue el mouse con lerp propio (rAF manual, no GSAP: nada de
 * tweens de duración fija, así que el lag de gsap.ticker.lagSmoothing(0)
 * documentado en otros componentes no aplica acá). Crece al pasar sobre
 * elementos clicables. `mix-blend-difference` lo mantiene visible tanto
 * sobre la foto oscura del hero como sobre fondos claros, sin lógica de
 * color condicional.
 *
 * Solo desktop real (`hover: hover` + `pointer: fine`) — en touch no hay
 * cursor que reemplazar, y el listener de mousemove no aporta nada ahí.
 */
export function CursorPersonalizado() {
  const puntoRef = useRef<HTMLDivElement>(null)
  const posicion = useRef({ x: 0, y: 0 })
  const objetivo = useRef({ x: 0, y: 0 })
  const inicializado = useRef(false)
  const [habilitado, setHabilitado] = useState(false)
  const [visible, setVisible] = useState(false)
  const [sobreInteractivo, setSobreInteractivo] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    setHabilitado(mq.matches)
    const alCambiar = (evento: MediaQueryListEvent) => setHabilitado(evento.matches)
    mq.addEventListener('change', alCambiar)
    return () => mq.removeEventListener('change', alCambiar)
  }, [])

  useEffect(() => {
    if (!habilitado) return

    function onMove(evento: MouseEvent) {
      objetivo.current = { x: evento.clientX, y: evento.clientY }
      if (!inicializado.current) {
        posicion.current = { ...objetivo.current }
        inicializado.current = true
      }
      setVisible(true)
      const interactivo = (evento.target as HTMLElement)?.closest(
        'a, button, input, [role="button"], [data-cursor-hover]',
      )
      setSobreInteractivo(Boolean(interactivo))
    }
    function onSalirVentana() {
      setVisible(false)
    }

    window.addEventListener('mousemove', onMove)
    document.documentElement.addEventListener('mouseleave', onSalirVentana)

    let frame: number
    function tick() {
      posicion.current.x += (objetivo.current.x - posicion.current.x) * FACTOR_LERP
      posicion.current.y += (objetivo.current.y - posicion.current.y) * FACTOR_LERP
      if (puntoRef.current) {
        puntoRef.current.style.transform = `translate(${posicion.current.x}px, ${posicion.current.y}px) translate(-50%, -50%)`
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.documentElement.removeEventListener('mouseleave', onSalirVentana)
      cancelAnimationFrame(frame)
    }
  }, [habilitado])

  if (!habilitado) return null

  const escala = sobreInteractivo ? RADIO_HOVER / RADIO_BASE : 1

  return (
    // Posición vía transform imperativo (rAF, cada frame) en este div externo —
    // separado del tamaño para no pisar el transition CSS del hijo.
    <div ref={puntoRef} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[200]">
      {/* Tamaño fijo + `scale`: solo transform/opacity, sin animar width/height (layout thrash). */}
      <div
        className="rounded-full mix-blend-difference"
        style={{
          width: RADIO_BASE * 2,
          height: RADIO_BASE * 2,
          backgroundColor: '#f4efe6',
          opacity: visible ? 1 : 0,
          transform: `scale(${escala})`,
          transition: `transform 250ms ${EASE}, opacity 200ms ease`,
        }}
      />
    </div>
  )
}
