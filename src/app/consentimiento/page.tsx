'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ConsentPage() {
  const [accepted, setAccepted] = useState(false);
  const router = useRouter();

  function handleStart() {
    if (!accepted) return;
    sessionStorage.setItem('consent_at', new Date().toISOString());
    router.push('/diagnostico?step=1');
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-2xl">
        <h1 className="mb-10 text-3xl font-bold sm:text-4xl">
          Antes de comenzar
        </h1>

        {/* What you'll do */}
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-text-accent">
            ¿Qué vas a hacer?
          </h2>
          <p className="text-sm leading-relaxed text-text-secondary">
            Responderás 50 preguntas sobre la dinámica de tu organización y tu
            experiencia laboral. El proceso dura aproximadamente 8 minutos.
          </p>
        </section>

        {/* Data handling */}
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-text-accent">
            ¿Qué hacemos con tus datos?
          </h2>
          <p className="text-sm leading-relaxed text-text-secondary">
            Tus respuestas son completamente anónimas. No recopilamos nombre,
            email, empresa ni dirección IP. Se asigna un código de sesión
            aleatorio que no puede vincularse a tu identidad. Los datos se
            analizan de forma agregada para investigación académica.
          </p>
        </section>

        {/* Rights */}
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-text-accent">
            Tus derechos
          </h2>
          <p className="text-sm leading-relaxed text-text-secondary">
            Puedes abandonar el diagnóstico en cualquier momento sin
            consecuencia alguna. Tienes derecho de acceso, rectificación y
            supresión de tus datos (Art. 15-17 RGPD). Contacto:{' '}
            <a
              href="mailto:rbalaguer16@alumno.uned.es"
              className="text-text-accent underline"
            >
              rbalaguer16@alumno.uned.es
            </a>
          </p>
        </section>

        {/* Data controller */}
        <section className="mb-10 rounded-xl border border-border-default bg-bg-surface p-5">
          <p className="text-sm text-text-secondary">
            <strong className="text-text-primary">
              Responsable del tratamiento:
            </strong>{' '}
            Raúl Balaguer Moreno · irometrics.app · Base legal: consentimiento
            explícito (Art. 6.1.a RGPD)
          </p>
          <p className="mt-2">
            <Link
              href="/privacidad"
              className="text-sm text-text-accent underline"
            >
              Leer política de privacidad completa
            </Link>
          </p>
        </section>

        {/* Consent checkbox */}
        <div className="mb-8">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-1 h-5 w-5 shrink-0 cursor-pointer appearance-none rounded border-2 border-border-default bg-transparent checked:border-regime-laminar checked:bg-regime-laminar transition-colors"
            />
            <span className="text-sm leading-relaxed text-text-secondary">
              He leído la información anterior y acepto participar
              voluntariamente en esta investigación
            </span>
          </label>
        </div>

        {/* CTA */}
        <button
          onClick={handleStart}
          disabled={!accepted}
          className="w-full rounded-xl bg-accent-primary px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base sm:w-auto"
        >
          Iniciar diagnóstico →
        </button>
      </div>
    </main>
  );
}
