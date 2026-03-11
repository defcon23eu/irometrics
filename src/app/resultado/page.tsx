'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import type { IROResult } from '@/types';
import { REGIME_MAP } from '@/lib/iro-calculator';
import IROGauge from '@/components/resultado/IROGauge';

export default function ResultadoPage() {
  const router = useRouter();
  const [result, setResult] = useState<IROResult | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('iro_result');
      if (!raw) {
        router.replace('/');
        return;
      }
      const parsed = JSON.parse(raw) as IROResult;
      setResult(parsed);
      // Clear session for privacy
      sessionStorage.clear();
    } catch {
      router.replace('/');
    }
  }, [router]);

  if (!result) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-border-default border-t-accent-primary" />
      </main>
    );
  }

  const regime = REGIME_MAP[result.regime];

  return (
    <main className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center text-3xl font-bold sm:text-4xl"
        >
          Tu régimen organizacional
        </motion.h1>

        {/* Gauge */}
        <IROGauge value={result.re_org} />

        {/* Regime label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 text-center"
        >
          <span
            className="inline-block rounded-full px-6 py-2 text-xl font-bold"
            style={{ backgroundColor: regime.color + '20', color: regime.color }}
          >
            {regime.label}
          </span>
        </motion.div>

        {/* Secondary metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-10 grid gap-4 sm:grid-cols-3"
        >
          <MetricCard
            label="Índice de densidad (δ)"
            value={`${Math.round((result.delta / 21) * 100)}%`}
          />
          <MetricCard
            label="Velocidad de cambio (v)"
            value={`${Math.round((result.v / 21) * 100)}%`}
          />
          <MetricCard
            label="Resistencia estructural (μ)"
            value={`${Math.round((result.mu / 21) * 100)}%`}
          />
        </motion.div>

        {/* Explanation */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="mt-12"
        >
          <h2 className="mb-4 text-xl font-semibold">¿Qué significa esto?</h2>
          <p className="mb-6 text-sm leading-relaxed text-text-secondary">
            {regime.description}
          </p>
          <ul className="space-y-2">
            {regime.implications.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                <span
                  className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: regime.color }}
                />
                {item}
              </li>
            ))}
          </ul>
        </motion.section>

        {/* Academic footer */}
        <div className="mt-16 border-t border-border-default pt-6 text-center text-xs text-text-muted">
          <p>
            Diagnóstico generado como parte de una investigación académica
            (UNED, 2026). No constituye diagnóstico clínico ni laboral. Los
            resultados son orientativos y de carácter estadístico.
          </p>
        </div>

        {/* Back button */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-border-default px-6 py-3 text-sm text-text-secondary transition-colors hover:border-accent-border hover:text-text-primary"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border-default bg-bg-surface p-4 text-center">
      <p className="text-2xl font-bold">{value}</p>
      <p className="mt-1 text-xs text-text-muted">{label}</p>
    </div>
  );
}
