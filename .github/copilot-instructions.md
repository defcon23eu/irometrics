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

---

## SISTEMA DE ANIMACIONES Y EFECTOS

### Tema Visual: Dinámica de Fluidos
La UI está inspirada en dinámica de fluidos y el número de Reynolds:
- **Flujo laminar** = animaciones suaves, predecibles
- **Flujo turbulento** = efectos de partículas, caos controlado
- Colores transicionan de verde (estable) a rojo (crítico)

### Tokens de Diseño CSS (globals.css)
```css
@theme inline {
  /* Fondos */
  --color-bg-base:      #0A0A0B;
  --color-bg-surface:   #0F0F11;
  --color-bg-elevated:  #161618;
  --color-bg-card:      #121214;

  /* Texto */
  --color-text-primary:   #F8F8F8;
  --color-text-secondary: #9CA3AF;
  --color-text-muted:     #6B7280;
  --color-text-accent:    #10B981;

  /* Acento (Esmeralda) */
  --color-accent-primary: #10B981;
  --color-accent-hover:   #34D399;
  --color-accent-subtle:  #10B98112;
  --color-accent-glow:    #10B98125;

  /* Colores de Régimen (Estados de Flujo) */
  --color-regime-laminar:    #10B981;  /* Verde - estable */
  --color-regime-transicion: #FBBF24;  /* Ámbar - advertencia */
  --color-regime-incipiente: #F97316;  /* Naranja - precaución */
  --color-regime-severo:     #EF4444;  /* Rojo - crítico */
}
```

### Variantes de Animación Framer Motion

#### 1. Fade In con Stagger
```tsx
const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.6, ease: [0.25, 0.4, 0.25, 1] },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

// Uso
<motion.div initial="hidden" animate="visible" variants={staggerContainer}>
  <motion.h1 variants={fadeIn} custom={0.1}>Título</motion.h1>
  <motion.p variants={fadeIn} custom={0.2}>Descripción</motion.p>
</motion.div>
```

#### 2. Scale In
```tsx
const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { delay, duration: 0.5, ease: [0.25, 0.4, 0.25, 1] },
  }),
};
```

#### 3. Hover en Cards
```tsx
<motion.div
  whileHover={{ y: -4, transition: { duration: 0.2 } }}
  className="rounded-2xl border border-border-subtle bg-bg-card"
>
  {/* Contenido */}
</motion.div>
```

#### 4. Botón con Spring
```tsx
<motion.button
  whileTap={{ scale: 0.9 }}
  animate={isSelected ? { scale: 1.1 } : { scale: 1 }}
  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
>
  {children}
</motion.button>
```

### Componente: Líneas de Flujo
```tsx
function FlowLines() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-px bg-gradient-to-r from-transparent via-accent-primary/30 to-transparent"
          style={{ top: `${20 + i * 15}%`, width: '100%' }}
          animate={{ x: ['-100%', '100%'] }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: 'linear',
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  );
}
```

### Componente: Partículas Flotantes
```tsx
function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-accent-primary/40"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
}
```

### Partículas de Flujo (Basadas en Intensidad)
```tsx
function FlowParticles({ color, intensity }: { color: string; intensity: number }) {
  const particleCount = Math.floor(intensity * 8) + 4;
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: particleCount }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 2 + Math.random() * 3,
            height: 2 + Math.random() * 3,
            backgroundColor: color,
            left: `${Math.random() * 100}%`,
            opacity: 0.4 + intensity * 0.3,
          }}
          initial={{ top: "100%", opacity: 0 }}
          animate={{ 
            top: "-10%", 
            opacity: [0, 0.6, 0],
            x: intensity > 0.5 ? [0, (Math.random() - 0.5) * 40, 0] : 0
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            delay: i * 0.3,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
```

### Contador Animado con Física Spring
```tsx
import { useSpring, useTransform } from 'framer-motion';

function AnimatedCounter({ value }: { value: number }) {
  const spring = useSpring(0, { stiffness: 40, damping: 20 });
  const display = useTransform(spring, (v) => v.toFixed(1));
  const [displayValue, setDisplayValue] = useState("0.0");

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  useEffect(() => {
    return display.on("change", (v) => setDisplayValue(v));
  }, [display]);

  return <>{displayValue}</>;
}
```

### Parallax con Scroll
```tsx
import { useScroll, useTransform } from 'framer-motion';

function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -50]);

  return (
    <section ref={heroRef}>
      <motion.div style={{ opacity: heroOpacity, y: heroY }}>
        {/* Contenido */}
      </motion.div>
    </section>
  );
}
```

### Escala Likert con Gradiente de Color
```tsx
const getButtonColor = (n: number, isSelected: boolean) => {
  if (!isSelected) return undefined;
  const colors = [
    'var(--color-regime-laminar)',    // 1 - baja fricción
    'var(--color-regime-laminar)',    // 2
    '#6EE7B7',                         // 3 - transición
    'var(--color-regime-transicion)', // 4 - neutral
    'var(--color-regime-incipiente)', // 5
    'var(--color-regime-incipiente)', // 6
    'var(--color-regime-severo)',     // 7 - alta fricción
  ];
  return colors[n - 1];
};

// Botón con efecto glow
<motion.button
  whileTap={{ scale: 0.9 }}
  animate={isSelected ? { scale: 1.1 } : { scale: 1 }}
  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
  style={{
    backgroundColor: isSelected ? buttonColor : undefined,
    boxShadow: isSelected ? `0 0 20px ${buttonColor}60` : undefined,
  }}
>
  {value}
</motion.button>
```

### Barra de Progreso con Indicador de Flujo
```tsx
<div className="relative h-1.5 w-full overflow-hidden rounded-full bg-bg-elevated/60">
  <motion.div
    className="absolute inset-y-0 left-0 rounded-full"
    initial={{ width: 0 }}
    animate={{ width: `${pct}%` }}
    transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    style={{
      background: `linear-gradient(90deg, 
        var(--color-regime-laminar) 0%, 
        var(--color-regime-transicion) 50%, 
        var(--color-accent-primary) 100%)`,
    }}
  />
  <motion.div
    className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full border-2 border-bg-base"
    animate={{ left: `calc(${pct}% - 6px)` }}
    transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    style={{ backgroundColor: flowState.color }}
  />
</div>
```

### Gauge SVG con Aguja Animada
```tsx
<motion.g
  initial={{ rotate: -180 }}
  animate={{ rotate: angle - 180 }}
  transition={{ 
    duration: 2, 
    type: "spring", 
    stiffness: 50, 
    damping: 12,
    delay: 0.5 
  }}
  style={{ transformOrigin: "100px 100px" }}
>
  <path d="M 100 100 L 98 30 L 100 20 L 102 30 Z" fill={config.color} />
  <circle cx="100" cy="100" r="10" fill="var(--color-bg-surface)" stroke={config.color} strokeWidth="3" />
</motion.g>
```

### Keyframes CSS
```css
@keyframes fade-in {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 5px currentColor; }
  50%       { box-shadow: 0 0 20px currentColor, 0 0 40px currentColor; }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-8px); }
}

@keyframes flow-lines {
  0% { stroke-dashoffset: 100; }
  100% { stroke-dashoffset: 0; }
}
```

### Clases Utilitarias
```css
/* Glassmorphism */
.glass {
  background: rgba(15, 15, 17, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* Botón fluido con shimmer en hover */
.btn-fluid {
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-fluid::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%);
  transform: translateX(-100%);
  transition: transform 0.5s ease;
}

.btn-fluid:hover::before {
  transform: translateX(100%);
}

/* Efecto glow para gauge */
.gauge-glow {
  filter: drop-shadow(0 0 8px var(--glow-color, var(--color-accent-primary)));
}

/* Línea de flujo animada (SVG) */
.flow-line {
  stroke-dasharray: 20 10;
  animation: flow-lines 2s linear infinite;
}
```

### Soporte Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Mejores Prácticas de Animación
1. Usar **animaciones spring** para elementos interactivos (botones, selecciones)
2. Usar curvas de easing **[0.25, 0.4, 0.25, 1]** para entradas suaves
3. Usar **stagger** para listas y grids (0.08-0.12s de delay)
4. **Codificar por color según régimen** - verde estable, rojo crítico
5. Añadir **efectos glow** en estados seleccionados/activos
6. Usar **layoutId** para transiciones de elementos compartidos
7. **Siempre soportar prefers-reduced-motion**
