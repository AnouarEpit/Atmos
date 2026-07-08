import { useState } from 'react'
import type { Ciudad } from '../../lib/data/ciudades'
import { OverlayBusqueda } from './components/OverlayBusqueda'
import { MenuMobile } from './components/MenuMobile'

const ENLACES = [
  { href: '#accueil', label: 'Accueil' },
  { href: '#previsions', label: 'Prévisions' },
  { href: '#actus', label: 'Actus' },
]

interface Props {
  onSeleccionarCiudad: (ciudad: Ciudad) => void
  /** Gatea el fade-in del header — false mientras el Preloader todavía tapa la pantalla. */
  revelado: boolean
}

export function Header({ onSeleccionarCiudad, revelado }: Props) {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [busquedaAbierta, setBusquedaAbierta] = useState(false)

  return (
    <header className="absolute inset-x-0 top-0 z-20 text-atmos-bone">
      <div
        className="flex items-center justify-between px-6 md:px-10 py-6"
        style={{
          opacity: revelado ? 1 : 0,
          transform: revelado ? 'translateY(0)' : 'translateY(-10px)',
          transition: 'opacity 800ms cubic-bezier(0.16, 1, 0.3, 1), transform 800ms cubic-bezier(0.16, 1, 0.3, 1)',
          transitionDelay: '350ms',
        }}
      >
        <span className="font-display text-lg tracking-wide">ATMOS</span>

        <div className="flex items-center gap-6 font-sans text-sm">
          <nav className="hidden items-center gap-8 md:flex">
            {ENLACES.map((enlace) => (
              <a
                key={enlace.href}
                href={enlace.href}
                className="border-b border-transparent pb-1 transition-colors duration-200 ease-out hover:border-atmos-bone focus-visible:border-atmos-bone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atmos-gold rounded-sm"
              >
                {enlace.label}
              </a>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => setBusquedaAbierta(true)}
            aria-label="Rechercher une ville"
            className="hidden rounded-sm p-1 transition-colors duration-200 ease-out hover:text-atmos-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atmos-gold md:block"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
          </button>
          <span aria-hidden className="hidden h-4 w-px bg-atmos-bone/30 md:block" />
          <span className="opacity-60">FR</span>
          <button
            type="button"
            aria-label={menuAbierto ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={menuAbierto}
            onClick={() => setMenuAbierto((abierto) => !abierto)}
            className="-mr-1.5 rounded-sm p-2 md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atmos-gold"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="h-5 w-5">
              {menuAbierto ? <path d="M5 5l14 14M19 5L5 19" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      <MenuMobile
        abierto={menuAbierto}
        onCerrar={() => setMenuAbierto(false)}
        enlaces={ENLACES}
        onSeleccionarCiudad={onSeleccionarCiudad}
      />

      <OverlayBusqueda
        abierto={busquedaAbierta}
        onCerrar={() => setBusquedaAbierta(false)}
        onSeleccionarCiudad={onSeleccionarCiudad}
      />
    </header>
  )
}
