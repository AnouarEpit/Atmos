# Atmos

Sitio web de clima estilo **"Editorial Atmospheric Full-Bleed"** — pieza de portfolio para candidatura alternance. Copy de interfaz en **francés**.

## Signature element

"Canvas Atmosférico Vivo": foto full-bleed real de la ciudad seleccionada + overlay de gradiente (siempre oscuro abajo → transparente arriba, para legibilidad del texto claro) cuya hue/opacidad varían según hora local real de esa ciudad (`timezone_offset` / `utc_offset_seconds` de Open-Meteo, 4 buckets: aube/jour/crépuscule/nuit) y condición meteorológica (6 familias: despejado/nubes/lluvia/tormenta/nieve/niebla, mapeadas desde códigos WMO). Temperatura en Fraunces gigante superpuesta directo sobre la foto. Crossfade con GSAP al cambiar de ciudad. Implementado en `src/domains/hero-temperatura/`.

## Stack

- Frontend: React 19 + Vite 8 + Tailwind CSS v4 (config CSS-first vía `@theme` en `src/styles/tokens.css`, sin `tailwind.config.js`)
- Backend: Node.js + Express 5 (proxy de API keys, el frontend nunca llama directo a APIs externas) — ESM, `server/` tiene su propio `package.json`
- Clima: **Open-Meteo** (`/v1/forecast`), proxied en `server/services/climaService.js` — sin API key ni tarjeta, gratis hasta 10 000 llamadas/día en uso no comercial. Requiere atribución CC BY 4.0 ("Données météo : Open-Meteo.com" con enlace, visible en `DatosDetalle.tsx`).
- Fotos de ciudad: **set curado estático** (decisión explícita del usuario, no Unsplash API) — 19 ciudades en `src/lib/data/ciudades.ts`, fotos placeholder SVG generadas en `public/images/villes/*.svg` **pendientes de reemplazo por fotografía real curada**
- Noticias: mock (`server/services/noticiasService.js`), forma de respuesta ya compatible con una API real futura
- Animación: GSAP (crossfade del fondo en `FondoDinamico.tsx`) + Lenis (smooth scroll, `shared/hooks/useLenis.ts`)
- Data fetching: React Query (`shared/hooks/useClimaActual.ts`)

## Arquitectura

Domain-driven. Cada dominio en `src/domains/<nombre>/` es autocontenido: `components/`, `hooks/` (si aplica), archivo principal `<Nombre>.tsx`, `index.ts` que exporta solo la API pública del dominio.

Dominios: `header`, `hero-temperatura`, `forecast`, `datos-detalle`, `noticias`.

Compartido: `src/shared/hooks` (`useClimaActual`, `useLenis` — usados por varios dominios a la vez, por eso viven aquí y no dentro de un dominio), `src/lib/api` (cliente HTTP + tipos hacia el backend), `src/lib/data/ciudades.ts` (set curado), `src/lib/clima/condicion.ts` (mapeo de códigos WMO), `src/styles/tokens.css` (design tokens).

`App.tsx` es el composition root: mantiene el estado de ciudad seleccionada y el único `useClimaActual`, y pasa los datos hacia abajo a cada dominio por props (evita refetches duplicados y prop-drilling de estado global).

Backend en `server/` con `routes/` y `services/` separados por dominio de datos (`clima`, `noticias`).

## Diales de taste-skill

- **VARIANCE**: 6/10 — identidad distintiva y repetible (serif + atmósfera + superposición), sin caos ni experimentación dispersa por sección
- **MOTION**: 4/10 — animación ambiental (overlay/fondo), nada de scroll-jacking ni efectos dispersos
- **DENSITY**: 3/10 — whitespace generoso, un dato hero dominante, secundarios en grid de 3-4 ítems máx

## Convenciones de sesión

Actualizar la sección **"Estado actual"** al final de cada sesión de trabajo con lo completado, para poder retomar desde cualquier máquina (portátil Ubuntu / PC sobremesa WSL) sin perder contexto.

## Estado actual

**2026-07-05** — Scaffold completo y funcional de punta a punta:

- Frontend Vite+React+TS+Tailwind v4 con los 5 dominios implementados (header, hero-temperatura, forecast, datos-detalle, noticias), tokens de diseño, overlay dinámico con GSAP, smooth scroll con Lenis, React Query.
- Backend Express en `server/` con proxy a OpenWeatherMap One Call 3.0 y noticias mock. Requiere `server/.env` con `OPENWEATHER_API_KEY` real (hay `.env.example`; el `.env` actual tiene un valor placeholder y las llamadas reales devuelven 401 hasta que se ponga una key válida).
- `npx tsc --noEmit` limpio. Ambos dev servers (`npm run dev` en la raíz para el frontend en :5173, `npm run dev` en `server/` para el backend en :3001) arrancan y responden correctamente; verificado con curl (proxy `/api/*` funcionando, HTML servido con fuentes).
- **Verificación visual con Playwright ya funciona** (el usuario autorizó `sudo npx playwright install-deps chromium` para instalar las 26 dependencias de sistema que faltaban). Workflow adoptado: después de cada cambio visual importante, capturar con Playwright (mockeando `/api/clima` vía `page.route` cuando no hay API key real) y criticar contra el moodboard antes de dar por terminado — ver memoria `feedback-screenshot-review`.
- Primera pasada de QA visual ya hecha sobre el scaffold inicial. Se encontraron y corrigieron 3 problemas reales:
  1. El símbolo "°" se renderizaba a tamaño completo junto al numeral (se veía como un círculo hueco flotante) → ahora es un span `0.32em` con `align-top`, lectura tipográfica correcta tipo Melbourne.
  2. El contraste día/noche·clima del overlay dinámico era casi imperceptible (mismo hue gris en todos los buckets, solo cambiaba opacidad) → se amplió el rango: cada bucket de hora tiene ahora un hue propio (aube/crépuscule cálidos violáceos, nuit índigo profundo casi negro, jour neutro claro) y los tintes de clima se doblaron en intensidad.
  3. Los iconos de forecast usaban emoji a todo color (☀️🌧️❄️), que leía como "app de clima genérica" en vez de editorial premium → reemplazados por un set de iconos lineales monocromos hechos a mano en `shared/ui/IconoClima.tsx` (`currentColor`, sin librería de iconos externa).
- Los placeholders SVG de ciudad ya no llevan el nombre de la ciudad horneado en grande (competía visualmente con el título real superpuesto) — solo un watermark pequeño y discreto abajo.
- **Ronda 2 de QA** (a petición del usuario, que revisó las capturas él mismo): el contraste día/noche no se notaba en los dos tercios superiores del hero. Verificado con estilos computados + muestreo de píxel real (no solo mirar el PNG) que **no era un bug** de `useOverlayPorHora` — los valores sí diferían — sino que el degradado va a opacidad ~0 arriba por diseño, y ahí solo actuaba el tinte de clima, que era demasiado desaturado para leerse como cambio de matiz (solo bajaba luminosidad). Fix aplicado en `useOverlayPorHora.ts` (tintes más saturados + residual de opacidad ~0.04-0.22 en el stop de arriba del gradiente, ya no 0) y en `FondoDinamico.tsx` (scrim fijo `bg-gradient-to-b from-black/45 to-transparent`, 192px de alto, para que la legibilidad del header nunca dependa del overlay dinámico). Verificado con matriz de 6 climas × 2 horas × 3 puntos del header: contraste mínimo 4.74:1 (WCAG AA texto normal pide 4.5:1) — pasa incluso en el peor caso (niebla + pleno día).

- **Primeras 2 fotos reales instaladas**: `paris.jpg` (Chris Karidis, Tour Eiffel + Seine, hora dorada, 231KB) y `lyon.jpg` (Adrien Olichon, iglesia + Saône, hora dorada, 389KB) — optimizadas con `sharp` (ancho 2000px, mozjpeg calidad 77-82) desde los originales de ~500-970KB, ambas bajo el límite de 400KB pedido. `ciudades.ts` actualizado a `.jpg` para esas dos entradas; las otras 17 ciudades siguen en placeholder SVG. Composición de ambas coincide con la referencia Manarola (sujeto arquitectónico a la derecha/centro, texto siempre abajo-izquierda).
- **Ronda 3 de QA**: Lyon tiene el cielo más saturado (cian) visto hasta ahora, buen caso límite real para el scrim del header. Diagnóstico con las capas aisladas (foto sola, sin overlay) confirmó que el tinte verde-azulado del header **no lo introduce el overlay — es el color real del cielo de la foto** (foto sola da contraste 1.98:1, ilegible; el stack de scrim+gradiente+tinte lo sube). El caso más ajustado (`jour`+despejado) daba 4.77:1 — pasa WCAG AA pero con poco margen. El usuario pidió subir el margen antes de sumar más fotos: escrim fijo subido de `black/45` a `black/55` en `FondoDinamico.tsx`. Reverificado: el caso ajustado sube a 5.90:1, `nuit`+lluvia en Lyon a 9.67:1, y el mínimo de la matriz completa (6 climas × 2 horas, ahora sobre la foto real de París) sube de 4.74 a **7.34:1**.
- **Manejo de errores en `useClimaActual`/`HeroTemperatura`**: si la petición de clima falla (tras los 3 reintentos automáticos de React Query), el hero ya no se queda en "Chargement…" indefinidamente — muestra "Impossible de charger la météo de {ciudad}." con un botón "Réessayer" que llama a `refetch()`. Verificado con Playwright forzando un 401 durante los reintentos y confirmando la recuperación tras el clic.
- **Migración de OpenWeatherMap a Open-Meteo** (motivo: evitar dependencia de API key/tarjeta de crédito — Open-Meteo es gratis hasta 10 000 llamadas/día sin registro para uso no comercial, encaja mejor con un proyecto de portafolio). Cambios:
  - `server/services/climaService.js` reescrito por completo: llama a `https://api.open-meteo.com/v1/forecast` con `wind_speed_unit=ms` (mantiene el mismo contrato de unidades que tenía OWM, cero cambios en el frontend) y `timezone=auto`. Genera las descripciones en francés desde una tabla propia de códigos WMO (Open-Meteo solo da el código numérico, no texto). Convierte los datetimes "naive" de Open-Meteo a unix timestamps reales usando `utc_offset_seconds` (evita el bug de parsear una hora local sin zona como si fuera la zona del servidor).
  - `src/lib/clima/condicion.ts`: `mapCondicion()` reescrito con la tabla oficial de códigos WMO (verificada contra la documentación de Open-Meteo, no solo por aproximación) — corrección importante: los códigos 80-82 son "averses de pluie" (familia lluvia), no nieve; nieve es 71-77 y 85-86.
  - `server/.env.example` ya no pide `OPENWEATHER_API_KEY` — solo `PORT`. El backend funciona sin ninguna variable de entorno obligatoria.
  - Atribución CC BY 4.0 añadida en `DatosDetalle.tsx`: línea discreta "Données météo : Open-Meteo.com" con enlace, justo debajo del grid de datos.
  - Verificado con Playwright contra el backend real (no mockeado): datos en vivo de París (18.2°C, "Généralement dégagé"), sin errores de consola, forecast de 7 días con iconos correctos.

**Pendientes para la próxima sesión:**
1. Reemplazar los 17 placeholders SVG restantes en `public/images/villes/` por fotografía real curada (mismo patrón que paris.jpg/lyon.jpg: `sharp`, ancho 2000px, mozjpeg, <400KB).
2. Pulido visual/responsive fino (mobile) y textura de niebla en el overlay (mencionada en el diseño pero no implementada — de momento solo cambia hue/opacidad, sin grano).
3. Los campos `uvi`/`wind_speed`/`humidity`/`pressure` de `daily[]` quedan en 0 (Open-Meteo no da esos agregados diarios y el frontend no los usa hoy — solo `dt`/`temp`/`weather` en `TarjetaDia`). Si en algún momento se quiere mostrar el UV máximo del día, por ejemplo, habría que añadir `uv_index_max` a los params `daily` de `climaService.js`.
