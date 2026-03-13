'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { QuestionDef } from '@/types';

interface SocioQuestionProps {
  question: QuestionDef;
  value: string | undefined;
  onSelect: (value: string) => void;
  onConfirm: () => void;
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3.5 8 6.5 11 12.5 5" />
    </svg>
  );
}

export default function SocioQuestion({ question, value, onSelect, onConfirm }: SocioQuestionProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  function handleOptionClick(optValue: string) {
    // Cancel any pending auto-advance (user changed their mind)
    if (timerRef.current) clearTimeout(timerRef.current);
    onSelect(optValue);
    // Auto-advance after 600ms — enough to see selection animate, fast enough to feel fluid
    timerRef.current = setTimeout(() => {
      onConfirm();
    }, 600);
  }

  if (!question.options) return null;

  return (
    <div className="flex flex-col gap-2 w-full max-w-[640px] mx-auto">
      {question.options.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <motion.button
            key={opt.value}
            onClick={() => handleOptionClick(opt.value)}
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
