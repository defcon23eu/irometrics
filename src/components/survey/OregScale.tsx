'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface OregScaleProps {
  value: number | null;
  onChange: (value: number) => void;
  disabled?: boolean;
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3.5 8 6.5 11 12.5 5" />
    </svg>
  );
}

export default function OregScale({ value, onChange, disabled = false }: OregScaleProps) {
  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-[640px] mx-auto">
      <div className="hidden sm:flex w-full justify-between mb-1">
        <span className="text-xs text-text-muted" id="oreg-left">Totalmente en desacuerdo</span>
        <span className="text-xs text-text-muted text-right" id="oreg-right">Totalmente de acuerdo</span>
      </div>

      <div
        role="radiogroup"
        aria-label="Escala de 1 a 6"
        aria-describedby="oreg-left oreg-right"
        className="flex flex-col sm:flex-row w-full gap-2 sm:gap-2"
      >
        {Array.from({ length: 6 }, (_, i) => i + 1).map((n) => {
          const isSelected = value === n;
          return (
            <motion.button
              key={n}
              role="radio"
              aria-checked={isSelected}
              aria-label={`Opción ${n} de 6`}
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

      <div className="flex sm:hidden w-full justify-between">
        <span className="text-xs text-text-muted max-w-[120px]">Totalmente en desacuerdo</span>
        <span className="text-xs text-text-muted max-w-[120px] text-right">Totalmente de acuerdo</span>
      </div>
    </div>
  );
}
