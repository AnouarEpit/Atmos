import { useState } from 'react'
import { Header } from './domains/header'
import { HeroTemperatura } from './domains/hero-temperatura'
import { Forecast } from './domains/forecast'
import { DatosDetalle } from './domains/datos-detalle'
import { Noticias } from './domains/noticias'
import { ciudadPorDefecto, type Ciudad } from './lib/data/ciudades'
import { useClimaActual } from './shared/hooks/useClimaActual'
import { useLenis } from './shared/hooks/useLenis'

export default function App() {
  useLenis()

  const [ciudadActual, setCiudadActual] = useState<Ciudad>(ciudadPorDefecto)
  const { data: clima, isLoading, isError, refetch } = useClimaActual(ciudadActual.lat, ciudadActual.lon)

  return (
    <>
      <Header />
      <HeroTemperatura
        ciudad={ciudadActual}
        clima={clima}
        cargando={isLoading}
        error={isError}
        onReintentar={refetch}
        onSeleccionarCiudad={setCiudadActual}
      />
      <Forecast dias={clima?.daily} />
      <DatosDetalle actual={clima?.current} />
      <Noticias ciudad={ciudadActual} clima={clima} />
    </>
  )
}
