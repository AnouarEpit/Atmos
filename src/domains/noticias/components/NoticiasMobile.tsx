import { useState } from 'react'
import type { Noticia } from '../../../lib/api/noticiasApi'
import { ArticuloDestacado } from './ArticuloDestacado'
import { ItemNoticiaCompacto } from './ItemNoticiaCompacto'
import { PanelNoticias } from './PanelNoticias'
import { PanelBourse } from './PanelBourse'

const PESTANAS = [
  { id: 'une', label: 'À la une' },
  { id: 'monde', label: 'Monde' },
  { id: 'bourse', label: 'Bourse' },
] as const

type PestanaId = (typeof PESTANAS)[number]['id']

interface Props {
  destacada: Noticia
  resto: Noticia[]
}

/**
 * Mobile-only (montado dentro de un wrapper `md:hidden` en `Noticias.tsx`):
 * tres pestañas en vez de apilar destacada + lista + "Dans le monde" + "Bourse"
 * en serie (scroll eterno hasta Bourse). Mismo lenguaje de pestañas que ya usa
 * `Forecast` mobile (píldora activa `bg-atmos-ink`, panel con fade+slide
 * `atmos-aparecer` al cambiar) — reusado, no reinventado.
 * "Bourse" combina el ticker de mercados con noticias financieras reales
 * debajo (mismo estilo destacada+lista que el resto de pestañas).
 */
export function NoticiasMobile({ destacada, resto }: Props) {
  const [activa, setActiva] = useState<PestanaId>('une')

  return (
    <div>
      <div className="mb-6 flex gap-2">
        {PESTANAS.map((pestana) => (
          <button
            key={pestana.id}
            type="button"
            onClick={() => setActiva(pestana.id)}
            aria-pressed={activa === pestana.id}
            className={`rounded-full px-4 py-2 font-sans text-sm transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atmos-gold ${
              activa === pestana.id ? 'bg-atmos-ink text-atmos-bone' : 'text-atmos-slate hover:text-atmos-ink'
            }`}
          >
            {pestana.label}
          </button>
        ))}
      </div>

      <div key={activa} className="animate-[atmos-aparecer_300ms_ease-out]">
        {activa === 'une' && (
          <div>
            <ArticuloDestacado noticia={destacada} />
            {resto.map((noticia) => (
              <ItemNoticiaCompacto key={noticia.id} noticia={noticia} />
            ))}
          </div>
        )}
        {activa === 'monde' && <PanelNoticias alcance="mundo" />}
        {activa === 'bourse' && <PanelBourse />}
      </div>
    </div>
  )
}
