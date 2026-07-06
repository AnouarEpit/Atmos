/**
 * Verifica que el texto del hero (índice lateral + bloque de temperatura)
 * sea legible sobre la foto de una ciudad dada, usando los mismos scrims
 * fijos definidos en FondoDinamico.tsx.
 *
 * Requiere: `npm run dev` (frontend en :5173) y el backend en :3001 corriendo.
 *
 * Uso rápido (recomendado para una foto nueva) — solo el peor caso conocido
 * hasta ahora (despejado + pleno día):
 *   node scripts/verificar-contraste-hero.mjs <slug> <lat> <lon>
 *
 * Uso completo — 6 climas × 2 horas, más lento, para revisiones a fondo:
 *   node scripts/verificar-contraste-hero.mjs <slug> <lat> <lon> --full
 *
 * Ejemplo:
 *   node scripts/verificar-contraste-hero.mjs marrakech 31.6295 -7.9811 --full
 */
import { chromium } from 'playwright'
import { PNG } from 'pngjs'
import { readFileSync } from 'node:fs'

const [slug, latArg, lonArg, flag] = process.argv.slice(2)
if (!slug || !latArg || !lonArg) {
  console.error('Uso: node scripts/verificar-contraste-hero.mjs <slug> <lat> <lon> [--full]')
  process.exit(1)
}
const lat = Number(latArg)
const lon = Number(lonArg)
const completo = flag === '--full'

const ahora = Math.floor(Date.now() / 1000)

function offsetParaHoraLocal(horaObjetivo) {
  const nowUtc = new Date()
  const horaUtc = nowUtc.getUTCHours() + nowUtc.getUTCMinutes() / 60
  let diff = ((horaObjetivo - horaUtc) % 24 + 24) % 24
  if (diff > 12) diff -= 24
  return Math.round(diff * 3600)
}

function mockClima({ weatherId, timezone_offset }) {
  return {
    lat, lon, timezone: 'auto', timezone_offset,
    current: {
      dt: ahora, sunrise: ahora - 18000, sunset: ahora + 18000,
      temp: 18, feels_like: 16, humidity: 58, pressure: 1013, uvi: 4.2,
      wind_speed: 3.3, wind_deg: 300,
      weather: [{ id: weatherId, main: 'x', description: 'ciel dégagé', icon: 'x' }],
    },
    daily: Array.from({ length: 7 }, () => ({
      dt: ahora, temp: { min: 10, max: 20 },
      weather: [{ id: weatherId, main: 'x', description: 'x', icon: 'x' }],
      uvi: 3, wind_speed: 3, humidity: 55, pressure: 1010,
    })),
  }
}

// despejado+jour ha sido el peor caso en cada ronda de verificación hecha hasta ahora
// (cielo despejado a pleno día = mínimo oscurecimiento dinámico). --full agrega el resto.
const CONDICIONES_RAPIDO = { despejado: 800 }
const CONDICIONES_COMPLETO = { despejado: 800, nubes: 802, lluvia: 501, tormenta: 200, nieve: 601, niebla: 741 }
const CONDICIONES = completo ? CONDICIONES_COMPLETO : CONDICIONES_RAPIDO
const HORAS = completo ? [['jour', 13], ['nuit', 22]] : [['jour', 13]]

function luminanciaRelativa([r, g, b]) {
  const canal = (c) => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4 }
  return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b)
}
function contraste(rgbA, rgbB) {
  const la = luminanciaRelativa(rgbA), lb = luminanciaRelativa(rgbB)
  const [claro, oscuro] = la > lb ? [la, lb] : [lb, la]
  return (claro + 0.05) / (oscuro + 0.05)
}

const ATMOS_BONE = [244, 239, 230]
const ATMOS_FOG = [184, 194, 201]
const ATMOS_GOLD = [192, 151, 58]
const UMBRAL_AA = 4.5

function mediana(valores) {
  const ordenados = [...valores].sort((a, b) => a - b)
  return ordenados[Math.floor(ordenados.length / 2)]
}

/** Muestrea justo arriba de la línea de texto (no en su centro) para no caer sobre el trazo de una letra. */
function muestrearParche(png, x, y) {
  const canalR = [], canalG = [], canalB = []
  for (let dy = -3; dy <= 3; dy++) {
    for (let dx = -3; dx <= 3; dx++) {
      const px = Math.max(0, Math.min(png.width - 1, Math.round(x) + dx))
      const py = Math.max(0, Math.min(png.height - 1, Math.round(y) + dy))
      const idx = (png.width * py + px) << 2
      canalR.push(png.data[idx]); canalG.push(png.data[idx + 1]); canalB.push(png.data[idx + 2])
    }
  }
  return [mediana(canalR), mediana(canalG), mediana(canalB)]
}

const browser = await chromium.launch({ args: ['--no-sandbox'] })
const filas = []

for (const [nombreCondicion, weatherId] of Object.entries(CONDICIONES)) {
  for (const [nombreHora, horaObjetivo] of HORAS) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
    const timezone_offset = offsetParaHoraLocal(horaObjetivo)
    await page.route(/\/api\/clima\?/, (route) =>
      route.fulfill({ contentType: 'application/json', body: JSON.stringify(mockClima({ weatherId, timezone_offset })) }),
    )
    await page.goto('http://localhost:5173', { waitUntil: 'domcontentloaded' })
    await page.waitForSelector('input[placeholder="Rechercher une ville…"]')
    await page.click('input[placeholder="Rechercher une ville…"]')
    await page.fill('input[placeholder="Rechercher une ville…"]', slug)
    await page.click(`li button:has-text("${slug}")`, { timeout: 5000 }).catch(() => {})
    await page.waitForSelector('text=Ressenti', { timeout: 15000 })
    await page.waitForTimeout(800)

    const puntos = []
    for (let i = 1; i <= 4; i++) {
      const label = page.locator(`text=/^0${i} ·/`)
      const valor = label.locator('xpath=following-sibling::p[1]')
      const bLabel = await label.boundingBox()
      const bValor = await valor.boundingBox()
      if (bLabel) puntos.push({ nombre: `indice-0${i}-label`, x: bLabel.x + bLabel.width / 2, y: bLabel.y - Math.max(5, bLabel.height * 0.35), color: ATMOS_GOLD })
      if (bValor) puntos.push({ nombre: `indice-0${i}-valor`, x: bValor.x + bValor.width / 2, y: bValor.y - Math.max(5, bValor.height * 0.35), color: ATMOS_BONE })
    }
    const h1 = page.locator('#accueil h1')
    const bH1 = await h1.boundingBox()
    if (bH1) puntos.push({ nombre: 'ciudad-nombre', x: bH1.x + bH1.width / 2, y: bH1.y - Math.max(5, bH1.height * 0.35), color: ATMOS_BONE })

    const numeral = h1.locator('xpath=preceding-sibling::p[1]')
    const bNumeral = await numeral.boundingBox()
    if (bNumeral) puntos.push({ nombre: 'temp-numeral', x: bNumeral.x + bNumeral.width / 2, y: bNumeral.y - Math.max(5, bNumeral.height * 0.35), color: ATMOS_BONE })

    const descripcion = h1.locator('xpath=following-sibling::p[1]')
    const bDesc = await descripcion.boundingBox()
    if (bDesc) puntos.push({ nombre: 'descripcion', x: bDesc.x + bDesc.width / 2, y: bDesc.y - Math.max(5, bDesc.height * 0.35), color: ATMOS_FOG })

    const archivo = `/tmp/verif-${slug}-${nombreCondicion}-${nombreHora}.png`
    await page.screenshot({ path: archivo })
    console.log(`captura: ${archivo}`)
    const png = PNG.sync.read(readFileSync(archivo))

    for (const p of puntos) {
      const rgb = muestrearParche(png, p.x, p.y)
      filas.push({ condicion: nombreCondicion, hora: nombreHora, nombre: p.nombre, rgb, contraste: contraste(rgb, p.color) })
    }
    await page.close()
  }
}
await browser.close()

console.log(`\n=== ${slug} — ${completo ? 'verificación completa (6 climas × 2 horas)' : 'verificación rápida (despejado + jour)'} ===`)
let huboFallo = false
for (const f of filas) {
  const estado = f.contraste >= UMBRAL_AA ? 'OK ' : 'FALLA'
  if (f.contraste < UMBRAL_AA) huboFallo = true
  console.log(`${estado.padEnd(6)} ${f.nombre.padEnd(18)} ${f.condicion}/${f.hora}  contraste=${f.contraste.toFixed(2)}`)
}
console.log(huboFallo ? '\n⚠ Hay puntos por debajo de 4.5:1 — revisar la foto o ajustar el scrim.' : '\n✓ Todo por encima de 4.5:1 (WCAG AA).')
