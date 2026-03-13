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
  1: 'Totalmente en desacuerdo',
  2: 'En desacuerdo',
  3: 'Algo en desacuerdo',
  4: 'Neutral',
  5: 'Algo de acuerdo',
  6: 'De acuerdo',
  7: 'Totalmente de acuerdo',
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
      <div className="w-full space-y-5">
        {/* Fluid flow indicator labels */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-regime-laminar" />
            <span className="text-xs text-text-muted font-sans">{leftLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted font-sans text-right">{rightLabel}</span>
            <div className="h-2 w-2 rounded-full bg-regime-severo" />
          </div>
        </div>

        {/* Flow visualization line */}
        <div className="relative h-1 w-full rounded-full bg-gradient-to-r from-regime-laminar via-regime-transicion to-regime-severo opacity-30" />

        {/* Buttons - fluid tap targets */}
        <div
          role="radiogroup"
          aria-label="Escala de 1 a 7"
          className="flex justify-between gap-1.5 sm:gap-2"
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
                whileTap={disabled ? undefined : { scale: 0.92 }}
                animate={isSelected ? { 
                  scale: [1, 1.1, 1.05],
                } : { scale: 1 }}
                transition={isSelected ? { 
                  type: 'spring', 
                  stiffness: 500, 
                  damping: 15 
                } : { duration: 0.15 }}
                className={`
                  relative flex-1 min-h-[52px] min-w-[40px] max-w-[56px]
                  rounded-xl border-2
                  flex items-center justify-center
                  text-base sm:text-lg font-mono font-bold
                  transition-all duration-200
                  ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                  ${isSelected
                    ? 'border-transparent text-bg-base shadow-lg'
                    : 'bg-bg-elevated/80 border-border-subtle text-text-muted hover:border-border-default hover:text-text-secondary hover:bg-bg-surface'
                  }
                `}
                style={{
                  backgroundColor: isSelected ? buttonColor : undefined,
                  boxShadow: isSelected ? `0 0 24px ${buttonColor}50` : undefined,
                }}
              >
                {n}
                {/* Ripple effect on selection */}
                {isSelected && (
                  <motion.span
                    className="absolute inset-0 rounded-xl"
                    initial={{ opacity: 0.6, scale: 1 }}
                    animate={{ opacity: 0, scale: 1.5 }}
                    transition={{ duration: 0.5 }}
                    style={{ backgroundColor: buttonColor }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Selection feedback with fluid animation */}
        <AnimatePresence mode="wait">
          {value !== null && value !== undefined && (
            <motion.div
              key={value}
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="flex items-center justify-center gap-2 py-1"
            >
              <span 
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: getButtonColor(value, true) }}
              />
              <span 
                className="text-sm font-medium"
                style={{ color: getButtonColor(value, true) }}
              >
                {VALUE_LABELS[value]}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
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
