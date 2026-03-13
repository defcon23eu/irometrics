# COPILOT INSTRUCTIONS · irometrics.app
# Contexto permanente para GitHub Copilot en VS Code
# Modelo recomendado: Claude Sonnet 4 (Agent Mode para cambios en código)

## PROYECTO
App de medición de burnout organizacional mediante el Índice de Reynolds
Organizacional (IRO). Stack: Next.js 14 App Router · TypeScript strict ·
Supabase (PostgreSQL). Vinculado a TFG de Psicología UNED 2025-26.

## FÓRMULA CENTRAL
Re_org = (Σδ · Σv · ΣD) / Σμ
IROlog = Math.log10(Re_org + 1)   ← base 10, ya implementado

Regímenes:
  < 100  → laminar (bajo riesgo)
  100–800 → transición
  800–1200 → turbulencia incipiente
  > 1200  → turbulencia severa

## INSTRUMENTOS (50 ítems, columnas Supabase)
Bloque A — Sociodemográfico: a1..a5
Bloque B — IRO (Likert 1–7): b1..b12
  δ densidad   : b1 b2 b3  (factor de RIESGO, van al numerador)
  v velocidad  : b4 b5 b6  (factor de RIESGO, van al numerador)
  D descoord.  : b7 b8 b9  (factor de RIESGO, van al numerador)
  μ viscosidad : b10 b11 b12 (factor PROTECTOR, va al DENOMINADOR)
    → μ alto = más amortiguación = menor Re_org
    → NO invertir ítems μ; usarlos directo en denominador

Bloque C — MBI-GS (escala 0–6): c1..c16
  Agotamiento  : c1 c2 c3 c4 c5
  Cinismo      : c6 c7 c8 c9 c16  ← c16 en CINISMO (verificado)
  Eficacia     : c10 c11 c12 c13 c14 c15
    → Eficacia en positivo (alto = más eficacia)
    → NO invertir para H1-H3
    → Solo invertir (6 - valor) si se construye índice global burnout

Bloque D — Oreg RTC (escala 1–6): d1..d17
  Búsqueda rutina    : d1 d2 d3 d4 d5
  Reacción emocional : d6 d7 d8 d9
  Rigidez cognitiva  : d10 d11 d12 d13
  Orientación c/p    : d14 d15 d16 d17

  ⚠️ ÍTEMS INVERSOS (escala 1-6 → inverso = 7 - valor):
  d4  "buscar activamente cambiar la rutina" → inverso
  d13 "a menudo cambio de opinión"          → inverso
  NINGÚN OTRO ítem de Oreg es inverso.

  rtcTotal = media(17 ítems con d4 y d13 ya invertidos)

## CAMBIOS YA IMPLEMENTADOS
✅ c16 → subescala Cinismo (no Eficacia)
✅ Labels D10-D13=Rigidez cognitiva, D14-D17=Orientación c/p
✅ IROlog = Math.log10(re_org + 1) en JS
✅ log(10, x) en SQL Supabase (migración 002)
✅ Inversión d4 y d13 en calculateRTC (iro-calculator.ts)
✅ BUG-01: calculateMBIScores sin inversión eficacia para H1-H3
✅ BUG-02: calculateRTC optimizado con inversión explícita d4/d13
✅ BUG-03: re_org_log incluido en insert a Supabase
✅ WARN-01: safeMu = Math.max(mu, 3) — mínimo teórico correcto

## HIPÓTESIS DEL ESTUDIO
H1: IRO_log+ → Agotamiento+ (correlación positiva)
H2: IRO_log+ → Cinismo+ (correlación positiva)
H3: IRO_log+ → Eficacia− (correlación negativa)
H4: Antigüedad modera IRO→burnout (más antigüedad = menos impacto)
H5: RTC total modera IRO→burnout

## REGLAS DE CÓDIGO
- TypeScript strict: todos los tipos explícitos, sin any
- Componentes: PascalCase · hooks: camelCase con prefijo `use`
- Nombres de función en camelCase inglés
- Tailwind únicamente · sin CSS-in-JS · sin styled-components
- Comentarios en español castellano
- Validación: Zod en cliente y servidor · nunca confiar solo en frontend
- RGPD: nunca almacenar IP completa · session_id UUID client-side
- Al calcular rtcTotal: SIEMPRE invertir d4 y d13 primero
- Al calcular reOrg: μ siempre en DENOMINADOR (nunca en numerador)
- Al calcular subescala cinismo: SIEMPRE incluir c16
- Tests unitarios para calcular_scores si se añaden nuevas funciones

## ESTRUCTURA DE PREGUNTAS
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

## ESTRUCTURA CLAVE DEL REPO
src/lib/iro-calculator.ts    ← lógica central de cálculo (IRO + MBI + RTC)
src/lib/questions.ts         ← definición de ítems y subescalas
src/types/index.ts           ← tipos TypeScript de bloques y resultado
supabase/migrations/         ← migraciones SQL ordenadas (001, 002...)
.env.local                   ← SUPABASE_URL + SUPABASE_ANON_KEY (no commitear)

## SUPABASE
- Región: EU-West (Frankfurt) — obligatorio RGPD
- RLS activo · anon solo INSERT · authenticated SELECT
- Exportación vía vista `export_spss` en SQL

## CONTEXTO PSICOMÉTRICO CRÍTICO

### MBI-GS (blockC)
- Eficacia (c10–c15): **NUNCA invertir para cálculo de hipótesis H1–H3**.
  Usar `calculateMBIScores()` → puntuación directa (alto = más eficacia).
  Solo invertir en `calculateMBIBurnoutIndex()` para índice global exploratorio.
- Cinismo incluye c16 (verificado Gil-Monte, 2002).
- Referencia: Schaufeli et al. (1996); Gil-Monte (2002).

### Oreg RTC (blockD)
- Ítems inversos: **D4 y D13 únicamente**. Inversión: `7 − valor` (escala 1–6).
- D4: "Siempre que mi vida se vuelve rutinaria, busco formas de cambiarla"
- D13: "A menudo cambio de opinión"
- Usar `calculateRTC(blockD)` de iro-calculator.ts.
- Referencia: Oreg (2003, JAP); Oreg et al. (2008, JAP).

### IRO (blockB)
- μ (b10+b11+b12) es factor PROTECTOR: a mayor μ, menor Re_org.
- `safeMu = Math.max(mu, 3)` — mínimo teórico real (3 ítems × Likert 1), **nunca usar 1**.
- `re_org_log = Math.log10(re_org + 1)` — **SIEMPRE persistir en Supabase** en cada insert.
- Prevención división por cero: `Math.max(reOrgRounded, 0) + 1` antes de log10.

## SISTEMA DE ANIMACIONES Y EFECTOS

### Tokens visuales (tema índigo)
- Acento principal: `#6366F1`
- Regímenes: laminar `#22C55E`, transición `#EAB308`, incipiente `#F97316`, severo `#EF4444`

### Variantes Framer Motion recomendadas
- `fadeIn`, `scaleIn`, `staggerContainer`
- Hover cards (`whileHover={{ y: -4 }}`)
- Botones con spring (`type: 'spring'`, `stiffness: 400`, `damping: 20`)

### Componentes de efectos reutilizables
- `FlowLines`
- `Particles`
- `FlowParticles`
- `AnimatedCounter`

### Patrones avanzados permitidos
- Parallax con `useScroll` + `useTransform`
- Likert con gradiente de color por intensidad
- ProgressBar fluido con indicador animado
- Gauge SVG con aguja animada por spring

### Utilities CSS
- `.glass`
- `.btn-fluid`
- `.gauge-glow`
- `.flow-line`

### Keyframes mínimos
- `fade-in`
- `shimmer`
- `pulse-glow`
- `float`
- `flow-lines`

### Buenas prácticas de motion
- Priorizar spring en interacciones
- Easing suave para entradas (`[0.25, 0.4, 0.25, 1]`)
- Stagger en listas y grids (`0.08–0.12`)
- Respetar `prefers-reduced-motion`
