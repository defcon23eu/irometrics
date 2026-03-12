"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

type Regime = "laminar" | "transicional" | "turbulencia_incipiente" | "turbulencia_severa"

interface IROGaugeProps {
  reOrg: number
  regime: Regime
}

const REGIME_CONFIG: Record<Regime, { color: string; emoji: string; label: string }> = {
  laminar:               { color: "var(--color-regime-laminar)",    emoji: "🟢", label: "Laminar" },
  transicional:          { color: "var(--color-regime-transicion)", emoji: "🟡", label: "Transicional" },
  turbulencia_incipiente:{ color: "var(--color-regime-incipiente)", emoji: "🟠", label: "Turbulencia Incipiente" },
  turbulencia_severa:    { color: "var(--color-regime-severo)",     emoji: "🔴", label: "Turbulencia Severa" },
}

const ZONES = [
  { start: 0,    end: 1000, color: "var(--color-regime-laminar)" },
  { start: 1000, end: 2500, color: "var(--color-regime-transicion)" },
  { start: 2500, end: 4000, color: "var(--color-regime-incipiente)" },
  { start: 4000, end: 5000, color: "var(--color-regime-severo)" },
]

function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
  const toRad = (d: number) => ((d - 180) * Math.PI) / 180
  const x1 = cx + r * Math.cos(toRad(startDeg))
  const y1 = cy + r * Math.sin(toRad(startDeg))
  const x2 = cx + r * Math.cos(toRad(endDeg))
  const y2 = cy + r * Math.sin(toRad(endDeg))
  const large = endDeg - startDeg > 180 ? 1 : 0
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`
}

export function IROGauge({ reOrg, regime }: IROGaugeProps) {
  const [mounted, setMounted] = useState(false)
  const config = REGIME_CONFIG[regime]
  const clampedValue = Math.min(Math.max(reOrg, 0), 5000)
  const angle = (clampedValue / 5000) * 180

  useEffect(() => { setMounted(true) }, [])

  const needleRad = ((angle - 180) * Math.PI) / 180
  const needleX = 100 + 72 * Math.cos(needleRad)
  const needleY = 100 + 72 * Math.sin(needleRad)

  return (
    <div className="flex flex-col items-center gap-4">
      <svg
        viewBox="0 0 200 110"
        className="w-full max-w-xs sm:max-w-sm gauge-glow"
        style={{ "--glow-color": config.color } as React.CSSProperties}
        role="meter"
        aria-valuenow={reOrg}
        aria-valuemin={0}
        aria-valuemax={5000}
        aria-label={`IRO: ${reOrg.toFixed(1)} — ${config.label}`}
      >
        {/* Track background */}
        <path
          d={arcPath(100, 100, 80, 0, 180)}
          fill="none"
          stroke="var(--color-border-subtle)"
          strokeWidth="12"
          strokeLinecap="round"
        />

        {/* Colored zone arcs */}
        {ZONES.map((zone, i) => {
          const startDeg = (zone.start / 5000) * 180
          const endDeg   = (zone.end   / 5000) * 180
          return (
            <path
              key={i}
              d={arcPath(100, 100, 80, startDeg, endDeg)}
              fill="none"
              stroke={zone.color}
              strokeWidth="12"
              strokeLinecap="butt"
              opacity="0.7"
            />
          )
        })}

        {/* Tick labels */}
        {[0, 1000, 2500, 4000, 5000].map((tick) => {
          const tickDeg = (tick / 5000) * 180
          const tickRad = ((tickDeg - 180) * Math.PI) / 180
          const lx = 100 + 64 * Math.cos(tickRad)
          const ly = 100 + 64 * Math.sin(tickRad)
          return (
            <text
              key={tick}
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="6"
              fill="var(--color-text-muted)"
            >
              {tick === 0 ? "0" : tick >= 1000 ? `${tick / 1000}k` : tick}
            </text>
          )
        })}

        {/* Animated needle */}
        {mounted && (
          <motion.line
            x1="100"
            y1="100"
            x2={needleX}
            y2={needleY}
            stroke={config.color}
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{ x2: 100 + 72 * Math.cos((-180 * Math.PI) / 180), y2: 100 + 72 * Math.sin((-180 * Math.PI) / 180) }}
            animate={{ x2: needleX, y2: needleY }}
            transition={{ duration: 1.8, ease: [0.34, 1.56, 0.64, 1] }}
          />
        )}

        {/* Needle pivot */}
        <circle cx="100" cy="100" r="4" fill={config.color} />

        {/* Center value */}
        <text x="100" y="88" textAnchor="middle" fontSize="10" fontWeight="700" fill="var(--color-text-primary)" fontFamily="var(--font-mono)">
          {reOrg.toFixed(1)}
        </text>
        <text x="100" y="98" textAnchor="middle" fontSize="6" fill="var(--color-text-muted)">
          Re_org
        </text>
      </svg>

      {/* Regime badge */}
      <motion.div
        className="flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium"
        style={{
          backgroundColor: `color-mix(in srgb, ${config.color} 10%, transparent)`,
          borderColor: `color-mix(in srgb, ${config.color} 30%, transparent)`,
          color: config.color,
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <span>{config.emoji}</span>
        <span>{config.label}</span>
      </motion.div>
    </div>
  )
}

export default IROGauge
