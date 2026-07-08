import { useState } from 'react'
import { ciudades, ciudadPorSlug, type Ciudad } from '../../../lib/data/ciudades'

const CLAVE_RECIENTES = 'atmos-ciudades-recientes'
const MAX_RECIENTES = 4

function leerRecientes(): string[] {
  try {
    const guardado = localStorage.getItem(CLAVE_RECIENTES)
    return guardado ? JSON.parse(guardado) : []
  } catch {
    return []
  }
}

function guardarReciente(slug: string) {
  const actuales = leerRecientes().filter((s) => s !== slug)
  try {
    localStorage.setItem(CLAVE_RECIENTES, JSON.stringify([slug, ...actuales].slice(0, MAX_RECIENTES)))
  } catch {
    // localStorage puede fallar en modo privado — la búsqueda sigue funcionando sin "récentes"
  }
}

/**
 * Lógica de búsqueda compartida entre OverlayBusqueda (desktop) y el menú
 * mobile — evita duplicar el filtrado/estado/récentes en dos componentes.
 * El estado de visibilidad (abierto/cerrado de cada uno) NO vive acá, cada
 * componente lo maneja según su propia mecánica de apertura/cierre.
 */
export function useBusquedaCiudades(onSeleccionar: (ciudad: Ciudad) => void) {
  const [consulta, setConsulta] = useState('')
  const [recientes, setRecientes] = useState<string[]>(() => leerRecientes())

  const consultaLimpia = consulta.trim()
  const resultados = consultaLimpia
    ? ciudades.filter((ciudad) => ciudad.nombre.toLowerCase().includes(consultaLimpia.toLowerCase()))
    : ciudades
  const sinResultados = resultados.length === 0 && consultaLimpia.length > 0
  const listaAMostrar = sinResultados ? ciudades : resultados

  const ciudadesRecientes = recientes
    .map((slug) => ciudadPorSlug(slug))
    .filter((c): c is Ciudad => c !== undefined)

  function seleccionarCiudad(ciudad: Ciudad) {
    onSeleccionar(ciudad)
    setConsulta('')
    guardarReciente(ciudad.slug)
    setRecientes(leerRecientes())
  }

  return {
    consulta,
    setConsulta,
    consultaLimpia,
    resultados: listaAMostrar,
    sinResultados,
    ciudadesRecientes,
    seleccionarCiudad,
  }
}
