interface Props {
  /** Fade-in escalonado tras el Preloader. Va en la propia raíz `absolute` (un wrapper con `transform` crearía un containing block nuevo y rompería el posicionamiento). */
  revelado?: boolean
}

export function IndicadorScroll({ revelado }: Props) {
  const estilo =
    revelado === undefined
      ? undefined
      : {
          opacity: revelado ? 1 : 0,
          transform: revelado ? 'translateY(0)' : 'translateY(14px)',
          transition: 'opacity 700ms cubic-bezier(0.16, 1, 0.3, 1), transform 700ms cubic-bezier(0.16, 1, 0.3, 1)',
          transitionDelay: '500ms',
        }

  return (
    <div
      className="absolute bottom-8 left-6 z-10 flex items-center gap-1.5 font-sans text-[0.8125rem] text-atmos-bone/80 md:left-10"
      style={estilo}
    >
      <span>Défiler</span>
      <span aria-hidden className="inline-block animate-[atmos-flecha-flotar_2.8s_ease-in-out_infinite]">
        ↓
      </span>
    </div>
  )
}
