'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface LikertScale7Props {
  value: number | null;
  onChange: (value: number) => void;
  leftLabel?: string;
  rightLabel?: string;
  disabled?: boolean;
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

function getButtonColor(n: number): string {
  const colors = [
    'var(--color-regime-laminar)',
    'var(--color-regime-laminar)',
    '#6EE7B7',
    'var(--color-regime-transicion)',
    'var(--color-regime-incipiente)',
    'var(--color-regime-incipiente)',
    'var(--color-regime-severo)',
  ];
  return colors[n - 1];
}

export default function LikertScale7({
  value,
  onChange,
  leftLabel = 'Totalmente en desacuerdo',
  rightLabel = 'Totalmente de acuerdo',
  disabled = false,
}: LikertScale7Props) {
  return (
    <div className="w-full space-y-3">
      {/* Labels above */}
      <div className="grid grid-cols-2 gap-2 px-0.5 text-[10px] leading-snug text-text-muted sm:text-xs">
        <span className="max-w-[12ch] text-left [overflow-wrap:anywhere] sm:max-w-none">{leftLabel}</span>
        <span className="justify-self-end max-w-[12ch] text-right [overflow-wrap:anywhere] sm:max-w-none">{rightLabel}</span>
      </div>

      {/* Buttons row — full width, no lateral labels compressing */}
      <div
        role="radiogroup"
        aria-label="Escala de 1 a 7"
        className="flex w-full items-center gap-1.5 sm:gap-2"
      >
        {Array.from({ length: 7 }, (_, i) => i + 1).map((n) => {
          const isSelected = value === n;
          const buttonColor = getButtonColor(n);
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
                  ? 'text-white'
                  : 'bg-bg-elevated border-border-subtle text-text-secondary hover:border-border-focus hover:text-text-primary'
                }
              `}
              style={isSelected
                ? { backgroundColor: buttonColor, borderColor: buttonColor, boxShadow: `0 0 24px ${buttonColor}70` }
                : {}}
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
