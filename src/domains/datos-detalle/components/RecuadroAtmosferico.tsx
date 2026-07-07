import { useEffect, useState } from 'react'

/**
 * Recuadro distintivo del layout mobile "Zen" — video real en loop (timelapse
 * de nubes recortado a un boomerand adelante+reversa para que el ciclo sea
 * perfectamente continuo, sin salto, ya que el material original no es cíclico).
 * Respaldo con resplandor CSS mientras carga o si falla, y respeta
 * prefers-reduced-motion mostrando un frame estático en su lugar.
 */
export function RecuadroAtmosferico() {
  const [reducirMovimiento, setReducirMovimiento] = useState(false)
  const [videoListo, setVideoListo] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducirMovimiento(mql.matches)
    const onChange = (evento: MediaQueryListEvent) => setReducirMovimiento(evento.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  const mostrarVideo = !reducirMovimiento

  return (
    <div className="relative h-[13rem] w-[5.5rem] shrink-0 overflow-hidden rounded-[1.75rem] bg-atmos-slate">
      <div
        aria-hidden
        className={`absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(184,194,201,0.6),rgba(74,87,96,0.95)_70%)] transition-opacity duration-500 ${
          mostrarVideo ? 'animate-[atmos-resplandor_4s_ease-in-out_infinite]' : ''
        } ${mostrarVideo && videoListo ? 'opacity-0' : 'opacity-100'}`}
      />
      {mostrarVideo ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/videos/atmosfera-cielo-poster.jpg"
          onCanPlay={() => setVideoListo(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            videoListo ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source src="/videos/atmosfera-cielo.webm" type="video/webm" />
          <source src="/videos/atmosfera-cielo.mp4" type="video/mp4" />
        </video>
      ) : (
        <img src="/videos/atmosfera-cielo-poster.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
      )}
    </div>
  )
}
