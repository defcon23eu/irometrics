# IRO Metrics — Copilot Instructions

## Proyecto
Plataforma de diagnóstico organizacional irometrics.app
Stack: Next.js 14 · App Router · TypeScript · Tailwind CSS · Supabase

## Contexto académico (NO mencionar en UI de cara al usuario)
TFG Psicología · UNED · Raúl Balaguer Moreno
Investigación burnout en microempresas tech españolas
Instrumentos: IRO (propio) + MBI-GS + Oreg RTC · N=200

## Fórmula IRO — NUNCA modificar
Re_org = (Σδ · Σv · ΣD) / Σμ
Rangos por subescala: [3, 21] (3 ítems × Likert 1-7)
Umbrales: <100 laminar · 100-800 transición · 800-1200 turb. incipiente · >1200 severa

## Reglas de código
- TypeScript estricto · nunca `any`
- Componentes: PascalCase · hooks: camelCase con prefijo `use`
- Tailwind únicamente · sin CSS-in-JS · sin styled-components
- Validación: Zod en cliente y servidor · nunca confiar solo en frontend
- RGPD: nunca almacenar IP completa · session_id UUID client-side
- Todos los textos UI en español · código y comentarios en inglés

## Estructura de preguntas
- TOTAL_ITEMS = 50 (5A + 12B + 16C + 17D)
- Bloque A: sociodemográficos · tipo select/number · NO Likert
- Bloque B: IRO · Likert 1-7 · etiquetas "Totalmente en desacuerdo" / "Totalmente de acuerdo"
- Bloque C: MBI-GS · escala frecuencia 0-6 · etiquetas "Nunca" / "Siempre"
- Bloque D: Oreg RTC · Likert 1-6 · etiquetas "Totalmente en desacuerdo" / "Totalmente de acuerdo"

## UX — Principios irrenunciables
- 1 pregunta por pantalla · nunca agrupar
- Botones grandes táctiles (min 48px) · nunca radio buttons ni checkboxes pequeños
- Barra de progreso siempre visible · "Pregunta X de 50"
- Animación slide horizontal entre preguntas (Framer Motion)
- Mobile-first · breakpoint primario: 375px
- Resultado IRO visible al terminar · valor numérico + régimen + color

## Supabase
- Región: EU-West (Frankfurt) — obligatorio RGPD
- RLS activo · anon solo INSERT · authenticated SELECT
- Exportación vía vista `export_spss` en SQL
