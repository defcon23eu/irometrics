'use client'

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

interface LikertScale7Props {
  value: number | null
  onChange: (value: number) => void
  leftLabel?: string
  rightLabel?: string
  disabled?: boolean
}

const LABELS = [
  'Nunca',
  'Rara vez',
  'A veces',
  'Neutral',
  'A menudo',
  'Frecuentemente',
  'Siempre',
]

export default function LikertScale7({
  value,
  onChange,
  leftLabel = 'Totalmente en desacuerdo',
  rightLabel = 'Totalmente de acuerdo',
  disabled = false,
}: LikertScale7Props) {
  const reduced = useReducedMotion()

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-[640px] mx-auto">

      {/* Labels — top on desktop */}
      <div className="hidden sm:flex w-full justify-between px-1">
        <span className="text-xs text-text-muted max-w-[120px]" id="likert7-left">
          {leftLabel}
        </span>
        <span className="text-xs text-text-muted max-w-[120px] text-right" id="likert7-right">
          {rightLabel}
        </span>
      </div>

      {/* Desktop: horizontal row */}
      <div
        role="radiogroup"
        aria-label="Escala de 1 a 7"
        aria-describedby="likert7-left likert7-right"
        className="hidden sm:flex w-full gap-2 justify-center"
      >
        {Array.from({ length: 7 }, (_, i) => i + 1).map((n) => {
          const isSelected = value === n
          return (
            <motion.button
              key={n}
              role="radio"
              aria-checked={isSelected}
              aria-label={`${n} - ${LABELS[n - 1]}`}
              disabled={disabled}
              onClick={() => onChange(n)}
              whileTap={disabled || reduced ? undefined : { scale: 0.92 }}
              whileHover={disabled || reduced ? undefined : { scale: 1.08 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              className={`
                relative flex items-center justify-center rounded-full font-semibold
                h-14 w-14 shrink-0 border-2 transition-all duration-150 ease-out
                ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                ${
                  isSelected
                    ? 'bg-accent-primary border-accent-primary text-white scale-105 shadow-[0_0_20px_rgba(99,102,241,0.4)]'
                    : 'bg-bg-surface/60 border-border-subtle text-text-secondary hover:border-accent-primary/50 hover:bg-bg-elevated'
                }
              `}
            >
              <span className="text-lg tabular-nums">{n}</span>
              <AnimatePresence>
                {isSelected && !reduced && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1.5 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="absolute inset-0 rounded-full border-2 border-accent-primary/50 pointer-events-none"
                  />
                )}
              </AnimatePresence>
            </motion.button>
          )
        })}
      </div>

      {/* Mobile: 2x4 grid (7 items + 1 empty) */}
      <div
        role="radiogroup"
        aria-label="Escala de 1 a 7"
        className="grid grid-cols-4 gap-3 w-full sm:hidden"
      >
        {Array.from({ length: 7 }, (_, i) => i + 1).map((n) => {
          const isSelected = value === n
          return (
            <motion.button
              key={n}
              role="radio"
              aria-checked={isSelected}
              aria-label={`${n} - ${LABELS[n - 1]}`}
              disabled={disabled}
              onClick={() => onChange(n)}
              whileTap={disabled || reduced ? undefined : { scale: 0.92 }}
              className={`
                relative flex flex-col items-center justify-center rounded-2xl font-semibold
                h-16 border-2 transition-all duration-150 ease-out
                ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                ${
                  isSelected
                    ? 'bg-accent-primary border-accent-primary text-white scale-[1.02] shadow-[0_0_16px_rgba(99,102,241,0.4)]'
                    : 'bg-bg-surface/60 border-border-subtle text-text-secondary active:bg-bg-elevated'
                }
              `}
            >
              <span className="text-lg tabular-nums">{n}</span>
              <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-white/80' : 'text-text-muted'}`}>
                {LABELS[n - 1]}
              </span>
            </motion.button>
          )
        })}
        {/* Empty cell for 2x4 grid alignment */}
        <div aria-hidden="true" />
      </div>

      {/* Labels — bottom on mobile */}
      <div className="flex sm:hidden w-full justify-between px-1">
        <span className="text-xs text-text-muted max-w-[100px]">{leftLabel}</span>
        <span className="text-xs text-text-muted max-w-[100px] text-right">{rightLabel}</span>
      </div>
    </div>
  )
}
