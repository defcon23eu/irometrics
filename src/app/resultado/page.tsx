'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import IROResultGauge from '@/components/resultado/IROGauge'

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
          <IROResultGauge reOrg={result.reOrg} regime={result.regime} animate={!reduced} />
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
