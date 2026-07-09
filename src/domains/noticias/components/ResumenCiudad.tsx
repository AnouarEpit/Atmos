import type { ReactNode } from 'react'
import type { Ciudad } from '../../../lib/data/ciudades'
import type { RespuestaClima } from '../../../lib/api/tipos'
import { formatearHora, calidadAireInfo, direccionViento } from '../../../lib/clima/formato'
import { consejoDelDia } from '../../../lib/clima/consejo'
import { faseLunar } from '../../../lib/clima/luna'
import { mapCondicion } from '../../../lib/clima/condicion'
import { IconoClima } from '../../../shared/ui/IconoClima'
import { IconoConsejo } from '../../../shared/ui/IconoConsejo'
import { IconoSolMedio } from '../../../shared/ui/IconoSolMedio'
import { useCalidadAire } from '../hooks/useCalidadAire'

interface Props {
  ciudad: Ciudad
  clima: RespuestaClima
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
 * Dos arcos elípticos (terminador fijo + uno cuya curvatura depende de la
 * iluminación) — la técnica estándar para dibujar fases lunares en SVG sin
 * necesitar un dibujo distinto por cada una de las 8 fases. El signo de
 * cos (no un simple k<=0.5) decide si el segundo arco cancela o completa
 * el primero — verificado visualmente en las 8 fases antes de usar esto.
 */
function IconoLuna({ cicloFraccion, className }: { cicloFraccion: number; className?: string }) {
  const r = 7
  const cosVal = Math.cos(cicloFraccion * 2 * Math.PI)
  const rx = Math.abs(r * cosVal)
  const sweep = cosVal >= 0 ? 0 : 1
  const d = `M12 5 A${r} ${r} 0 0 1 12 19 A${rx.toFixed(2)} ${r} 0 0 ${sweep} 12 5 Z`
  return (
    <svg {...svgProps} className={className}>
      <circle cx="12" cy="12" r={r} />
      <path d={d} fill="currentColor" stroke="none" />
    </svg>
  )
}

/** 3 ondas horizontales fluyendo en loop (stroke-dasharray/dashoffset) — repinta solo este SVG, nunca causa reflow del resto de la tarjeta. */
function OndasViento({ className }: { className?: string }) {
  const onda = (y: number) => `M0,${y} C25,${y - 12} 50,${y - 12} 75,${y} C100,${y + 12} 125,${y + 12} 150,${y} C175,${y - 12} 200,${y - 12} 225,${y} C250,${y + 12} 275,${y + 12} 300,${y}`
  const comun = { strokeWidth: 2, strokeLinecap: 'round' as const, strokeDasharray: '14 10' }
  return (
    <svg viewBox="0 0 300 64" preserveAspectRatio="none" className={className} fill="none" stroke="currentColor">
      <path d={onda(16)} {...comun} className="motion-safe:animate-[atmos-viento-flujo_3.2s_linear_infinite,atmos-pulso-opacidad_3.2s_ease-in-out_infinite]" />
      <path
        d={onda(32)}
        {...comun}
        className="motion-safe:animate-[atmos-viento-flujo_2.6s_linear_infinite,atmos-pulso-opacidad_2.6s_ease-in-out_infinite]"
        style={{ animationDelay: '0.4s, 0.4s' }}
      />
      <path
        d={onda(48)}
        {...comun}
        className="motion-safe:animate-[atmos-viento-flujo_3.8s_linear_infinite,atmos-pulso-opacidad_3.8s_ease-in-out_infinite]"
        style={{ animationDelay: '0.8s, 0.8s' }}
      />
    </svg>
  )
}

function ItemCompacto({ icono, etiqueta, valor }: { icono: ReactNode; etiqueta: string; valor: string }) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      {icono}
      <p className="font-mono text-[0.625rem] uppercase tracking-wider text-atmos-slate">{etiqueta}</p>
      <p className="font-mono text-sm text-atmos-ink">{valor}</p>
    </div>
  )
}

function FilaResumen({ icono, etiqueta, valor }: { icono: ReactNode; etiqueta: string; valor: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 shrink-0">
        {icono}
        <p className="font-sans text-sm text-atmos-slate whitespace-nowrap">{etiqueta}</p>
      </div>
      <div className="text-right">{valor}</div>
    </div>
  )
}

export function ResumenCiudad({ ciudad, clima }: Props) {
  const { current, daily, timezone_offset } = clima
  const hoy = daily[0]
  const mañana = daily[1]
  const consejo = consejoDelDia(current)
  const fase = faseLunar()
  const aire = useCalidadAire(ciudad.lat, ciudad.lon)
  const infoAire = aire.data ? calidadAireInfo(aire.data.aqi) : null
  const vientoKmh = Math.round(current.wind_speed * 3.6)

  return (
    <aside className="rounded-2xl bg-white p-6 md:p-9 shadow-[0_10px_32px_rgba(20,24,28,0.06),0_3px_8px_rgba(20,24,28,0.04)]">
      {/* A — encabezado + temperatura */}
      <p className="font-mono text-[0.8125rem] uppercase tracking-wider text-atmos-slate">
        Aujourd'hui à {ciudad.nombre}
      </p>
      <div className="flex items-baseline gap-3 mt-3">
        <p className="font-display text-[3.5rem] font-light text-atmos-ink leading-none">
          {Math.round(current.temp)}°
        </p>
        {hoy && (
          <p className="font-mono text-sm text-atmos-slate">
            {Math.round(hoy.temp.min)}°–{Math.round(hoy.temp.max)}°
          </p>
        )}
      </div>
      <p className="font-sans text-sm text-atmos-slate mt-1 capitalize">{current.weather[0]?.description}</p>

      <div className="h-px bg-atmos-slate/20 my-6" />

      {/* B — fila compacta de consulta rápida */}
      <div className="flex items-start justify-between gap-2">
        <ItemCompacto
          icono={<IconoSolMedio lado="lever" className="h-4 w-4 text-atmos-gold" />}
          etiqueta="Lever"
          valor={formatearHora(current.sunrise, timezone_offset)}
        />
        <ItemCompacto
          icono={<IconoSolMedio lado="coucher" className="h-4 w-4 text-atmos-slate" />}
          etiqueta="Coucher"
          valor={formatearHora(current.sunset, timezone_offset)}
        />
        {mañana && (
          <ItemCompacto
            icono={<IconoClima condicion={mapCondicion(mañana.weather[0].id)} className="h-4 w-4 text-atmos-slate" />}
            etiqueta="Demain"
            valor={`${Math.round(mañana.temp.max)}°`}
          />
        )}
      </div>

      <div className="h-px bg-atmos-slate/20 my-6" />

      {/* C — bloque grande: le vent actuellement */}
      <p className="font-mono text-[0.8125rem] uppercase tracking-wider text-atmos-slate">Le vent actuellement</p>
      <OndasViento className="w-full h-16 text-atmos-slate mt-3" />
      <div className="flex items-baseline gap-2 mt-2">
        <p className="font-display text-4xl font-medium text-atmos-ink">{vientoKmh} km/h</p>
        <p className="font-mono text-sm text-atmos-slate">{direccionViento(current.wind_deg)}</p>
      </div>

      <div className="h-px bg-atmos-slate/20 my-6" />

      {/* D — bloque grande: phase lunaire */}
      <p className="font-mono text-[0.8125rem] uppercase tracking-wider text-atmos-slate mb-3">Phase lunaire</p>
      <div className="flex items-center gap-4">
        <IconoLuna
          cicloFraccion={fase.cicloFraccion}
          className="h-[3.25rem] w-[3.25rem] text-atmos-slate shrink-0 motion-safe:animate-[atmos-pulso-opacidad-sutil_4s_ease-in-out_infinite]"
        />
        <p className="font-display text-[1.375rem] font-normal text-atmos-ink">{fase.nombre}</p>
      </div>

      <div className="h-px bg-atmos-slate/20 my-6" />

      {/* E — qualité de l'air, fila simple */}
      {infoAire && (
        <>
          <FilaResumen
            icono={<span className={`h-2.5 w-2.5 rounded-full ${infoAire.colorClase} shrink-0`} aria-hidden />}
            etiqueta="Qualité de l'air"
            valor={<p className="font-mono text-sm text-atmos-ink">{infoAire.etiqueta}</p>}
          />
          <div className="h-px bg-atmos-slate/20 my-6" />
        </>
      )}

      {/* F — consejo contextual */}
      <div className="flex items-start gap-3">
        <IconoConsejo tipo={consejo.tipo} className="h-5 w-5 text-atmos-gold shrink-0 mt-0.5" />
        <p className="font-sans text-sm text-atmos-ink leading-relaxed">{consejo.texto}</p>
      </div>
    </aside>
  )
}
