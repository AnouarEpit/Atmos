import { useEffect, useState } from 'react'
import { Header } from './domains/header'
import { HeroTemperatura } from './domains/hero-temperatura'
import { Forecast } from './domains/forecast'
import { DatosDetalle } from './domains/datos-detalle'
import { Noticias } from './domains/noticias'
import { Footer } from './domains/footer'
import { ciudadPorDefecto, type Ciudad } from './lib/data/ciudades'
import { useClimaActual } from './shared/hooks/useClimaActual'
import { useLenis } from './shared/hooks/useLenis'
import { Preloader } from './shared/ui/Preloader'
import { CursorPersonalizado } from './shared/ui/CursorPersonalizado'

const prefiereReducirMovimiento = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function App() {
  useLenis()

  const [ciudadActual, setCiudadActual] = useState<Ciudad>(ciudadPorDefecto)
  const { data: clima, isLoading, isError, refetch } = useClimaActual(ciudadActual.lat, ciudadActual.lon)

  const [preloaderActivo, setPreloaderActivo] = useState(() => !prefiereReducirMovimiento())
  const [datosListos, setDatosListos] = useState(false)

  useEffect(() => {
    if (!isLoading || isError) {
      setDatosListos(true)
      return
    }
    const seguridad = setTimeout(() => setDatosListos(true), 6000)
    return () => clearTimeout(seguridad)
  }, [isLoading, isError])

  return (
    <>
      {preloaderActivo && (
        <Preloader listo={datosListos} onTerminado={() => setPreloaderActivo(false)} />
      )}
      <CursorPersonalizado />
      <Header onSeleccionarCiudad={setCiudadActual} revelado={!preloaderActivo} />
      <HeroTemperatura
        ciudad={ciudadActual}
        clima={clima}
        cargando={isLoading}
        error={isError}
        onReintentar={refetch}
        revelado={!preloaderActivo}
      />
      <Forecast dias={clima?.daily} />
      <DatosDetalle actual={clima?.current} timezoneOffset={clima?.timezone_offset} />
      <Noticias />
      <Footer />
    </>
  )
}
