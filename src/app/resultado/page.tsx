'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import type { IROResult } from '@/types';
import { REGIME_MAP } from '@/lib/iro-calculator';
import IROGauge from '@/components/resultado/IROGauge';
import { RegimeCard } from '@/components/iro';
import { FlowParticles } from '@/components/effects';

// ─── Count-up with easing + reduced-motion ───
function useCountUp(target: number, duration = 1800, delay = 200) {
  const [value, setValue] = useState(0);
  const prefersReduced = useRef(
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    if (target <= 0) return;
    if (prefersReduced.current) {
      const rafImmediate = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(rafImmediate);
    }

    const startTime = performance.now() + delay;
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    let raf: number;

    const tick = (now: number) => {
      if (now < startTime) { raf = requestAnimationFrame(tick); return; }
      const elapsed = Math.min((now - startTime) / duration, 1);
      setValue(+(target * easeOutCubic(elapsed)).toFixed(2));
      if (elapsed < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, delay]);

  return value;
}

// ─── Stagger variants ───
const PAGE_VARIANTS = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.10, delayChildren: 0.1 } },
};
const BLOCK_VARIANTS = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};
const BADGE_VARIANTS = {
  hidden: { scale: 0.75, opacity: 0 },
  visible: {
    scale: 1, opacity: 1,
    transition: { type: 'spring' as const, stiffness: 280, damping: 18 },
  },
};

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
      const rafParsed = requestAnimationFrame(() => setResult(parsed));
      // CLEANUP: only remove survey-specific keys, keep consent_at for analytics
      sessionStorage.removeItem('survey_state');
      sessionStorage.removeItem('iro_result');
      return () => cancelAnimationFrame(rafParsed);
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
    <motion.main
      variants={PAGE_VARIANTS}
      initial="hidden"
      animate="visible"
      className="min-h-screen px-4 py-16"
    >
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <motion.div variants={BLOCK_VARIANTS}>
          <p className="mb-2 text-center font-mono text-xs tracking-[0.2em] text-text-muted uppercase">
            DIAGNÓSTICO COMPLETADO · {dateStr}
          </p>
          <h1 className="mb-10 text-center text-3xl font-bold sm:text-4xl">
            Tu régimen organizacional
          </h1>
        </motion.div>

        {/* Gauge */}
        <motion.div variants={BLOCK_VARIANTS} className="relative isolate overflow-hidden rounded-2xl">
          <FlowParticles
            color={regime.color}
            intensity={Math.min(result.re_org / 1200, 1)}
          />
          <div className="relative z-10">
            <IROGauge reOrg={result.re_org} regime={result.regime} />
          </div>
        </motion.div>

        {/* Re_org count-up value */}
        <motion.div variants={BLOCK_VARIANTS} className="mt-4 text-center">
          <p
            className="font-mono font-bold"
            style={{
              color: regime.color,
              fontSize: 'clamp(3rem, 12vw, 5.5rem)',
              lineHeight: 1,
            }}
          >
            {animatedValue.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="mt-1 font-mono text-sm text-text-muted">Re<sub>org</sub></p>
        </motion.div>

        {/* Regime badge (spring) */}
        <motion.div variants={BADGE_VARIANTS} className="mt-6 text-center">
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
          variants={BLOCK_VARIANTS}
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
          variants={BLOCK_VARIANTS}
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

        {/* Regime Card — Visual summary */}
        <motion.div variants={BLOCK_VARIANTS} className="mt-10">
          <RegimeCard
            regime={result.regime}
            reOrg={result.re_org}
            showDetails={false}
          />
        </motion.div>

        {/* Share Button */}
        <motion.div variants={BLOCK_VARIANTS} className="mt-8 flex justify-center">
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.vibrate?.([50]);
                navigator.share({
                  title: 'Mi diagnóstico IRO',
                  text: `Mi régimen organizacional: ${regime.label} (Re_org: ${result.re_org.toFixed(2)})`,
                  url: window.location.origin,
                });
              }
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-accent-primary/30 bg-accent-subtle px-6 py-3 text-sm font-medium text-accent-primary transition-all duration-200 hover:border-accent-primary hover:bg-accent-primary/10 active:scale-95"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Compartir resultado
          </button>
        </motion.div>

        {/* Academic footer */}
        <motion.div variants={BLOCK_VARIANTS} className="mt-16 border-t border-border-subtle pt-6 text-center">
          <p className="font-mono text-xs tracking-[0.15em] text-text-muted">
            UNED · GRADO EN PSICOLOGÍA · 2025–2026
          </p>
          <p className="mt-2 text-xs text-text-muted">
            Diagnóstico orientativo con fines estadísticos. No constituye diagnóstico clínico ni laboral.
          </p>
        </motion.div>

        {/* Back button */}
        <motion.div variants={BLOCK_VARIANTS} className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-border-subtle px-6 py-3 text-sm text-text-secondary transition-colors duration-150 hover:border-border-focus hover:text-text-primary"
          >
            ← Volver al inicio
          </Link>
        </motion.div>
      </div>
    </motion.main>
  );
}
