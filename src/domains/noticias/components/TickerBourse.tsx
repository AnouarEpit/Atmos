import { useQuery } from '@tanstack/react-query'
import { obtenerBolsa } from '../../../lib/api/bolsaApi'
import { FlechaMercado } from './Bourse'

/**
 * Reemplaza la lista vertical de `Bourse` dentro de la pestaña "Bourse" mobile
 * (`NoticiasMobile`): franja con los mismos 7 mercados desfilando en marquee
 * horizontal continuo. Misma queryKey que `Bourse` (React Query comparte
 * caché, sin llamada extra). Marquee contenido en su propio `overflow-hidden`
 * — no afecta el ancho del documento (el proyecto tuvo varios bugs reales de
 * overflow horizontal por elementos que sangraban fuera de su contenedor).
 *
 * Sin fondo (ni negro ni blanco): probado negro primero, se sentía fuera de
 * lugar sobre `atmos-sable`; blanco después, pero la tarjeta se notaba de
 * más — el texto se funde directo con la sección, mismo criterio que las
 * columnas "Dans le monde"/"Bourse" (sin card blanca, "son noticias
 * también").
 *
 * `atmos-alza`/`atmos-bad` NO pasan 4.5:1 sobre `atmos-sable` como texto
 * (calculado: 3.34:1 / 3.77:1 — `atmos-sable` es más OSCURO que el blanco
 * contra el que se habían verificado antes, no más claro, primer supuesto
 * mío estaba mal y lo corregí calculando en vez de asumir). Por eso el
 * porcentaje va en `atmos-ink` (12.44:1, de sobra) y el color solo tiñe la
 * flecha — ahí sí pasa el mínimo no-texto de WCAG 1.4.11 (3:1, gráficos con
 * significado): 3.34:1/3.77:1 ambos por encima de 3.
 */
export function TickerBourse() {
  const { data } = useQuery({
    queryKey: ['bolsa'],
    queryFn: obtenerBolsa,
    staleTime: 10 * 60 * 1000,
  })

  if (!data?.length) return null

  return (
    <div className="overflow-hidden py-3.5">
      <div className="flex w-max motion-safe:animate-[atmos-ticker-flujo_28s_linear_infinite]">
        {[...data, ...data].map((mercado, indice) => {
          const subiendo = mercado.variacionPorcentual >= 0
          const colorClase = subiendo ? 'text-atmos-alza' : 'text-atmos-bad'
          return (
            <div
              key={indice}
              className="flex shrink-0 items-center gap-2 whitespace-nowrap px-5 font-mono text-sm text-atmos-ink"
            >
              <span className="text-atmos-slate">{mercado.nombre}</span>
              <span className="flex items-center gap-1.5">
                <FlechaMercado subiendo={subiendo} className={`h-3.5 w-3.5 shrink-0 ${colorClase}`} />
                {subiendo ? '+' : ''}
                {mercado.variacionPorcentual.toFixed(2)}%
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
