# IRO Metrics — Design System v1.0

## Filosofía de diseño
Referencia visual: Linear.app + Vercel Dashboard + Stripe Elements
Principio: "Reduce para persuadir" — cada elemento que desaparece
aumenta el foco en la pregunta. El participante nunca debe pensar
en la interfaz, solo en su respuesta.

## Paleta de colores — Design Tokens

### Backgrounds (modo oscuro único)
--bg-base:        #080B10
--bg-surface:     #0F1318
--bg-elevated:    #161B22
--bg-overlay:     #1C2128

### Texto
--text-primary:   #F0F6FC
--text-secondary: #8B949E
--text-muted:     #484F58
--text-accent:    #58A6FF

### Colores de régimen IRO (semáforo)
--regime-laminar:    #22C55E
--regime-transicion: #EAB308
--regime-incipiente: #F97316
--regime-severo:     #EF4444

### Accent / Brand
--accent-primary:  #3B82F6
--accent-hover:    #2563EB
--accent-glow:     rgba(59, 130, 246, 0.15)
--accent-border:   rgba(59, 130, 246, 0.3)

### Borders
--border-default:  rgba(240, 246, 252, 0.1)
--border-focus:    rgba(59, 130, 246, 0.5)
--border-success:  rgba(34, 197, 94, 0.5)

## Tipografía
Font stack: 'Inter', system-ui, sans-serif
Mono: 'JetBrains Mono', 'Fira Code', monospace

## Animación
Auto-advance: 280ms after Likert selection
Gauge needle: 1500ms ease-out
Page transitions: 400ms ease-out enter, 200ms exit
Question slide: 300ms with directional x offset
