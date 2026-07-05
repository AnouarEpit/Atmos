import { useState } from 'react'
import type { Ciudad } from '../../lib/data/ciudades'

interface Props {
  ciudades: Ciudad[]
  ciudadActual: Ciudad
  onCambiarCiudad: (ciudad: Ciudad) => void
}

export function Header({ ciudades, ciudadActual, onCambiarCiudad }: Props) {
  const [abierto, setAbierto] = useState(false)

  return (
    <header className="absolute inset-x-0 top-0 z-20 text-atmos-bone">
      <div className="flex items-center justify-between px-6 md:px-10 py-6">
        <span className="font-display text-lg tracking-wide">ATMOS</span>

        <nav className="hidden md:flex items-center gap-8 font-sans text-sm">
          <a href="#accueil" className="hover:opacity-70">
            Accueil
          </a>
          <a href="#previsions" className="hover:opacity-70">
            Prévisions
          </a>
          <a href="#actus" className="hover:opacity-70">
            Actus
          </a>
        </nav>

        <div className="flex items-center gap-4 font-sans text-sm">
          <div className="relative">
            <button
              type="button"
              onClick={() => setAbierto((valor) => !valor)}
              className="uppercase tracking-wide"
            >
              {ciudadActual.nombre} ▾
            </button>
            {abierto && (
              <ul className="absolute right-0 mt-2 w-48 max-h-72 overflow-auto bg-atmos-ink/90 backdrop-blur-sm">
                {ciudades.map((ciudad) => (
                  <li key={ciudad.slug}>
                    <button
                      type="button"
                      onClick={() => {
                        onCambiarCiudad(ciudad)
                        setAbierto(false)
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-atmos-bone/10"
                    >
                      {ciudad.nombre}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <span className="opacity-60">FR</span>
        </div>
      </div>
      <div className="h-px bg-atmos-bone/20" />
    </header>
  )
}
