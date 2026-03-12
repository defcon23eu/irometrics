'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const },
  }),
};

const REGIMES = [
  { icon: '◈', name: 'Laminar', range: 'Re < 100', color: '#22C55E', bg: '#22C55E0D', border: '#22C55E26', desc: 'Flujo estable y predecible. Baja fricción interna.' },
  { icon: '⧫', name: 'Transición', range: '100 ≤ Re < 800', color: '#EAB308', bg: '#EAB3080D', border: '#EAB30826', desc: 'Señales de tensión emergente. Momento de intervenir.' },
  { icon: '■', name: 'Turbulencia incipiente', range: '800 ≤ Re < 1200', color: '#F97316', bg: '#F973160D', border: '#F9731626', desc: 'Inestabilidad visible. Riesgo de desgaste moderado-alto.' },
  { icon: '▶', name: 'Turbulencia severa', range: 'Re ≥ 1200', color: '#EF4444', bg: '#EF44440D', border: '#EF444426', desc: 'Dinámica caótica. Intervención prioritaria.' },
];

const STEPS = [
  { n: '01', title: 'Contexto', desc: '5 preguntas sobre tu empresa, rol y antigüedad. Sin datos identificativos.' },
  { n: '02', title: 'Diagnóstico', desc: '45 ítems: dinámica organizacional (IRO), desgaste profesional (MBI-GS), resistencia al cambio (Oreg RTC).' },
  { n: '03', title: 'Resultado', desc: 'Re_org inmediato. Clasificación visual de régimen con desglose por subescala.' },
];

const INSTRUMENT = [
  { bloque: 'A', instrumento: 'Sociodemográfico', items: '5', escala: '—' },
  { bloque: 'B', instrumento: 'Protocolo IRO', items: '12', escala: 'Likert 1–7' },
  { bloque: 'C', instrumento: 'MBI-GS (Gil-Monte, 2002)', items: '16', escala: '0–6' },
  { bloque: 'D', instrumento: 'Oreg RTC (Oreg, 2003)', items: '17', escala: 'Likert 1–6' },
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* ===== HERO ===== */}
      <section
        className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4"
        style={{ background: 'linear-gradient(180deg, var(--color-bg-base) 0%, var(--color-bg-surface) 100%)' }}
      >
        {/* Grid background */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(var(--color-grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--color-grid-line) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        {/* Radial glow */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-primary/8 blur-3xl" />

        <motion.div
          className="relative z-10 max-w-3xl text-center"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {/* Badge */}
          <motion.p
            variants={fadeUp}
            custom={0}
            className="mb-6 inline-block rounded-full border border-border-subtle bg-bg-surface/60 px-4 py-1.5 font-mono text-xs tracking-widest text-text-secondary"
          >
            ✦ DIAGNÓSTICO · UNED PSICOLOGÍA · 2025–2026
          </motion.p>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            custom={1}
            className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl"
          >
            ¿En qué régimen opera tu organización?
          </motion.h1>

          {/* Equation — styled formula container */}
          <motion.div
            variants={fadeUp}
            custom={2}
            className="my-8 flex flex-col items-center gap-3"
          >
            <div className="w-40 h-px bg-gradient-to-r from-transparent via-border-default to-transparent" />

            <div className="
              relative group cursor-help
              px-6 py-3 rounded-lg
              bg-accent-subtle border border-border-focus/20
              hover:border-border-focus/40 transition-all duration-300
            ">
              {/* Radial glow on hover */}
              <div className="
                absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100
                transition-opacity duration-300 pointer-events-none
                bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,#6366F112,transparent)]
              " />

              {/* Formula */}
              <p className="relative font-mono text-lg sm:text-xl font-medium
                            text-accent-primary tracking-wide select-none">
                Re<sub className="text-xs align-sub">org</sub>
                <span className="text-text-secondary mx-2">=</span>
                <span className="text-text-primary">(δ · v · D)</span>
                <span className="text-text-secondary mx-2">/</span>
                <span className="text-text-primary">μ</span>
              </p>
            </div>

            <p className="text-[11px] text-text-muted font-sans tracking-wide uppercase">
              Índice de Reynolds Organizacional
            </p>

            <div className="w-40 h-px bg-gradient-to-r from-transparent via-border-default to-transparent" />
          </motion.div>

          {/* Stats */}
          <motion.p
            variants={fadeUp}
            custom={3}
            className="mt-4 font-mono text-sm text-text-muted"
          >
            08 min · 50 ítems · Re<sub>org</sub> inmediato
          </motion.p>

          {/* CTA */}
          <motion.div variants={fadeUp} custom={4} className="mt-10">
            <Link
              href="/consentimiento"
              className="inline-flex items-center gap-2 rounded-xl bg-accent-primary px-8 py-4 text-lg font-semibold text-white transition-all duration-150 hover:bg-accent-hover focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
            >
              Iniciar diagnóstico →
            </Link>
          </motion.div>

          {/* Trust */}
          <motion.p
            variants={fadeUp}
            custom={5}
            className="mt-4 text-xs text-text-muted"
          >
            100 % anónimo · Sin registro · Sin cookies
          </motion.p>
        </motion.div>
      </section>

      {/* ===== RÉGIMEN ===== */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <p className="mb-3 text-center font-mono text-xs tracking-[0.2em] text-text-muted uppercase">
            RÉGIMEN
          </p>
          <h2 className="mb-4 text-center text-2xl font-bold sm:text-3xl">
            Cuatro estados de flujo organizacional
          </h2>
          <p className="mx-auto mb-12 max-w-xl text-center text-sm text-text-secondary">
            El Índice de Reynolds Organizacional clasifica la dinámica de tu equipo en un espectro continuo — del orden al caos.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {REGIMES.map((r, i) => (
              <motion.div
                key={r.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="rounded-xl border border-l-4 p-5 transition-all duration-200 hover:brightness-110"
                style={{
                  backgroundColor: r.bg,
                  borderColor: r.border,
                  borderLeftColor: r.color,
                }}
              >
                <span className="font-mono text-2xl" style={{ color: r.color }}>{r.icon}</span>
                <h3 className="mt-2 text-base font-semibold text-text-primary">{r.name}</h3>
                <p className="mt-1 font-mono text-xs text-text-muted">{r.range}</p>
                <p className="mt-2 text-sm text-text-secondary">{r.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Regime table */}
          <div className="mt-8 overflow-x-auto rounded-xl border border-border-subtle bg-bg-surface">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border-subtle text-xs uppercase tracking-wider text-text-muted">
                  <th className="px-5 py-3 font-mono font-medium">Re<sub>org</sub></th>
                  <th className="px-5 py-3 font-medium">Régimen</th>
                  <th className="hidden px-5 py-3 font-medium sm:table-cell">Descripción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {REGIMES.map((r) => (
                  <tr key={r.name}>
                    <td className="whitespace-nowrap px-5 py-3 font-mono text-text-secondary">{r.range}</td>
                    <td className="px-5 py-3 font-semibold" style={{ color: r.color }}>
                      <span className="mr-1.5">{r.icon}</span>{r.name}
                    </td>
                    <td className="hidden px-5 py-3 text-text-secondary sm:table-cell">{r.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ===== MÉTODO ===== */}
      <section className="bg-bg-surface/50 px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <p className="mb-3 text-center font-mono text-xs tracking-[0.2em] text-text-muted uppercase">
            MÉTODO
          </p>
          <h2 className="mb-12 text-center text-2xl font-bold sm:text-3xl">
            Tres pasos. Un diagnóstico.
          </h2>

          <div className="grid gap-8 sm:grid-cols-3">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="rounded-xl border border-border-subtle bg-bg-surface p-6 transition-colors duration-150 hover:border-border-focus"
              >
                <span className="font-mono text-3xl font-bold text-accent-primary">{s.n}</span>
                <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== INSTRUMENTO ===== */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <p className="mb-3 text-center font-mono text-xs tracking-[0.2em] text-text-muted uppercase">
            INSTRUMENTO
          </p>
          <h2 className="mb-4 text-center text-2xl font-bold sm:text-3xl">
            Batería de evaluación
          </h2>
          <p className="mx-auto mb-12 max-w-xl text-center text-sm text-text-secondary">
            50 ítems distribuidos en 4 bloques. Instrumentos validados internacionalmente.
          </p>

          <div className="overflow-x-auto rounded-xl border border-border-subtle bg-bg-surface">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border-subtle text-xs uppercase tracking-wider text-text-muted">
                  <th className="px-5 py-3 font-mono font-medium">Bloque</th>
                  <th className="px-5 py-3 font-medium">Instrumento</th>
                  <th className="px-5 py-3 font-mono font-medium">Ítems</th>
                  <th className="px-5 py-3 font-mono font-medium">Escala</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {INSTRUMENT.map((row) => (
                  <tr key={row.bloque}>
                    <td className="px-5 py-3 font-mono font-bold text-accent-primary">{row.bloque}</td>
                    <td className="px-5 py-3 font-semibold text-text-primary">{row.instrumento}</td>
                    <td className="px-5 py-3 font-mono text-text-secondary">{row.items}</td>
                    <td className="px-5 py-3 font-mono text-text-secondary">{row.escala}</td>
                  </tr>
                ))}
                <tr className="border-t border-border-default bg-bg-elevated/50">
                  <td className="px-5 py-3 font-mono font-bold text-text-primary">Σ</td>
                  <td className="px-5 py-3 font-semibold text-text-primary">Total</td>
                  <td className="px-5 py-3 font-mono font-bold text-text-primary">50</td>
                  <td className="px-5 py-3" />
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ===== TRANSPARENCIA ===== */}
      <section className="bg-bg-surface/50 px-4 py-20">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-xl border border-border-subtle bg-bg-surface p-8">
            <p className="mb-3 font-mono text-xs tracking-[0.2em] text-text-muted uppercase">TRANSPARENCIA</p>
            <h2 className="mb-4 text-xl font-bold">Datos anónimos. Siempre.</h2>
            <p className="text-sm leading-relaxed text-text-secondary">
              Investigación académica sobre bienestar laboral en microempresas tecnológicas españolas,
              desarrollada en la Universidad Nacional de Educación a Distancia (UNED).
              Participación voluntaria, anónima y no remunerada.
              Sin datos identificativos. Sin IP. Sin cookies. Los datos se utilizan
              exclusivamente para análisis estadístico agregado con fines académicos.
            </p>
            <p className="mt-4 font-mono text-xs text-text-muted">
              ▶ Responsable: Raúl Balaguer Moreno · rbalaguer16@alumno.uned.es
            </p>
          </div>
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="px-4 py-20 text-center">
        <p className="mb-3 font-mono text-xs tracking-[0.2em] text-text-muted uppercase">⌖ DIAGNÓSTICO</p>
        <h2 className="mb-6 text-2xl font-bold sm:text-3xl">
          ¿Listo para calcular tu Re<sub>org</sub>?
        </h2>
        <Link
          href="/consentimiento"
          className="inline-flex items-center gap-2 rounded-xl bg-accent-primary px-8 py-4 text-lg font-semibold text-white transition-all duration-150 hover:bg-accent-hover focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
        >
          Iniciar diagnóstico →
        </Link>
        <p className="mt-6 font-mono text-xs text-text-muted">
          UNED · Grado en Psicología · 2025–2026
        </p>
      </section>
    </main>
  );
}
