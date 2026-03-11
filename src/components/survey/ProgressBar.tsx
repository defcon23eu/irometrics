'use client';

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
      <div className="h-1 w-full overflow-hidden rounded-full bg-bg-elevated">
        <div
          className="h-full rounded-full transition-all duration-300 ease-out"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, var(--color-regime-laminar), var(--color-regime-transicion), var(--color-regime-incipiente), var(--color-regime-severo))',
            backgroundSize: '400% 100%',
            backgroundPosition: `${pct}% 0`,
          }}
        />
      </div>
    </div>
  );
}
