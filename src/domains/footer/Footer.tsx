const ENLACES = [
  { href: '#accueil', label: 'Accueil' },
  { href: '#previsions', label: 'Prévisions' },
  { href: '#actus', label: 'Actus' },
]

/**
 * Sección de cierre. La curva de transición NO vive acá — vive en el
 * `rounded-b-[3.5rem]` de `Noticias` (mismo mecanismo que Hero→Forecast):
 * `Footer` es `atmos-bone`, igual que `body` (ver `tokens.css`), así que
 * redondear las esquinas de ESTA sección no revelaría ningún color distinto
 * detrás — invisible por definición. Noticias es `atmos-sable`; al redondear
 * su propia esquina inferior sí revela un color real (`bone`, que además
 * coincide con este footer, dando la costura continua).
 */
export function Footer() {
  return (
    <footer className="relative bg-atmos-bone px-6 py-16 md:px-10 md:py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 md:flex-row md:items-start md:justify-between">
        <div>
          <span className="font-display text-2xl italic tracking-wide text-atmos-ink">Atmos</span>
          <p className="mt-3 max-w-xs font-sans text-sm text-atmos-slate">
            Le temps qu'il fait, les nouvelles qui comptent — un seul regard sur le monde.
          </p>
        </div>

        <nav className="flex gap-8 font-sans text-sm text-atmos-ink">
          {ENLACES.map((enlace) => (
            <a
              key={enlace.href}
              href={enlace.href}
              className="border-b border-transparent pb-1 transition-colors duration-200 ease-out hover:border-atmos-ink focus-visible:border-atmos-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atmos-gold rounded-sm"
            >
              {enlace.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="mx-auto mt-14 max-w-6xl border-t border-atmos-slate/20 pt-6 font-mono text-xs uppercase tracking-wider text-atmos-slate/70">
        © {new Date().getFullYear()} Atmos
      </div>
    </footer>
  )
}
