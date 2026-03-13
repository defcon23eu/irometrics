'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FlowLines, Particles } from '@/components/effects';
import { fadeIn, staggerContainer, scaleIn } from '@/lib/motion-presets';

// Data
const REGIMES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 sm:w-8 sm:h-8">
        <path d="M4 12h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M4 8h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
        <path d="M4 16h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      </svg>
    ),
    name: 'Flujo Laminar',
    shortName: 'Laminar',
    range: 'Re < 100',
    color: '#22C55E',
    desc: 'Operaciones estables y predecibles. Equipos sincronizados con baja friccion.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 sm:w-8 sm:h-8">
        <path d="M4 12c4-2 8 2 12 0s4-2 4-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M4 8c4-1 8 1 12 0s4-1 4-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
        <path d="M4 16c4-1 8 1 12 0s4-1 4-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      </svg>
    ),
    name: 'Zona de Transicion',
    shortName: 'Transicion',
    range: '100 - 800',
    color: '#EAB308',
    desc: 'Primeras tensiones detectables. Momento optimo para intervenir y prevenir.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 sm:w-8 sm:h-8">
        <path d="M4 12c2-3 4 3 6-2s4 4 6-1 4 2 4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M4 7c2-2 4 2 6-1s4 3 6-1 4 1 4 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
        <path d="M4 17c2-2 4 2 6-1s4 3 6-1 4 1 4 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      </svg>
    ),
    name: 'Turbulencia Inicial',
    shortName: 'T. Inicial',
    range: '800 - 1200',
    color: '#F97316',
    desc: 'Inestabilidad visible. Riesgo moderado-alto de desgaste profesional.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 sm:w-8 sm:h-8">
        <path d="M4 12c1-4 2 4 4-3s3 5 4-2 3 4 4-2 3 3 4 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M4 6c1-3 2 3 4-2s3 4 4-2 3 3 4-1 3 2 4 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
        <path d="M4 18c1-3 2 3 4-2s3 4 4-2 3 3 4-1 3 2 4 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      </svg>
    ),
    name: 'Turbulencia Critica',
    shortName: 'T. Critica',
    range: 'Re > 1200',
    color: '#EF4444',
    desc: 'Dinamica caotica. Intervencion prioritaria. Alto riesgo de burnout.',
  },
];

const STEPS = [
  { n: '01', title: 'Contexto', desc: '5 preguntas sobre sector, rol y antiguedad. Sin datos identificativos.', time: '~1 min' },
  { n: '02', title: 'Diagnostico', desc: '45 items validados: dinamica organizacional, desgaste profesional, resistencia al cambio.', time: '~7 min' },
  { n: '03', title: 'Resultado', desc: 'Indice Re_org inmediato con clasificacion visual y desglose por subescala.', time: 'Instantaneo' },
];

const INSTRUMENTS = [
  { block: 'A', name: 'Sociodemografico', items: 5, scale: '-' },
  { block: 'B', name: 'Protocolo IRO', items: 12, scale: '1-7' },
  { block: 'C', name: 'MBI-GS', items: 16, scale: '0-6' },
  { block: 'D', name: 'Oreg RTC', items: 17, scale: '1-6' },
];

// Flow lines background component
function FlowLines() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-px bg-gradient-to-r from-transparent via-accent-primary/30 to-transparent"
          style={{
            top: `${20 + i * 15}%`,
            width: '100%',
          }}
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: 'linear',
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  );
}

// Floating particles
function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-accent-primary/40"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
}

export default function HomePage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -50]);

  return (
    <main className="min-h-screen bg-bg-base">
      {/* ===== HERO ===== */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden"
      >
        {/* Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,#6366F115,transparent)]" />
        <FlowLines />
        <Particles />
        
        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(var(--color-grid-line) 1px, transparent 1px),
              linear-gradient(90deg, var(--color-grid-line) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative z-10 max-w-4xl mx-auto text-center"
        >
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div variants={fadeIn} custom={0}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border-subtle bg-bg-surface/80 backdrop-blur-sm text-xs font-mono tracking-wider text-text-muted">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse" />
                INVESTIGACION UNED 2025-2026
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeIn}
              custom={0.1}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance leading-[1.1]"
            >
              <span className="text-text-primary">Mide la </span>
              <span className="text-accent-primary">turbulencia</span>
              <br />
              <span className="text-text-primary">de tu organizacion</span>
            </motion.h1>

            {/* Formula card */}
            <motion.div
              variants={scaleIn}
              custom={0.2}
              className="inline-flex flex-col items-center"
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-accent-primary/20 via-accent-primary/10 to-accent-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative px-8 py-5 rounded-xl border border-border-subtle bg-bg-card/90 backdrop-blur-sm">
                  <p className="font-mono text-xl sm:text-2xl md:text-3xl font-medium tracking-wide">
                    <span className="text-accent-primary">Re</span>
                    <sub className="text-sm text-text-muted">org</sub>
                    <span className="text-text-muted mx-3">=</span>
                    <span className="text-text-primary">(</span>
                    <span className="text-accent-primary">d</span>
                    <span className="text-text-muted mx-1">·</span>
                    <span className="text-accent-primary">v</span>
                    <span className="text-text-muted mx-1">·</span>
                    <span className="text-accent-primary">D</span>
                    <span className="text-text-primary">)</span>
                    <span className="text-text-muted mx-2">/</span>
                    <span className="text-accent-primary">m</span>
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm text-text-muted font-mono tracking-widest uppercase">
                Indice de Reynolds Organizacional
              </p>
            </motion.div>

            {/* Stats row */}
            <motion.div
              variants={fadeIn}
              custom={0.3}
              className="flex items-center justify-center gap-6 sm:gap-10 text-center"
            >
              {[
                { value: '8', label: 'minutos' },
                { value: '50', label: 'items' },
                { value: '4', label: 'instrumentos' },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <span className="text-2xl sm:text-3xl font-bold text-text-primary font-mono">{stat.value}</span>
                  <span className="text-xs text-text-muted uppercase tracking-wider">{stat.label}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div variants={fadeIn} custom={0.4} className="pt-4">
              <Link
                href="/consentimiento"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-accent-primary text-white font-semibold text-lg transition-all duration-300 hover:bg-accent-hover hover:shadow-[0_0_40px_#6366F140] focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
              >
                Iniciar diagnostico
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.p variants={fadeIn} custom={0.5} className="text-sm text-text-muted">
              100% anonimo · Sin registro · Sin cookies
            </motion.p>

            {/* Demo link */}
            <motion.div variants={fadeIn} custom={0.6}>
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-accent-primary transition-colors"
              >
                <span className="font-mono text-[10px] px-2 py-1 rounded border border-border-subtle bg-bg-surface">DEMO</span>
                Ver simulacion interactiva
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-border-subtle flex items-start justify-center p-2"
          >
            <motion.div className="w-1 h-2 rounded-full bg-text-muted" />
          </motion.div>
        </motion.div>
      </section>

      {/* ===== REGIMES ===== */}
      <section className="relative py-24 sm:py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.p variants={fadeIn} className="text-sm font-mono tracking-[0.3em] text-accent-primary uppercase mb-4">
              Regimenes
            </motion.p>
            <motion.h2 variants={fadeIn} className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-6">
              Cuatro estados de flujo
            </motion.h2>
            <motion.p variants={fadeIn} className="max-w-2xl mx-auto text-text-secondary text-lg">
              El Indice de Reynolds Organizacional clasifica la dinamica de tu equipo en un espectro continuo, del orden al caos.
            </motion.p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {REGIMES.map((regime, i) => (
              <motion.div
                key={regime.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group relative p-6 rounded-2xl border border-border-subtle bg-bg-card overflow-hidden"
              >
                {/* Glow effect on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(circle at 50% 0%, ${regime.color}15, transparent 70%)` }}
                />
                
                {/* Top accent line */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                  style={{ background: `linear-gradient(90deg, transparent, ${regime.color}, transparent)` }}
                />

                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div style={{ color: regime.color }}>{regime.icon}</div>
                    <span className="font-mono text-xs px-2 py-1 rounded-lg bg-bg-elevated" style={{ color: regime.color }}>
                      {regime.range}
                    </span>
                  </div>
                  <h3 className="mt-4 text-base sm:text-lg font-semibold text-text-primary">
                    <span className="hidden sm:inline">{regime.name}</span>
                    <span className="sm:hidden">{regime.shortName}</span>
                  </h3>
                  <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                    {regime.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== METHOD ===== */}
      <section className="relative py-24 sm:py-32 px-4 bg-bg-surface/50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.p variants={fadeIn} className="text-sm font-mono tracking-[0.3em] text-accent-primary uppercase mb-4">
              Metodo
            </motion.p>
            <motion.h2 variants={fadeIn} className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-6">
              Tres pasos, un diagnostico
            </motion.h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="relative p-8 rounded-2xl border border-border-subtle bg-bg-card"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-5xl font-bold font-mono text-accent-primary/20">{step.n}</span>
                  <span className="px-3 py-1 rounded-full border border-border-subtle text-xs font-mono text-text-muted">
                    {step.time}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-3">{step.title}</h3>
                <p className="text-text-secondary leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== INSTRUMENTS ===== */}
      <section className="relative py-24 sm:py-32 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.p variants={fadeIn} className="text-sm font-mono tracking-[0.3em] text-accent-primary uppercase mb-4">
              Instrumentos
            </motion.p>
            <motion.h2 variants={fadeIn} className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-6">
              Bateria validada
            </motion.h2>
            <motion.p variants={fadeIn} className="max-w-xl mx-auto text-text-secondary text-lg">
              50 items distribuidos en 4 bloques con instrumentos validados internacionalmente.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-border-subtle bg-bg-card overflow-hidden"
          >
            <div className="grid grid-cols-4 gap-px bg-border-subtle">
              {['Bloque', 'Instrumento', 'Items', 'Escala'].map((header) => (
                <div key={header} className="px-4 py-3 bg-bg-elevated text-xs font-mono uppercase tracking-wider text-text-muted">
                  {header}
                </div>
              ))}
              {INSTRUMENTS.map((inst) => (
                <React.Fragment key={`instrument-${inst.block}`}>
                  <div className="px-4 py-4 bg-bg-card font-mono font-bold text-accent-primary">
                    {inst.block}
                  </div>
                  <div className="px-4 py-4 bg-bg-card text-text-primary font-medium">
                    {inst.name}
                  </div>
                  <div className="px-4 py-4 bg-bg-card font-mono text-text-secondary">
                    {inst.items}
                  </div>
                  <div className="px-4 py-4 bg-bg-card font-mono text-text-secondary">
                    {inst.scale}
                  </div>
                </React.Fragment>
              ))}
              <div className="px-4 py-4 bg-bg-elevated font-mono font-bold text-text-primary">S</div>
              <div className="px-4 py-4 bg-bg-elevated text-text-primary font-semibold">Total</div>
              <div className="px-4 py-4 bg-bg-elevated font-mono font-bold text-accent-primary">50</div>
              <div className="px-4 py-4 bg-bg-elevated" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== TRANSPARENCY ===== */}
      <section className="relative py-24 sm:py-32 px-4 bg-bg-surface/50">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-8 sm:p-10 rounded-2xl border border-border-subtle bg-bg-card"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-accent-subtle flex items-center justify-center">
                <svg className="w-5 h-5 text-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-mono tracking-[0.2em] text-accent-primary uppercase">Transparencia</p>
                <h3 className="text-xl font-bold text-text-primary">Datos anonimos. Siempre.</h3>
              </div>
            </div>
            <p className="text-text-secondary leading-relaxed mb-6">
              Investigacion academica sobre bienestar laboral en microempresas tecnologicas espanolas, desarrollada en la Universidad Nacional de Educacion a Distancia (UNED). Participacion voluntaria, anonima y no remunerada.
            </p>
            <div className="pt-6 border-t border-border-subtle">
              <p className="text-sm text-text-muted font-mono">
                Responsable: Raul Balaguer Moreno
              </p>
              <p className="text-sm text-text-muted font-mono mt-1">
                rbalaguer16@alumno.uned.es
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="relative py-24 sm:py-32 px-4 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,#10B98110,transparent)]" />
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="relative max-w-2xl mx-auto text-center"
        >
          <motion.p variants={fadeIn} className="text-sm font-mono tracking-[0.3em] text-accent-primary uppercase mb-6">
            Diagnostico
          </motion.p>
          <motion.h2 variants={fadeIn} className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-8">
            Calcula tu Re<sub className="text-lg">org</sub>
          </motion.h2>
          <motion.div variants={fadeIn}>
            <Link
              href="/consentimiento"
              className="group inline-flex items-center gap-3 px-10 py-5 rounded-xl bg-accent-primary text-bg-base font-semibold text-lg transition-all duration-300 hover:bg-accent-hover hover:shadow-[0_0_60px_#10B98130]"
            >
              Iniciar diagnostico
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
          <motion.p variants={fadeIn} className="mt-8 text-sm text-text-muted font-mono">
            UNED · Grado en Psicologia · 2025-2026
          </motion.p>
        </motion.div>
      </section>
    </main>
  );
}
