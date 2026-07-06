export interface Ciudad {
  slug: string
  nombre: string
  pais: string
  lat: number
  lon: number
  /** Ruta a la foto curada estática del signature element. */
  foto: string
}

/**
 * Set curado estático: 15-20 ciudades con foto propia (sin API externa de
 * imágenes). Cubre el contexto francés/europeo y añade un par de outliers
 * climáticos (Marrakech, Reykjavik, Montréal) para mostrar el rango del
 * overlay dinámico (calor/desierto, nieve, niebla nórdica).
 */
export const ciudades: Ciudad[] = [
  { slug: 'paris', nombre: 'Paris', pais: 'France', lat: 48.8566, lon: 2.3522, foto: '/images/villes/paris.jpg' },
  { slug: 'lyon', nombre: 'Lyon', pais: 'France', lat: 45.764, lon: 4.8357, foto: '/images/villes/lyon.jpg' },
  { slug: 'marseille', nombre: 'Marseille', pais: 'France', lat: 43.2965, lon: 5.3698, foto: '/images/villes/marseille.jpg' },
  { slug: 'bordeaux', nombre: 'Bordeaux', pais: 'France', lat: 44.8378, lon: -0.5792, foto: '/images/villes/bordeaux.jpg' },
  { slug: 'nice', nombre: 'Nice', pais: 'France', lat: 43.7102, lon: 7.262, foto: '/images/villes/nice.jpg' },
  { slug: 'strasbourg', nombre: 'Strasbourg', pais: 'France', lat: 48.5734, lon: 7.7521, foto: '/images/villes/strasbourg.jpg' },
  { slug: 'londres', nombre: 'Londres', pais: 'Royaume-Uni', lat: 51.5074, lon: -0.1278, foto: '/images/villes/londres.jpg' },
  { slug: 'berlin', nombre: 'Berlin', pais: 'Allemagne', lat: 52.52, lon: 13.405, foto: '/images/villes/berlin.jpg' },
  { slug: 'madrid', nombre: 'Madrid', pais: 'Espagne', lat: 40.4168, lon: -3.7038, foto: '/images/villes/madrid.svg' },
  { slug: 'rome', nombre: 'Rome', pais: 'Italie', lat: 41.9028, lon: 12.4964, foto: '/images/villes/rome.svg' },
  { slug: 'amsterdam', nombre: 'Amsterdam', pais: 'Pays-Bas', lat: 52.3676, lon: 4.9041, foto: '/images/villes/amsterdam.svg' },
  { slug: 'lisbonne', nombre: 'Lisbonne', pais: 'Portugal', lat: 38.7223, lon: -9.1393, foto: '/images/villes/lisbonne.svg' },
  { slug: 'bruxelles', nombre: 'Bruxelles', pais: 'Belgique', lat: 50.8503, lon: 4.3517, foto: '/images/villes/bruxelles.svg' },
  { slug: 'geneve', nombre: 'Genève', pais: 'Suisse', lat: 46.2044, lon: 6.1432, foto: '/images/villes/geneve.svg' },
  { slug: 'vienne', nombre: 'Vienne', pais: 'Autriche', lat: 48.2082, lon: 16.3738, foto: '/images/villes/vienne.svg' },
  { slug: 'copenhague', nombre: 'Copenhague', pais: 'Danemark', lat: 55.6761, lon: 12.5683, foto: '/images/villes/copenhague.svg' },
  { slug: 'reykjavik', nombre: 'Reykjavik', pais: 'Islande', lat: 64.1466, lon: -21.9426, foto: '/images/villes/reykjavik.svg' },
  { slug: 'marrakech', nombre: 'Marrakech', pais: 'Maroc', lat: 31.6295, lon: -7.9811, foto: '/images/villes/marrakech.svg' },
  { slug: 'montreal', nombre: 'Montréal', pais: 'Canada', lat: 45.5017, lon: -73.5673, foto: '/images/villes/montreal.svg' },
]

export const ciudadPorSlug = (slug: string): Ciudad | undefined =>
  ciudades.find((c) => c.slug === slug)

export const ciudadPorDefecto = ciudades[0]
