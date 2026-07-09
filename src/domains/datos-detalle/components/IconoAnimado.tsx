interface Props {
  tipo: 'uv' | 'vent' | 'humidite' | 'pression' | 'ressenti'
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

/**
 * Iconos ambientales de datos-detalle: loops continuos y sutiles (MOTION 4/10),
 * solo transform/opacity vía @keyframes de tokens.css — nunca disparan reflow.
 * Mismo estilo lineal que IconoClima (stroke, currentColor).
 */
export function IconoAnimado({ tipo, className }: Props) {
  switch (tipo) {
    case 'uv':
      return (
        <svg {...svgProps} className={`${className ?? ''} motion-safe:animate-[atmos-pulso-opacidad_2.8s_ease-in-out_infinite]`}>
          <circle cx="12" cy="12" r="4.5" />
          <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5 5l2.1 2.1M17 17l2.1 2.1M19 5l-2.1 2.1M7 17l-2.1 2.1" />
        </svg>
      )
    case 'vent':
      return (
        <svg {...svgProps} className={className}>
          <path d="M3 8h14" className="motion-safe:animate-[atmos-viento_2.4s_ease-in-out_infinite]" />
          <path
            d="M3 12h10"
            className="motion-safe:animate-[atmos-viento_2.4s_ease-in-out_infinite]"
            style={{ animationDelay: '0.3s' }}
          />
          <path
            d="M3 16h7"
            className="motion-safe:animate-[atmos-viento_2.4s_ease-in-out_infinite]"
            style={{ animationDelay: '0.6s' }}
          />
        </svg>
      )
    case 'humidite':
      return (
        <svg {...svgProps} className={className}>
          <path
            d="M12 3c0 0 6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z"
            className="motion-safe:animate-[atmos-pulso-escala_2.8s_ease-in-out_infinite]"
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          />
        </svg>
      )
    case 'pression':
      return (
        <svg {...svgProps} className={className}>
          <circle cx="12" cy="12" r="8" />
          <line
            x1="12"
            y1="12"
            x2="12"
            y2="6"
            className="motion-safe:animate-[atmos-oscilar-aguja_3s_ease-in-out_infinite]"
            style={{ transformOrigin: '12px 12px' }}
          />
        </svg>
      )
    case 'ressenti':
      return (
        <svg {...svgProps} className={`${className ?? ''} motion-safe:animate-[atmos-pulso-opacidad-sutil_2.8s_ease-in-out_infinite]`}>
          <path d="M12 4a2 2 0 0 0-2 2v7.5a3.5 3.5 0 1 0 4 0V6a2 2 0 0 0-2-2z" />
          <line x1="12" y1="7" x2="12" y2="14" />
        </svg>
      )
  }
}
