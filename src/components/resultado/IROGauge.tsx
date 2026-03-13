"use client"

import { useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { IRORegime } from "@/types"
import { FlowParticles, AnimatedCounter } from "@/components/effects"
import { getFlowIntensity, SPRING_GAUGE } from "@/lib/motion-presets"

interface IROGaugeProps {
  reOrg: number
  regime: IRORegime
}

const REGIME_CONFIG: Record<IRORegime, { color: string; label: string; icon: string }> = {
  laminar:              { color: "var(--color-regime-laminar)",    label: "Laminar",              icon: "L" },
  transicion:           { color: "var(--color-regime-transicion)", label: "Transicional",         icon: "T" },
  turbulencia_incipiente: { color: "var(--color-regime-incipiente)", label: "Turbulencia Incipiente", icon: "Ti" },
  turbulencia_severa:   { color: "var(--color-regime-severo)",     label: "Turbulencia Severa",   icon: "Ts" },
}

const ZONES = [
  { start: 0,    end: 1000, color: "var(--color-regime-laminar)",    label: "Laminar" },
  { start: 1000, end: 2500, color: "var(--color-regime-transicion)", label: "Transicion" },
  { start: 2500, end: 4000, color: "var(--color-regime-incipiente)", label: "Incipiente" },
  { start: 4000, end: 5000, color: "var(--color-regime-severo)",     label: "Severo" },
]

export default function IROGauge({ reOrg, regime }: IROGaugeProps) {
  const config = REGIME_CONFIG[regime]
  const svgRef = useRef<SVGSVGElement>(null)

  // Clamp value and calculate angle (0-180 degrees for semicircle)
  const clampedValue = Math.min(Math.max(reOrg, 0), 5000)
  const angle = (clampedValue / 5000) * 180
  const intensity = getFlowIntensity(reOrg)

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-[300px] sm:w-[380px] lg:w-[460px] mx-auto"
    >
      {/* Flow particles background */}
      <FlowParticles color={config.color} intensity={intensity} />
      
      {/* Glow effect */}
      <div 
        className="absolute inset-0 blur-3xl opacity-20 rounded-full"
        style={{ backgroundColor: config.color }}
      />

      <div className="relative aspect-[2/1.1]">
        <svg ref={svgRef} viewBox="0 0 200 115" className="w-full h-full">
          <defs>
            {/* Gradient for the active arc */}
            <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--color-regime-laminar)" />
              <stop offset="33%" stopColor="var(--color-regime-transicion)" />
              <stop offset="66%" stopColor="var(--color-regime-incipiente)" />
              <stop offset="100%" stopColor="var(--color-regime-severo)" />
            </linearGradient>
            
            {/* Glow filter */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            {/* Drop shadow for needle */}
            <filter id="needleShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.3"/>
            </filter>
          </defs>

          {/* Background arc track */}
          <path
            d="M 15 100 A 85 85 0 0 1 185 100"
            fill="none"
            stroke="var(--color-bg-elevated)"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* Zone segments */}
          {ZONES.map((zone, i) => {
            const startAngle = (zone.start / 5000) * 180
            const endAngle = (zone.end / 5000) * 180
            const startRad = (startAngle - 180) * (Math.PI / 180)
            const endRad = (endAngle - 180) * (Math.PI / 180)

            const x1 = 100 + 85 * Math.cos(startRad)
            const y1 = 100 + 85 * Math.sin(startRad)
            const x2 = 100 + 85 * Math.cos(endRad)
            const y2 = 100 + 85 * Math.sin(endRad)

            return (
              <motion.path
                key={i}
                d={`M ${x1} ${y1} A 85 85 0 0 1 ${x2} ${y2}`}
                fill="none"
                stroke={zone.color}
                strokeWidth="16"
                strokeLinecap="butt"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.25 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              />
            )
          })}

          {/* Active progress arc */}
          <motion.path
            d="M 15 100 A 85 85 0 0 1 185 100"
            fill="none"
            stroke={config.color}
            strokeWidth="16"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: angle / 180 }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            style={{ filter: 'url(#glow)' }}
          />

          {/* Tick marks */}
          {[0, 1000, 2000, 3000, 4000, 5000].map((tick) => {
            const tickAngle = ((tick / 5000) * 180 - 180) * (Math.PI / 180)
            const x1 = 100 + 72 * Math.cos(tickAngle)
            const y1 = 100 + 72 * Math.sin(tickAngle)
            const x2 = 100 + 80 * Math.cos(tickAngle)
            const y2 = 100 + 80 * Math.sin(tickAngle)
            const labelX = 100 + 62 * Math.cos(tickAngle)
            const labelY = 100 + 62 * Math.sin(tickAngle)

            return (
              <g key={tick}>
                <motion.line 
                  x1={x1} y1={y1} x2={x2} y2={y2} 
                  stroke="var(--color-text-muted)" 
                  strokeWidth="1.5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ delay: 0.5 + tick / 10000 }}
                />
                <motion.text
                  x={labelX}
                  y={labelY}
                  fill="var(--color-text-muted)"
                  fontSize="6"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontFamily="var(--font-mono)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.8 }}
                  transition={{ delay: 0.6 + tick / 10000 }}
                >
                  {tick >= 1000 ? `${tick / 1000}k` : tick}
                </motion.text>
              </g>
            )
          })}

          {/* Animated needle */}
          <motion.g
            initial={{ rotate: -180 }}
            animate={{ rotate: angle - 180 }}
            transition={{ 
              duration: 2, 
              type: "spring", 
              stiffness: 50, 
              damping: 12,
              delay: 0.5 
            }}
            style={{ transformOrigin: "100px 100px", filter: 'url(#needleShadow)' }}
          >
            {/* Needle body */}
            <path 
              d="M 100 100 L 98 30 L 100 20 L 102 30 Z" 
              fill={config.color}
            />
            {/* Needle center hub */}
            <circle 
              cx="100" 
              cy="100" 
              r="10" 
              fill="var(--color-bg-surface)" 
              stroke={config.color} 
              strokeWidth="3"
            />
            {/* Inner dot */}
            <circle 
              cx="100" 
              cy="100" 
              r="4" 
              fill={config.color}
            />
          </motion.g>
        </svg>

        {/* Center value display */}
        <AnimatePresence>
          {isVisible && (
            <motion.div 
              className="absolute bottom-2 left-1/2 -translate-x-1/2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.5 }}
            >
              <div 
                className="rounded-2xl px-6 py-3 backdrop-blur-md border"
                style={{ 
                  backgroundColor: 'var(--color-bg-surface)',
                  borderColor: `color-mix(in srgb, ${config.color} 30%, transparent)`,
                  boxShadow: `0 4px 24px ${config.color}15`,
                }}
              >
                <div className="text-center">
                  <div 
                    className="text-2xl sm:text-3xl font-mono font-bold tracking-tight"
                    style={{ color: config.color }}
                  >
                    <AnimatedCounter value={reOrg} />
                  </div>
                  <div className="text-xs text-text-muted mt-1">
                    Re<sub>org</sub>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Regime label badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, type: "spring", stiffness: 200 }}
        className="flex justify-center mt-4"
      >
        <span
          className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold border"
          style={{
            backgroundColor: `color-mix(in srgb, ${config.color} 15%, transparent)`,
            borderColor: `color-mix(in srgb, ${config.color} 40%, transparent)`,
            color: config.color,
          }}
        >
          <span className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: config.color }} />
          {config.label}
        </span>
      </motion.div>
    </motion.div>
  )
}

export { IROGauge }
