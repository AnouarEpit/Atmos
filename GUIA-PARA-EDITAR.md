# Guía para editar Atmos a mano

Este documento es para vos, no para una IA. La idea es que puedas abrir cualquier
archivo mencionado acá, encontrar el número o la palabra que te interesa, cambiarlo,
guardar, y ver el resultado — sin tener que entender todo el proyecto de una.

Está organizado en 3 partes:

1. **Cómo funciona el "idioma" del proyecto** (leé esto una vez, es la base de todo).
2. **Sección por sección**: qué hace cada parte de la página y qué archivo tocar.
3. **Recetario rápido**: "quiero hacer X" → "tocá este archivo, esta línea".

---

## Parte 1 — El "idioma" del proyecto (leer una vez)

### Cómo correr el proyecto en tu compu

Necesitás DOS terminales abiertas a la vez (el sitio no funciona con solo una):

```bash
# Terminal 1 — el frontend (lo que ves en el navegador)
cd /home/a1nuar/projets/Atmos
npm run dev
# se abre en http://localhost:5173

# Terminal 2 — el backend (trae los datos del clima)
cd /home/a1nuar/projets/Atmos/server
npm run dev
# escucha en el puerto 3001
```

Con ambas corriendo, abrís `http://localhost:5173` en el navegador y ves la página real.
Cada vez que guardás un archivo, el navegador se actualiza solo (no hace falta recargar).

### Los tamaños están en "rem", no en píxeles — y todo está multiplicado x1.25

Vas a ver números raros como `text-2xl`, `h-[5.5rem]`, `mt-6`. Estas son "clases de
Tailwind" (el sistema de estilos que usa el proyecto). Cada una representa un tamaño:

| Clase | Tamaño "de base" | Tamaño real en tu pantalla |
|---|---|---|
| `text-sm` | 14px | 17.5px |
| `text-base` | 16px | 20px |
| `text-xl` | 20px | 25px |
| `text-2xl` | 24px | 30px |
| `text-4xl` | 36px | 45px |
| `h-5` / `w-5` | 20px | 25px |
| `p-4` (padding) | 16px | 20px |
| `mt-6` (margen arriba) | 24px | 30px |
| `gap-4` | 16px | 20px |

**¿Por qué el tamaño real es 25% más grande?** En `src/styles/tokens.css` hay una línea:

```css
html {
  font-size: 125%;
}
```

Esto agranda TODO el sitio un 25% de una sola vez (fue una decisión de diseño, para
que se vea como con zoom de navegador al 125%). Por eso, cuando edites un tamaño,
pensá en la tabla de arriba: si escribís `text-xl`, en la pantalla real se ve como 25px,
no 20px.

Para tamaños que no están en la lista de Tailwind (como `h-[5.5rem]`, con corchetes),
la cuenta es: **rem × 20 = píxeles reales**. Ejemplo: `w-[5.5rem]` = 5.5 × 20 = 110px reales.

### `md:` = "a partir de tablet/desktop"

Vas a ver muchas clases con el prefijo `md:`, por ejemplo:

```
hidden md:flex
```

Esto significa: **"oculto en el celular, pero mostralo como `flex` a partir de pantallas
medianas (tablet/desktop)"**. Es el sistema que usa el proyecto para tener un diseño
distinto en mobile vs. desktop dentro del MISMO archivo.

Regla simple:
- Una clase **sin** `md:` → aplica siempre (mobile Y desktop), salvo que otra clase con `md:` la reemplace.
- Una clase **con** `md:` → solo aplica en pantallas de ~768px de ancho para arriba.

Ejemplo real de `src/domains/datos-detalle/DatosDetalle.tsx`:

```tsx
<div className="hidden md:grid md:grid-cols-4 gap-8">   {/* el grid de 4 columnas: SOLO desktop */}
<div className="flex gap-5 md:hidden max-w-sm mx-auto">  {/* la tarjeta "Zen": SOLO mobile */}
```

### Los colores tienen nombre, no son códigos sueltos

Todos los colores están definidos una sola vez en `src/styles/tokens.css`, dentro de `@theme`:

```css
--color-atmos-ink: #14181c;      /* negro/gris muy oscuro — texto principal */
--color-atmos-bone: #f4efe6;     /* crema — fondo de casi toda la página */
--color-atmos-slate: #4a5760;    /* gris azulado — texto secundario */
--color-atmos-gold: #c0973a;     /* dorado — acentos, cosas destacadas */
--color-atmos-fog: #b8c2c9;      /* gris claro — texto sobre la foto del hero */
--color-atmos-sable: #e1d6c7;    /* beige más oscuro — fondo de la sección "À la une" */
--color-atmos-good: #5b7a5e;     /* verde — calidad del aire "Bonne" */
--color-atmos-bad: #a8503f;      /* rojo apagado — calidad del aire "Mauvaise" */
```

Si querés cambiar UN color en TODO el sitio a la vez (por ejemplo, el dorado), cambiás
el valor acá una sola vez y se actualiza en todos lados. Si en cambio un componente usa
`text-atmos-gold`, `bg-atmos-slate`, etc., está usando estos nombres, no colores sueltos.

### Después de editar: cómo confirmar que no rompiste nada

En una terminal, desde `/home/a1nuar/projets/Atmos`:

```bash
npx tsc --noEmit -p tsconfig.app.json
```

Si no imprime nada, está todo bien. Si imprime un error, te dice el archivo y la línea
exacta del problema.

---

## Parte 2 — Sección por sección

### 2.1 — Header (el menú de arriba: "ATMOS", Accueil/Prévisions/Actus)

**Archivo:** `src/domains/header/Header.tsx`

**Qué hace:** la barra fija arriba de todo, con el logo "ATMOS" a la izquierda y los
links de navegación a la derecha (Accueil/Prévisions/Actus + "FR"). En mobile, los
links se esconden y aparece un botón de hamburguesa (☰) que despliega un menú.

**Cosas que podrías querer cambiar:**

- **El texto de los links**: buscá el array `ENLACES` al principio del archivo:
  ```tsx
  const ENLACES = [
    { href: '#accueil', label: 'Accueil' },
    { href: '#previsions', label: 'Prévisions' },
    { href: '#actus', label: 'Actus' },
  ]
  ```
  Cambiá `label` por el texto que quieras. `href` es a qué sección de la página salta.

- **El tamaño del logo "ATMOS"**: es la línea `<span className="font-display text-lg tracking-wide">`.
  Cambiá `text-lg` por `text-xl` (más grande) o `text-base` (más chico).

---

### 2.2 — Hero (la portada: foto + temperatura grande)

Esta es la sección más grande, con varios archivos. Todos viven en
`src/domains/hero-temperatura/`.

| Archivo | Qué controla |
|---|---|
| `HeroTemperatura.tsx` | El "esqueleto": junta todos los pedazos de abajo |
| `components/FondoDinamico.tsx` | La foto de fondo + el oscurecimiento (overlay) |
| `components/TemperaturaDisplay.tsx` | El número grande de la temperatura + nombre de ciudad |
| `components/BuscadorCiudad.tsx` | La barra de búsqueda + la lista desplegable |
| `components/IndiceLateral.tsx` | Los 4 datos (Ressenti/Vent/Humidité/UV) — versión desktop (columna) y mobile (fila) |
| `components/IndicadorScroll.tsx` | El texto "Défiler ↓" abajo a la izquierda |
| `hooks/useOverlayPorHora.ts` | Calcula el color del oscurecimiento según la hora/clima |
| `hooks/useEncogimientoScroll.ts` | El efecto de "encogerse" al hacer scroll |

**Cosas que podrías querer cambiar:**

- **El tamaño del numeral de temperatura** ("23°" gigante): en `TemperaturaDisplay.tsx`,
  buscá:
  ```tsx
  <p className="font-display text-[clamp(5rem,17vw,11.875rem)] font-medium leading-none tabular-nums">
  ```
  El `clamp(5rem, 17vw, 11.875rem)` significa "nunca más chico que 5rem, nunca más
  grande que 11.875rem, y en el medio se ajusta según el ancho de pantalla (17vw)".
  Para agrandarlo, subí el último número (ej. `11.875rem` → `13rem`).

- **El tamaño del nombre de la ciudad** ("Paris, France"): en el mismo archivo,
  `text-3xl md:text-4xl` — el primero es el tamaño en mobile, el segundo en desktop.

- **La foto de cada ciudad y su recorte**: en `src/lib/data/ciudades.ts`, cada ciudad
  tiene un campo `foto` (la ruta a la imagen) y opcionalmente `posicionFoto` (qué parte
  de la foto se ve cuando se recorta en pantallas angostas). Ejemplo:
  ```ts
  { slug: 'paris', ..., foto: '/images/villes/paris.jpg', posicionFoto: '75% center' },
  ```
  `posicionFoto: '75% center'` significa "mostrá la zona que está al 75% del ancho de
  la foto" (así la Torre Eiffel, que no está centrada en la foto original, no se corta
  en mobile). Si una ciudad no tiene `posicionFoto`, usa `center` (el medio de la foto).
  Para ajustarlo: probá valores como `'30% center'` (más a la izquierda) o
  `'center 20%'` (más arriba) y mirá el resultado en mobile (F12 → ícono de celular
  en Chrome/Edge).

- **El redondeado de la esquina inferior del hero**: en `HeroTemperatura.tsx`,
  `rounded-b-[3.5rem]` en el `<section>`. Es el radio de las esquinas de abajo (donde
  se ve la curva hacia la sección de Prévisions). Más grande = curva más pronunciada.

- **La velocidad/tamaño del efecto de encogerse al hacer scroll**: en
  `hooks/useEncogimientoScroll.ts`:
  ```ts
  const tween = gsap.to(ref.current, {
    scale: 0.95,   // <- qué tan chico se pone (0.95 = 5% más chico). Ej: 0.9 = más notorio
    ...
    scrollTrigger: {
      start: 'bottom 80%',  // <- cuándo empieza el efecto
      end: 'bottom 20%',    // <- cuándo termina
      scrub: true,
    },
  })
  ```

- **Los 4 datos del índice** (Ressenti/Vent/Humidité/UV): en `IndiceLateral.tsx`, el
  array `items` al principio de cada componente (`IndiceLateral` para desktop,
  `IndiceMobileInline` para mobile) arma la lista. El tamaño de los valores en desktop
  es `text-2xl` (columna vertical); en mobile es `text-base` (fila horizontal).

- **La animación de la flecha de "Défiler"**: en `src/styles/tokens.css`, buscá
  `@keyframes atmos-flecha-flotar` — el número `9px` es cuánto baja, `2.8s` es la
  duración de un ciclo completo (más alto = más lento).

---

### 2.3 — Buscador de ciudad (la barra "Rechercher une ville...")

**Archivo:** `src/domains/hero-temperatura/components/BuscadorCiudad.tsx`

**Qué hace:** el input de texto + la lista de ciudades que aparece al escribir o hacer
clic. En desktop la lista sale al costado izquierdo del input; en mobile sale debajo.

**Cosas que podrías querer cambiar:**

- **El ancho de la lista en desktop**: `md:w-64` (16rem = 320px reales).
- **Cuántas ciudades caben antes de necesitar scroll (mobile)**: `max-h-32` (altura
  máxima del desplegable en mobile). Si lo subís, verificá que no se corte contra el
  borde de abajo del hero — usá el checklist del final de este documento.
- **Qué tan transparente/con blur es la lista**: `bg-atmos-ink/25 backdrop-blur-2xl`.
  El número después de la barra (`/25`) es la opacidad en porcentaje (25%). Más alto =
  más oscuro/opaco, más bajo = más transparente.
- **Agregar o quitar ciudades**: eso se hace en `src/lib/data/ciudades.ts`, no en este
  archivo — ahí está la lista completa con nombre, país, coordenadas y foto de cada una.

---

### 2.4 — Forecast (Prévisions 7 jours)

| Archivo | Qué controla |
|---|---|
| `src/domains/forecast/Forecast.tsx` | El esqueleto: título + grid desktop + tarjeta con pestañas mobile |
| `components/TarjetaDia.tsx` | Cada tarjeta individual (solo se usa en desktop) |
| `components/SparklineSemana.tsx` | La línea punteada dorada que conecta las temperaturas (solo desktop) |

**Cosas que podrías querer cambiar:**

- **El tamaño de las tarjetas en desktop**: en `TarjetaDia.tsx`, `min-w-[7.5rem]`
  (ancho mínimo, 150px reales) y `px-5 py-6` (espacio interno). El numeral de
  temperatura es `text-2xl font-medium`.
- **La velocidad del hover de las tarjetas** (cuando pasás el mouse): en el mismo
  archivo, `duration-[650ms]` (tarjeta), `duration-[550ms]` (ícono), `duration-[420ms]`
  (fecha) — son milisegundos. Más alto = más lento.
- **El espacio entre tarjetas (desktop)**: en `Forecast.tsx`, `md:gap-7`.
- **La curva punteada**: en `SparklineSemana.tsx`, `ALTO_BANDA = 90` controla qué tan
  pronunciada es la curva (más alto = sube/baja más). El color es
  `stopColor="#c0973a"` (el dorado) dentro del `<linearGradient>`.
- **Las pestañas de día en mobile**: en `Forecast.tsx`, la píldora activa usa
  `bg-atmos-ink text-atmos-bone`; el resto `text-atmos-slate`. El tamaño del número
  grande en el panel de detalle es `text-5xl`.

---

### 2.5 — DatosDetalle (Conditions actuelles)

| Archivo | Qué controla |
|---|---|
| `src/domains/datos-detalle/DatosDetalle.tsx` | El esqueleto: título + grid desktop + layout "Zen" mobile |
| `components/GridDato.tsx` | Cada dato individual, versión desktop (grid 2x4) |
| `components/FilaZen.tsx` | Cada dato individual, versión mobile (lista al lado del video) |
| `components/IconoAnimado.tsx` | Los 4 íconos que laten/se mueven solos (UV, viento, humedad, presión) |
| `components/RecuadroAtmosferico.tsx` | El recuadro con el video de nubes (solo mobile) |

**Cosas que podrías querer cambiar:**

- **El tamaño del recuadro de video (mobile)**: en `RecuadroAtmosferico.tsx`, la
  primera línea del `<div>`:
  ```tsx
  <div className="relative h-[13rem] w-[5.5rem] shrink-0 overflow-hidden rounded-[1.75rem] bg-atmos-slate">
  ```
  - `h-[13rem]` = alto (13 × 20 = 260px reales). Para agrandarlo, ej. `h-[15rem]` (300px).
  - `w-[5.5rem]` = ancho (5.5 × 20 = 110px reales). Ej. `w-[7rem]` (140px).
  - `rounded-[1.75rem]` = qué tan redondeadas son las esquinas (más alto = más redondo).
  - **Importante**: si agrandás el recuadro, la columna de datos al lado (`FilaZen`)
    tiene que seguir siendo igual de alta para que quede alineado — eso es automático
    porque usa `justify-between` en `DatosDetalle.tsx`, no hace falta tocar nada ahí.

- **Dónde empieza y termina el loop del video** (esto NO se edita en el código React,
  se edita re-generando el archivo de video con `ffmpeg`). El video original completo
  está en `/mnt/c/Users/a1nua/Videos/atmos/athmosfera-cielo.mp4` (59 segundos). El que
  se usa en el sitio (`public/videos/atmosfera-cielo.mp4`) es un recorte de 3.5
  segundos + su reversa (para que el loop no dé un salto, ya que el video original no
  es cíclico — es un timelapse de nubes formándose).

  Para cambiar el segmento del video que se usa, corré esto en la terminal (desde
  `/home/a1nuar/projets/Atmos`):

  ```bash
  # Paso 1: elegí el segundo donde querés que EMPIECE el loop (-ss) y cuántos
  # segundos de duración querés (-t). Ejemplo: empezar en el segundo 25, duración 4s:
  ffmpeg -y -ss 25 -t 4 -i "/mnt/c/Users/a1nua/Videos/atmos/athmosfera-cielo.mp4" \
    -vf "crop=450:720:415:0,scale=270:432,fps=24" -an \
    -c:v libx264 -crf 28 -preset slow -pix_fmt yuv420p /tmp/base.mp4

  # Paso 2: crear la versión en reversa
  ffmpeg -y -i /tmp/base.mp4 -vf reverse -an -c:v libx264 -crf 28 -preset slow /tmp/base_rev.mp4

  # Paso 3: pegar adelante + reversa (esto es lo que hace que el loop no salte)
  ffmpeg -y -i /tmp/base.mp4 -i /tmp/base_rev.mp4 \
    -filter_complex "[0:v][1:v]concat=n=2:v=1:a=0[outv]" -map "[outv]" \
    -c:v libx264 -crf 28 -preset slow -pix_fmt yuv420p -movflags +faststart \
    public/videos/atmosfera-cielo.mp4

  # Paso 4: lo mismo pero en formato WebM (más liviano, se usa si el navegador lo soporta)
  ffmpeg -y -i /tmp/base.mp4 -i /tmp/base_rev.mp4 \
    -filter_complex "[0:v][1:v]concat=n=2:v=1:a=0[outv]" -map "[outv]" \
    -c:v libvpx-vp9 -crf 32 -b:v 0 -pix_fmt yuv420p \
    public/videos/atmosfera-cielo.webm

  # Paso 5 (opcional): actualizar la imagen de respaldo (poster) al primer frame nuevo
  ffmpeg -y -i public/videos/atmosfera-cielo.mp4 -frames:v 1 -q:v 4 \
    public/videos/atmosfera-cielo-poster.jpg
  ```

  Solo necesitás cambiar los números `-ss 25 -t 4` del Paso 1 por donde quieras
  empezar y cuánto quieras que dure. El resto de los comandos son siempre iguales.
  Con `-t 3` a `-t 5` (3 a 5 segundos) anda bien — más largo = archivo más pesado.

- **Los íconos animados (UV/viento/humedad/presión)**: viven en `IconoAnimado.tsx`.
  Cada uno tiene su propio `@keyframes` en `src/styles/tokens.css` (buscá
  `atmos-pulso-opacidad`, `atmos-viento`, `atmos-pulso-escala`, `atmos-oscilar-aguja`).
  El número en `_2.8s_` (por ejemplo) es la duración de un ciclo — más alto = más lento.

- **El tamaño de los valores en mobile** ("6", "15 km/h", etc.): en `FilaZen.tsx`,
  `text-2xl font-medium`. En desktop (`GridDato.tsx`) es `text-4xl font-bold` — son
  archivos separados a propósito, podés cambiar uno sin afectar el otro.

---

### 2.6 — Noticias (À la une)

| Archivo | Qué controla |
|---|---|
| `src/domains/noticias/Noticias.tsx` | El esqueleto: título + lista de artículos + tarjeta lateral |
| `components/ArticuloDestacado.tsx` | El primer artículo (el más grande) |
| `components/ItemNoticiaCompacto.tsx` | Los artículos 02-06 (lista compacta) |
| `components/ResumenCiudad.tsx` | La tarjeta blanca de la derecha (temperatura, viento, luna, aire) |
| `src/lib/clima/luna.ts` | Calcula la fase de la luna (sin API, es matemática) |
| `src/lib/clima/consejo.ts` | Genera el consejo del día ("Journée agréable...") |

**Cosas que podrías querer cambiar:**

- **El fondo de toda la sección**: en `Noticias.tsx`, `bg-atmos-sable` — para cambiar
  el color, andá a `src/styles/tokens.css` y editá `--color-atmos-sable`.
- **El ancho de la tarjeta lateral**: en `Noticias.tsx`, la clase del grid:
  `grid-cols-[1fr_23rem]` — el `23rem` es el ancho de la columna derecha (460px reales).
- **La velocidad de las ondas de viento** (en la tarjeta de la derecha): en
  `ResumenCiudad.tsx`, buscá `OndasViento` — los números como `2.8s`, `2.6s`, `3.8s`
  son la duración de cada onda (tres líneas con velocidades ligeramente distintas a
  propósito, para que no se vean sincronizadas).

---

## Parte 3 — Recetario rápido

### "Quiero agrandar/achicar un texto"

Buscá la clase `text-algo` en el archivo correspondiente (ver Parte 2 para saber cuál).
Escala de Tailwind, de más chico a más grande:

```
text-xs → text-sm → text-base → text-lg → text-xl → text-2xl → text-3xl → text-4xl → text-5xl → text-6xl
```

### "Quiero más/menos espacio entre dos elementos"

- Si están uno al lado del otro dentro de un `flex`, buscá `gap-N` en el contenedor
  (ej. `gap-4` → `gap-6` para más espacio).
- Si es el espacio ARRIBA de un elemento: `mt-N` (margin-top). Ej. `mt-4` → `mt-8`.
- Si es el espacio ADENTRO de una caja (entre el borde y el contenido): `p-N` (padding)
  o `px-N`/`py-N` (solo horizontal/vertical).
- La escala de números va de 0 a 96 aprox., en saltos de a poco: `1, 2, 3, 4, 5, 6, 8,
  10, 12, 16, 20, 24...` (cada número = 4px de base × 1.25 = 5px reales por unidad).

### "Quiero que algo se vea distinto en mobile vs desktop"

Poné dos clases, una normal (mobile) y una con `md:` (desktop). Ejemplo: si algo mide
`text-xl` en mobile y querés que sea más grande en desktop:

```tsx
className="text-xl md:text-3xl"
```

### "Quiero cambiar un color"

Si el color ya es uno de los "oficiales" del sitio (bone, gold, ink, slate, sable,
fog, good, bad), cambialo en `src/styles/tokens.css` dentro de `@theme` — se actualiza
en TODO el sitio a la vez. Si querés cambiarlo solo en un lugar puntual, buscá la clase
`bg-atmos-X` o `text-atmos-X` en ese archivo específico y cambiá el nombre por otro
color de la lista.

### "Quiero agrandar el recuadro del video o cambiar el loop"

Ver la sección **2.5 — DatosDetalle**, tiene los dos casos con el paso a paso completo.

### "Hice un cambio y ahora la página no carga / se ve rota"

1. Mirá la terminal donde corre `npm run dev` — si hay un error, suele decir el
   archivo y la línea.
2. Corré `npx tsc --noEmit -p tsconfig.app.json` — te dice si hay un error de tipos.
3. Si no entendés el error, deshacé el último cambio (Ctrl+Z en tu editor, o
   `git diff` en la terminal para ver qué cambiaste) y probá de nuevo de a un cambio
   por vez.

### Checklist antes de dar un cambio por terminado

1. Mirá el cambio en desktop (navegador normal, ventana grande).
2. Mirá el cambio en mobile: F12 (herramientas de desarrollador) → ícono de
   celular/tablet arriba a la izquierda del panel → elegí "iPhone SE" (375px) y
   "iPhone 14 Pro Max" o similar (414-430px).
3. Si tocaste texto/valores, probá con un caso "raro" (ej. una ciudad con nombre
   largo, un viento de 3 dígitos) para confirmar que no se corta ni se rompe la línea.
4. Corré `npx tsc --noEmit -p tsconfig.app.json` — no debería imprimir nada.

---

*Este archivo lo generó Claude durante la sesión del 2026-07-07. Si en sesiones
futuras cambian nombres de archivos o clases, esta guía puede quedar desactualizada
en los detalles puntuales — pero la lógica general (rem×20, `md:`, tokens de color)
no cambia.*
