import { useState } from 'react'

const ENLACES = [
  { href: '#accueil', label: 'Accueil' },
  { href: '#previsions', label: 'Prévisions' },
  { href: '#actus', label: 'Actus' },
]

export function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false)

  return (
    <header className="absolute inset-x-0 top-0 z-20 text-atmos-bone">
      <div className="flex items-center justify-between px-6 md:px-10 py-6">
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

      {menuAbierto && (
        <nav className="mx-6 mt-1 rounded-2xl border border-atmos-bone/15 bg-atmos-ink/70 shadow-[0_16px_32px_rgba(0,0,0,0.25)] backdrop-blur-xl md:hidden">
          {ENLACES.map((enlace) => (
            <a
              key={enlace.href}
              href={enlace.href}
              onClick={() => setMenuAbierto(false)}
              className="block border-b border-atmos-bone/10 px-5 py-3.5 font-sans text-base transition-colors duration-150 ease-out last:border-b-0 hover:bg-atmos-bone/10 focus-visible:bg-atmos-bone/10 focus-visible:outline-none"
            >
              {enlace.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}
