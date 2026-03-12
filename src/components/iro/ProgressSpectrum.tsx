"use client"

import { useState } from "react"
import { motion } from "framer-motion"

interface ProgressSpectrumProps {
  currentStep: number
  totalSteps?: number
}

const STEPS = [
  { id: 1, name: "Landing",      label: "Inicio" },
  { id: 2, name: "RGPD",         label: "Consentimiento" },
  { id: 3, name: "Socio",        label: "Datos Socio" },
  { id: 4, name: "Survey",       label: "Encuesta IRO" },
  { id: 5, name: "Result",       label: "Resultado" },
]

function interpolateColor(progress: number): string {
  const stops = [
    { stop: 0,    rgb: [34,  197, 94]  },
    { stop: 0.33, rgb: [234, 179, 8]   },
    { stop: 0.66, rgb: [249, 115, 22]  },
    { stop: 1,    rgb: [239, 68,  68]  },
  ]
  let lo = stops[0], hi = stops[stops.length - 1]
  for (let i = 0; i < stops.length - 1; i++) {
    if (progress >= stops[i].stop && progress <= stops[i + 1].stop) {
      lo = stops[i]; hi = stops[i + 1]; break
    }
  }
  const range = hi.stop - lo.stop
  const t = range === 0 ? 0 : (progress - lo.stop) / range
  const r = Math.round(lo.rgb[0] + (hi.rgb[0] - lo.rgb[0]) * t)
  const g = Math.round(lo.rgb[1] + (hi.rgb[1] - lo.rgb[1]) * t)
  const b = Math.round(lo.rgb[2] + (hi.rgb[2] - lo.rgb[2]) * t)
  return `rgb(${r},${g},${b})`
}

function getPhase(step: number): number {
  if (step <= 1)  return 1
  if (step <= 2)  return 2
  if (step <= 5)  return 3
  if (step <= 40) return 4
  return 5
}

export function ProgressSpectrum({ currentStep, totalSteps = 45 }: ProgressSpectrumProps) {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null)
  const progress = Math.min(currentStep / totalSteps, 1)
  const progressColor = interpolateColor(progress)
  const progressPercent = Math.round(progress * 100)
  const currentPhase = getPhase(currentStep)

  return (
    <div
      className="w-full space-y-3"
      role="progressbar"
      aria-valuenow={currentStep}
      aria-valuemin={0}
      aria-valuemax={totalSteps}
      aria-label={`Progreso: paso ${currentStep} de ${totalSteps}`}
    >
      {/* Phase step indicators */}
      <div className="flex justify-between items-center">
        {STEPS.map((step) => {
          const isActive    = step.id === currentPhase
          const isCompleted = step.id < currentPhase
          return (
            <div
              key={step.id}
              className="relative flex flex-col items-center gap-1"
              onMouseEnter={() => setHoveredStep(step.id)}
              onMouseLeave={() => setHoveredStep(null)}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-200"
                style={{
                  backgroundColor: isCompleted || isActive ? progressColor : "var(--color-bg-elevated)",
                  color: isCompleted || isActive ? "#000" : "var(--color-text-muted)",
                  boxShadow: isActive ? `0 0 12px ${progressColor}60` : "none",
                }}
              >
                {isCompleted ? "✓" : step.id}
              </div>

              {/* Tooltip */}
              {hoveredStep === step.id && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-bg-overlay border border-border-subtle text-text-secondary text-xs px-2 py-1 rounded z-10">
                  {step.label}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Progress bar */}
      <div className="relative h-2 w-full rounded-full bg-bg-elevated overflow-hidden">
        {/* Spectrum gradient bg */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: "linear-gradient(to right, var(--color-regime-laminar), var(--color-regime-transicion), var(--color-regime-incipiente), var(--color-regime-severo))",
          }}
        />
        {/* Actual fill */}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ backgroundColor: progressColor }}
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
        {/* Shimmer overlay */}
        <div className="absolute inset-0 shimmer opacity-30" />
      </div>

      {/* Labels */}
      <div className="flex justify-between text-xs text-text-muted font-mono">
        <span>Paso {currentStep} / {totalSteps}</span>
        <span style={{ color: progressColor }}>{progressPercent}%</span>
      </div>
    </div>
  )
}

export default ProgressSpectrum
