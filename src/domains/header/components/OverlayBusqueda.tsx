import { useEffect, useRef } from 'react'
import type { Ciudad } from '../../../lib/data/ciudades'
import { useBusquedaCiudades } from '../hooks/useBusquedaCiudades'
import { useTemperaturasCiudades } from '../../../shared/hooks/useTemperaturasCiudades'

interface Props {
  abierto: boolean
  onCerrar: () => void
  onSeleccionarCiudad: (ciudad: Ciudad) => void
}

/**
 * "Search takeover" desktop: pantalla completa atmos-bone (no oscura),
 * disparada por la lupa del header. Input fijo arriba (con flecha volver),
 * resultados en lista scrolleable, récentes fijo abajo — así el teclado
 * (irrelevante en desktop, pero misma estructura sirve si se abre en un
 * mobile con teclado físico/virtual) nunca tapa nada porque cada zona tiene
 * su propio espacio, no dependen de scrollear la página entera.
 */
export function OverlayBusqueda({ abierto, onCerrar, onSeleccionarCiudad }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const temperaturas = useTemperaturasCiudades(abierto)
  const { consulta, setConsulta, consultaLimpia, resultados, sinResultados, ciudadesRecientes, seleccionarCiudad } =
    useBusquedaCiudades((ciudad) => {
      onSeleccionarCiudad(ciudad)
      onCerrar()
    })

  useEffect(() => {
    if (abierto) inputRef.current?.focus()
  }, [abierto])

  useEffect(() => {
    if (!abierto) return
    function onKeyDown(evento: KeyboardEvent) {
      if (evento.key === 'Escape') onCerrar()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [abierto, onCerrar])

  if (!abierto) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-atmos-bone text-atmos-ink">
      <div className="flex shrink-0 items-center gap-4 border-b border-atmos-ink/10 px-6 pt-6 pb-5 md:px-10">
        <button
          type="button"
          onClick={onCerrar}
          aria-label="Fermer la recherche"
          className="rounded-sm p-1 text-atmos-ink/70 transition-colors hover:text-atmos-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atmos-gold"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <div className="flex flex-1 items-center gap-3 border-b-2 border-atmos-gold pb-2">
          <span aria-hidden className="text-atmos-slate">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
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
            className="w-full bg-transparent font-display text-2xl text-atmos-ink placeholder:text-atmos-ink/35 outline-none md:text-3xl"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 md:px-10">
        {consultaLimpia && !sinResultados && (
          <p className="mb-3 font-mono text-xs uppercase tracking-wider text-atmos-slate">Résultats</p>
        )}
        {sinResultados && (
          <p className="mb-4 font-sans text-sm text-atmos-slate">
            Aucun résultat pour « {consultaLimpia} » — parmi les villes disponibles :
          </p>
        )}
        <ul>
          {resultados.map((ciudad) => (
            <li key={ciudad.slug} className="border-b border-atmos-ink/10 last:border-b-0">
              <button
                type="button"
                onClick={() => seleccionarCiudad(ciudad)}
                className="flex w-full items-center justify-between py-4 text-left transition-colors hover:text-atmos-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atmos-gold rounded-sm"
              >
                <span className="font-display text-xl">
                  {ciudad.nombre}, {ciudad.pais}
                </span>
                {temperaturas.has(ciudad.slug) && (
                  <span className="font-mono text-base text-atmos-slate">{temperaturas.get(ciudad.slug)}°</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {ciudadesRecientes.length > 0 && (
        <div className="shrink-0 border-t border-atmos-ink/10 px-6 py-6 md:px-10">
          <p className="mb-3 font-mono text-xs uppercase tracking-wider text-atmos-slate">Récentes</p>
          <div className="flex flex-wrap gap-2">
            {ciudadesRecientes.map((ciudad) => (
              <button
                key={ciudad.slug}
                type="button"
                onClick={() => seleccionarCiudad(ciudad)}
                className="rounded-full border border-atmos-ink/15 px-4 py-2 font-sans text-sm transition-colors hover:border-atmos-gold hover:text-atmos-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atmos-gold"
              >
                {ciudad.nombre}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
