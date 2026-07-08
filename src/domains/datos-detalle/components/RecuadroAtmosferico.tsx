import { useEffect, useState } from 'react'

interface Props {
  /** Bucket "nuit" (mismo umbral que useOverlayPorHora, ≥20h local) — cambia a un video de cielo nocturno real en vez del timelapse de nubes diurno. */
  esNoche?: boolean
}

/**
 * Recuadro distintivo del layout mobile "Zen" — video real en loop (timelapse
 * de nubes recortado a un boomerand adelante+reversa para que el ciclo sea
 * perfectamente continuo, sin salto, ya que el material original no es cíclico;
 * mismo tratamiento para el video nocturno de cielo estrellado). Respaldo con
 * resplandor CSS mientras carga o si falla, y respeta prefers-reduced-motion
 * mostrando un frame estático en su lugar.
 */
export function RecuadroAtmosferico({ esNoche = false }: Props) {
  const [reducirMovimiento, setReducirMovimiento] = useState(false)
  const [videoListo, setVideoListo] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducirMovimiento(mql.matches)
    const onChange = (evento: MediaQueryListEvent) => setReducirMovimiento(evento.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  // Al cruzar el umbral día/noche con la página ya abierta, el resplandor
  // cubre el instante del cambio de fuente (mismo mecanismo que la carga inicial).
  useEffect(() => {
    setVideoListo(false)
  }, [esNoche])

  const mostrarVideo = !reducirMovimiento
  const base = esNoche ? 'atmosfera-cielo-nuit' : 'atmosfera-cielo'

  return (
    <div className="relative h-[18rem] w-[clamp(7rem,38vw,12.2rem)] shrink-0 overflow-hidden rounded-[1.75rem] bg-atmos-slate">
      <div
        aria-hidden
        className={`absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(184,194,201,0.6),rgba(74,87,96,0.95)_70%)] transition-opacity duration-500 ${
          mostrarVideo ? 'animate-[atmos-resplandor_4s_ease-in-out_infinite]' : ''
        } ${mostrarVideo && videoListo ? 'opacity-0' : 'opacity-100'}`}
      />
      {mostrarVideo ? (
        <video
          key={base}
          autoPlay
          muted
          loop
          playsInline
          poster={`/videos/${base}-poster.jpg`}
          onCanPlay={() => setVideoListo(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            videoListo ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source src={`/videos/${base}.webm`} type="video/webm" />
          <source src={`/videos/${base}.mp4`} type="video/mp4" />
        </video>
      ) : (
        <img key={base} src={`/videos/${base}-poster.jpg`} alt="" className="absolute inset-0 h-full w-full object-cover" />
      )}
    </div>
  )
}
