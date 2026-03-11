'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

// Inline SVG icon components
function ChartIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="M7 16l4-8 4 4 4-8" />
    </svg>
  );
}

function GaugeIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </svg>
  );
}

function WaveIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12c2-3 4-3 6 0s4 3 6 0 4-3 6 0" />
      <path d="M2 18c2-3 4-3 6 0s4 3 6 0 4-3 6 0" />
      <path d="M2 6c2-3 4-3 6 0s4 3 6 0 4-3 6 0" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: 'easeOut' as const },
  }),
};

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* ===== BLOCK 1: Hero ===== */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #080B10 0%, #0D1520 100%)' }}
      >
        {/* CSS grid background */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(240,246,252,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(240,246,252,0.04) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        {/* Radial glow */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent-primary/8 blur-3xl" />

        <motion.div
          className="relative z-10 max-w-3xl text-center"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
        >
          {/* Badge */}
          <motion.p
            variants={fadeUp}
            custom={0}
            className="mb-6 inline-block rounded-full border border-border-default px-4 py-1.5 text-xs tracking-wide text-text-secondary"
          >
            Investigación independiente · UNED · 2026
          </motion.p>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            custom={1}
            className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl"
          >
            Mide la turbulencia de tu organización.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeUp}
            custom={2}
            className="mt-6 text-lg text-text-secondary sm:text-xl"
          >
            Diagnóstico avanzado de dinámica estructural y desgaste de equipos
            para microempresas tecnológicas.
          </motion.p>

          {/* CTA */}
          <motion.div variants={fadeUp} custom={3} className="mt-10">
            <Link
              href="/consentimiento"
              className="inline-flex items-center gap-2 rounded-xl px-8 py-4 text-lg font-semibold text-white transition-all duration-150 hover:opacity-90 focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
              style={{ background: 'linear-gradient(90deg, #3B82F6, #6366F1)' }}
            >
              → Iniciar diagnóstico gratuito
            </Link>
          </motion.div>

          {/* Trust line */}
          <motion.p
            variants={fadeUp}
            custom={4}
            className="mt-4 text-sm text-text-muted"
          >
            5 minutos · 100 % anónimo · Sin registro
          </motion.p>
        </motion.div>
      </section>

      {/* ===== BLOCK 2: Authority metrics ===== */}
      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-3">
          {[
            { icon: <ChartIcon />, title: '12 indicadores críticos', desc: 'Evaluación multidimensional de la dinámica interna' },
            { icon: <GaugeIcon />, title: 'Régimen en tiempo real', desc: 'Resultado inmediato con clasificación visual' },
            { icon: <WaveIcon />, title: 'Basado en física de fluidos', desc: 'Modelo analítico inspirado en dinámica de fluidos' },
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="rounded-xl border border-border-default bg-bg-surface p-6 text-center"
              style={{ background: 'linear-gradient(145deg, #0F1318, #161B22)' }}
            >
              <div className="mb-3 flex justify-center text-text-accent">
                {card.icon}
              </div>
              <h3 className="text-lg font-semibold">{card.title}</h3>
              <p className="mt-2 text-sm text-text-secondary">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== BLOCK 3: How it works ===== */}
      <section className="px-6 py-20 bg-bg-surface/50">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-12 text-center text-2xl font-bold sm:text-3xl">
            Cómo funciona
          </h2>
          <div className="grid gap-10 sm:grid-cols-3">
            {[
              { step: '01', title: 'Describe tu organización', desc: '5 preguntas contextuales sobre tu empresa y equipo' },
              { step: '02', title: 'Evalúa la dinámica', desc: 'Indicadores de dinámica organizacional, bienestar y adaptación al cambio' },
              { step: '03', title: 'Recibe tu régimen', desc: 'Resultado visual inmediato con tu nivel de turbulencia organizacional' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="text-center"
              >
                <span className="mb-3 inline-block text-3xl font-black text-accent-primary">
                  {item.step}
                </span>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-text-secondary">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BLOCK 4: Result spectrum ===== */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-8 text-2xl font-bold sm:text-3xl">
            El resultado que recibirás
          </h2>
          {/* Spectrum bar */}
          <div className="mx-auto mb-4 h-3 w-full overflow-hidden rounded-full">
            <div
              className="h-full w-full"
              style={{
                background:
                  'linear-gradient(to right, var(--color-regime-laminar) 0%, var(--color-regime-transicion) 33%, var(--color-regime-incipiente) 66%, var(--color-regime-severo) 100%)',
              }}
            />
          </div>
          {/* Labels */}
          <div className="mb-8 flex justify-between text-xs text-text-secondary sm:text-sm">
            <span>Laminar</span>
            <span>Transición</span>
            <span>Turb. incipiente</span>
            <span>Turb. severa</span>
          </div>
          <p className="text-text-secondary">
            ¿Está tu equipo en zona de riesgo? Descúbrelo en 5 minutos.
          </p>
        </div>
      </section>

      {/* ===== BLOCK 5: RGPD / Consent ===== */}
      <section className="px-6 py-20 bg-bg-surface/50">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-xl border border-border-default bg-bg-surface p-8">
            <div className="mb-4 flex items-center gap-3 text-text-secondary">
              <LockIcon />
              <h2 className="text-xl font-bold text-text-primary">Transparencia total</h2>
            </div>
            <p className="text-sm leading-relaxed text-text-secondary">
              Este diagnóstico forma parte de una investigación académica sobre
              bienestar laboral en microempresas tecnológicas españolas,
              desarrollada en la Universidad Nacional de Educación a Distancia
              (UNED). Tu participación es voluntaria, anónima y no remunerada.
              No se recopilan datos identificativos ni direcciones IP. Los datos
              se utilizan exclusivamente para análisis estadístico agregado con
              fines académicos. Puedes retirar tu participación en cualquier
              momento.
            </p>
            <p className="mt-4 text-xs text-text-muted">
              Responsable: Raúl Balaguer Moreno · rbalaguer16@alumno.uned.es
            </p>
          </div>
        </div>
      </section>

      {/* ===== Final CTA ===== */}
      <section className="px-6 py-20 text-center">
        <Link
          href="/consentimiento"
          className="inline-flex items-center gap-2 rounded-xl px-8 py-4 text-lg font-semibold text-white transition-all duration-150 hover:opacity-90 focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
          style={{ background: 'linear-gradient(90deg, #3B82F6, #6366F1)' }}
        >
          Comenzar el diagnóstico →
        </Link>
      </section>
    </main>
  );
}
