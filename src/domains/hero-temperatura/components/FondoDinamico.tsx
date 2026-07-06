import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface Gradiente {
  stop1: string
  stop2: string
  stop3: string
}

interface Props {
  foto: string
  gradiente: Gradiente
  tinte: string
}

export function FondoDinamico({ foto, gradiente, tinte }: Props) {
  const contenedorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!contenedorRef.current) return
    gsap.fromTo(
      contenedorRef.current,
      { opacity: 0, scale: 1.03 },
      { opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out' },
    )
  }, [foto])

  return (
    <div ref={contenedorRef} className="absolute inset-0 -z-10 overflow-hidden">
      <img key={foto} src={foto} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div
        className="absolute inset-0 transition-[background-image] duration-1000 ease-out"
        style={{
          backgroundImage: `linear-gradient(to top, ${gradiente.stop1}, ${gradiente.stop2} 55%, ${gradiente.stop3})`,
        }}
      />
      <div
        className="absolute inset-0 mix-blend-overlay transition-colors duration-1000 ease-out"
        style={{ backgroundColor: tinte }}
      />
      {/* Scrims fijos: legibilidad del nav/índice/bloque de temperatura independiente del overlay dinámico de clima/hora. */}
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black/55 to-transparent" />
      <div className="absolute inset-y-0 left-0 hidden w-[33rem] bg-gradient-to-r from-black/82 via-black/64 via-40% to-transparent md:block" />
      <div className="absolute inset-y-0 right-0 w-[32.5rem] bg-gradient-to-l from-black/82 via-black/64 via-40% to-transparent" />
    </div>
  )
}
