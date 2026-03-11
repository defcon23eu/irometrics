'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { QuestionDef } from '@/types';

interface SocioQuestionProps {
  question: QuestionDef;
  value: string | number | undefined;
  onChange: (value: string | number) => void;
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3.5 8 6.5 11 12.5 5" />
    </svg>
  );
}

export default function SocioQuestion({ question, value, onChange }: SocioQuestionProps) {
  const [error, setError] = useState('');

  if (question.type === 'select' && question.options) {
    return (
      <div className="flex flex-col gap-2 w-full max-w-[640px] mx-auto">
        {question.options.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <motion.button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={`relative w-full rounded-lg px-5 py-4 text-left text-sm font-medium transition-all duration-150 ease-out sm:text-base
                ${
                  isSelected
                    ? 'bg-accent-glow border border-accent-primary text-text-accent shadow-glow'
                    : 'bg-bg-surface border border-border-default text-text-secondary hover:bg-bg-elevated hover:border-accent-border'
                }
              `}
            >
              {opt.label}
              <AnimatePresence>
                {isSelected && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-accent-primary"
                  >
                    <CheckIcon />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    );
  }

  // Number input
  const min = question.validation?.min ?? 0;
  const max = question.validation?.max ?? 999;

  function handleChange(raw: string) {
    if (raw === '') {
      setError('');
      return;
    }
    const num = parseInt(raw, 10);
    if (isNaN(num)) return;
    if (num < min || num > max) {
      setError(`Introduce un valor entre ${min} y ${max}`);
      return;
    }
    setError('');
    onChange(num);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={value ?? ''}
        onChange={(e) => handleChange(e.target.value)}
        aria-label={question.text}
        className="w-full max-w-[200px] rounded-lg border-2 border-border-default bg-bg-surface px-6 py-4 text-center text-2xl font-semibold text-text-primary outline-none transition-colors focus:border-accent-primary focus:shadow-glow"
        placeholder={`${min}–${max}`}
      />
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-sm text-regime-severo"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
