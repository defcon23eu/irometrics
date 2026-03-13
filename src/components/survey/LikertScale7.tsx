'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface LikertScale7Props {
  value: number | null;
  onChange: (value: number) => void;
  leftLabel?: string;
  rightLabel?: string;
  disabled?: boolean;
  compact?: boolean;
}

const VALUE_LABELS: Record<number, string> = {
  1: 'Nada de acuerdo',
  2: 'En desacuerdo',
  3: 'Algo en desacuerdo',
  4: 'Neutral',
  5: 'Algo de acuerdo',
  6: 'De acuerdo',
  7: 'Muy de acuerdo',
};

const VALUE_LABELS_SHORT: Record<number, string> = {
  1: 'Nada',
  2: 'No',
  3: 'Poco',
  4: 'Neutral',
  5: 'Algo',
  6: 'Si',
  7: 'Mucho',
};

// Fluid color gradient from laminar (green) to turbulent (red)
const getButtonColor = (n: number, isSelected: boolean) => {
  if (!isSelected) return undefined;
  const colors = [
    'var(--color-regime-laminar)',    // 1 - low friction
    'var(--color-regime-laminar)',    // 2
    '#6EE7B7',                         // 3 - transition start
    'var(--color-regime-transicion)', // 4 - neutral/transition
    'var(--color-regime-incipiente)', // 5
    'var(--color-regime-incipiente)', // 6
    'var(--color-regime-severo)',     // 7 - high friction
  ];
  return colors[n - 1];
};

export default function LikertScale7({
  value,
  onChange,
  leftLabel = 'Totalmente en desacuerdo',
  rightLabel = 'Totalmente de acuerdo',
  disabled = false,
  compact = false,
}: LikertScale7Props) {
  
  if (compact) {
    return (
      <div className="w-full space-y-4">
        {/* Flow visualization gradient bar */}
        <div className="relative">
          <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-regime-laminar via-regime-transicion to-regime-severo opacity-40" />
          {/* Progress indicator */}
          {value !== null && (
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-bg-base"
              style={{ 
                backgroundColor: getButtonColor(value, true),
                left: `${((value - 1) / 6) * 100}%`,
                transform: 'translate(-50%, -50%)',
              }}
              layoutId="likert-indicator"
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            />
          )}
        </div>

        {/* Labels row - compact for mobile */}
        <div className="flex items-center justify-between text-[11px] sm:text-xs text-text-muted px-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-regime-laminar" />
            <span className="hidden sm:inline">{leftLabel}</span>
            <span className="sm:hidden">Nada</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="hidden sm:inline">{rightLabel}</span>
            <span className="sm:hidden">Mucho</span>
            <span className="w-2 h-2 rounded-full bg-regime-severo" />
          </span>
        </div>

        {/* Buttons - optimized tap targets */}
        <div
          role="radiogroup"
          aria-label="Escala de 1 a 7"
          className="flex justify-center gap-2 sm:gap-3"
        >
          {Array.from({ length: 7 }, (_, i) => i + 1).map((n) => {
            const isSelected = value === n;
            const buttonColor = getButtonColor(n, isSelected);
            
            return (
              <motion.button
                key={n}
                role="radio"
                aria-checked={isSelected}
                aria-label={`${n} — ${VALUE_LABELS[n]}`}
                disabled={disabled}
                onClick={() => onChange(n)}
                whileTap={disabled ? undefined : { scale: 0.9 }}
                animate={isSelected ? { 
                  scale: 1.1,
                } : { scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className={`
                  relative h-12 w-12 sm:h-14 sm:w-14
                  rounded-xl border-2
                  flex items-center justify-center
                  text-lg sm:text-xl font-mono font-bold
                  transition-colors duration-150
                  ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer active:scale-95'}
                  ${isSelected
                    ? 'border-transparent text-bg-base'
                    : 'bg-bg-elevated border-border-subtle text-text-muted hover:border-border-default hover:text-text-secondary'
                  }
                `}
                style={{
                  backgroundColor: isSelected ? buttonColor : undefined,
                  boxShadow: isSelected ? `0 0 20px ${buttonColor}60, 0 4px 12px ${buttonColor}30` : undefined,
                }}
              >
                {n}
              </motion.button>
            );
          })}
        </div>

        {/* Selection feedback */}
        <div className="h-8 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {value !== null && value !== undefined && (
              <motion.div
                key={value}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="flex items-center gap-2"
              >
                <span 
                  className="text-sm sm:text-base font-medium"
                  style={{ color: getButtonColor(value, true) }}
                >
                  {VALUE_LABELS[value]}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // Original inline layout for non-compact mode
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-3 w-full">
        <span className="shrink-0 w-20 text-right text-xs text-text-muted font-sans leading-tight">
          {leftLabel}
        </span>

        <div
          role="radiogroup"
          aria-label="Escala de 1 a 7"
          className="flex flex-1 items-center justify-between gap-1"
        >
          {Array.from({ length: 7 }, (_, i) => i + 1).map((n) => {
            const isSelected = value === n;
            const buttonColor = getButtonColor(n, isSelected);
            
            return (
              <motion.button
                key={n}
                role="radio"
                aria-checked={isSelected}
                aria-label={`${n} — ${VALUE_LABELS[n]}`}
                disabled={disabled}
                onClick={() => onChange(n)}
                whileTap={disabled ? undefined : { scale: 0.9 }}
                className={`
                  flex-1 aspect-square max-w-[44px] rounded-full border-2
                  flex items-center justify-center
                  text-sm font-mono font-semibold
                  transition-all duration-200
                  ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                  ${isSelected
                    ? 'border-transparent text-bg-base scale-110'
                    : 'bg-bg-elevated border-border-subtle text-text-muted hover:border-border-default hover:text-text-secondary'
                  }
                `}
                style={{
                  backgroundColor: isSelected ? buttonColor : undefined,
                  boxShadow: isSelected ? `0 0 16px ${buttonColor}40` : undefined,
                }}
              >
                {n}
              </motion.button>
            );
          })}
        </div>

        <span className="shrink-0 w-20 text-left text-xs text-text-muted font-sans leading-tight">
          {rightLabel}
        </span>
      </div>

      <AnimatePresence mode="wait">
        {value !== null && value !== undefined && (
          <motion.p
            key={value}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center text-xs font-medium h-4"
            style={{ color: getButtonColor(value, true) }}
          >
            {VALUE_LABELS[value]}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
