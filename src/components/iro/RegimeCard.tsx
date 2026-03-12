"use client"

import { useState } from "react"
import { motion } from "framer-motion"

type Regime = "laminar" | "transicional" | "turbulencia_incipiente" | "turbulencia_severa"

interface RegimeCardProps {
  regime: Regime
  reOrg: number
  description?: string
}

const REGIME_DATA: Record<Regime, {
  title: string
  emoji: string
  colorVar: string
  bgVar: string
  description: string
  resources: { label: string; url: string }[]
}> = {
  laminar: {
    title: "Flujo Laminar",
    emoji: "🟢",
    colorVar: "var(--color-regime-laminar)",
    bgVar:    "var(--color-regime-laminar-bg)",
    description: "Tu organización presenta un flujo de trabajo ordenado y predecible. Los procesos están bien definidos y la comunicación es efectiva.",
    resources: [
      { label: "EU-OSHA: Buenas prácticas",       url: "https://osha.europa.eu/es/themes/psychosocial-risks-and-stress" },
      { label: "JRC: Indicadores de bienestar",    url: "https://joint-research-centre.ec.europa.eu" },
      { label: "Guía mantenimiento preventivo",   url: "https://osha.europa.eu/es/publications" },
    ],
  },
  transicional: {
    title: "Flujo Transicional",
    emoji: "🟡",
    colorVar: "var(--color-regime-transicion)",
    bgVar:    "var(--color-regime-transicion-bg)",
    description: "Se detectan perturbaciones en el flujo organizacional. Es momento de implementar medidas preventivas antes de que escalen.",
    resources: [
      { label: "EU-OSHA: Evaluación de riesgos",    url: "https://osha.europa.eu/es/themes/psychosocial-risks-and-stress" },
      { label: "JRC: Herramientas de diagnóstico", url: "https://joint-research-centre.ec.europa.eu" },
      { label: "Protocolo intervención temprana",  url: "https://osha.europa.eu/es/publications" },
    ],
  },
  turbulencia_incipiente: {
    title: "Turbulencia Incipiente",
    emoji: "🟠",
    colorVar: "var(--color-regime-incipiente)",
    bgVar:    "var(--color-regime-incipiente-bg)",
    description: "El flujo organizacional muestra patrones caóticos significativos. Se requiere intervención activa para estabilizar los procesos.",
    resources: [
      { label: "EU-OSHA: Plan de acción urgente", url: "https://osha.europa.eu/es/themes/psychosocial-risks-and-stress" },
      { label: "JRC: Casos de estudio",           url: "https://joint-research-centre.ec.europa.eu" },
      { label: "Guía gestión de crisis",          url: "https://osha.europa.eu/es/publications" },
    ],
  },
  turbulencia_severa: {
    title: "Turbulencia Severa",
    emoji: "🔴",
    colorVar: "var(--color-regime-severo)",
    bgVar:    "var(--color-regime-severo-bg)",
    description: "Situación crítica con alto riesgo psicosocial. Requiere intervención inmediata y apoyo profesional especializado.",
    resources: [
      { label: "EU-OSHA: Intervención de emergencia", url: "https://osha.europa.eu/es/themes/psychosocial-risks-and-stress" },
      { label: "JRC: Protocolos de recuperación",    url: "https://joint-research-centre.ec.europa.eu" },
      { label: "Línea de ayuda profesional",         url: "https://osha.europa.eu/es/publications" },
    ],
  },
}

export function RegimeCard({ regime, reOrg, description }: RegimeCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const data = REGIME_DATA[regime]
  const finalDescription = description ?? data.description

  const handleShare = async () => {
    const text = `Mi Re_org = ${reOrg.toFixed(1)} — ${data.title} ${data.emoji} | irometrics.app`
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: `Resultado IRO: ${data.title}`, text, url: window.location.href })
      } catch {
        await navigator.clipboard.writeText(text)
      }
    } else if (typeof navigator !== "undefined") {
      await navigator.clipboard.writeText(text)
    }
  }

  return (
    <div
      className="relative w-full cursor-pointer"
      style={{ perspective: "1000px" }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* FRONT */}
        <div
          className="w-full rounded-xl border p-6 space-y-4"
          style={{
            backfaceVisibility: "hidden",
            backgroundColor: data.bgVar,
            borderColor: `color-mix(in srgb, ${data.colorVar} 25%, transparent)`,
            borderLeftWidth: "3px",
            borderLeftColor: data.colorVar,
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-mono text-text-muted mb-1">Re_org</p>
              <p className="text-3xl font-bold font-mono" style={{ color: data.colorVar }}>
                {reOrg.toFixed(1)}
              </p>
            </div>
            <span className="text-3xl">{data.emoji}</span>
          </div>

          <div>
            <p className="text-sm font-semibold text-text-primary mb-1">{data.title}</p>
            <p className="text-sm text-text-secondary leading-relaxed">{finalDescription}</p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-text-muted italic">Toca para ver recursos EU →</p>
            <button
              onClick={(e) => { e.stopPropagation(); handleShare() }}
              className="text-xs px-3 py-1 rounded-full border border-border-default text-text-secondary hover:text-text-primary hover:border-border-focus transition-colors"
              aria-label="Compartir resultado IRO"
            >
              Compartir
            </button>
          </div>
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 rounded-xl border p-6 space-y-4"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            backgroundColor: "var(--color-bg-surface)",
            borderColor: `color-mix(in srgb, ${data.colorVar} 25%, transparent)`,
          }}
        >
          <p className="text-sm font-semibold" style={{ color: data.colorVar }}>Recursos EU</p>
          <ul className="space-y-3">
            {data.resources.map((r, i) => (
              <li key={i}>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-sm text-text-secondary hover:text-text-primary underline underline-offset-2 transition-colors"
                >
                  {r.label} ↗
                </a>
              </li>
            ))}
          </ul>
          <p className="text-xs text-text-muted pt-2 italic">Toca para volver →</p>
        </div>
      </motion.div>
    </div>
  )
}

export default RegimeCard
