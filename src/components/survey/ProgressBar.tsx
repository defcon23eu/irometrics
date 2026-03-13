'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number; // 1-50
  total: number;   // 50
  blockLabel: string;
}

export default function ProgressBar({ current, total, blockLabel }: ProgressBarProps) {
  const pct = (current / total) * 100;

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm text-text-secondary">
          Pregunta {current} de {total}
        </span>
        <span className="rounded-full bg-bg-surface px-3 py-0.5 text-xs text-text-secondary">
          {blockLabel}
        </span>
      </div>
      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-bg-elevated/60">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          style={{
            background: 'linear-gradient(90deg, var(--color-regime-laminar) 0%, var(--color-regime-transicion) 50%, var(--color-accent-primary) 100%)',
          }}
        />
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full border-2 border-bg-base"
          animate={{ left: `calc(${pct}% - 6px)` }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          style={{ backgroundColor: 'var(--color-accent-primary)' }}
        />
      </div>
    </div>
  );
}
