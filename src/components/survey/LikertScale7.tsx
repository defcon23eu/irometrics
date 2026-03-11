'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface LikertScale7Props {
  value: number | null;
  onChange: (value: number) => void;
  leftLabel?: string;
  rightLabel?: string;
  disabled?: boolean;
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3.5 8 6.5 11 12.5 5" />
    </svg>
  );
}

export default function LikertScale7({
  value,
  onChange,
  leftLabel = 'Totalmente en desacuerdo',
  rightLabel = 'Totalmente de acuerdo',
  disabled = false,
}: LikertScale7Props) {
  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-[640px] mx-auto">
      {/* Labels — top on desktop */}
      <div className="hidden sm:flex w-full justify-between mb-1">
        <span className="text-xs text-text-muted max-w-[140px]" id="likert7-left">{leftLabel}</span>
        <span className="text-xs text-text-muted max-w-[140px] text-right" id="likert7-right">{rightLabel}</span>
      </div>

      {/* Buttons — vertical on mobile, horizontal on desktop */}
      <div
        role="radiogroup"
        aria-label="Escala de 1 a 7"
        aria-describedby="likert7-left likert7-right"
        className="flex flex-col sm:flex-row w-full gap-2 sm:gap-2"
      >
        {Array.from({ length: 7 }, (_, i) => i + 1).map((n) => {
          const isSelected = value === n;
          return (
            <motion.button
              key={n}
              role="radio"
              aria-checked={isSelected}
              aria-label={`Opción ${n} de 7`}
              disabled={disabled}
              onClick={() => onChange(n)}
              whileTap={disabled ? undefined : { scale: 0.95 }}
              whileHover={disabled ? undefined : { scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={`relative flex items-center justify-center rounded-lg font-semibold
                w-full h-14 sm:h-[52px] sm:flex-1
                transition-all duration-150 ease-out
                ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                ${
                  isSelected
                    ? 'bg-accent-glow border border-accent-primary text-text-accent shadow-glow'
                    : 'bg-bg-surface border border-border-default text-text-secondary hover:bg-bg-elevated hover:border-accent-border'
                }
              `}
            >
              <span className="text-lg">{n}</span>
              <AnimatePresence>
                {isSelected && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute right-3 text-accent-primary"
                  >
                    <CheckIcon />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      {/* Labels — bottom on mobile */}
      <div className="flex sm:hidden w-full justify-between">
        <span className="text-xs text-text-muted max-w-[120px]">{leftLabel}</span>
        <span className="text-xs text-text-muted max-w-[120px] text-right">{rightLabel}</span>
      </div>
    </div>
  );
}
