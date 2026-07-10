import type { ClimaActual } from '../../lib/api/tipos'
import { nivelUV, direccionViento, formatearHora } from '../../lib/clima/formato'
import { bucketHoraLocal } from '../../lib/clima/horaLocal'
import { consejoDelDia } from '../../lib/clima/consejo'
import { useRevelarEnScroll } from '../../shared/hooks/useRevelarEnScroll'
import { IconoConsejo } from '../../shared/ui/IconoConsejo'
import { IconoSolMedio } from '../../shared/ui/IconoSolMedio'
import { IconoAnimado } from './components/IconoAnimado'
import { RecuadroAtmosferico } from './components/RecuadroAtmosferico'
import { FilaZen } from './components/FilaZen'
import { EstadisticaDesktop } from './components/EstadisticaDesktop'
import { FormasAtmosfericas } from './components/FormasAtmosfericas'
import { SubrayadoAnimado } from './components/SubrayadoAnimado'
import { useEscalaPanel } from './hooks/useEscalaPanel'

interface Props {
  actual?: ClimaActual
  /** Mismo timezone_offset que usa el hero — decide si RecuadroAtmosferico muestra el video de día o de noche. */
  timezoneOffset?: number
}

export function DatosDetalle({ actual, timezoneOffset = 0 }: Props) {
  const revelarTitulo = useRevelarEnScroll<HTMLHeadingElement>({ y: 24, start: 'top 92%', end: 'top 68%' })
  const revelarSubtitulo = useRevelarEnScroll<HTMLParagraphElement>({ y: 20, start: 'top 90%', end: 'top 64%' })
  // activarEn: revelarDesktop/revelarMobile viven en wrappers hidden md:flex / md:hidden —
  // sin esto, la mitad invisible seguía calculando su ScrollTrigger en cada scroll igual
  // (ver hallazgo bug scroll trackpad laptop, sesión 2026-07-10).
  const revelarDesktop = useRevelarEnScroll<HTMLDivElement>({ start: 'top 85%', end: 'top 50%', activarEn: 'desktop' })
  const revelarMobile = useRevelarEnScroll<HTMLDivElement>({ start: 'top 85%', end: 'top 50%', activarEn: 'mobile' })
  const escalaPanel = useEscalaPanel<HTMLDivElement>()

  if (!actual) return null

  const esNoche = bucketHoraLocal(timezoneOffset) === 'nuit'
  const consejo = consejoDelDia(actual)

  return (
    <section className="relative isolate bg-atmos-bone px-6 md:px-10 py-16">
      <FormasAtmosfericas />
      {/* Panel flotante solo desktop: bg-atmos-sable + esquinas redondeadas, con margen de atmos-bone alrededor (-mx-6 + padding propio). En mobile estas clases no aplican — layout idéntico al de antes. ref: crece al entrar en viewport y se encoge al salir hacia Noticias (useEscalaPanel, solo desktop vía gsap.matchMedia). */}
      <div ref={escalaPanel} className="md:relative md:z-10 md:mx-4 md:rounded-[2.5rem] md:bg-atmos-sable md:px-14 md:py-16">
      <h2 ref={revelarTitulo} className="font-display text-[2rem] font-light text-atmos-ink text-center">
        Conditions <SubrayadoAnimado />
      </h2>
      <p ref={revelarSubtitulo} className="font-sans text-sm text-atmos-slate text-center mt-3 mb-10">
        Détails en temps réel pour aujourd'hui
      </p>

      {/* Desktop: video real + grid 2×2 de estadísticas + consejo — fundido en bg-atmos-bone, sin marco de tarjeta */}
      <div ref={revelarDesktop} className="hidden md:flex gap-16 justify-center items-start">
        <RecuadroAtmosferico esNoche={esNoche} grande />
        <div className="flex w-[28rem] flex-col gap-8 pt-1">
          <div className="grid grid-cols-2 gap-x-12 gap-y-8">
            <EstadisticaDesktop
              etiqueta="UV"
              valor={String(Math.round(actual.uvi))}
              detalle={nivelUV(actual.uvi)}
              icono={<IconoAnimado tipo="uv" className="h-5 w-5 text-atmos-gold" />}
            />
            <EstadisticaDesktop
              etiqueta="Vent"
              valor={`${Math.round(actual.wind_speed * 3.6)} km/h`}
              detalle={direccionViento(actual.wind_deg)}
              icono={<IconoAnimado tipo="vent" className="h-5 w-5 text-atmos-slate" />}
            />
            <EstadisticaDesktop
              etiqueta="Humidité"
              valor={`${actual.humidity}%`}
              icono={<IconoAnimado tipo="humidite" className="h-5 w-5 text-atmos-slate" />}
            />
            <EstadisticaDesktop
              etiqueta="Pression"
              valor={`${actual.pressure} hPa`}
              icono={<IconoAnimado tipo="pression" className="h-5 w-5 text-atmos-slate" />}
            />
          </div>
          <div className="border-t border-atmos-slate/20" />
          <div className="flex items-start gap-3">
            <IconoConsejo tipo={consejo.tipo} className="h-5 w-5 text-atmos-gold shrink-0 mt-0.5" />
            <p className="font-sans text-sm text-atmos-ink leading-relaxed">{consejo.texto}</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <IconoSolMedio lado="lever" className="h-5 w-5 shrink-0 text-atmos-gold" />
              <p className="font-sans text-sm text-atmos-ink">Lever {formatearHora(actual.sunrise, timezoneOffset)}</p>
            </div>
            <div className="flex items-center gap-2">
              <IconoSolMedio lado="coucher" className="h-5 w-5 shrink-0 text-atmos-slate" />
              <p className="font-sans text-sm text-atmos-ink">Coucher {formatearHora(actual.sunset, timezoneOffset)}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <IconoAnimado tipo="ressenti" className="h-5 w-5 shrink-0 mt-0.5 text-atmos-slate" />
            <p className="font-sans text-sm text-atmos-ink leading-relaxed">Ressenti {Math.round(actual.feels_like)}°</p>
          </div>
        </div>
      </div>

      {/* Mobile: variante "Zen" — recuadro atmosférico + lista de datos (sin cambios) */}
      <div ref={revelarMobile} className="flex gap-[1.4rem] md:hidden max-w-sm mx-auto">
        <RecuadroAtmosferico esNoche={esNoche} />
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-[1.2rem] py-1">
          <FilaZen
            etiqueta="UV"
            valor={String(Math.round(actual.uvi))}
            detalle={nivelUV(actual.uvi)}
            icono={<IconoAnimado tipo="uv" className="h-5 w-5 text-atmos-gold" />}
          />
          <FilaZen
            etiqueta="Vent"
            valor={`${Math.round(actual.wind_speed * 3.6)} km/h`}
            detalle={direccionViento(actual.wind_deg)}
            icono={<IconoAnimado tipo="vent" className="h-5 w-5 text-atmos-slate" />}
          />
          <FilaZen
            etiqueta="Humidité"
            valor={`${actual.humidity}%`}
            icono={<IconoAnimado tipo="humidite" className="h-5 w-5 text-atmos-slate" />}
          />
          <FilaZen
            etiqueta="Pression"
            valor={`${actual.pressure} hPa`}
            icono={<IconoAnimado tipo="pression" className="h-5 w-5 text-atmos-slate" />}
          />
        </div>
      </div>

      <p className="mt-10 font-mono text-[0.6875rem] text-atmos-slate/70 text-center md:text-left">
        Données météo :{' '}
        <a
          href="https://open-meteo.com"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-2 hover:text-atmos-slate"
        >
          Open-Meteo.com
        </a>
      </p>
      </div>
    </section>
  )
}
