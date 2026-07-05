/**
 * Datos mockeados: la sección noticias no está conectada a una API real
 * todavía (decisión de alcance para evitar una tercera dependencia externa
 * con cuota en la demo de portafolio). La forma de la respuesta ya imita
 * la de un servicio real para poder sustituirla sin tocar el frontend.
 */
const PLANTILLAS = [
  { titular: (ciudad) => `Vague de chaleur : les recommandations sanitaires à ${ciudad}`, fuente: 'Météo-France' },
  { titular: (ciudad) => `Pourquoi le ciel de ${ciudad} change de couleur au coucher du soleil`, fuente: 'Le Monde Sciences' },
  { titular: (ciudad) => `${ciudad} : comment les habitants s'adaptent aux épisodes de pluie intense`, fuente: 'France Info' },
  { titular: (ciudad) => `Qualité de l'air à ${ciudad} : les chiffres de la semaine`, fuente: 'AirParif' },
  { titular: (ciudad) => `Un printemps plus précoce observé autour de ${ciudad}`, fuente: 'Reuters' },
  { titular: () => 'Comprendre l\'indice UV : ce que signifient vraiment les chiffres', fuente: 'Organisation Météorologique Mondiale' },
]

export function obtenerNoticias(nombreCiudad) {
  return PLANTILLAS.map((plantilla, indice) => ({
    id: `${nombreCiudad}-${indice}`,
    titular: plantilla.titular(nombreCiudad),
    fuente: plantilla.fuente,
    publicadoHaceHoras: 1 + indice * 3,
  }))
}
