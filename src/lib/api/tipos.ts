export interface CondicionClima {
  id: number
  main: string
  description: string
  icon: string
}

export interface ClimaActual {
  dt: number
  sunrise: number
  sunset: number
  temp: number
  feels_like: number
  humidity: number
  pressure: number
  uvi: number
  wind_speed: number
  wind_deg: number
  weather: CondicionClima[]
}

export interface ClimaDiario {
  dt: number
  temp: { min: number; max: number }
  weather: CondicionClima[]
  uvi: number
  wind_speed: number
  humidity: number
  pressure: number
}

export interface RespuestaClima {
  lat: number
  lon: number
  timezone: string
  timezone_offset: number
  current: ClimaActual
  daily: ClimaDiario[]
}
