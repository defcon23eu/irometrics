'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface OregScaleProps {
  value: number | null;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const VALUE_LABELS: Record<number, string> = {
  1: 'Totalmente en desacuerdo',
  2: 'En desacuerdo',
  3: 'Algo en desacuerdo',
  4: 'Algo de acuerdo',
  5: 'De acuerdo',
  6: 'Totalmente de acuerdo',
};

export default function OregScale({ value, onChange, disabled = false }: OregScaleProps) {
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between text-[11px] sm:text-xs text-text-muted">
        <span className="max-w-[45%] leading-tight">
          Totalmente en desacuerdo
        </span>
        <span className="max-w-[45%] text-right leading-tight">
          Totalmente de acuerdo
        </span>
      </div>

      <div
        role="radiogroup"
        aria-label="Escala de 1 a 6"
        className="flex items-center gap-2 overflow-x-auto pb-1"
      >
          {Array.from({ length: 6 }, (_, i) => i + 1).map((n) => {
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
                  h-12 w-12 shrink-0 rounded-xl border-2
                  flex items-center justify-center
                  text-sm font-mono font-semibold
                  transition-all duration-150
                  ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                  ${isSelected
                    ? 'bg-accent-primary border-accent-primary text-white scale-105 shadow-[0_0_16px_#6366F125]'
                    : 'bg-bg-elevated border-border-subtle text-text-muted hover:border-border-focus hover:text-text-primary hover:bg-bg-elevated/80'
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
            className="text-center text-xs text-accent-primary font-medium h-4"
          >
            {VALUE_LABELS[value]}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
