interface Props {
  temperatura: number
  sensacion: number
  ciudad: string
  pais: string
  descripcion: string
}

export function TemperaturaDisplay({ temperatura, sensacion, ciudad, pais, descripcion }: Props) {
  return (
    <div className="text-atmos-bone">
      <p className="font-display text-[clamp(6rem,20vw,13rem)] font-light leading-none tabular-nums">
        {Math.round(temperatura)}
        <span className="text-[0.32em] align-top">°</span>
      </p>
      <h1 className="font-display text-3xl md:text-4xl mt-2">
        {ciudad}, {pais}
      </h1>
      <p className="font-sans text-lg text-atmos-fog mt-1 capitalize">
        {descripcion} · Ressenti {Math.round(sensacion)}°
      </p>
    </div>
  )
}
