'use client';

import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';

/* ─────────────────────────────────────────────
   Animation helpers
───────────────────────────────────────────── */
function useFadeUp(delay: number) {
  const reduce = useReducedMotion();
  return {
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 16 },
    animate: reduce ? { opacity: 1 } : { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0.15 : 0.6, delay, ease: 'easeOut' },
  };
}

function useScaleIn(delay: number) {
  const reduce = useReducedMotion();
  return {
    initial: reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 },
    animate: reduce ? { opacity: 1 } : { opacity: 1, scale: 1 },
    transition: { duration: reduce ? 0.15 : 0.5, delay, ease: 'easeOut' },
  };
}

function useWhileInView(delay: number) {
  const reduce = useReducedMotion();
  return {
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 20 },
    whileInView: reduce ? { opacity: 1 } : { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: reduce ? 0.15 : 0.5, delay, ease: 'easeOut' },
  };
}

/* ─────────────────────────────────────────────
   CTA Button (reused in hero + footer)
───────────────────────────────────────────── */
function CTAButton() {
  const router = useRouter();
  const anim = useScaleIn(0.5);

  return (
    <motion.button
      {...anim}
      onClick={() => router.push('/consentimiento')}
      className="inline-flex items-center gap-2 rounded-lg bg-accent-primary px-8 py-[14px] font-sans text-base font-medium text-white transition-all duration-150 hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
      aria-label="Iniciar diagnóstico organizacional"
    >
      Iniciar diagnóstico →
    </motion.button>
  );
}

/* ─────────────────────────────────────────────
   Page
───────────────────────────────────────────── */
export default function HomePage() {
  return (
    <main className="min-h-screen bg-bg-base text-text-primary font-sans">

      {/* ══════════════════════════════════════
          SECTION 1 · HERO
      ══════════════════════════════════════ */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden"
        aria-labelledby="hero-heading"
      >
        {/* CSS animated grid */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(250,250,250,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(250,250,250,0.04) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        {/* Radial glow top */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(99,102,241,0.125), transparent)',
          }}
        />

        <div className="relative z-10 flex flex-col items-center text-center gap-6 max-w-[640px]">

          {/* Trust badge */}
          <motion.p
            {...useFadeUp(0)}
            className="inline-flex items-center gap-1.5 rounded-full border border-accent-primary/30 bg-accent-subtle px-4 py-1.5 font-sans text-xs text-text-secondary"
          >
            ✦ Estudio académico · UNED Psicología · 2025-2026
          </motion.p>

          {/* Headline */}
          <motion.h1
            id="hero-heading"
            {...useFadeUp(0.1)}
            className="text-balance font-sans font-bold text-text-primary text-center"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.15 }}
          >
            ¿En qué régimen opera
            <br className="hidden sm:block" /> tu organización?
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            {...useFadeUp(0.2)}
            className="max-w-[480px] font-sans text-lg text-text-secondary text-center text-pretty"
          >
            Diagnóstico de dinámica organizacional basado en el Índice de Reynolds
          </motion.p>

          {/* IRO Equation */}
          <motion.div
            {...useFadeUp(0.3)}
            className="flex flex-col items-center gap-2"
          >
            <hr
              aria-hidden="true"
              className="w-60 border-border-subtle opacity-20"
            />
            <span
              className="font-mono text-lg text-accent-primary cursor-help"
              title="Índice de Reynolds Organizacional"
              aria-label="Fórmula del Índice de Reynolds Organizacional: Re_org = (δ · v · D) dividido entre μ"
            >
              Re_org = (δ · v · D) / μ
            </span>
            <hr
              aria-hidden="true"
              className="w-60 border-border-subtle opacity-20"
            />
          </motion.div>

          {/* Stats row */}
          <motion.p
            {...useFadeUp(0.4)}
            className="font-sans text-sm text-text-muted"
            aria-label="8 minutos · 50 ítems · Resultado inmediato"
          >
            8 min · 50 ítems · Resultado inmediato
          </motion.p>

          {/* CTA */}
          <CTAButton />

          {/* Privacy note */}
          <motion.p
            {...useFadeUp(0.6)}
            className="font-sans text-xs text-text-muted text-center"
          >
            Datos anonimizados · Almacenamiento EU-Frankfurt · RGPD 2016/679
          </motion.p>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 2 · HOW IT WORKS
      ══════════════════════════════════════ */}
      <section
        className="border-y border-border-subtle bg-bg-surface py-16 px-4"
        aria-labelledby="how-heading"
      >
        <h2 id="how-heading" className="sr-only">Cómo funciona el diagnóstico</h2>
        <div className="mx-auto grid max-w-4xl gap-6 grid-cols-1 md:grid-cols-3">
          {[
            {
              icon: '◈',
              title: 'Responde 50 preguntas',
              desc: 'Evalúa densidad, velocidad, dispersión y viscosidad organizacional',
            },
            {
              icon: '⟳',
              title: 'El IRO se calcula',
              desc: 'Re_org = (δ·v·D)/μ aplicado a tu contexto específico',
            },
            {
              icon: '◉',
              title: 'Recibe tu diagnóstico',
              desc: 'Régimen laminar, transición o turbulencia con descripción detallada',
            },
          ].map((card, i) => (
            <motion.article
              key={card.title}
              {...useWhileInView(i * 0.12)}
              className="rounded-xl border border-border-subtle bg-bg-elevated p-6 flex flex-col gap-3"
            >
              <span
                aria-hidden="true"
                className="font-mono text-2xl text-accent-primary"
              >
                {card.icon}
              </span>
              <h3 className="font-sans text-base font-semibold text-text-primary">
                {card.title}
              </h3>
              <p className="font-sans text-sm text-text-secondary leading-relaxed">
                {card.desc}
              </p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 3 · REGIME PREVIEW
      ══════════════════════════════════════ */}
      <section
        className="py-16 px-4"
        aria-labelledby="regimes-heading"
      >
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <h2
              id="regimes-heading"
              className="font-sans text-2xl font-semibold text-text-primary text-balance"
            >
              Cuatro regímenes posibles
            </h2>
            <p className="mt-2 font-sans text-sm text-text-secondary">
              Tu resultado caerá en uno de estos rangos
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              {
                color: '#22C55E',
                label: 'Flujo Laminar',
                range: 'Re_org < 100',
                desc: 'Alta estabilidad organizacional. Procesos fluidos y coordinación eficiente.',
              },
              {
                color: '#EAB308',
                label: 'Régimen de Transición',
                range: '100 ≤ Re_org < 800',
                desc: 'Tensión moderada. Señales tempranas de turbulencia organizacional.',
              },
              {
                color: '#F97316',
                label: 'Turbulencia Incipiente',
                range: '800 ≤ Re_org < 1200',
                desc: 'Dinámica compleja. Riesgo elevado de desgaste profesional.',
              },
              {
                color: '#EF4444',
                label: 'Turbulencia Severa',
                range: 'Re_org ≥ 1200',
                desc: 'Régimen crítico. Intervención preventiva urgente recomendada.',
              },
            ].map((regime, i) => (
              <motion.article
                key={regime.label}
                {...useWhileInView(i * 0.1)}
                className="rounded-xl border border-border-subtle bg-bg-surface p-5 flex flex-col gap-2"
                style={{ borderLeftWidth: '4px', borderLeftColor: regime.color }}
              >
                <h3
                  className="font-sans text-base font-semibold text-text-primary"
                  style={{ color: regime.color }}
                >
                  {regime.label}
                </h3>
                <p className="font-mono text-xs text-text-muted">
                  {regime.range}
                </p>
                <p className="font-sans text-sm text-text-secondary leading-relaxed">
                  {regime.desc}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 4 · CTA FOOTER
      ══════════════════════════════════════ */}
      <section
        className="py-20 px-4 bg-bg-base text-center flex flex-col items-center gap-6"
        aria-labelledby="cta-footer-heading"
      >
        <h2
          id="cta-footer-heading"
          className="font-sans text-3xl font-semibold text-text-primary text-balance"
          style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}
        >
          ¿Listo para conocer tu Re_org?
        </h2>

        <CTAButton />

        <div className="flex items-center gap-3 mt-2">
          <div
            className="w-8 h-8 rounded bg-bg-elevated border border-border-subtle flex-shrink-0"
            aria-hidden="true"
            role="img"
            aria-label="Sello UNED"
          />
          <p className="font-sans text-xs text-text-muted text-left">
            Estudio avalado por UNED · Grado en Psicología · Curso 2025-2026
          </p>
        </div>
      </section>

    </main>
  );
}
