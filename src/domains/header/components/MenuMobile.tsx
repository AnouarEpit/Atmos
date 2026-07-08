import { useEffect, useRef } from 'react'
import type { Ciudad } from '../../../lib/data/ciudades'
import { ciudadesPopulares } from '../../../lib/data/ciudades'
import { useBusquedaCiudades } from '../hooks/useBusquedaCiudades'

interface Enlace {
  href: string
  label: string
}

interface Props {
  abierto: boolean
  onCerrar: () => void
  enlaces: Enlace[]
  onSeleccionarCiudad: (ciudad: Ciudad) => void
}

/**
 * Menú mobile (opción 3 mostrada al usuario): buscador como primer elemento
 * — antes de la navegación —, con "villes populaires" como chips debajo del
 * nav cuando no hay búsqueda activa. Al escribir, la lista de resultados
 * reemplaza nav+chips en el mismo espacio (no hay lugar para mostrar todo
 * junto en una pantalla chica).
 */
export function MenuMobile({ abierto, onCerrar, enlaces, onSeleccionarCiudad }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  // ref, no state: onTouchEnd puede correr antes de que React re-renderice con
  // el valor que setState hubiera guardado en onTouchStart (closure obsoleto,
  // verificado con un swipe sintético disparado sin pausa entre eventos).
  const touchInicioYRef = useRef<number | null>(null)
  const { consulta, setConsulta, consultaLimpia, resultados, sinResultados, seleccionarCiudad } = useBusquedaCiudades(
    (ciudad) => {
      onSeleccionarCiudad(ciudad)
      onCerrar()
    },
  )

  useEffect(() => {
    // Sin autofocus: en mobile eso abre el teclado apenas se abre el menú,
    // sin que el usuario haya tocado el input todavía.
    if (!abierto) setConsulta('')
  }, [abierto, setConsulta])

  useEffect(() => {
    if (!abierto) return
    function onKeyDown(evento: KeyboardEvent) {
      if (evento.key === 'Escape') onCerrar()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [abierto, onCerrar])

  if (!abierto) return null

  const buscando = consultaLimpia.length > 0

  return (
    <nav
      ref={panelRef}
      className="mx-6 mt-1 max-h-[70vh] overflow-y-auto rounded-2xl border border-atmos-bone/15 bg-atmos-ink/80 shadow-[0_16px_32px_rgba(0,0,0,0.25)] backdrop-blur-xl md:hidden"
      onTouchStart={(evento) => { touchInicioYRef.current = evento.touches[0].clientY }}
      onTouchEnd={(evento) => {
        if (touchInicioYRef.current !== null && evento.changedTouches[0].clientY - touchInicioYRef.current > 60) onCerrar()
        touchInicioYRef.current = null
      }}
    >
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center gap-3 rounded-full bg-atmos-bone/10 px-4 py-2.5">
          <span aria-hidden className="text-atmos-bone/60">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
          </span>
          <input
            ref={inputRef}
            value={consulta}
            onChange={(evento) => setConsulta(evento.target.value)}
            placeholder="Rechercher une ville…"
            aria-label="Rechercher une ville"
            className="w-full bg-transparent font-sans text-sm text-atmos-bone placeholder:text-atmos-bone/50 outline-none"
          />
        </div>
      </div>

      {buscando ? (
        <div className="px-2 pb-3">
          {sinResultados && (
            <p className="px-3 pb-2 font-sans text-xs text-atmos-bone/70">
              Aucun résultat pour « {consultaLimpia} » :
            </p>
          )}
          <ul className="max-h-64 overflow-y-auto" data-lenis-prevent>
            {resultados.map((ciudad) => (
              <li key={ciudad.slug}>
                <button
                  type="button"
                  onClick={() => seleccionarCiudad(ciudad)}
                  className="block w-full rounded-lg px-3 py-3 text-left font-sans text-sm text-atmos-bone transition-colors hover:bg-atmos-bone/10 focus-visible:bg-atmos-bone/10 focus-visible:outline-none"
                >
                  {ciudad.nombre}, {ciudad.pais}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <>
          {enlaces.map((enlace) => (
            <a
              key={enlace.href}
              href={enlace.href}
              onClick={onCerrar}
              className="block border-b border-atmos-bone/10 px-5 py-3.5 font-sans text-base text-atmos-bone transition-colors duration-150 ease-out last:border-b-0 hover:bg-atmos-bone/10 focus-visible:bg-atmos-bone/10 focus-visible:outline-none"
            >
              {enlace.label}
            </a>
          ))}
          <div className="px-5 pt-4 pb-5">
            <p className="mb-2.5 font-mono text-[0.625rem] uppercase tracking-wider text-atmos-bone/50">
              Villes populaires
            </p>
            <div className="flex flex-wrap gap-2">
              {ciudadesPopulares.map((ciudad) => (
                <button
                  key={ciudad.slug}
                  type="button"
                  onClick={() => seleccionarCiudad(ciudad)}
                  className="rounded-full border border-atmos-bone/20 px-4 py-1.5 font-sans text-sm text-atmos-bone transition-colors hover:border-atmos-gold hover:text-atmos-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atmos-gold"
                >
                  {ciudad.nombre}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </nav>
  )
}
