# Product

## Register

brand

## Users

Dos lectores simultáneos, ambos evaluando al candidato a través del sitio:

- **Reclutadores / responsables RRHH de alternance en tech** — navegan el sitio como lo haría cualquier visitante, sin contexto técnico previo. Lo que ven en pantalla ES la carta de presentación.
- **Devs que revisan el repositorio** — inspeccionan el código, la arquitectura y el historial de commits como muestra técnica adicional. Esperan encontrar coherencia entre lo que se ve y cómo está construido (convenciones, ausencia de atajos, decisiones documentadas).

El "job to be done" del visitante no es literalmente "consultar el clima" — es formarse una impresión de la capacidad de diseño/desarrollo del candidato en los ~2 minutos que dedica a explorar el sitio.

## Product Purpose

Portfolio de candidatura para un puesto de alternance (Francia), disfrazado de app de clima funcional. Existe para demostrar — no para explicar — criterio de diseño editorial, rigor de accesibilidad verificado con números, y arquitectura de frontend limpia. El éxito se mide en si el sitio comunica ese criterio sin que el visitante tenga que leer un README para notarlo.

## Brand Personality

**Editorial, atmosférico, preciso.**

- *Editorial*: tipografía serif (Fraunces) como protagonista, tratamiento de foto full-bleed, jerarquía tipo revista/portada — no plantilla de producto SaaS.
- *Atmosférico*: el signature element (overlay dinámico por hora local real + condición meteorológica) es la seña de identidad del sitio; nada más compite con él por atención.
- *Preciso*: cada decisión visual con implicación de accesibilidad (contraste, tipografía, motion) se verifica con cálculo numérico o medición real (Playwright), nunca "a ojo". Este rigor es, en sí mismo, parte del mensaje de marca hacia el lector-dev.

## Anti-references

Ninguno de los dos debe filtrarse:

- **"AI slop" / plantilla SaaS genérica**: fondo crema-lavanda por defecto, tarjetas idénticas con sombra, iconos de librería genérica repetidos sin criterio, eyebrows uppercase sobre cada sección, hero-metric template, gradientes decorativos en texto. Si el visitante puede adivinar la paleta/composición solo por la categoría ("sitio de clima" → azul cielo + tarjetas), ya perdimos.
- **Dashboard meteorológico frío**: estilo AccuWeather/Windy — denso, utilitario, sin atmósfera ni identidad editorial. Los datos (UV, viento, presión) existen para servir la narrativa visual, no al revés.

## Design Principles

1. **Un elemento con identidad fuerte antes que muchos genéricos.** El overlay dinámico del hero es el signature element; el resto del sitio lo acompaña sin competir (VARIANCE 6/10 — distintivo y repetible, no caótico).
2. **El movimiento es ambiental, nunca protagonista.** Loops continuos (iconos, ondas de viento, brillo lunar) en `transform`/`opacity` cuando es posible; ninguna animación debe sentirse como un efecto que reclama atención por sí mismo (MOTION 4/10).
3. **Verificar con números, no a ojo.** Todo contraste de texto introducido se calcula (fórmula WCAG de luminancia relativa) antes de darlo por bueno; toda animación se mide (bounding box a lo largo del tiempo, diff de píxeles) en vez de asumirse.
4. **Reutilizar antes que duplicar.** Cuando dos dominios necesitan la misma lógica (`direccionViento`, `IconoClima`, `formatearHora`), se extrae a `lib/` en el momento en que aparece la segunda necesidad, no antes ni después.
5. **El dato real manda sobre el mockup.** Ninguna sección se declara terminada sin una captura con datos reales de la ciudad activa, y sin confirmar que el estado se actualiza correctamente al cambiar de ciudad.

## Accessibility & Inclusion

- **Mínimo WCAG AA** (≥4.5:1 texto normal, ≥3:1 texto grande/gráficos no decorativos) en todo par texto/fondo nuevo — verificado por cálculo, no percepción visual. Historial de 3+ fallos reales encontrados y corregidos así en esta sesión (ver CLAUDE.md).
- Gráficos decorativos redundantes con texto adyacente (iconos de sol/luna junto a su etiqueta y valor) se documentan como exentos de 1.4.11 cuando no alcanzan 3:1, en vez de ignorarse en silencio.
- **Brecha conocida, no resuelta todavía**: ninguna animación del sitio tiene alternativa `prefers-reduced-motion` — impeccable la marca como no-opcional; queda pendiente para una próxima pasada (no es una decisión deliberada, es una omisión a corregir).
