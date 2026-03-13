'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number; // 1-50
  total: number;   // 50
  blockLabel?: string;
  minimal?: boolean;
}

export default function ProgressBar({ current, total, blockLabel, minimal = false }: ProgressBarProps) {
  const pct = (current / total) * 100;

  if (minimal) {
    return (
      <div className="w-full">
        <div className="h-1 w-full overflow-hidden rounded-full bg-bg-elevated/50">
          <motion.div
            className="h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            style={{
              background: 'linear-gradient(90deg, var(--color-accent-primary), var(--color-accent-hover))',
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm text-text-secondary">
          Pregunta {current} de {total}
        </span>
        {blockLabel && (
          <span className="rounded-full bg-bg-surface px-3 py-0.5 text-xs text-text-secondary">
            {blockLabel}
          </span>
        )}
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-bg-elevated">
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          style={{
            background: 'linear-gradient(90deg, var(--color-regime-laminar), var(--color-regime-transicion), var(--color-regime-incipiente), var(--color-regime-severo))',
            backgroundSize: '400% 100%',
            backgroundPosition: `${pct}% 0`,
          }}
        />
      </div>
    </div>
  );
}
