'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  total: number;
  blockLabel?: string;
  minimal?: boolean;
}

export default function ProgressBar({ current, total, blockLabel, minimal = false }: ProgressBarProps) {
  const pct = (current / total) * 100;
  
  // Determine flow state based on progress
  const getFlowState = () => {
    if (pct < 25) return { label: 'Iniciando flujo', color: 'var(--color-regime-laminar)' };
    if (pct < 50) return { label: 'Flujo estable', color: 'var(--color-regime-laminar)' };
    if (pct < 75) return { label: 'En transicion', color: 'var(--color-regime-transicion)' };
    if (pct < 100) return { label: 'Casi completado', color: 'var(--color-accent-primary)' };
    return { label: 'Flujo completado', color: 'var(--color-accent-primary)' };
  };

  const flowState = getFlowState();

  if (minimal) {
    return (
      <div className="w-full space-y-2">
        {/* Fluid progress bar */}
        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-bg-elevated/60">
          {/* Background shimmer */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              background: 'linear-gradient(90deg, transparent, var(--color-accent-primary), transparent)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 2s linear infinite',
            }}
          />
          
          {/* Progress fill with fluid gradient */}
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            style={{
              background: `linear-gradient(90deg, 
                var(--color-regime-laminar) 0%, 
                var(--color-regime-transicion) 50%, 
                var(--color-accent-primary) 100%)`,
            }}
          />
          
          {/* Flow indicator dot */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full border-2 border-bg-base"
            initial={{ left: '0%' }}
            animate={{ left: `calc(${pct}% - 6px)` }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            style={{ backgroundColor: flowState.color }}
          />
        </div>

        {/* Minimal percentage indicator */}
        <div className="flex items-center justify-between text-[10px] font-mono text-text-muted">
          <span>{current}/{total}</span>
          <motion.span
            key={Math.floor(pct)}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="tabular-nums"
            style={{ color: flowState.color }}
          >
            {Math.round(pct)}%
          </motion.span>
        </div>
      </div>
    );
  }

  // Full progress bar with labels
  return (
    <div className="w-full space-y-3">
      {/* Header with flow state */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div 
            className="h-2 w-2 rounded-full"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7] 
            }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ backgroundColor: flowState.color }}
          />
          <span className="text-sm text-text-secondary font-medium">
            {flowState.label}
          </span>
        </div>
        {blockLabel && (
          <span className="rounded-full bg-bg-surface px-3 py-0.5 text-xs text-text-muted border border-border-subtle">
            {blockLabel}
          </span>
        )}
      </div>

      {/* Progress track */}
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-bg-elevated">
        {/* Regime zone markers */}
        <div className="absolute inset-0 flex">
          <div className="h-full w-1/4 border-r border-bg-base/30" style={{ backgroundColor: 'var(--color-regime-laminar-bg)' }} />
          <div className="h-full w-1/4 border-r border-bg-base/30" style={{ backgroundColor: 'var(--color-regime-transicion-bg)' }} />
          <div className="h-full w-1/4 border-r border-bg-base/30" style={{ backgroundColor: 'var(--color-regime-incipiente-bg)' }} />
          <div className="h-full w-1/4" style={{ backgroundColor: 'var(--color-regime-severo-bg)' }} />
        </div>
        
        {/* Progress fill */}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          style={{
            background: `linear-gradient(90deg, 
              var(--color-regime-laminar), 
              var(--color-regime-transicion), 
              var(--color-regime-incipiente), 
              var(--color-regime-severo))`,
            backgroundSize: '400% 100%',
            backgroundPosition: `${pct}% 0`,
          }}
        />
      </div>

      {/* Progress stats */}
      <div className="flex items-center justify-between text-xs font-mono text-text-muted">
        <span>Pregunta {current} de {total}</span>
        <span className="tabular-nums" style={{ color: flowState.color }}>
          {Math.round(pct)}% completado
        </span>
      </div>
    </div>
  );
}
