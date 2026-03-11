'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import type { IROResult } from '@/types';
import { REGIME_MAP } from '@/lib/iro-calculator';
import IROGauge from '@/components/resultado/IROGauge';

function useCountUp(target: number, duration = 1800) {
  const [value, setValue] = useState(0);
  const ref = useRef<number>(0);

  useEffect(() => {
    if (target <= 0) return;
    const start = performance.now();
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      setValue(+(target * ease(progress)).toFixed(2));
      if (progress < 1) {
        ref.current = requestAnimationFrame(tick);
      }
    }

    ref.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(ref.current);
  }, [target, duration]);

  return value;
}

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
      sessionStorage.clear();
    } catch {
      router.replace('/');
    }
  }, [router]);

  const animatedValue = useCountUp(result?.re_org ?? 0);

  if (!result) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-border-default border-t-accent-primary" />
      </main>
    );
  }

  const regime = REGIME_MAP[result.regime];
  const dateStr = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();

  return (
    <main className="min-h-screen px-4 py-16">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-2 text-center font-mono text-xs tracking-[0.2em] text-text-muted uppercase"
        >
          DIAGNÓSTICO COMPLETADO · {dateStr}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center text-3xl font-bold sm:text-4xl"
        >
          Tu régimen organizacional
        </motion.h1>

        {/* Gauge */}
        <IROGauge value={result.re_org} />

        {/* Re_org count-up value */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-center"
        >
          <p className="font-mono text-5xl font-bold sm:text-6xl" style={{ color: regime.color }}>
            {animatedValue.toFixed(2)}
          </p>
          <p className="mt-1 font-mono text-sm text-text-muted">Re<sub>org</sub></p>
        </motion.div>

        {/* Regime badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 text-center"
        >
          <span
            className="inline-block rounded-full border px-6 py-2 font-mono text-lg font-bold"
            style={{
              backgroundColor: regime.color + '1F',
              borderColor: regime.color + '4D',
              color: regime.color,
            }}
          >
            {regime.label}
          </span>
        </motion.div>

        {/* Technical subscale table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-10 overflow-x-auto rounded-xl border border-border-subtle bg-bg-surface"
        >
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border-subtle text-xs uppercase tracking-wider text-text-muted">
                <th className="px-5 py-3 font-mono font-medium">Subescala</th>
                <th className="px-5 py-3 font-mono font-medium">Valor</th>
                <th className="px-5 py-3 font-mono font-medium">Rango</th>
                <th className="px-5 py-3 font-mono font-medium">%</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {[
                { label: 'δ (Densidad)', value: result.delta, max: 21 },
                { label: 'v (Velocidad)', value: result.v, max: 21 },
                { label: 'D (Dispersión)', value: result.D, max: 21 },
                { label: 'μ (Resistencia)', value: result.mu, max: 21 },
              ].map((s) => (
                <tr key={s.label}>
                  <td className="px-5 py-3 font-mono text-text-secondary">{s.label}</td>
                  <td className="px-5 py-3 font-mono font-bold">{s.value}</td>
                  <td className="px-5 py-3 font-mono text-text-muted">3–{s.max}</td>
                  <td className="px-5 py-3 font-mono text-text-secondary">{Math.round((s.value / s.max) * 100)}%</td>
                </tr>
              ))}
              <tr className="border-t border-border-default bg-bg-elevated/50">
                <td className="px-5 py-3 font-mono font-bold text-text-primary">Re<sub>org</sub></td>
                <td className="px-5 py-3 font-mono font-bold" style={{ color: regime.color }}>{result.re_org.toFixed(2)}</td>
                <td className="px-5 py-3 font-mono text-text-muted">0–∞</td>
                <td className="px-5 py-3 font-mono font-bold" style={{ color: regime.color }}>{regime.label.split(' ').pop()}</td>
              </tr>
            </tbody>
          </table>
        </motion.div>

        {/* Explanation card with regime border */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="mt-10 rounded-xl border border-border-subtle bg-bg-surface p-6"
          style={{ borderLeftWidth: '4px', borderLeftColor: regime.color }}
        >
          <h2 className="mb-3 text-lg font-semibold">¿Qué significa esto?</h2>
          <p className="mb-5 text-sm leading-relaxed text-text-secondary">
            {regime.description}
          </p>
          <ul className="space-y-2">
            {regime.implications.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                <span className="mt-0.5 font-mono text-xs" style={{ color: regime.color }}>▶</span>
                {item}
              </li>
            ))}
          </ul>
        </motion.section>

        {/* Academic footer */}
        <div className="mt-16 border-t border-border-subtle pt-6 text-center">
          <p className="font-mono text-xs tracking-[0.15em] text-text-muted">
            UNED · GRADO EN PSICOLOGÍA · 2025–2026
          </p>
          <p className="mt-2 text-xs text-text-muted">
            Diagnóstico orientativo con fines estadísticos. No constituye diagnóstico clínico ni laboral.
          </p>
        </div>

        {/* Back button */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-border-subtle px-6 py-3 text-sm text-text-secondary transition-colors duration-150 hover:border-border-focus hover:text-text-primary"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
