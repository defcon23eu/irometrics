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
    <div className="w-full space-y-3">
      {/* Single row: [label-left] [btn0..6] [label-right] */}
      <div className="flex items-center gap-2 sm:gap-3 w-full">
        <span className="shrink-0 w-14 sm:w-16 text-right text-[10px] sm:text-xs text-text-muted font-sans leading-tight">
          Nunca
        </span>

        <div
          role="radiogroup"
          aria-label="Escala de frecuencia de 0 a 6"
          className="flex flex-1 items-center justify-between gap-0.5 sm:gap-1"
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
          Siempre
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
