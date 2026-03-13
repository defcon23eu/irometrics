"use client"

import { useEffect, useState } from "react"
import { motion, useSpring, useTransform } from "framer-motion"
import type { IRORegime } from "@/types"

interface IROGaugeProps {
  reOrg: number
  regime: IRORegime
}

const REGIME_CONFIG: Record<IRORegime, { color: string; emoji: string; label: string; max: number }> = {
  laminar:              { color: "var(--color-regime-laminar)",    emoji: "🟢", label: "Laminar",              max: 1000 },
  transicion:           { color: "var(--color-regime-transicion)", emoji: "🟡", label: "Transicional",         max: 2500 },
  turbulencia_incipiente: { color: "var(--color-regime-incipiente)", emoji: "🟠", label: "Turbulencia Incipiente", max: 4000 },
  turbulencia_severa:   { color: "var(--color-regime-severo)",     emoji: "🔴", label: "Turbulencia Severa",   max: 5000 },
}

const ZONES = [
  { start: 0,    end: 1000, color: "var(--color-regime-laminar)" },
  { start: 1000, end: 2500, color: "var(--color-regime-transicion)" },
  { start: 2500, end: 4000, color: "var(--color-regime-incipiente)" },
  { start: 4000, end: 5000, color: "var(--color-regime-severo)" },
]

const TICKS = [0, 1000, 2000, 3000, 4000, 5000]

// Animated counter component
function AnimatedCounter({ value }: { value: number }) {
  const spring = useSpring(0, { stiffness: 50, damping: 20 })
  const display = useTransform(spring, (v) => v.toFixed(1))
  const [displayValue, setDisplayValue] = useState("0.0")

  useEffect(() => {
    spring.set(value)
  }, [spring, value])

  useEffect(() => {
    return display.on("change", (v) => setDisplayValue(v))
  }, [display])

  return <>{displayValue}</>
}

export default function IROGauge({ reOrg, regime }: IROGaugeProps) {
  const config = REGIME_CONFIG[regime]

  // Clamp value and calculate angle (0-180 degrees for semicircle)
  const clampedValue = Math.min(Math.max(reOrg, 0), 5000)
  const angle = (clampedValue / 5000) * 180

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-[280px] sm:w-[360px] lg:w-[440px] mx-auto"
    >
      <div className="relative aspect-[2/1]">
        <svg viewBox="0 0 200 110" className="w-full h-full">
          {/* Background arc */}
          <path
            d="M 10 100 A 90 90 0 0 1 190 100"
            fill="none"
            stroke="var(--color-bg-elevated)"
            strokeWidth="20"
            strokeLinecap="round"
          />

          {/* Colored zone arcs */}
          {ZONES.map((zone, i) => {
            const startAngle = (zone.start / 5000) * 180
            const endAngle = (zone.end / 5000) * 180
            const startRad = (startAngle - 180) * (Math.PI / 180)
            const endRad = (endAngle - 180) * (Math.PI / 180)

            const x1 = 100 + 90 * Math.cos(startRad)
            const y1 = 100 + 90 * Math.sin(startRad)
            const x2 = 100 + 90 * Math.cos(endRad)
            const y2 = 100 + 90 * Math.sin(endRad)

            return (
              <path
                key={i}
                d={`M ${x1} ${y1} A 90 90 0 0 1 ${x2} ${y2}`}
                fill="none"
                stroke={zone.color}
                strokeWidth="20"
                strokeLinecap="butt"
                opacity="0.8"
              />
            )
          })}

          {/* Tick marks and labels */}
          {TICKS.map((tick) => {
            const tickAngle = ((tick / 5000) * 180 - 180) * (Math.PI / 180)
            const x1 = 100 + 75 * Math.cos(tickAngle)
            const y1 = 100 + 75 * Math.sin(tickAngle)
            const x2 = 100 + 85 * Math.cos(tickAngle)
            const y2 = 100 + 85 * Math.sin(tickAngle)

            return (
              <g key={tick}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--color-text-muted)" strokeWidth="2" />
                <text
                  x={100 + 65 * Math.cos(tickAngle)}
                  y={100 + 65 * Math.sin(tickAngle)}
                  fill="var(--color-text-muted)"
                  fontSize="7"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontFamily="var(--font-mono)"
                >
                  {tick >= 1000 ? `${tick / 1000}k` : tick}
                </text>
              </g>
            )
          })}

          {/* Animated needle */}
          <motion.g
            initial={{ rotate: -180 }}
            animate={{ rotate: angle - 180 }}
            transition={{ duration: 2, type: "spring", stiffness: 60, damping: 15 }}
            style={{ transformOrigin: "100px 100px" }}
          >
            <path d="M 100 100 L 100 20 L 103 25 L 100 100 L 97 25 Z" fill={config.color} />
            <circle cx="100" cy="100" r="8" fill="var(--color-bg-base)" stroke={config.color} strokeWidth="3" />
          </motion.g>
        </svg>

        {/* Center label */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center pb-1">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="bg-bg-surface/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-border-subtle"
          >
            <div className="text-xl sm:text-2xl font-mono font-bold text-text-primary">
              Re<sub className="text-xs">org</sub> = <AnimatedCounter value={reOrg} />
            </div>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="text-lg">{config.emoji}</span>
              <span className="text-xs text-text-secondary font-medium">{config.label}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export { IROGauge }
