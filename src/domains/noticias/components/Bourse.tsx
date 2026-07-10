import { useQuery } from '@tanstack/react-query'
import { obtenerBolsa } from '../../../lib/api/bolsaApi'

/**
 * Flecha lineal simple (línea + punta en L), mismo lenguaje que el resto de
 * iconos del sitio (`IconoClima`, `IconoConsejo`: trazo, `currentColor`, sin
 * relleno) — no un glifo ↑/↓ tipográfico, para mantener consistencia visual.
 */
function FlechaMercado({ subiendo, className }: { subiendo: boolean; className?: string }) {
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

/**
 * Rellena el espacio vacío que dejaba "Dans le monde" en desktop (columna
 * lateral más corta que la lista principal de noticias). Índices puros
 * (CAC 40, DAX, Nikkei, Dow, Nasdaq) están bloqueados en el plan free de
 * Twelve Data (verificado en vivo) — se usan ETFs de país/región que sí
 * funcionan gratis y siguen de cerca esos mismos mercados (ver
 * `bolsaService.js` para el detalle completo).
 */
export function Bourse() {
  const { data } = useQuery({
    queryKey: ['bolsa'],
    queryFn: obtenerBolsa,
    staleTime: 10 * 60 * 1000,
  })

  if (!data?.length) return null

  return (
    <aside className="rounded-2xl bg-white p-6 md:p-9 shadow-[0_10px_32px_rgba(20,24,28,0.06),0_3px_8px_rgba(20,24,28,0.04)]">
      <p className="font-mono text-[0.8125rem] uppercase tracking-wider text-atmos-slate mb-5">Bourse</p>
      <div className="flex flex-col">
        {data.map((mercado, indice) => {
          const subiendo = mercado.variacionPorcentual >= 0
          const colorClase = subiendo ? 'text-atmos-alza' : 'text-atmos-bad'
          return (
            <div
              key={mercado.simbolo}
              className={`flex items-center justify-between gap-3 py-3 ${indice > 0 ? 'border-t border-atmos-slate/20' : ''}`}
            >
              <p className="font-sans text-sm text-atmos-ink">{mercado.nombre}</p>
              <div className={`flex items-center gap-1.5 ${colorClase}`}>
                <FlechaMercado subiendo={subiendo} className="h-3.5 w-3.5 shrink-0" />
                <p className="font-mono text-sm tabular-nums">
                  {subiendo ? '+' : ''}
                  {mercado.variacionPorcentual.toFixed(2)}%
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </aside>
  )
}
