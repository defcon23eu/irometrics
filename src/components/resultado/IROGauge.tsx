'use client'

import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

type Regime = 'laminar' | 'transicion' | 'turbulencia_incipiente' | 'turbulencia_severa'

interface IROResultGaugeProps {
  reOrg: number
  regime: Regime
  animate?: boolean
}

// Regime colors
const REGIME_COLORS: Record<Regime, string> = {
  laminar: '#22C55E',
  transicion: '#EAB308',
  turbulencia_incipiente: '#F97316',
  turbulencia_severa: '#EF4444',
}

// Map reOrg to needle angle on the semicircle (−90° → +90°) using log scale
function reOrgToAngle(reOrg: number): number {
  const maxLog = Math.log10(2001)
  const valLog = Math.log10(Math.min(reOrg, 2000) + 1)
  return -90 + Math.min(valLog / maxLog, 1) * 180
}

// Arc helper
function describeArc(
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number,
): string {
  const rad = (d: number) => (d * Math.PI) / 180
  const x1 = cx + r * Math.cos(rad(startDeg))
  const y1 = cy + r * Math.sin(rad(startDeg))
  const x2 = cx + r * Math.cos(rad(endDeg))
  const y2 = cy + r * Math.sin(rad(endDeg))
  const large = endDeg - startDeg > 180 ? 1 : 0
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`
}

// Log-scale arc segment boundaries
// log10(101)/log10(2001)*180 ≈ 37.4 (laminar 0–100)
// (log10(801)−log10(101))/log10(2001)*180 ≈ 53.0 (transición 100–800)
// (log10(1201)−log10(801))/log10(2001)*180 ≈ 17.4 (incipiente 800–1200)
// remainder ≈ 72.2 (severo 1200+)
const ARC_SEGMENTS: { color: string; start: number; end: number }[] = [
  { color: '#22C55E', start: -90, end: -52.6 },
  { color: '#EAB308', start: -52.6, end: 0.4 },
  { color: '#F97316', start: 0.4, end: 17.8 },
  { color: '#EF4444', start: 17.8, end: 90 },
]

/**
 * IROResultGauge
 * Enhanced SVG semicircle gauge with 4 log-scale regime arcs and animated needle.
 * Supports reduced motion preference.
 */
export default function IROResultGauge({
  reOrg,
  regime,
  animate = true,
}: IROResultGaugeProps) {
  const reduced = useReducedMotion()
  const shouldAnimate = animate && !reduced
  const targetAngle = reOrgToAngle(reOrg)
  const [needleAngle, setNeedleAngle] = useState(shouldAnimate ? -90 : targetAngle)
  const needleColor = REGIME_COLORS[regime]

  useEffect(() => {
    if (!shouldAnimate) {
      setNeedleAngle(targetAngle)
      return
    }
    const duration = 1800
    const start = performance.now()
    const from = -90
    let raf: number
    function frame(now: number) {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3) // ease-out cubic
      setNeedleAngle(from + eased * (targetAngle - from))
      if (t < 1) raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [targetAngle, shouldAnimate])

  const cx = 140
  const cy = 140
  const r = 100
  const rad = (d: number) => (d * Math.PI) / 180
  const needleLen = 82
  const nx = cx + needleLen * Math.cos(rad(needleAngle))
  const ny = cy + needleLen * Math.sin(rad(needleAngle))

  return (
    <svg
      viewBox="0 0 280 160"
      width="100%"
      style={{ maxWidth: 340 }}
      role="img"
      aria-label={`Medidor IRO: ${reOrg.toFixed(1)} — ${regime.replace('_', ' ')}`}
    >
      {/* Background track */}
      <path
        d={describeArc(cx, cy, r, -90, 90)}
        fill="none"
        stroke="#1F1F23"
        strokeWidth={18}
        strokeLinecap="round"
      />

      {/* Colored regime segments */}
      {ARC_SEGMENTS.map((seg, i) => (
        <path
          key={i}
          d={describeArc(cx, cy, r, seg.start, seg.end)}
          fill="none"
          stroke={seg.color}
          strokeWidth={18}
          strokeLinecap={i === 0 || i === ARC_SEGMENTS.length - 1 ? 'round' : 'butt'}
          opacity={0.9}
        />
      ))}

      {/* Needle glow (subtle) */}
      <line
        x1={cx}
        y1={cy}
        x2={nx}
        y2={ny}
        stroke={needleColor}
        strokeWidth={6}
        strokeLinecap="round"
        opacity={0.25}
      />

      {/* Needle line */}
      <line
        x1={cx}
        y1={cy}
        x2={nx}
        y2={ny}
        stroke={needleColor}
        strokeWidth={3}
        strokeLinecap="round"
      />

      {/* Needle tip */}
      <circle cx={nx} cy={ny} r={5} fill={needleColor} />

      {/* Needle base */}
      <circle cx={cx} cy={cy} r={6} fill="#3F3F46" />
      <circle cx={cx} cy={cy} r={3} fill="#52525B" />

      {/* Center value */}
      <text
        x={cx}
        y={cy + 30}
        textAnchor="middle"
        fontFamily="var(--font-geist-mono), monospace"
        fontSize="15"
        fontWeight="700"
        fill={needleColor}
      >
        {reOrg.toFixed(1)}
      </text>

      {/* Arc labels */}
      <text
        x={30}
        y={152}
        textAnchor="middle"
        fontFamily="var(--font-geist-sans), sans-serif"
        fontSize="10"
        fill="#52525B"
      >
        Laminar
      </text>
      <text
        x={250}
        y={152}
        textAnchor="middle"
        fontFamily="var(--font-geist-sans), sans-serif"
        fontSize="10"
        fill="#52525B"
      >
        Severo
      </text>
    </svg>
  )
}
