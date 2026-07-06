/**
 * Datos mockeados: la sección noticias no está conectada a una API real
 * todavía (decisión de alcance para evitar una tercera dependencia externa
 * con cuota en la demo de portafolio). La forma de la respuesta ya imita
 * la de un servicio real para poder sustituirla sin tocar el frontend.
 */
const PLANTILLAS = [
  {
    categoria: 'Santé',
    titular: (c) => `Vague de chaleur : les recommandations sanitaires à ${c}`,
    extracto: (c) => `Les autorités appellent à la vigilance face aux fortes températures attendues cette semaine à ${c}.`,
    fuente: 'Météo-France',
  },
  {
    categoria: 'Science',
    titular: (c) => `Pourquoi le ciel de ${c} change de couleur au coucher du soleil`,
    extracto: () => `La diffusion de la lumière dans l'atmosphère explique ces teintes changeantes observées chaque soir.`,
    fuente: 'Le Monde Sciences',
  },
  {
    categoria: 'Société',
    titular: (c) => `${c} : comment les habitants s'adaptent aux épisodes de pluie intense`,
    extracto: (c) => `Entre infrastructures repensées et nouveaux réflexes du quotidien, ${c} apprend à vivre avec des pluies plus intenses.`,
    fuente: 'France Info',
  },
  {
    categoria: 'Environnement',
    titular: (c) => `Qualité de l'air à ${c} : les chiffres de la semaine`,
    extracto: () => `Les niveaux de particules fines restent globalement stables, avec quelques pics ponctuels relevés en centre-ville.`,
    fuente: 'AirParif',
  },
  {
    categoria: 'Climat',
    titular: (c) => `Un printemps plus précoce observé autour de ${c}`,
    extracto: () => `Les relevés des dix dernières années confirment une avancée progressive des beaux jours dès la fin février.`,
    fuente: 'Reuters',
  },
  {
    categoria: 'Météo',
    titular: () => "Comprendre l'indice UV : ce que signifient vraiment les chiffres",
    extracto: () => `De 1 à 11+, l'indice UV mesure l'intensité du rayonnement solaire et guide les bons réflexes de protection.`,
    fuente: 'Organisation Météorologique Mondiale',
  },
]

export function obtenerNoticias(nombreCiudad) {
  const ahora = Date.now()
  return PLANTILLAS.map((plantilla, indice) => {
    const horas = 1 + indice * 3
    return {
      id: `${nombreCiudad}-${indice}`,
      categoria: plantilla.categoria,
      titular: plantilla.titular(nombreCiudad),
      extracto: plantilla.extracto(nombreCiudad),
      fuente: plantilla.fuente,
      publicadoHaceHoras: horas,
      publicadoEn: new Date(ahora - horas * 3600 * 1000).toISOString(),
    }
  })
}
