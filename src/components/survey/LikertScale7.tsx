'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface LikertScale7Props {
  value: number | null;
  onChange: (value: number) => void;
  leftLabel?: string;
  rightLabel?: string;
  disabled?: boolean;
  compact?: boolean;
}

const VALUE_LABELS: Record<number, string> = {
  1: 'Totalmente en desacuerdo',
  2: 'En desacuerdo',
  3: 'Algo en desacuerdo',
  4: 'Neutral',
  5: 'Algo de acuerdo',
  6: 'De acuerdo',
  7: 'Totalmente de acuerdo',
};

export default function LikertScale7({
  value,
  onChange,
  leftLabel = 'Totalmente en desacuerdo',
  rightLabel = 'Totalmente de acuerdo',
  disabled = false,
  compact = false,
}: LikertScale7Props) {
  
  // Compact mobile-friendly layout
  if (compact) {
    return (
      <div className="w-full space-y-4">
        {/* Labels on top */}
        <div className="flex items-center justify-between text-[10px] sm:text-xs text-text-muted font-sans px-1">
          <span>{leftLabel}</span>
          <span className="text-right">{rightLabel}</span>
        </div>

        {/* Desktop: single row, Mobile: 7 buttons in a row with flex-wrap */}
        <div
          role="radiogroup"
          aria-label="Escala de 1 a 7"
          className="flex flex-wrap justify-center gap-2 sm:gap-3 sm:flex-nowrap"
        >
          {Array.from({ length: 7 }, (_, i) => i + 1).map((n) => {
            const isSelected = value === n;
            return (
              <motion.button
                key={n}
                role="radio"
                aria-checked={isSelected}
                aria-label={`${n} — ${VALUE_LABELS[n]}`}
                disabled={disabled}
                onClick={() => onChange(n)}
                whileTap={disabled ? undefined : { scale: 0.9 }}
                animate={isSelected ? { scale: [1, 1.15, 1.05] } : { scale: 1 }}
                transition={isSelected ? { type: 'spring', stiffness: 400, damping: 10 } : undefined}
                className={`
                  h-12 w-12 sm:h-14 sm:w-14 rounded-xl border-2
                  flex items-center justify-center shrink-0
                  text-base sm:text-lg font-mono font-semibold
                  transition-colors duration-150
                  ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer active:scale-95'}
                  ${isSelected
                    ? 'bg-accent-primary border-accent-primary text-white shadow-[0_0_20px_#6366F140]'
                    : 'bg-bg-elevated border-border-subtle text-text-muted hover:border-border-focus hover:text-text-primary hover:bg-bg-surface'
                  }
                `}
              >
                {n}
              </motion.button>
            );
          })}
        </div>

        {/* Selection feedback */}
        <AnimatePresence mode="wait">
          {value !== null && value !== undefined && (
            <motion.p
              key={value}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center text-sm text-accent-primary font-medium"
            >
              {VALUE_LABELS[value]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Original layout
  return (
    <div className="w-full space-y-3">
      {/* Single row: [label-left] [btn1..7] [label-right] */}
      <div className="flex items-center gap-2 sm:gap-3 w-full">
        <span className="shrink-0 w-14 sm:w-16 text-right text-[10px] sm:text-xs text-text-muted font-sans leading-tight">
          {leftLabel}
        </span>

        <div
          role="radiogroup"
          aria-label="Escala de 1 a 7"
          className="flex flex-1 items-center justify-between gap-0.5 sm:gap-1"
        >
          {Array.from({ length: 7 }, (_, i) => i + 1).map((n) => {
            const isSelected = value === n;
            return (
              <motion.button
                key={n}
                role="radio"
                aria-checked={isSelected}
                aria-label={`${n} — ${VALUE_LABELS[n]}`}
                disabled={disabled}
                onClick={() => onChange(n)}
                whileTap={disabled ? undefined : { scale: 0.92 }}
                className={`
                  flex-1 aspect-square rounded-full border-2
                  flex items-center justify-center
                  text-xs sm:text-sm font-mono font-medium
                  transition-all duration-150 min-w-0
                  ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                  ${isSelected
                    ? 'bg-accent-primary border-accent-primary text-white scale-105 shadow-[0_0_16px_#6366F125]'
                    : 'bg-bg-elevated border-border-subtle text-text-muted hover:border-border-focus hover:text-text-primary hover:bg-bg-elevated/80'
                  }
                `}
                style={{ maxWidth: '44px' }}
              >
                {n}
              </motion.button>
            );
          })}
        </div>

        <span className="shrink-0 w-14 sm:w-16 text-left text-[10px] sm:text-xs text-text-muted font-sans leading-tight">
          {rightLabel}
        </span>
      </div>

      {/* Selection feedback */}
      <AnimatePresence mode="wait">
        {value !== null && value !== undefined && (
          <motion.p
            key={value}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center text-xs text-accent-primary font-medium h-4"
          >
            {VALUE_LABELS[value]}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
