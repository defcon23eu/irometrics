'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'

// ─── Types ────────────────────────────────────────────────────────────────────

type Regime = 'laminar' | 'transicion' | 'turbulencia_incipiente' | 'turbulencia_severa'

interface IroResult {
  reOrg: number
  regime: Regime
  reOrgLog: number
  duracionSeg: number
  completedAt: string
}

// ─── Regime config ────────────────────────────────────────────────────────────

const REGIME_CONFIG: Record<Regime, {
  color: string
  bg: string
  border: string
  label: string
  range: string
  description: string
}> = {
  laminar: {
    color: '#22C55E',
    bg: '#22C55E1F',
    border: '#22C55E40',
    label: 'Flujo Laminar',
    range: 'Re_org < 100',
    description: 'Tu organización opera con alta estabilidad y coordinación eficiente. Los procesos fluyen con mínima fricción interna.',
  },
  transicion: {
    color: '#EAB308',
    bg: '#EAB3081F',
    border: '#EAB30840',
    label: 'Régimen de Transición',
    range: '100 ≤ Re_org < 800',
    description: 'Tensión organizacional moderada. Señales tempranas de turbulencia que pueden derivar en desgaste si no se gestionan.',
  },
  turbulencia_incipiente: {
    color: '#F97316',
    bg: '#F973161F',
    border: '#F9731640',
    label: 'Turbulencia Incipiente',
    range: '800 ≤ Re_org < 1.200',
    description: 'Dinámica organizacional compleja con riesgo elevado de burnout. Intervención preventiva recomendada a corto plazo.',
  },
  turbulencia_severa: {
    color: '#EF4444',
    bg: '#EF44441F',
    border: '#EF444440',
    label: 'Turbulencia Severa',
    range: 'Re_org ≥ 1.200',
    description: 'Régimen crítico de dinámica organizacional. El riesgo de desgaste profesional es máximo. Intervención urgente necesaria.',
  },
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = Math.round(sec % 60)
  return m > 0 ? `${m} min ${s} s` : `${s} s`
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

// Map reOrg to needle angle on the semicircle (−90° → +90°) using log scale
function reOrgToAngle(reOrg: number): number {
  const maxLog = Math.log10(2001)
  const valLog = Math.log10(Math.min(reOrg, 2000) + 1)
  return -90 + Math.min(valLog / maxLog, 1) * 180
}

// ─── Gauge SVG helpers ────────────────────────────────────────────────────────

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number,
): string {
  const rad = (d: number) => (d * Math.PI) / 180
  const x1 = cx + r * Math.cos(rad(startDeg))
  const y1 = cy + r * Math.sin(rad(startDeg))
  const x2 = cx + r * Math.cos(rad(endDeg))
  const y2 = cy + r * Math.sin(rad(endDeg))
  const large = endDeg - startDeg > 180 ? 1 : 0
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`
}

// Segment boundaries computed from log10 scale across 180°
// log10(101)/log10(2001)*180 ≈ 37.4  (laminar 0–100)
// (log10(801)−log10(101))/log10(2001)*180 ≈ 53.0  (transición 100–800)
// (log10(1201)−log10(801))/log10(2001)*180 ≈ 17.4  (incipiente 800–1200)
// remainder ≈ 72.2  (severo 1200+)
const ARC_SEGMENTS: { color: string; start: number; end: number }[] = [
  { color: '#22C55E', start: -90,       end: -90 + 37.4              },
  { color: '#EAB308', start: -90 + 37.4, end: -90 + 37.4 + 53.0     },
  { color: '#F97316', start: -90 + 37.4 + 53.0, end: -90 + 37.4 + 53.0 + 17.4 },
  { color: '#EF4444', start: -90 + 37.4 + 53.0 + 17.4, end: 90      },
]

// ─── Gauge component ──────────────────────────────────────────────────────────

function IroGauge({
  reOrg,
  regime,
  animate: doAnimate,
}: {
  reOrg: number
  regime: Regime
  animate: boolean
}) {
  const cfg = REGIME_CONFIG[regime]
  const targetAngle = reOrgToAngle(reOrg)
  const [needleAngle, setNeedleAngle] = useState(doAnimate ? -90 : targetAngle)

  useEffect(() => {
    if (!doAnimate) { setNeedleAngle(targetAngle); return }
    const duration = 1800
    const start = performance.now()
    const from = -90
    let raf: number
    function frame(now: number) {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setNeedleAngle(from + eased * (targetAngle - from))
      if (t < 1) raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [targetAngle, doAnimate])

  const cx = 140
  const cy = 140
  const r = 100
  const rad = (d: number) => (d * Math.PI) / 180
  const needleLen = 82
  const nx = cx + needleLen * Math.cos(rad(needleAngle))
  const ny = cy + needleLen * Math.sin(rad(needleAngle))

  return (
    <svg
      viewBox="0 0 280 160"
      width="100%"
      style={{ maxWidth: 320 }}
      role="img"
      aria-label={`Medidor IRO: ${reOrg.toFixed(1)} — ${cfg.label}`}
    >
      {/* Track */}
      <path
        d={describeArc(cx, cy, r, -90, 90)}
        fill="none"
        stroke="#27272A"
        strokeWidth={16}
        strokeLinecap="round"
      />

      {/* Colored segments */}
      {ARC_SEGMENTS.map((seg, i) => (
        <path
          key={i}
          d={describeArc(cx, cy, r, seg.start, seg.end)}
          fill="none"
          stroke={seg.color}
          strokeWidth={16}
          strokeLinecap={
            i === 0
              ? 'round'
              : i === ARC_SEGMENTS.length - 1
              ? 'round'
              : 'butt'
          }
          opacity={0.85}
        />
      ))}

      {/* Needle line */}
      <line
        x1={cx} y1={cy}
        x2={nx} y2={ny}
        stroke={cfg.color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      {/* Needle tip */}
      <circle cx={nx} cy={ny} r={4} fill={cfg.color} />
      {/* Needle base */}
      <circle cx={cx} cy={cy} r={5} fill="#52525B" />

      {/* Centre value */}
      <text
        x={cx} y={cy + 28}
        textAnchor="middle"
        fontFamily="var(--font-geist-mono), monospace"
        fontSize="14"
        fontWeight="700"
        fill={cfg.color}
      >
        {reOrg.toFixed(1)}
      </text>

      {/* Arc labels */}
      <text x={32}  y={152} textAnchor="middle" fontFamily="var(--font-geist-sans), sans-serif" fontSize="10" fill="#52525B">Laminar</text>
      <text x={248} y={152} textAnchor="middle" fontFamily="var(--font-geist-sans), sans-serif" fontSize="10" fill="#52525B">Severo</text>
    </svg>
  )
}

// ─── Count-up hook ────────────────────────────────────────────────────────────

function useCountUp(target: number, duration: number, run: boolean, reduced: boolean): number {
  const [value, setValue] = useState(reduced ? target : 0)

  useEffect(() => {
    if (!run || reduced) { setValue(target); return }
    const start = performance.now()
    let raf: number
    function frame(now: number) {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(eased * target)
      if (t < 1) raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [target, duration, run, reduced])

  return value
}

// ─── Animation helpers ────────────────────────────────────────────────────────

type MotionProps = {
  initial: object
  animate: object
  transition: object
}

function fadeIn(delayMs: number, reduced: boolean): MotionProps {
  if (reduced) return { initial: {}, animate: {}, transition: {} }
  return {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay: delayMs / 1000, ease: 'easeOut' },
  }
}

function slideUp(delayMs: number, reduced: boolean): MotionProps {
  if (reduced) return { initial: {}, animate: {}, transition: {} }
  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay: delayMs / 1000, ease: 'easeOut' },
  }
}

function scaleIn(delayMs: number, reduced: boolean): MotionProps {
  if (reduced) return { initial: {}, animate: {}, transition: {} }
  return {
    initial: { opacity: 0, scale: 0.92 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.45, delay: delayMs / 1000, ease: 'easeOut' },
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ResultadoPage() {
  const router = useRouter()
  const reduced = useReducedMotion() ?? false
  const [result, setResult] = useState<IroResult | null>(null)
  const [ready, setReady] = useState(false)
  const hasRead = useRef(false)

  useEffect(() => {
    if (hasRead.current) return
    hasRead.current = true
    try {
      const raw = sessionStorage.getItem('iro_result')
      if (!raw) { router.replace('/'); return }
      const parsed = JSON.parse(raw) as IroResult
      if (
        typeof parsed.reOrg !== 'number' ||
        typeof parsed.regime !== 'string' ||
        !(parsed.regime in REGIME_CONFIG)
      ) {
        router.replace('/')
        return
      }
      sessionStorage.removeItem('iro_result')
      setResult(parsed)
      setReady(true)
    } catch {
      router.replace('/')
    }
  }, [router])

  const countedValue = useCountUp(result?.reOrg ?? 0, 1800, ready, reduced)

  if (!ready || !result) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-bg-base">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-border-default border-t-accent-primary" />
      </main>
    )
  }

  const cfg = REGIME_CONFIG[result.regime]

  const metrics: { label: string; value: string }[] = [
    { label: 'Tiempo',   value: formatDuration(result.duracionSeg) },
    { label: 'Ítems',    value: '50 / 50'                          },
    { label: 'IRO_log',  value: result.reOrgLog.toFixed(4)         },
  ]

  return (
    <main className="min-h-screen bg-bg-base py-12 px-4">
      <div className="mx-auto max-w-2xl flex flex-col gap-8">

        {/* Block 1 — Header badge */}
        <motion.div className="flex justify-center" {...fadeIn(0, reduced)}>
          <span
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-sans text-sm text-text-secondary border"
            style={{
              backgroundColor: 'var(--color-accent-subtle)',
              borderColor: 'var(--color-accent-border)',
            }}
          >
            Diagnóstico completado · {formatDate(result.completedAt)}
          </span>
        </motion.div>

        {/* Block 2 — IRO Value */}
        <motion.section
          aria-labelledby="iro-heading"
          className="flex flex-col items-center gap-1 text-center"
          {...fadeIn(100, reduced)}
        >
          <p
            id="iro-heading"
            className="font-sans uppercase tracking-widest text-text-secondary"
            style={{ fontSize: '0.875rem' }}
          >
            Tu Índice de Reynolds Organizacional
          </p>
          <p
            className="font-mono font-bold tabular-nums leading-none"
            style={{
              fontSize: 'clamp(3.5rem, 12vw, 6rem)',
              color: cfg.color,
            }}
            aria-label={`IRO: ${result.reOrg.toFixed(1)}`}
          >
            {countedValue.toFixed(1)}
          </p>
          <p
            className="font-mono text-text-muted mt-1"
            style={{ fontSize: '0.875rem' }}
          >
            IRO_log = {result.reOrgLog.toFixed(4)}
          </p>
        </motion.section>

        {/* Block 3 — Gauge */}
        <motion.div className="flex justify-center" {...scaleIn(200, reduced)}>
          <IroGauge reOrg={result.reOrg} regime={result.regime} animate={!reduced} />
        </motion.div>

        {/* Block 4 — Regime badge */}
        <motion.div
          className="flex flex-col items-center gap-2"
          {...slideUp(300, reduced)}
        >
          <div
            className="inline-flex items-center gap-2 rounded-2xl border px-6 py-3"
            style={{ backgroundColor: cfg.bg, borderColor: cfg.border }}
          >
            <span
              aria-hidden="true"
              className="shrink-0 rounded-full"
              style={{ width: 8, height: 8, backgroundColor: cfg.color }}
            />
            <span
              className="font-sans font-semibold"
              style={{ color: cfg.color, fontSize: '1.125rem' }}
            >
              {cfg.label}
            </span>
          </div>
          <p
            className="font-mono text-text-muted"
            style={{ fontSize: '0.75rem' }}
          >
            {cfg.range}
          </p>
        </motion.div>

        {/* Block 5 — Description card */}
        <motion.div
          className="rounded-r-xl p-5"
          style={{
            borderLeft: `4px solid ${cfg.color}`,
            backgroundColor: cfg.bg,
          }}
          {...fadeIn(400, reduced)}
        >
          <p className="font-sans text-text-primary leading-relaxed" style={{ fontSize: '1rem' }}>
            {cfg.description}
          </p>
        </motion.div>

        {/* Block 6 — Metrics grid */}
        <motion.div
          className="grid grid-cols-3 gap-3"
          role="list"
          aria-label="Métricas del diagnóstico"
          {...fadeIn(500, reduced)}
        >
          {metrics.map((m) => (
            <div
              key={m.label}
              role="listitem"
              className="flex flex-col gap-1 rounded-xl border border-border-subtle bg-bg-surface p-4"
            >
              <span
                className="font-sans text-text-muted"
                style={{ fontSize: '0.75rem' }}
              >
                {m.label}
              </span>
              <span
                className="font-mono font-semibold text-text-primary"
                style={{ fontSize: '1.25rem' }}
              >
                {m.value}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Block 7 — Academic note */}
        <footer className="flex flex-col items-center gap-2 pb-4 text-center">
          <p
            className="max-w-md font-sans text-text-muted leading-relaxed"
            style={{ fontSize: '0.8125rem' }}
          >
            Este resultado forma parte de una investigación académica de la UNED
            sobre burnout en microempresas tecnológicas españolas.
            Tus respuestas son completamente anónimas.
          </p>
          <p
            className="font-sans text-text-muted"
            style={{ fontSize: '0.75rem' }}
          >
            Grado en Psicología · UNED · Curso 2025-2026
          </p>
        </footer>

      </div>
    </main>
  )
}
