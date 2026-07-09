import type { TipoConsejo } from '../../lib/clima/consejo'

const svgProps = {
  viewBox: '0 0 24 24',
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function IconoConsejo({ tipo, className }: { tipo: TipoConsejo; className?: string }) {
  switch (tipo) {
    case 'sol':
      return (
        <svg {...svgProps} className={className}>
          <circle cx="12" cy="12" r="4.5" />
          <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5 5l2.1 2.1M17 17l2.1 2.1M19 5l-2.1 2.1M7 17l-2.1 2.1" />
        </svg>
      )
    case 'viento':
      return (
        <svg {...svgProps} className={className}>
          <path d="M3 8h14M3 12h10M3 16h7" />
        </svg>
      )
    case 'lluvia':
      return (
        <svg {...svgProps} className={className}>
          <path d="M7 17.5a4 4 0 0 1-.5-7.97A5 5 0 0 1 16.4 8.1 4.5 4.5 0 0 1 16.5 17.5H7Z" />
          <path d="M9 19.5l-1 2.5M13 19.5l-1 2.5M17 19.5l-1 2.5" />
        </svg>
      )
    case 'general':
      return (
        <svg {...svgProps} className={className}>
          <path d="M4 12.5l4.5 4.5L20 6" />
        </svg>
      )
  }
}
