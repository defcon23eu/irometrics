'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'

/* ─────────────────────────────────────────────
   Animation helper
───────────────────────────────────────────── */

function useFadeUp(delay: number) {
  const reduce = useReducedMotion()
  if (reduce) return { initial: {}, animate: {}, transition: {} }
  return {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay, ease: 'easeOut' },
  }
}

/* ─────────────────────────────────────────────
   Checkmark icon
───────────────────────────────────────────── */

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polyline points="2.5 6 5 8.5 9.5 3.5" />
    </svg>
  )
}

/* ─────────────────────────────────────────────
   Page
───────────────────────────────────────────── */

export default function ConsentPage() {
  const [accepted, setAccepted] = useState(false)
  const router = useRouter()

  function handleStart() {
    if (!accepted) return
    sessionStorage.setItem('consent_at', new Date().toISOString())
    router.push('/diagnostico')
  }

  const sections = [
    {
      title: '¿Qué vas a hacer?',
      content:
        'Responderás 50 preguntas sobre la dinámica de tu organización y tu experiencia laboral. El proceso dura aproximadamente 8 minutos.',
    },
    {
      title: '¿Qué hacemos con tus datos?',
      content:
        'Tus respuestas son completamente anónimas. No recopilamos nombre, email, empresa ni dirección IP. Se asigna un código de sesión aleatorio que no puede vincularse a tu identidad.',
    },
    {
      title: 'Tus derechos',
      content: (
        <>
          Puedes abandonar el diagnóstico en cualquier momento sin
          consecuencia alguna. Tienes derecho de acceso, rectificación y
          supresión de tus datos (Art. 15-17 RGPD). Contacto:{' '}
          <a
            href="mailto:rbalaguer16@alumno.uned.es"
            className="text-accent-primary underline hover:text-accent-hover transition-colors"
          >
            rbalaguer16@alumno.uned.es
          </a>
        </>
      ),
    },
  ]

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 sm:py-16">
      {/* Glassmorphic card */}
      <motion.div
        {...useFadeUp(0)}
        className="w-full max-w-2xl rounded-2xl border border-border-subtle bg-bg-surface/80 backdrop-blur-xl p-6 sm:p-10"
      >
        <motion.h1
          {...useFadeUp(0.05)}
          className="mb-8 text-2xl font-bold text-text-primary sm:text-3xl"
        >
          Antes de comenzar
        </motion.h1>

        {/* Info sections */}
        {sections.map((section, i) => (
          <motion.section
            key={section.title}
            {...useFadeUp(0.1 + i * 0.05)}
            className="mb-6"
          >
            <h2 className="mb-2 text-base font-semibold text-accent-primary">
              {section.title}
            </h2>
            <p className="text-sm leading-relaxed text-text-secondary">
              {section.content}
            </p>
          </motion.section>
        ))}

        {/* Data controller box */}
        <motion.section
          {...useFadeUp(0.25)}
          className="mb-8 rounded-xl border border-border-subtle bg-bg-elevated/60 p-5"
        >
          <p className="text-sm text-text-secondary">
            <strong className="text-text-primary">
              Responsable del tratamiento:
            </strong>{' '}
            Raúl Balaguer Moreno · irometrics.app · Base legal: consentimiento
            explícito (Art. 6.1.a RGPD)
          </p>
          <p className="mt-3">
            <Link
              href="/privacidad"
              className="text-sm text-accent-primary underline hover:text-accent-hover transition-colors"
            >
              Leer política de privacidad completa
            </Link>
          </p>
        </motion.section>

        {/* Consent checkbox — custom styled */}
        <motion.div {...useFadeUp(0.3)} className="mb-8">
          <label className="flex cursor-pointer items-start gap-4 group">
            <div className="relative mt-0.5">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="peer sr-only"
                aria-describedby="consent-label"
              />
              <div
                className={`
                  h-6 w-6 shrink-0 rounded-lg border-2 transition-all duration-150 flex items-center justify-center
                  ${accepted
                    ? 'border-regime-laminar bg-regime-laminar'
                    : 'border-border-default bg-transparent group-hover:border-accent-primary/50'
                  }
                `}
              >
                {accepted && <CheckIcon className="text-white" />}
              </div>
            </div>
            <span
              id="consent-label"
              className="text-sm leading-relaxed text-text-secondary group-hover:text-text-primary transition-colors"
            >
              He leído la información anterior y acepto participar
              voluntariamente en esta investigación
            </span>
          </label>
        </motion.div>

        {/* CTA */}
        <motion.button
          {...useFadeUp(0.35)}
          onClick={handleStart}
          disabled={!accepted}
          className={`
            w-full sm:w-auto rounded-xl px-10 py-4 text-base font-semibold text-white transition-all duration-150
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base
            ${accepted
              ? 'bg-accent-primary hover:bg-accent-hover shadow-lg hover:shadow-xl cursor-pointer'
              : 'bg-accent-primary/40 cursor-not-allowed'
            }
          `}
        >
          Iniciar diagnóstico
          <span aria-hidden="true" className="ml-2">→</span>
        </motion.button>
      </motion.div>
    </main>
  )
}
