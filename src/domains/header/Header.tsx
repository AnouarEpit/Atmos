export function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-20 text-atmos-bone">
      <div className="flex items-center justify-between px-6 md:px-10 py-6">
        <span className="font-display text-lg tracking-wide">ATMOS</span>

        <div className="flex items-center gap-6 font-sans text-sm">
          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#accueil"
              className="border-b border-transparent pb-1 transition-colors duration-200 ease-out hover:border-atmos-bone"
            >
              Accueil
            </a>
            <a
              href="#previsions"
              className="border-b border-transparent pb-1 transition-colors duration-200 ease-out hover:border-atmos-bone"
            >
              Prévisions
            </a>
            <a
              href="#actus"
              className="border-b border-transparent pb-1 transition-colors duration-200 ease-out hover:border-atmos-bone"
            >
              Actus
            </a>
          </nav>
          <span aria-hidden className="hidden h-4 w-px bg-atmos-bone/30 md:block" />
          <span className="opacity-60">FR</span>
        </div>
      </div>
    </header>
  )
}
