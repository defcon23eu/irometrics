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
                animate={isSelected ? { scale: 1.08 } : { scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className={`
                  flex-1 aspect-square rounded-full border-2
                  flex items-center justify-center
                  text-xs sm:text-sm font-mono font-medium
                  transition-all duration-150 min-w-0
                  ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                  ${isSelected
                    ? 'text-white'
                    : 'bg-bg-elevated border-border-subtle text-text-muted hover:border-border-focus hover:text-text-primary hover:bg-bg-elevated/80'
                  }
                `}
                style={{
                  maxWidth: '44px',
                  ...(isSelected
                    ? {
                        backgroundColor: buttonColor,
                        borderColor: buttonColor,
                        boxShadow: `0 0 20px ${buttonColor}60`,
                      }
                    : {}),
                }}
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
