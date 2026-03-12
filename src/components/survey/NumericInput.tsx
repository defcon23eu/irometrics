'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface NumericInputProps {
  min: number;
  max: number;
  initialValue?: number;
  onConfirm: (value: number) => void;
  unit?: string;
}

export default function NumericInput({
  min, max, initialValue, onConfirm, unit,
}: NumericInputProps) {
  const [raw, setRaw] = useState<string>(initialValue?.toString() ?? '');
  const inputRef = useRef<HTMLInputElement>(null);
  const parsed = raw === '' ? null : parseInt(raw, 10);
  const isValid = parsed !== null && !isNaN(parsed) && parsed >= min && parsed <= max;

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleConfirm = () => {
    if (isValid && parsed !== null) onConfirm(parsed);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-5 w-full max-w-xs mx-auto"
    >
      <div className="relative w-full">
        <input
          ref={inputRef}
          type="number"
          inputMode="numeric"
          pattern="[0-9]*"
          min={min}
          max={max}
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleConfirm(); }}
          className={`
            w-full text-center text-4xl font-mono font-semibold py-6 px-4
            bg-bg-elevated rounded-xl border-2 transition-all duration-150
            text-text-primary placeholder-text-muted
            focus:outline-none focus:ring-2 focus:ring-accent-primary/20
            [appearance:textfield]
            [&::-webkit-outer-spin-button]:appearance-none
            [&::-webkit-inner-spin-button]:appearance-none
            ${isValid
              ? 'border-border-focus'
              : raw !== '' && !isValid
                ? 'border-regime-severo/50'
                : 'border-border-default'
            }
          `}
          placeholder="—"
        />
        {unit && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2
                           text-text-muted text-sm font-mono">
            {unit}
          </span>
        )}
      </div>

      {raw !== '' && !isValid && (
        <p className="text-xs text-regime-severo/80 font-mono">
          Valor entre {min} y {max}
        </p>
      )}

      <button
        onClick={handleConfirm}
        disabled={!isValid}
        className="
          w-full py-3.5 rounded-lg font-medium text-sm
          bg-accent-primary hover:bg-accent-hover
          disabled:opacity-25 disabled:cursor-not-allowed
          text-white transition-all duration-150 active:scale-[0.98]
        "
      >
        Confirmar →
      </button>

      <p className="text-xs text-text-muted font-mono">
        Rango: {min} – {max}{unit ? ` ${unit}` : ''}
      </p>
    </motion.div>
  );
}
