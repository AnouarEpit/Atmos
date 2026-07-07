import { useEffect, useState } from 'react'

interface Props {
  contenedorRef: React.RefObject<HTMLDivElement | null>
  valores: number[]
  minimo: number
  maximo: number
}

interface Punto {
  x: number
  y: number
}

/** Catmull-Rom → Bézier cúbico: curva suave que realmente pasa por cada punto. */
function pathSuave(puntos: Punto[]): string {
  if (puntos.length < 2) return ''
  let d = `M${puntos[0].x},${puntos[0].y}`
  for (let i = 0; i < puntos.length - 1; i++) {
    const p0 = puntos[i - 1] ?? puntos[i]
    const p1 = puntos[i]
    const p2 = puntos[i + 1]
    const p3 = puntos[i + 2] ?? p2
    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6
    d += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`
  }
  return d
}

/**
 * Sparkline real (altura por temperatura, no por layout) — centrada en el
 * centro vertical REAL de cada tarjeta (medido, no un número fijo a ojo):
 * un día con temperatura promedio de la semana cae exactamente al centro,
 * más cálido sube, más frío baja. Flujo continuo reutilizando el mismo
 * keyframe que las ondas de viento de ResumenCiudad (atmos-viento-flujo),
 * en vez de duplicar la animación.
 */
export function SparklineSemana({ contenedorRef, valores, minimo, maximo }: Props) {
  const [estado, setEstado] = useState<{ d: string; width: number; height: number } | null>(null)

  useEffect(() => {
    const contenedor = contenedorRef.current
    if (!contenedor) return
    const tarjetas = Array.from(contenedor.children).filter(
      (hijo): hijo is HTMLElement => hijo instanceof HTMLElement,
    )
    if (tarjetas.length < 2) return
    const contRect = contenedor.getBoundingClientRect()
    const rango = maximo - minimo || 1
    const ALTO_BANDA = 90

    const puntos = tarjetas.map((tarjeta, i) => {
      const rect = tarjeta.getBoundingClientRect()
      const x = rect.left + rect.width / 2 - contRect.left
      const centroTarjeta = rect.top + rect.height / 2 - contRect.top
      const yNormalizada = (valores[i] - minimo) / rango
      const y = centroTarjeta - (yNormalizada - 0.5) * ALTO_BANDA
      return { x, y }
    })

    setEstado({ d: pathSuave(puntos), width: contRect.width, height: contRect.height })
  }, [contenedorRef, valores, minimo, maximo])

  if (!estado) return null

  return (
    <svg className="absolute inset-0 z-0" width={estado.width} height={estado.height}>
      <defs>
        <linearGradient id="sparkline-semana-gradiente" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#c0973a" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#c0973a" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#c0973a" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <path
        d={estado.d}
        fill="none"
        stroke="url(#sparkline-semana-gradiente)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="14 10"
        className="animate-[atmos-viento-flujo_2.8s_linear_infinite]"
      />
    </svg>
  )
}
