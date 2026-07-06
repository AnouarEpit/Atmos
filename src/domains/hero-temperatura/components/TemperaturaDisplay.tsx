interface Props {
  temperatura: number
  sensacion: number
  ciudad: string
  pais: string
  descripcion: string
}

export function TemperaturaDisplay({ temperatura, sensacion, ciudad, pais, descripcion }: Props) {
  return (
    <div className="text-right text-atmos-bone">
      <p className="font-display text-[clamp(5rem,17vw,11.875rem)] font-medium leading-none tabular-nums">
        {Math.round(temperatura)}
        <span className="text-[0.32em] align-top">°</span>
      </p>
      <h1 className="font-display text-3xl md:text-4xl font-light mt-2">
        {ciudad}, {pais}
      </h1>
      <p className="font-sans text-lg text-atmos-fog mt-1 capitalize [text-shadow:0_1px_8px_rgba(0,0,0,0.6)]">
        {descripcion} · Ressenti {Math.round(sensacion)}°
      </p>
    </div>
  )
}
