'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface IROGaugeProps {
  value: number;
  maxValue?: number;
}

// Gauge arc zones (angle in degrees, from -90 to 90)
const ZONES = [
  { threshold: 100, color: 'var(--color-regime-laminar)' },
  { threshold: 800, color: 'var(--color-regime-transicion)' },
  { threshold: 1200, color: 'var(--color-regime-incipiente)' },
  { threshold: 2000, color: 'var(--color-regime-severo)' },
];

function valueToAngle(value: number, max: number): number {
  const clamped = Math.min(Math.max(value, 0), max);
  return -90 + (clamped / max) * 180;
}

export default function IROGauge({ value, maxValue = 2000 }: IROGaugeProps) {
  const [animatedAngle, setAnimatedAngle] = useState(-90);
  const targetAngle = valueToAngle(value, maxValue);

  useEffect(() => {
    // Small delay then animate
    const timer = setTimeout(() => setAnimatedAngle(targetAngle), 200);
    return () => clearTimeout(timer);
  }, [targetAngle]);

  const cx = 150;
  const cy = 150;
  const r = 120;

  // Create arc paths for each zone
  function arcPath(startAngleDeg: number, endAngleDeg: number): string {
    const startRad = (startAngleDeg * Math.PI) / 180;
    const endRad = (endAngleDeg * Math.PI) / 180;
    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);
    const largeArc = endAngleDeg - startAngleDeg > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
  }

  // Zone angle boundaries
  const zoneAngles = ZONES.map((z) => ({
    angle: -90 + (Math.min(z.threshold, maxValue) / maxValue) * 180,
    color: z.color,
  }));

  // Needle endpoint
  const needleRad = (animatedAngle * Math.PI) / 180;
  const needleLen = r - 15;
  const nx = cx + needleLen * Math.cos(needleRad);
  const ny = cy + needleLen * Math.sin(needleRad);

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 300 180" className="w-full max-w-[350px]">
        {/* Arc zones */}
        {zoneAngles.map((zone, i) => {
          const start = i === 0 ? -180 : zoneAngles[i - 1].angle - 90;
          const end = zone.angle - 90;
          // Shift angles for SVG coordinate system (top of arc = -180 to 0)
          const s = -180 + (i === 0 ? 0 : (zoneAngles[i - 1].angle + 90) / 180 * 180);
          const e = -180 + ((zone.angle + 90) / 180) * 180;
          return (
            <path
              key={i}
              d={arcPath(
                -180 + ((i === 0 ? 0 : zoneAngles[i - 1].angle + 90) / 180) * 180,
                -180 + ((zone.angle + 90) / 180) * 180,
              )}
              fill="none"
              stroke={zone.color}
              strokeWidth="18"
              strokeLinecap="round"
              opacity={0.7}
            />
          );
        })}

        {/* Needle */}
        <motion.line
          x1={cx}
          y1={cy}
          animate={{ x2: nx, y2: ny }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          x2={cx}
          y2={cy - needleLen}
        />

        {/* Center dot */}
        <circle cx={cx} cy={cy} r="6" fill="currentColor" />
      </svg>
    </div>
  );
}
