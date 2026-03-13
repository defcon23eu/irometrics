'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface MBIScaleProps {
  value: number | null;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const VALUE_LABELS: Record<number, string> = {
  0: 'Nunca',
  1: 'Casi nunca',
  2: 'Alguna vez',
  3: 'Regularmente',
  4: 'Bastante a menudo',
  5: 'Casi siempre',
  6: 'Siempre',
};

export default function MBIScale({ value, onChange, disabled = false }: MBIScaleProps) {
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between text-[11px] sm:text-xs text-text-muted">
        <span className="max-w-[45%] leading-tight">
          Nunca
        </span>
        <span className="max-w-[45%] text-right leading-tight">
          Siempre
        </span>
      </div>

      <div
        role="radiogroup"
        aria-label="Escala de frecuencia de 0 a 6"
        className="flex items-center gap-2 overflow-x-auto pb-1"
      >
          {Array.from({ length: 7 }, (_, i) => i).map((n) => {
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
