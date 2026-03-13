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
      {/* Labels above */}
      <div className="flex justify-between px-0.5 text-[10px] leading-tight text-text-muted sm:text-xs">
        <span>Nunca</span>
        <span>Siempre</span>
      </div>

      {/* Buttons row — full width */}
      <div
        role="radiogroup"
        aria-label="Escala de frecuencia de 0 a 6"
        className="flex w-full items-center gap-1.5 sm:gap-2"
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
              whileTap={disabled ? undefined : { scale: 0.88 }}
              animate={isSelected ? { scale: 1.12 } : { scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className={`
                flex-1 aspect-square rounded-full border-2
                flex items-center justify-center
                text-sm font-mono font-semibold
                min-h-[44px]
                transition-colors duration-150
                ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                ${isSelected
                  ? 'bg-accent-primary border-accent-primary text-white shadow-[0_0_24px_#6366F170]'
                  : 'bg-bg-elevated border-border-subtle text-text-secondary hover:border-border-focus hover:text-text-primary'
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
            className="min-h-[1.75rem] px-1 text-center text-[11px] leading-snug text-accent-primary font-medium [overflow-wrap:anywhere]"
          >
            {VALUE_LABELS[value]}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
