/** Compartido entre datos-detalle e IndiceLateral (hero) — evita duplicar la lógica de umbrales. */
export function nivelUV(uvi: number): string {
  if (uvi < 3) return 'Faible'
  if (uvi < 6) return 'Modéré'
  if (uvi < 8) return 'Élevé'
  return 'Très élevé'
}
