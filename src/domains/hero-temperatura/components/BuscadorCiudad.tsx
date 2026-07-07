import { useState } from 'react'
import { ciudades, type Ciudad } from '../../../lib/data/ciudades'

interface Props {
  onSeleccionar: (ciudad: Ciudad) => void
}

export function BuscadorCiudad({ onSeleccionar }: Props) {
  const [consulta, setConsulta] = useState('')
  const [abierto, setAbierto] = useState(false)

  const consultaLimpia = consulta.trim()
  const resultados = consultaLimpia
    ? ciudades.filter((ciudad) => ciudad.nombre.toLowerCase().includes(consultaLimpia.toLowerCase()))
    : ciudades
  // El set de ciudades es curado (fotos reales, no una API externa) — si la búsqueda no
  // matchea ninguna, en vez de dejar el dropdown vacío en silencio, se avisa explícitamente
  // y se ofrece la lista completa como alternativa.
  const sinResultados = resultados.length === 0 && consultaLimpia.length > 0
  const listaAMostrar = sinResultados ? ciudades : resultados

  return (
    <div
      className="relative mt-16 ml-auto max-w-sm"
      onBlur={(evento) => {
        // Cierra solo si el foco salió de TODO el widget (input + dropdown), no al moverse
        // entre ellos con Tab — con el timeout anterior, tabular desde el input cerraba el
        // dropdown antes de que el foco pudiera llegar a un resultado (inalcanzable por teclado).
        if (!evento.currentTarget.contains(evento.relatedTarget)) {
          setAbierto(false)
        }
      }}
    >
      <div className="flex items-center gap-3 border-b border-atmos-bone/40 pb-2 transition-colors duration-200 ease-out hover:border-atmos-bone/70 focus-within:border-atmos-gold">
        <input
          aria-label="Rechercher une ville"
          value={consulta}
          onChange={(evento) => {
            setConsulta(evento.target.value)
            setAbierto(true)
          }}
          onFocus={() => setAbierto(true)}
          // El pointerdown+preventDefault() de los ítems del dropdown evita que el input
          // pierda foco al seleccionar (esquiva la carrera con blur) — pero eso significa
          // que el input queda enfocado, así que un tap/click posterior no dispara onFocus
          // de nuevo (el navegador solo lo dispara en una transición real de foco). onClick
          // cubre ese caso: se dispara igual aunque el input ya estuviera enfocado.
          onClick={() => setAbierto(true)}
          placeholder="Rechercher une ville…"
          className="w-full bg-transparent py-2 font-sans text-atmos-bone placeholder:text-atmos-bone/50 outline-none md:py-0"
        />
        <span aria-hidden className="text-atmos-bone/70">
          ⌕
        </span>
      </div>
      {abierto && listaAMostrar.length > 0 && (
        <ul
          data-lenis-prevent
          className="scrollbar-fina absolute inset-x-0 top-full mt-2 max-h-32 w-auto overflow-auto rounded-2xl border border-atmos-bone/10 bg-atmos-ink/25 shadow-[0_16px_32px_rgba(0,0,0,0.2)] backdrop-blur-2xl md:inset-x-auto md:top-0 md:right-full md:mt-0 md:mr-3 md:max-h-72 md:w-64"
        >
          {sinResultados && (
            <li className="border-b border-atmos-bone/10 px-4 py-3 font-sans text-xs text-atmos-bone/80 [text-shadow:0_1px_6px_rgba(0,0,0,0.6)]">
              Aucun résultat pour « {consultaLimpia} » — parmi les villes disponibles :
            </li>
          )}
          {listaAMostrar.map((ciudad) => (
            <li key={ciudad.slug}>
              <button
                type="button"
                onPointerDown={(evento) => {
                  // iOS Safari/Chrome (WebKit): el blur del input en un tap a veces llega sin
                  // relatedTarget seteado, así que el guard de abajo no detecta que el foco
                  // se movió DENTRO del widget y cierra la lista antes de que el click llegue
                  // a disparar. pointerdown ocurre antes que blur en cualquier navegador/input
                  // (mouse o touch), así que la selección ya pasó para cuando blur reacciona.
                  evento.preventDefault()
                  onSeleccionar(ciudad)
                  setConsulta('')
                  setAbierto(false)
                }}
                onClick={() => {
                  // Mantenido para activación por teclado (Enter/Espacio), que dispara click
                  // directo sin pasar por pointerdown.
                  onSeleccionar(ciudad)
                  setConsulta('')
                  setAbierto(false)
                }}
                className="block w-full text-left px-5 py-3 font-sans text-base tracking-tight text-atmos-bone transition-colors duration-150 ease-out [text-shadow:0_1px_8px_rgba(0,0,0,0.7)] hover:bg-atmos-bone/10 focus-visible:bg-atmos-bone/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-atmos-gold"
              >
                {ciudad.nombre}, {ciudad.pais}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
