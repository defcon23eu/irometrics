'use client'

import { motion, useReducedMotion } from 'framer-motion'

interface BlockProgressProps {
  currentBlock: 1 | 2 | 3 | 4
  blockLabel: string
  itemsInBlock: number
  itemsDoneInBlock: number
  totalItems: number
  totalDone: number
}

/**
 * BlockProgress
 * Shows block indicator (Bloque X/4), percentage, and animated progress bar.
 * No "X/50" counter — only block + percentage per spec.
 */

const BLOCK_COLORS = {
  1: '#6366F1', // accent-primary for block A
  2: '#22C55E', // regime-laminar for block B (IRO)
  3: '#EAB308', // regime-transicion for block C (MBI)
  4: '#F97316', // regime-incipiente for block D (Oreg)
} as const

export default function BlockProgress({
  currentBlock,
  blockLabel,
  totalItems,
  totalDone,
}: BlockProgressProps) {
  const reduced = useReducedMotion()
  const pct = Math.round((totalDone / totalItems) * 100)
  const barColor = BLOCK_COLORS[currentBlock]

  return (
    <div className="w-full">
      {/* Top row: block indicator + percentage */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Block badge */}
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
            style={{
              backgroundColor: `${barColor}20`,
              color: barColor,
            }}
          >
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: barColor }}
            />
            Bloque {currentBlock}/4
          </span>
          {/* Block label */}
          <span className="hidden sm:inline text-sm text-text-muted">
            {blockLabel}
          </span>
        </div>

        {/* Percentage */}
        <span className="font-mono text-sm text-text-secondary tabular-nums">
          {pct}%
        </span>
      </div>

      {/* Progress bar */}
      <div
        className="h-1.5 w-full overflow-hidden rounded-full"
        style={{ backgroundColor: 'var(--color-border-subtle)' }}
        role="progressbar"
        aria-valuenow={totalDone}
        aria-valuemin={0}
        aria-valuemax={totalItems}
        aria-label={`Progreso del diagnóstico: ${pct}%`}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: barColor }}
          initial={{ width: '0%' }}
          animate={{ width: `${pct}%` }}
          transition={{
            duration: reduced ? 0 : 0.4,
            ease: 'easeOut',
          }}
        />
      </div>

      {/* Mobile block label */}
      <p className="mt-2 text-xs text-text-muted sm:hidden">
        {blockLabel}
      </p>
    </div>
  )
}
