'use client';

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
  if (!question.options) return null;

  return (
    <div className="flex flex-col gap-2 w-full max-w-[640px] mx-auto">
      {question.options.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <motion.button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
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

      {/* Explicit advance button — no auto-advance for selects */}
      <AnimatePresence>
        {value && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            onClick={onConfirm}
            className="mt-2 w-full py-3.5 rounded-lg font-medium text-sm
              bg-accent-primary hover:bg-accent-hover
              text-white transition-all duration-150 active:scale-[0.98]"
          >
            Siguiente →
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
