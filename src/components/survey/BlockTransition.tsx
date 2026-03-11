'use client'

import { useEffect, useRef } from 'react'
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  animate,
  useMotionValue,
  useTransform,
} from 'framer-motion'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BlockTransitionProps {
  blockNum: 1 | 2 | 3
  blockLabel: string
  itemsDone: number
  totalItems: 50
  onComplete: () => void
}

// ─── Per-block message copy ───────────────────────────────────────────────────

const BLOCK_MESSAGES = {
  1: {
    title: 'Bloque IRO completado',
    sub: 'Has evaluado la dinámica de tu organización',
    motivation: 'Ya tienes el 24% · ¡Buen ritmo!',
    nextLabel: 'A continuación: tu experiencia profesional',
  },
  2: {
    title: 'Más de la mitad',
    sub: 'Burnout assessment completado',
    motivation: '56% completado · ¡Sigue adelante!',
    nextLabel: 'A continuación: actitud ante el cambio',
  },
  3: {
    title: 'Último bloque',
    sub: 'Solo queda 1 de 4 bloques',
    motivation: '90% completado · ¡Ya casi!',
    nextLabel: 'Último bloque · 90 segundos más',
  },
} as const

// ─── SVG dash lengths (circumference and check path) ─────────────────────────

// circle r=24 → circumference ≈ 150.8
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * 24

// check path M 14 24 L 22 32 L 34 16 — rough length ≈ 28
const CHECK_LENGTH = 28

// ─── Progress bar with animated width ────────────────────────────────────────

function ProgressBar({
  itemsDone,
  totalItems,
  delay,
  reduced,
}: {
  itemsDone: number
  totalItems: number
  delay: number
  reduced: boolean
}) {
  const progress = (itemsDone / totalItems) * 100
  return (
    <div
      className="w-full rounded-full"
      style={{ height: 4, backgroundColor: 'var(--color-border-subtle)' }}
      role="progressbar"
      aria-valuenow={itemsDone}
      aria-valuemin={0}
      aria-valuemax={totalItems}
      aria-label="Progreso del cuestionario"
    >
      <motion.div
        className="h-full rounded-full"
        style={{
          background:
            'linear-gradient(to right, var(--color-accent-primary), var(--color-accent-hover))',
        }}
        initial={{ width: '0%' }}
        animate={{ width: `${progress}%` }}
        transition={
          reduced
            ? { duration: 0 }
            : { duration: 0.6, delay: delay / 1000, ease: 'easeOut' }
        }
      />
    </div>
  )
}

// ─── Animated checkmark SVG ───────────────────────────────────────────────────

function AnimatedCheck({ reduced }: { reduced: boolean }) {
  return (
    <svg
      width={56}
      height={56}
      viewBox="0 0 56 56"
      fill="none"
      aria-hidden="true"
    >
      {/* Circle */}
      <motion.circle
        cx={28}
        cy={28}
        r={24}
        stroke="#22C55E"
        strokeWidth={2}
        strokeLinecap="round"
        initial={{ strokeDasharray: CIRCLE_CIRCUMFERENCE, strokeDashoffset: CIRCLE_CIRCUMFERENCE }}
        animate={{ strokeDashoffset: 0 }}
        transition={
          reduced
            ? { duration: 0 }
            : { duration: 0.4, ease: 'easeOut' }
        }
      />
      {/* Checkmark */}
      <motion.path
        d="M 16 28 L 24 36 L 40 20"
        stroke="#22C55E"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ strokeDasharray: CHECK_LENGTH, strokeDashoffset: CHECK_LENGTH }}
        animate={{ strokeDashoffset: 0 }}
        transition={
          reduced
            ? { duration: 0 }
            : { duration: 0.4, delay: 0.15, ease: 'easeOut' }
        }
      />
    </svg>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function BlockTransition({
  blockNum,
  blockLabel: _blockLabel,
  itemsDone,
  totalItems,
  onComplete,
}: BlockTransitionProps) {
  const reduced = useReducedMotion() ?? false
  const msg = BLOCK_MESSAGES[blockNum]
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Schedule onComplete after full sequence (2200ms) or short delay if reduced
  useEffect(() => {
    const delay = reduced ? 800 : 2200
    timerRef.current = setTimeout(onComplete, delay)
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current)
    }
  }, [onComplete, reduced])

  // Stagger delays (ms) for each phase — ignored when reduced
  const textDelay   = 400
  const barDelay    = 600
  const motiveDelay = 1000

  return (
    <AnimatePresence>
      <motion.div
        key="block-transition"
        className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6"
        style={{ backgroundColor: 'color-mix(in srgb, var(--color-bg-base) 95%, transparent)' }}
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        // backdrop-blur via inline style so it works without Tailwind plugin
        aria-live="polite"
        aria-atomic="true"
        role="status"
      >
        {/* Backdrop blur layer */}
        <div
          className="absolute inset-0 -z-10"
          style={{ backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
        />

        <div className="flex w-full max-w-sm flex-col items-center gap-6">

          {/* Phase 1 — Checkmark */}
          <AnimatedCheck reduced={reduced} />

          {/* Phase 2 — Title + subtitle */}
          <motion.div
            className="flex flex-col items-center gap-1 text-center"
            initial={reduced ? {} : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              reduced
                ? { duration: 0 }
                : { duration: 0.3, delay: textDelay / 1000, ease: 'easeOut' }
            }
          >
            <h2
              className="font-sans font-semibold text-text-primary"
              style={{ fontSize: '1.5rem' }}
            >
              {msg.title}
            </h2>
            <p
              className="font-sans text-text-secondary"
              style={{ fontSize: '0.875rem' }}
            >
              {msg.sub}
            </p>
          </motion.div>

          {/* Phase 3 — Progress bar */}
          <motion.div
            className="w-full"
            initial={reduced ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={
              reduced
                ? { duration: 0 }
                : { duration: 0.2, delay: barDelay / 1000 }
            }
          >
            <ProgressBar
              itemsDone={itemsDone}
              totalItems={totalItems}
              delay={barDelay}
              reduced={reduced}
            />
            <p
              className="mt-1.5 text-center font-mono text-text-muted"
              style={{ fontSize: '0.75rem' }}
            >
              {itemsDone} / {totalItems} ítems completados
            </p>
          </motion.div>

          {/* Phase 4 — Motivation + next hint */}
          <motion.div
            className="flex flex-col items-center gap-1 text-center"
            initial={reduced ? {} : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              reduced
                ? { duration: 0 }
                : { duration: 0.3, delay: motiveDelay / 1000, ease: 'easeOut' }
            }
          >
            <p
              className="font-sans font-medium"
              style={{ fontSize: '0.875rem', color: 'var(--color-accent-primary)' }}
            >
              {msg.motivation}
            </p>
            <p
              className="font-sans text-text-muted"
              style={{ fontSize: '0.8125rem' }}
            >
              {msg.nextLabel}
            </p>
          </motion.div>

        </div>
      </motion.div>
    </AnimatePresence>
  )
}
