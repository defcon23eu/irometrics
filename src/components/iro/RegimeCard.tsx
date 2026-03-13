"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { IRORegime } from "@/types"

interface RegimeCardProps {
  regime: IRORegime
  reOrg: number
  description?: string
  showDetails?: boolean
}

const REGIME_DATA: Record<IRORegime, {
  title: string
  colorVar: string
  bgVar: string
  description: string
  characteristics: string[]
  resources: { label: string; url: string }[]
}> = {
  laminar: {
    title: "Flujo Laminar",
    colorVar: "var(--color-regime-laminar)",
    bgVar:    "var(--color-regime-laminar-bg)",
    description: "Tu organizacion presenta un flujo de trabajo ordenado y predecible. Los procesos estan bien definidos y la comunicacion es efectiva.",
    characteristics: [
      "Baja resistencia al cambio",
      "Comunicacion fluida",
      "Procesos estables",
      "Bienestar optimo"
    ],
    resources: [
      { label: "EU-OSHA: Buenas practicas",       url: "https://osha.europa.eu/es/themes/psychosocial-risks-and-stress" },
      { label: "JRC: Indicadores de bienestar",    url: "https://joint-research-centre.ec.europa.eu" },
    ],
  },
  transicion: {
    title: "Flujo de Transicion",
    colorVar: "var(--color-regime-transicion)",
    bgVar:    "var(--color-regime-transicion-bg)",
    description: "Se detectan perturbaciones en el flujo organizacional. Es momento de implementar medidas preventivas antes de que escalen.",
    characteristics: [
      "Perturbaciones detectadas",
      "Requiere atencion preventiva",
      "Potencial de mejora",
      "Intervencion temprana"
    ],
    resources: [
      { label: "EU-OSHA: Evaluacion de riesgos",    url: "https://osha.europa.eu/es/themes/psychosocial-risks-and-stress" },
      { label: "JRC: Herramientas de diagnostico", url: "https://joint-research-centre.ec.europa.eu" },
    ],
  },
  turbulencia_incipiente: {
    title: "Turbulencia Incipiente",
    colorVar: "var(--color-regime-incipiente)",
    bgVar:    "var(--color-regime-incipiente-bg)",
    description: "El flujo organizacional muestra patrones caoticos significativos. Se requiere intervencion activa para estabilizar los procesos.",
    characteristics: [
      "Patrones caoticos",
      "Alta friccion interna",
      "Requiere intervencion",
      "Riesgo de escalada"
    ],
    resources: [
      { label: "EU-OSHA: Plan de accion urgente", url: "https://osha.europa.eu/es/themes/psychosocial-risks-and-stress" },
      { label: "JRC: Casos de estudio",           url: "https://joint-research-centre.ec.europa.eu" },
    ],
  },
  turbulencia_severa: {
    title: "Turbulencia Severa",
    colorVar: "var(--color-regime-severo)",
    bgVar:    "var(--color-regime-severo-bg)",
    description: "Situacion critica con alto riesgo psicosocial. Requiere intervencion inmediata y apoyo profesional especializado.",
    characteristics: [
      "Estado critico",
      "Riesgo psicosocial alto",
      "Intervencion inmediata",
      "Apoyo profesional"
    ],
    resources: [
      { label: "EU-OSHA: Intervencion de emergencia", url: "https://osha.europa.eu/es/themes/psychosocial-risks-and-stress" },
      { label: "JRC: Protocolos de recuperacion",    url: "https://joint-research-centre.ec.europa.eu" },
    ],
  },
}

// Flow visualization SVG based on regime
function FlowVisualization({ regime, color }: { regime: IRORegime; color: string }) {
  const isLaminar = regime === 'laminar'
  const isTransicion = regime === 'transicion'
  const isSevero = regime === 'turbulencia_severa'
  
  return (
    <svg viewBox="0 0 80 40" className="w-20 h-10 opacity-60">
      {isLaminar ? (
        // Parallel smooth lines
        <>
          {[8, 16, 24, 32].map((y, i) => (
            <motion.path
              key={i}
              d={`M 0 ${y} Q 40 ${y} 80 ${y}`}
              stroke={color}
              strokeWidth="1.5"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: i * 0.1 }}
            />
          ))}
        </>
      ) : isTransicion ? (
        // Slightly wavy lines
        <>
          {[8, 16, 24, 32].map((y, i) => (
            <motion.path
              key={i}
              d={`M 0 ${y} Q 20 ${y + (i % 2 ? 3 : -3)} 40 ${y} Q 60 ${y + (i % 2 ? -3 : 3)} 80 ${y}`}
              stroke={color}
              strokeWidth="1.5"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: i * 0.1 }}
            />
          ))}
        </>
      ) : isSevero ? (
        // Chaotic turbulent lines
        <>
          {[8, 16, 24, 32].map((y, i) => (
            <motion.path
              key={i}
              d={`M 0 ${y} Q 10 ${y + 8} 20 ${y - 5} Q 30 ${y + 6} 40 ${y - 4} Q 50 ${y + 7} 60 ${y - 6} Q 70 ${y + 5} 80 ${y}`}
              stroke={color}
              strokeWidth="1.5"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, delay: i * 0.08 }}
            />
          ))}
        </>
      ) : (
        // Incipiente - moderate turbulence
        <>
          {[8, 16, 24, 32].map((y, i) => (
            <motion.path
              key={i}
              d={`M 0 ${y} Q 20 ${y + 5} 40 ${y - 4} Q 60 ${y + 4} 80 ${y}`}
              stroke={color}
              strokeWidth="1.5"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.1, delay: i * 0.1 }}
            />
          ))}
        </>
      )}
    </svg>
  )
}

export function RegimeCard({ regime, reOrg, description }: RegimeCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const data = REGIME_DATA[regime]
  const finalDescription = description ?? data.description

  const handleShare = async () => {
    const text = `Mi Re_org = ${reOrg.toFixed(1)} - ${data.title} | irometrics.app`
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
      className="relative w-full cursor-pointer group"
      style={{ perspective: "1200px" }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* FRONT */}
        <div
          className="relative w-full overflow-hidden rounded-2xl border p-6"
          style={{
            backfaceVisibility: "hidden",
            backgroundColor: 'var(--color-bg-surface)',
            borderColor: `color-mix(in srgb, ${data.colorVar} 30%, transparent)`,
          }}
        >
          {/* Accent border */}
          <div 
            className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
            style={{ backgroundColor: data.colorVar }}
          />
          
          {/* Background glow */}
          <div 
            className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-10 -translate-y-1/2 translate-x-1/2"
            style={{ backgroundColor: data.colorVar }}
          />

          {/* Header */}
          <div className="relative flex items-start justify-between gap-4 mb-4">
            <div>
              <p className="text-xs font-mono text-text-muted mb-1 tracking-wide">Re<sub>org</sub></p>
              <p className="text-4xl font-bold font-mono tracking-tight" style={{ color: data.colorVar }}>
                {reOrg.toFixed(1)}
              </p>
            </div>
            <FlowVisualization regime={regime} color={data.colorVar} />
          </div>

          {/* Title and description */}
          <div className="relative space-y-3 mb-5">
            <h3 className="text-lg font-semibold text-text-primary">{data.title}</h3>
            <p className="text-sm text-text-secondary leading-relaxed">{finalDescription}</p>
          </div>

          {/* Characteristics pills */}
          <div className="relative flex flex-wrap gap-2 mb-5">
            {data.characteristics.map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border"
                style={{
                  backgroundColor: data.bgVar,
                  borderColor: `color-mix(in srgb, ${data.colorVar} 20%, transparent)`,
                  color: data.colorVar,
                }}
              >
                <span 
                  className="h-1.5 w-1.5 rounded-full" 
                  style={{ backgroundColor: data.colorVar }}
                />
                {char}
              </motion.span>
            ))}
          </div>

          {/* Footer */}
          <div className="relative flex items-center justify-between pt-4 border-t border-border-subtle">
            <p className="text-xs text-text-muted">Toca para ver recursos</p>
            <button
              onClick={(e) => { e.stopPropagation(); handleShare() }}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-border-default text-text-secondary hover:text-text-primary hover:border-border-focus transition-colors"
              aria-label="Compartir resultado IRO"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Compartir
            </button>
          </div>
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 overflow-hidden rounded-2xl border p-6"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            backgroundColor: 'var(--color-bg-surface)',
            borderColor: `color-mix(in srgb, ${data.colorVar} 30%, transparent)`,
          }}
        >
          {/* Accent border */}
          <div 
            className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
            style={{ backgroundColor: data.colorVar }}
          />

          <div className="h-full flex flex-col">
            <h4 className="text-sm font-semibold mb-4" style={{ color: data.colorVar }}>
              Recursos Europeos
            </h4>
            
            <ul className="space-y-3 flex-1">
              {data.resources.map((r, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                >
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors group/link"
                  >
                    <span 
                      className="flex-shrink-0 h-6 w-6 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: data.bgVar }}
                    >
                      <svg className="w-3 h-3" style={{ color: data.colorVar }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </span>
                    <span className="group-hover/link:underline underline-offset-2">{r.label}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
            
            <p className="text-xs text-text-muted pt-4 border-t border-border-subtle">
              Toca para volver
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default RegimeCard
