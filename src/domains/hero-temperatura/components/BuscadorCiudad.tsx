import { useEffect, useRef, useState } from 'react'
import { ciudades, type Ciudad } from '../../../lib/data/ciudades'

interface Props {
  onSeleccionar: (ciudad: Ciudad) => void
}

export function BuscadorCiudad({ onSeleccionar }: Props) {
  const [consulta, setConsulta] = useState('')
  const [abierto, setAbierto] = useState(false)
  const cierreTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Evita que un timeout de un blur anterior (nunca cancelado) cierre un dropdown reabierto para otra búsqueda.
  useEffect(() => () => {
    if (cierreTimeoutRef.current) clearTimeout(cierreTimeoutRef.current)
  }, [])

  const resultados = consulta.trim()
    ? ciudades.filter((ciudad) => ciudad.nombre.toLowerCase().includes(consulta.trim().toLowerCase()))
    : ciudades

  return (
    <div className="relative mt-16 ml-auto max-w-sm">
      <div className="flex items-center gap-3 border-b border-atmos-bone/40 pb-2 transition-colors duration-200 ease-out hover:border-atmos-bone/70 focus-within:border-atmos-gold">
        <input
          value={consulta}
          onChange={(evento) => {
            setConsulta(evento.target.value)
            setAbierto(true)
          }}
          onFocus={() => {
            if (cierreTimeoutRef.current) clearTimeout(cierreTimeoutRef.current)
            setAbierto(true)
          }}
          onBlur={() => {
            if (cierreTimeoutRef.current) clearTimeout(cierreTimeoutRef.current)
            cierreTimeoutRef.current = setTimeout(() => setAbierto(false), 100)
          }}
          placeholder="Rechercher une ville…"
          className="w-full bg-transparent font-sans text-atmos-bone placeholder:text-atmos-bone/50 outline-none"
        />
        <span aria-hidden className="text-atmos-bone/70">
          ⌕
        </span>
      </div>
      {abierto && resultados.length > 0 && (
        <ul className="absolute mt-2 w-full max-h-64 overflow-auto bg-atmos-ink/90 backdrop-blur-sm">
          {resultados.map((ciudad) => (
            <li key={ciudad.slug}>
              <button
                type="button"
                onMouseDown={(evento) => {
                  // mousedown se dispara antes que el blur del input — preventDefault evita
                  // que el input pierda el foco y dispare el cierre del dropdown a mitad del clic.
                  evento.preventDefault()
                  if (cierreTimeoutRef.current) clearTimeout(cierreTimeoutRef.current)
                  onSeleccionar(ciudad)
                  setConsulta('')
                  setAbierto(false)
                }}
                className="block w-full text-left px-4 py-2 font-sans text-atmos-bone transition-colors duration-150 ease-out hover:bg-atmos-bone/10"
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
