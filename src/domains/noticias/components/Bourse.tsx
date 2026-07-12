/**
 * Flecha lineal simple (línea + punta en L), mismo lenguaje que el resto de
 * iconos del sitio (`IconoClima`, `IconoConsejo`: trazo, `currentColor`, sin
 * relleno) — no un glifo ↑/↓ tipográfico, para mantener consistencia visual.
 * Usada por `TickerBourse` (el componente `Bourse` original, lista vertical
 * en tarjeta blanca, se retiró al pasar mobile a pestañas y desktop a
 * columnas — ver `PanelBourse`).
 */
export function FlechaMercado({ subiendo, className }: { subiendo: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {subiendo ? <path d="M4 17 L18 5 M18 5 L18 11 M18 5 L12 5" /> : <path d="M4 7 L18 19 M18 19 L18 13 M18 19 L12 19" />}
    </svg>
  )
}
