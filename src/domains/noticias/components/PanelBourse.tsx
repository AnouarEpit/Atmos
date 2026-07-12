import { PanelNoticias } from './PanelNoticias'
import { TickerBourse } from './TickerBourse'

/**
 * Ticker de mercados + noticias financieras reales debajo, mismo estilo que
 * el resto de paneles de noticias — usado en la pestaña "Bourse" mobile y en
 * la columna "Bourse" desktop.
 */
export function PanelBourse() {
  return (
    <div>
      <TickerBourse />
      <div className="mt-8">
        <PanelNoticias alcance="finanzas" />
      </div>
    </div>
  )
}
