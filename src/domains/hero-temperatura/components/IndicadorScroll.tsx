export function IndicadorScroll() {
  return (
    <div className="absolute bottom-8 left-6 z-10 flex items-center gap-1.5 font-sans text-[0.8125rem] text-atmos-bone/80 md:left-10">
      <span>Défiler</span>
      <span aria-hidden className="inline-block animate-[atmos-flecha-flotar_2.8s_ease-in-out_infinite]">
        ↓
      </span>
    </div>
  )
}
