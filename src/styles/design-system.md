# IRO Metrics — Design System v2.0 (defcon23.eu DNA)

## Filosofía de diseño
Referencia visual: Linear.app + Vercel Dashboard + defcon23.eu
Principio: "Reduce para persuadir" — cada elemento que desaparece
aumenta el foco en la pregunta. El participante nunca debe pensar
en la interfaz, solo en su respuesta.

Tono: Frío, directo, técnico. Sin adjetivos vacíos. Datos cuando sea posible.
Voz: Profesional, sin fluff, frases cortas.

## ADN Visual · defcon23.eu

### Caracteres especiales tipográficos
- Separadores: · ◈ ⧫ ◇ ▶ ■ ✦ ⌖
- Casillas: ✕ ✓
- Iconos inline con Geist Mono en accent-primary

### Estructura de sección
[ETIQUETA UPPERCASE tracking-[0.2em] font-mono text-xs text-text-muted]
→ h2 directo, font-bold
→ párrafo descriptivo text-text-secondary
→ contenido (cards, tabla, etc.)

### Listas y bullets
▶ o ■ en lugar de bullets genéricos nativos
Numeración: "01 · 02 · 03" con Geist Mono en accent-primary

### Cards
bg-bg-surface · border-border-subtle · rounded-xl
Hover: border-border-focus transition-colors duration-150
border-left: 4px solid [color-régimen] para contexto semántico

### Tablas técnicas
overflow-x-auto · rounded-xl · border-border-subtle · bg-bg-surface
thead: text-xs uppercase tracking-wider text-text-muted font-mono
tbody: divide-y divide-border-subtle
Footer row: border-t border-border-default bg-bg-elevated/50

### Badges
pill shape · rounded-full · border · font-mono · text-xs tracking-widest
Background: regime-color + 1F opacity
Border: regime-color + 4D opacity

### Stats inline
Número grande Geist Mono + label pequeño text-text-muted debajo

## Paleta de colores — Design Tokens (Zinc/Indigo)

### Backgrounds (modo oscuro único)
--bg-base:        #09090B
--bg-surface:     #111113
--bg-elevated:    #18181B
--bg-overlay:     #1F1F23

### Texto
--text-primary:   #FAFAFA
--text-secondary: #A1A1AA
--text-muted:     #52525B
--text-accent:    #818CF8

### Colores de régimen IRO (semáforo)
--regime-laminar:    #22C55E    (bg: #22C55E1F)
--regime-transicion: #EAB308    (bg: #EAB3081F)
--regime-incipiente: #F97316    (bg: #F973161F)
--regime-severo:     #EF4444    (bg: #EF44441F)

### Accent / Brand (Indigo)
--accent-primary:  #6366F1
--accent-hover:    #818CF8
--accent-subtle:   #6366F114
--accent-glow:     #6366F130
--accent-border:   #6366F14D

### Borders
--border-subtle:   #27272A
--border-default:  #3F3F46
--border-focus:    #6366F1
--border-success:  #22C55E80

### Misc
--grid-line:       #FAFAFA0A
--shadow-glow:     0 0 24px #6366F133

## Tipografía
Font stack: Geist, system-ui, sans-serif
Mono: Geist Mono, monospace
CSS vars: --font-geist-sans, --font-geist-mono
font-weight: 700 headings, 400 body

## Grid de fondo
backgroundImage: linear-gradient(var(--color-grid-line) 1px, transparent 1px),
                 linear-gradient(90deg, var(--color-grid-line) 1px, transparent 1px)
backgroundSize: 40px 40px
Solo CSS, jamás JS ni canvas.

## Survey · Sin contador X/50
- Block header: "BLOQUE 01 ◈" font-mono tracking-[0.15em]
- Per-block progress bar (porcentaje del bloque actual)
- "24% · Bloque 1/4" en lugar de "12/50"
- Question card: rounded-2xl border-border-subtle bg-bg-elevated/50 p-6

## Block transition splash
- Animated checkmark SVG (pathLength 0→1 500ms)
- "BLOQUE 01 COMPLETADO ◈" font-mono tracking-[0.2em]
- Subtitle with next block description
- Total progress bar with fill animation
- Auto-dismiss: 2200ms

## Resultado
- Count-up animation: 1800ms, cubic easing (1 - (1-t)^3)
- Technical subscale table (δ, v, D, μ, Re_org)
- Explanation card: border-l-4 regime color
- Academic footer: font-mono tracking-[0.15em]

## Animación
Auto-advance: 280ms after Likert selection
Gauge needle: 1500ms ease-out
Page transitions: 400ms ease-out enter, 200ms exit
Question slide: 300ms with directional x offset
Hero stagger: 100ms incremental delay
Cards whileInView: opacity 0,y:30 → 1,0 (once, margin -50px)
Block transition: AnimatePresence mode="wait"

## prefers-reduced-motion
All Framer Motion respects:
@media (prefers-reduced-motion: reduce) → no animations
