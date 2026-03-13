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
    <div className="w-full space-y-3">
      {/* Labels above */}
      <div className="grid grid-cols-2 gap-2 px-0.5 text-[10px] leading-snug text-text-muted sm:text-xs">
        <span className="max-w-[12ch] text-left [overflow-wrap:anywhere] sm:max-w-none">Totalmente en desacuerdo</span>
        <span className="justify-self-end max-w-[12ch] text-right [overflow-wrap:anywhere] sm:max-w-none">Totalmente de acuerdo</span>
      </div>

      {/* Buttons row — full width, 6 buttons = more space per button */}
      <div
        role="radiogroup"
        aria-label="Escala de 1 a 6"
        className="flex w-full items-center gap-2 sm:gap-3"
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
