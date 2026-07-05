import type { Condicion } from '../../lib/clima/condicion'

interface Props {
  condicion: Condicion
  className?: string
}

const svgProps = {
  viewBox: '0 0 24 24',
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

const NUBE = 'M7 17.5a4 4 0 0 1-.5-7.97A5 5 0 0 1 16.4 8.1 4.5 4.5 0 0 1 16.5 17.5H7Z'

/** Set de iconos lineales monocromos (currentColor) — evita el look de app de clima genérica de los emoji a todo color. */
export function IconoClima({ condicion, className }: Props) {
  switch (condicion) {
    case 'despejado':
      return (
        <svg {...svgProps} className={className}>
          <circle cx="12" cy="12" r="4.5" />
          <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5 5l2.1 2.1M17 17l2.1 2.1M19 5l-2.1 2.1M7 17l-2.1 2.1" />
        </svg>
      )
    case 'nubes':
      return (
        <svg {...svgProps} className={className}>
          <path d={NUBE} />
        </svg>
      )
    case 'lluvia':
      return (
        <svg {...svgProps} className={className}>
          <path d={NUBE} />
          <path d="M9 19.5l-1 2.5M13 19.5l-1 2.5M17 19.5l-1 2.5" />
        </svg>
      )
    case 'tormenta':
      return (
        <svg {...svgProps} className={className}>
          <path d={NUBE} />
          <path d="M13.5 17.5l-2.5 4h2.5l-2 2.5" />
        </svg>
      )
    case 'nieve':
      return (
        <svg {...svgProps} className={className}>
          <path d={NUBE} />
          <path d="M12 18.8v4.4M10.1 19.9l3.8 2.2M10.1 22.1l3.8-2.2" />
        </svg>
      )
    case 'niebla':
      return (
        <svg {...svgProps} className={className}>
          <path d="M4 9h13M3 13h16M4 17h13M7 21h9" />
        </svg>
      )
  }
}
