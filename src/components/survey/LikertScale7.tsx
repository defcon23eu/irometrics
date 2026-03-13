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
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between text-[11px] sm:text-xs text-text-muted">
        <span className="max-w-[45%] leading-tight">
          {leftLabel}
        </span>
        <span className="max-w-[45%] text-right leading-tight">
          {rightLabel}
        </span>
      </div>

      <div
        role="radiogroup"
        aria-label="Escala de 1 a 7"
        className="flex items-center gap-2 overflow-x-auto pb-1"
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
                whileTap={disabled ? undefined : { scale: 0.92 }}
                className={`
                  h-12 w-12 shrink-0 rounded-xl border-2
                  flex items-center justify-center
                  text-sm font-mono font-semibold
                  transition-all duration-150
                  ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                  ${isSelected
                    ? 'text-white scale-105'
                    : 'bg-bg-elevated border-border-subtle text-text-muted hover:border-border-focus hover:text-text-primary hover:bg-bg-elevated/80'
                  }
                `}
                style={isSelected
                  ? {
                      backgroundColor: buttonColor,
                      borderColor: buttonColor,
                      boxShadow: `0 0 20px ${buttonColor}60`,
                    }
                  : undefined}
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
