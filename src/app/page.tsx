'use client'

import { useRouter } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import AnimatedGridBackground from '@/components/hero/AnimatedGridBackground'

/* ─────────────────────────────────────────────
   Animation helpers — all respect reduced motion
───────────────────────────────────────────── */

function useFadeUp(delay: number) {
  const reduce = useReducedMotion()
  if (reduce) return { initial: {}, animate: {}, transition: {} }
  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: 'easeOut' },
  }
}

function useScaleIn(delay: number) {
  const reduce = useReducedMotion()
  if (reduce) return { initial: {}, animate: {}, transition: {} }
  return {
    initial: { opacity: 0, scale: 0.94 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.45, delay, ease: 'easeOut' },
  }
}

function useWhileInView(delay: number) {
  const reduce = useReducedMotion()
  if (reduce) {
    return {
      initial: {},
      whileInView: {},
      viewport: { once: true },
      transition: {},
    }
  }
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.5, delay, ease: 'easeOut' },
  }
}

/* ─────────────────────────────────────────────
   Hero SVG gauge preview (4-arc semicircle)
───────────────────────────────────────────── */

function GaugePreview() {
  // Log-scale arc boundaries for regime thresholds
  const cx = 100, cy = 90, r = 70
  const arcSegments = [
    { color: '#22C55E', start: -90, end: -52.6 },  // Laminar: 0-100
    { color: '#EAB308', start: -52.6, end: 0.4 },  // Transición: 100-800
    { color: '#F97316', start: 0.4, end: 17.8 },   // Incipiente: 800-1200
    { color: '#EF4444', start: 17.8, end: 90 },    // Severa: 1200+
  ]

  function describeArc(startDeg: number, endDeg: number): string {
    const rad = (d: number) => (d * Math.PI) / 180
    const x1 = cx + r * Math.cos(rad(startDeg))
    const y1 = cy + r * Math.sin(rad(startDeg))
    const x2 = cx + r * Math.cos(rad(endDeg))
    const y2 = cy + r * Math.sin(rad(endDeg))
    const large = endDeg - startDeg > 180 ? 1 : 0
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`
  }

  return (
    <svg
      viewBox="0 0 200 110"
      width="200"
      height="110"
      aria-label="Vista previa del medidor IRO con 4 zonas de color"
      role="img"
      className="opacity-80"
    >
      {/* Track */}
      <path
        d={describeArc(-90, 90)}
        fill="none"
        stroke="#27272A"
        strokeWidth={12}
        strokeLinecap="round"
      />
      {/* Colored arcs */}
      {arcSegments.map((seg, i) => (
        <path
          key={i}
          d={describeArc(seg.start, seg.end)}
          fill="none"
          stroke={seg.color}
          strokeWidth={12}
          strokeLinecap={i === 0 || i === arcSegments.length - 1 ? 'round' : 'butt'}
          opacity={0.9}
        />
      ))}
      {/* Center pivot */}
      <circle cx={cx} cy={cy} r={4} fill="#52525B" />
    </svg>
  )
}

/* ─────────────────────────────────────────────
   CTA Button (reused in hero + footer)
───────────────────────────────────────────── */

function CTAButton({ delay = 0.5 }: { delay?: number }) {
  const router = useRouter()
  const anim = useScaleIn(delay)

  return (
    <motion.button
      {...anim}
      onClick={() => router.push('/consentimiento')}
      className="inline-flex items-center gap-2 rounded-xl bg-accent-primary px-8 py-4 font-sans text-base font-semibold text-white shadow-lg transition-all duration-150 hover:bg-accent-hover hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
      aria-label="Iniciar diagnóstico organizacional"
    >
      Iniciar diagnóstico
      <span aria-hidden="true" className="ml-1">→</span>
    </motion.button>
  )
}

/* ─────────────────────────────────────────────
   Page
───────────────────────────────────────────── */

export default function HomePage() {
  const howCards = [
    {
      step: '01',
      title: 'Responde 50 preguntas',
      desc: 'Evalúa densidad, velocidad, dispersión y viscosidad organizacional en 8 minutos.',
    },
    {
      step: '02',
      title: 'El IRO se calcula',
      desc: 'Re_org = (δ·v·D)/μ aplicado a tu contexto específico de microempresa tech.',
    },
    {
      step: '03',
      title: 'Recibe tu diagnóstico',
      desc: 'Régimen laminar, transición o turbulencia con descripción detallada e implicaciones.',
    },
  ]

  const regimes = [
    {
      color: '#22C55E',
      bg: '#22C55E1F',
      label: 'Flujo Laminar',
      range: 'Re_org < 100',
      desc: 'Alta estabilidad organizacional. Procesos fluidos y coordinación eficiente.',
    },
    {
      color: '#EAB308',
      bg: '#EAB3081F',
      label: 'Régimen de Transición',
      range: '100 ≤ Re_org < 800',
      desc: 'Tensión moderada. Señales tempranas de turbulencia organizacional.',
    },
    {
      color: '#F97316',
      bg: '#F973161F',
      label: 'Turbulencia Incipiente',
      range: '800 ≤ Re_org < 1200',
      desc: 'Dinámica compleja. Riesgo elevado de desgaste profesional.',
    },
    {
      color: '#EF4444',
      bg: '#EF44441F',
      label: 'Turbulencia Severa',
      range: 'Re_org ≥ 1200',
      desc: 'Régimen crítico. Intervención preventiva urgente recomendada.',
    },
  ]

  return (
    <main className="min-h-screen bg-bg-base text-text-primary font-sans">

      {/* ══════════════════════════════════════
          SECTION 1 · HERO
      ══════════════════════════════════════ */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden"
        aria-labelledby="hero-heading"
      >
        <AnimatedGridBackground />

        <div className="relative z-10 flex flex-col items-center text-center gap-6 max-w-[680px]">

          {/* Trust badge */}
          <motion.p
            {...useFadeUp(0)}
            className="inline-flex items-center gap-2 rounded-full border border-accent-primary/30 bg-accent-subtle backdrop-blur-sm px-4 py-1.5 font-sans text-xs text-text-secondary"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent-primary" aria-hidden="true" />
            Estudio académico · UNED Psicología · 2025-2026
          </motion.p>

          {/* Headline */}
          <motion.h1
            id="hero-heading"
            {...useFadeUp(0.1)}
            className="text-balance font-sans font-bold text-text-primary"
            style={{ fontSize: 'clamp(2.25rem, 6vw, 3.5rem)', lineHeight: 1.1 }}
          >
            ¿En qué régimen opera
            <br className="hidden sm:block" /> tu organización?
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            {...useFadeUp(0.2)}
            className="max-w-[520px] font-sans text-lg text-text-secondary text-center text-pretty"
          >
            Diagnóstico de dinámica organizacional basado en el Índice de Reynolds
          </motion.p>

          {/* IRO Equation — styled block */}
          <motion.div
            {...useFadeUp(0.3)}
            className="flex flex-col items-center gap-3 py-4"
          >
            <div className="rounded-xl border border-border-subtle bg-bg-surface/60 backdrop-blur-md px-8 py-4">
              <span
                className="font-mono text-xl font-medium text-accent-primary tracking-wide"
                title="Índice de Reynolds Organizacional"
                aria-label="Fórmula: Re_org = (δ · v · D) / μ"
              >
                Re_org = (δ · v · D) / μ
              </span>
            </div>
          </motion.div>

          {/* Gauge preview */}
          <motion.div {...useFadeUp(0.35)}>
            <GaugePreview />
          </motion.div>

          {/* Stats row */}
          <motion.p
            {...useFadeUp(0.4)}
            className="font-sans text-sm text-text-muted tracking-wide"
          >
            8 min · 50 preguntas · Resultado IRO
          </motion.p>

          {/* CTA */}
          <CTAButton delay={0.5} />

          {/* Privacy note */}
          <motion.p
            {...useFadeUp(0.6)}
            className="font-sans text-xs text-text-muted text-center max-w-sm"
          >
            Datos anonimizados · Almacenamiento EU-Frankfurt · RGPD 2016/679
          </motion.p>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 2 · HOW IT WORKS
      ══════════════════════════════════════ */}
      <section
        className="border-y border-border-subtle bg-bg-surface py-20 px-4"
        aria-labelledby="how-heading"
      >
        <h2 id="how-heading" className="sr-only">Cómo funciona el diagnóstico</h2>
        <div className="mx-auto grid max-w-5xl gap-6 grid-cols-1 md:grid-cols-3">
          {howCards.map((card, i) => (
            <motion.article
              key={card.step}
              {...useWhileInView(i * 0.1)}
              className="group relative rounded-2xl border border-border-subtle bg-bg-elevated/80 backdrop-blur-md p-6 flex flex-col gap-4 transition-colors hover:border-accent-primary/40"
            >
              <span
                aria-hidden="true"
                className="font-mono text-4xl font-bold text-accent-primary/20 group-hover:text-accent-primary/30 transition-colors"
              >
                {card.step}
              </span>
              <h3 className="font-sans text-lg font-semibold text-text-primary">
                {card.title}
              </h3>
              <p className="font-sans text-sm text-text-secondary leading-relaxed">
                {card.desc}
              </p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 3 · REGIME PREVIEW
      ══════════════════════════════════════ */}
      <section
        className="py-20 px-4"
        aria-labelledby="regimes-heading"
      >
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <motion.h2
              {...useWhileInView(0)}
              id="regimes-heading"
              className="font-sans text-2xl sm:text-3xl font-semibold text-text-primary text-balance"
            >
              Cuatro regímenes posibles
            </motion.h2>
            <motion.p
              {...useWhileInView(0.05)}
              className="mt-3 font-sans text-sm text-text-secondary"
            >
              Tu resultado caerá en uno de estos rangos del Índice de Reynolds Organizacional
            </motion.p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {regimes.map((regime, i) => (
              <motion.article
                key={regime.label}
                {...useWhileInView(i * 0.08)}
                className="rounded-2xl border border-border-subtle bg-bg-surface/80 backdrop-blur-sm p-6 flex flex-col gap-3 transition-all hover:bg-bg-elevated/60"
                style={{ borderLeftWidth: '4px', borderLeftColor: regime.color }}
              >
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: regime.color }}
                  />
                  <h3
                    className="font-sans text-base font-semibold"
                    style={{ color: regime.color }}
                  >
                    {regime.label}
                  </h3>
                </div>
                <p className="font-mono text-xs text-text-muted">
                  {regime.range}
                </p>
                <p className="font-sans text-sm text-text-secondary leading-relaxed">
                  {regime.desc}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 4 · CTA FOOTER
      ══════════════════════════════════════ */}
      <section
        className="py-24 px-4 bg-bg-surface/50 border-t border-border-subtle text-center flex flex-col items-center gap-8"
        aria-labelledby="cta-footer-heading"
      >
        <motion.h2
          {...useWhileInView(0)}
          id="cta-footer-heading"
          className="font-sans font-semibold text-text-primary text-balance"
          style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)' }}
        >
          ¿Listo para conocer tu Re_org?
        </motion.h2>

        <CTAButton delay={0.1} />

        {/* UNED seal */}
        <motion.div
          {...useWhileInView(0.15)}
          className="flex items-center gap-4 mt-4"
        >
          <div
            className="w-10 h-10 rounded-lg bg-bg-elevated border border-border-subtle flex items-center justify-center text-text-muted text-xs font-mono"
            aria-hidden="true"
          >
            UNED
          </div>
          <p className="font-sans text-xs text-text-muted text-left max-w-[240px]">
            Estudio avalado por UNED<br />
            Grado en Psicología · Curso 2025-2026
          </p>
        </motion.div>
      </section>

    </main>
  )
}
