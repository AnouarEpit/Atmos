const svgProps = {
  viewBox: '0 0 24 24',
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

/** Círculo medio-lleno: llenándose (lever, dorado) vs. vaciándose (coucher, slate) — mismo lenguaje lineal que IconoClima. */
export function IconoSolMedio({ lado, className }: { lado: 'lever' | 'coucher'; className?: string }) {
  const arco = lado === 'lever' ? 'M12 5 A7 7 0 0 1 12 19 Z' : 'M12 5 A7 7 0 0 0 12 19 Z'
  return (
    <svg {...svgProps} className={className}>
      <circle cx="12" cy="12" r="7" />
      <path d={arco} fill="currentColor" stroke="none" />
    </svg>
  )
}
